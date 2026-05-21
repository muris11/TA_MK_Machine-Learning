from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    mean_absolute_error,
    mean_squared_error,
    precision_score,
    r2_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor

from uas_ml.config import (
    ARTIFACT_DIR,
    CLASSIFICATION_TARGET,
    FEATURE_COLUMNS,
    FEATURE_IMPORTANCE_PATH,
    METRICS_PATH,
    MODEL_BUNDLE_PATH,
    PRIORITY_LABELS,
    REGRESSION_TARGET,
)
from uas_ml.data import build_priority_thresholds, classify_priority, load_dataset


def _make_regression_models() -> dict[str, Any]:
    return {
        "Linear Regression": Pipeline(
            [
                ("scaler", StandardScaler()),
                ("model", LinearRegression()),
            ]
        ),
        "Decision Tree Regressor": DecisionTreeRegressor(
            max_depth=6,
            min_samples_leaf=5,
            random_state=42,
        ),
        "Random Forest Regressor": RandomForestRegressor(
            n_estimators=300,
            max_depth=9,
            min_samples_leaf=3,
            random_state=42,
        ),
    }


def _make_classification_models() -> dict[str, Any]:
    return {
        "Logistic Regression": Pipeline(
            [
                ("scaler", StandardScaler()),
                (
                    "model",
                    LogisticRegression(
                        class_weight="balanced",
                        max_iter=1500,
                        random_state=42,
                    ),
                ),
            ]
        ),
        "Decision Tree Classifier": DecisionTreeClassifier(
            class_weight="balanced",
            max_depth=6,
            min_samples_leaf=5,
            random_state=42,
        ),
        "Random Forest Classifier": RandomForestClassifier(
            n_estimators=300,
            class_weight="balanced",
            max_depth=9,
            min_samples_leaf=3,
            random_state=42,
        ),
    }


def evaluate_regression_model(model: Any, x_test: pd.DataFrame, y_test: pd.Series) -> dict[str, float]:
    predictions = model.predict(x_test)
    return {
        "MAE": float(mean_absolute_error(y_test, predictions)),
        "RMSE": float(np.sqrt(mean_squared_error(y_test, predictions))),
        "R2": float(r2_score(y_test, predictions)),
    }


def evaluate_classification_model(
    model: Any,
    x_test: pd.DataFrame,
    y_test: pd.Series,
) -> dict[str, Any]:
    predictions = model.predict(x_test)
    return {
        "Accuracy": float(accuracy_score(y_test, predictions)),
        "Precision": float(
            precision_score(y_test, predictions, average="weighted", zero_division=0)
        ),
        "Recall": float(recall_score(y_test, predictions, average="weighted", zero_division=0)),
        "F1-Score": float(f1_score(y_test, predictions, average="weighted", zero_division=0)),
        "Confusion Matrix": confusion_matrix(
            y_test,
            predictions,
            labels=PRIORITY_LABELS,
        ).tolist(),
        "Classification Report": classification_report(
            y_test,
            predictions,
            labels=PRIORITY_LABELS,
            zero_division=0,
            output_dict=True,
        ),
    }


