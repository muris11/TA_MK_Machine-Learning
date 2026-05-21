from __future__ import annotations

from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
DATASET_PATH = ROOT_DIR / "dataset_kemiskinan_jabar_uas.csv"
ARTIFACT_DIR = ROOT_DIR / "ml_artifacts"
MODEL_BUNDLE_PATH = ARTIFACT_DIR / "uas_poverty_model_bundle.pkl"
LEGACY_MODEL_BUNDLE_PATH = ARTIFACT_DIR / "poverty_model_bundle.pkl"
METRICS_PATH = ARTIFACT_DIR / "uas_evaluation_metrics.json"
FEATURE_IMPORTANCE_PATH = ARTIFACT_DIR / "uas_feature_importance.csv"

FEATURE_COLUMNS = [
    "tahun",
    "gini_ratio",
    "tingkat_penganggur_terbuka",
    "rata_rata_inflasi_tahunan",
    "indeks_pembangunan_manusia",
]

REGRESSION_TARGET = "persentase_kemiskinan"
CLASSIFICATION_TARGET = "priority_level"

PRIORITY_LABELS = ["Low Priority", "Medium Priority", "High Priority"]