def train_and_evaluate(dataset_path: Path | None = None) -> dict[str, Any]:
    df = load_dataset(dataset_path)
    x = df[FEATURE_COLUMNS]
    y_reg = df[REGRESSION_TARGET]
    y_cls = df[CLASSIFICATION_TARGET]

    x_train, x_test, y_reg_train, y_reg_test, y_cls_train, y_cls_test = train_test_split(
        x,
        y_reg,
        y_cls,
        test_size=0.2,
        random_state=42,
        stratify=y_cls,
    )

    regression_results: list[dict[str, Any]] = []
    trained_regression_models: dict[str, Any] = {}
    for name, model in _make_regression_models().items():
        model.fit(x_train, y_reg_train)
        trained_regression_models[name] = model
        regression_results.append({"Model": name, **evaluate_regression_model(model, x_test, y_reg_test)})

    classification_results: list[dict[str, Any]] = []
    trained_classification_models: dict[str, Any] = {}
    for name, model in _make_classification_models().items():
        model.fit(x_train, y_cls_train)
        trained_classification_models[name] = model
        classification_results.append(
            {"Model": name, **evaluate_classification_model(model, x_test, y_cls_test)}
        )

    regression_df = pd.DataFrame(regression_results).sort_values(
        by=["RMSE", "MAE"],
        ascending=True,
    )
    classification_df = pd.DataFrame(classification_results).sort_values(
        by=["F1-Score", "Accuracy"],
        ascending=False,
    )

    best_reg_name = str(regression_df.iloc[0]["Model"])
    best_cls_name = str(classification_df.iloc[0]["Model"])
    best_reg_model = trained_regression_models[best_reg_name]
    best_cls_model = trained_classification_models[best_cls_name]

    thresholds = build_priority_thresholds(df)
    feature_importance = _extract_feature_importance(best_reg_model)

    metrics = {
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "dataset_rows": int(len(df)),
        "feature_columns": FEATURE_COLUMNS,
        "target_regression": REGRESSION_TARGET,
        "target_classification": CLASSIFICATION_TARGET,
        "priority_thresholds": thresholds,
        "best_models": {
            "regression": best_reg_name,
            "classification": best_cls_name,
        },
        "regression_comparison": regression_df.to_dict(orient="records"),
        "classification_comparison": classification_df.to_dict(orient="records"),
        "improvements": [
            "Preprocessing memakai StandardScaler untuk model linear/logistic agar skala fitur seimbang.",
            "Menambahkan target klasifikasi priority_level dari persentase kemiskinan memakai threshold kuantil.",
            "Membandingkan beberapa algoritma regresi dan klasifikasi untuk memilih model terbaik berbasis metrik evaluasi.",
        ],
    }

    bundle = {
        "regression_model": best_reg_model,
        "classification_model": best_cls_model,
        "feature_columns": FEATURE_COLUMNS,
        "priority_thresholds": thresholds,
        "metrics": metrics,
        "feature_importance": feature_importance,
    }

    return {
        "dataset": df,
        "bundle": bundle,
        "metrics": metrics,
        "feature_importance": feature_importance,
    }


def _extract_feature_importance(model: Any) -> pd.DataFrame:
    estimator = model
    if isinstance(model, Pipeline):
        estimator = model.named_steps["model"]

    if hasattr(estimator, "feature_importances_"):
        values = estimator.feature_importances_
    elif hasattr(estimator, "coef_"):
        values = np.abs(np.ravel(estimator.coef_))
    else:
        values = np.ones(len(FEATURE_COLUMNS)) / len(FEATURE_COLUMNS)

    importance = pd.DataFrame(
        {
            "feature": FEATURE_COLUMNS,
            "importance": values,
        }
    )
    total = importance["importance"].sum()
    if total:
        importance["importance"] = importance["importance"] / total
    return importance.sort_values("importance", ascending=False).reset_index(drop=True)


def save_training_artifacts(result: dict[str, Any]) -> None:
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(result["bundle"], MODEL_BUNDLE_PATH)

    with METRICS_PATH.open("w", encoding="utf-8") as file:
        json.dump(result["metrics"], file, indent=2, ensure_ascii=False)

    result["feature_importance"].to_csv(FEATURE_IMPORTANCE_PATH, index=False)


def train_and_save(dataset_path: Path | None = None) -> dict[str, Any]:
    result = train_and_evaluate(dataset_path)
    save_training_artifacts(result)
    return result


def load_model_bundle(path: Path = MODEL_BUNDLE_PATH) -> dict[str, Any]:
    if not path.exists():
        train_and_save()
    return joblib.load(path)


def predict_from_input(input_data: dict[str, float], bundle: dict[str, Any] | None = None) -> dict[str, Any]:
    bundle = load_model_bundle() if bundle is None else bundle
    features = pd.DataFrame([{column: input_data[column] for column in bundle["feature_columns"]}])
    poverty = float(bundle["regression_model"].predict(features)[0])
    thresholds = bundle["priority_thresholds"]

    model_priority = str(bundle["classification_model"].predict(features)[0])
    threshold_priority = classify_priority(
        poverty,
        thresholds["low_threshold"],
        thresholds["high_threshold"],
    )

    return {
        "prediksi_kemiskinan": poverty,
        "priority_level": threshold_priority,
        "priority_model": model_priority,
        "status": _status_for_priority(threshold_priority),
        "rekomendasi_utama": _recommendation_for_priority(threshold_priority),
    }


def _status_for_priority(priority: str) -> str:
    return {
        "Low Priority": "Risiko rendah",
        "Medium Priority": "Risiko sedang",
        "High Priority": "Risiko tinggi",
    }.get(priority, "Risiko sedang")


def _recommendation_for_priority(priority: str) -> str:
    return {
        "Low Priority": "Pertahankan program sosial dan lakukan monitoring berkala.",
        "Medium Priority": "Lakukan intervensi pencegahan untuk kelompok rentan.",
        "High Priority": "Prioritaskan bantuan sosial, padat karya, dan pengendalian harga pangan.",
    }.get(priority, "Lakukan validasi data dan monitoring lanjutan.")

