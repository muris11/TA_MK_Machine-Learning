from __future__ import annotations

import json
from pathlib import Path

import joblib
import matplotlib.pyplot as plt
import pandas as pd
import streamlit as st

from uas_ml.config import (
    DATASET_PATH,
    FEATURE_COLUMNS,
    FEATURE_IMPORTANCE_PATH,
    METRICS_PATH,
    MODEL_BUNDLE_PATH,
)
from uas_ml.data import load_dataset
from uas_ml.modeling import load_model_bundle, predict_from_input, train_and_save


st.set_page_config(
    page_title="UAS ML - Prediksi Kemiskinan Jawa Barat",
    layout="wide",
)


@st.cache_data
def get_dataset() -> pd.DataFrame:
    return load_dataset()


@st.cache_resource
def get_model_bundle() -> dict:
    if not MODEL_BUNDLE_PATH.exists():
        train_and_save()
    return load_model_bundle()


def load_metrics() -> dict:
    if not METRICS_PATH.exists():
        train_and_save()
    return json.loads(METRICS_PATH.read_text(encoding="utf-8"))


def render_metric_table(metrics: dict, key: str, columns: list[str]) -> None:
    df = pd.DataFrame(metrics[key])
    st.dataframe(df[columns], use_container_width=True, hide_index=True)


def render_confusion_matrix(metrics: dict) -> None:
    best_name = metrics["best_models"]["classification"]
    best_row = next(
        row for row in metrics["classification_comparison"] if row["Model"] == best_name
    )
    matrix = pd.DataFrame(
        best_row["Confusion Matrix"],
        index=["Aktual Low", "Aktual Medium", "Aktual High"],
        columns=["Pred Low", "Pred Medium", "Pred High"],
    )
    st.dataframe(matrix, use_container_width=True)


def render_feature_chart() -> None:
    if FEATURE_IMPORTANCE_PATH.exists():
        importance = pd.read_csv(FEATURE_IMPORTANCE_PATH)
    else:
        importance = pd.DataFrame(get_model_bundle()["feature_importance"])

    fig, ax = plt.subplots(figsize=(8, 4))
    ax.barh(importance["feature"], importance["importance"], color="#2563eb")
    ax.invert_yaxis()
    ax.set_xlabel("Importance")
    ax.set_title("Feature Importance Model Terbaik")
    st.pyplot(fig)


def render_dataset_upload(default_df: pd.DataFrame) -> pd.DataFrame:
    uploaded_file = st.file_uploader(
        "Upload dataset CSV opsional",
        type=["csv"],
        help="Gunakan jika ingin mencoba dataset lain dengan kolom fitur yang sama.",
    )

    if uploaded_file is None:
        return default_df

    uploaded_df = pd.read_csv(uploaded_file)
    missing = [column for column in FEATURE_COLUMNS if column not in uploaded_df.columns]
    if missing:
        st.error(f"Kolom wajib belum ada: {', '.join(missing)}")
        return default_df

    st.success("Dataset upload berhasil dibaca.")
    return uploaded_df


def main() -> None:
    dataset = get_dataset()
    bundle = get_model_bundle()
    metrics = load_metrics()

    st.title("Prediksi Kemiskinan Jawa Barat")
    st.caption(
        "Aplikasi UAS Machine Learning: input data, prediksi model, tampilan dataset, "
        "evaluasi, dan visualisasi untuk konteks Smart City."
    )

    with st.sidebar:
        st.header("Input Data")
        tahun = st.number_input("Tahun prediksi", min_value=2014, value=2026)
        gini_ratio = st.number_input("Gini Ratio", min_value=0.0, max_value=1000.0, value=385.0)
        tpt = st.number_input(
            "Tingkat Pengangguran Terbuka (%)",
            min_value=0.0,
            max_value=30.0,
            value=5.8,
        )
        inflasi = st.number_input(
            "Rata-rata Inflasi Tahunan (%)",
            min_value=-5.0,
            max_value=20.0,
            value=2.4,
        )
        ipm = st.number_input(
            "Indeks Pembangunan Manusia",
            min_value=0.0,
            max_value=100.0,
            value=73.5,
        )

    tab_predict, tab_dataset, tab_evaluation, tab_smart_city = st.tabs(
        ["Prediksi", "Dataset", "Evaluasi Model", "Analisis Smart City"]
    )

    with tab_predict:
        left, right = st.columns([0.9, 1.1])

        input_data = {
            "tahun": tahun,
            "gini_ratio": gini_ratio,
            "tingkat_penganggur_terbuka": tpt,
            "rata_rata_inflasi_tahunan": inflasi,
            "indeks_pembangunan_manusia": ipm,
        }
        prediction = predict_from_input(input_data, bundle=bundle)

        with left:
            st.subheader("Hasil Prediksi")
            st.metric("Prediksi Kemiskinan", f"{prediction['prediksi_kemiskinan']:.2f}%")
            st.metric("Level Prioritas", prediction["priority_level"])
            st.write(f"**Status:** {prediction['status']}")
            st.info(prediction["rekomendasi_utama"])

        with right:
            st.subheader("Visualisasi")
            render_feature_chart()

    with tab_dataset:
        st.subheader("Tampilan Dataset")
        selected_df = render_dataset_upload(dataset)
        st.write(f"Jumlah data: **{len(selected_df)} baris**")
        st.dataframe(selected_df.head(20), use_container_width=True, hide_index=True)

        if "priority_level" in selected_df.columns:
            st.bar_chart(selected_df["priority_level"].value_counts())
        elif "persentase_kemiskinan" in selected_df.columns:
            st.line_chart(selected_df[["persentase_kemiskinan"]])

    with tab_evaluation:
        st.subheader("Perbandingan Model")
        st.write(f"Model regresi terbaik: **{metrics['best_models']['regression']}**")
        st.write(f"Model klasifikasi terbaik: **{metrics['best_models']['classification']}**")

        st.markdown("**Evaluasi Regresi**")
        render_metric_table(metrics, "regression_comparison", ["Model", "MAE", "RMSE", "R2"])

        st.markdown("**Evaluasi Klasifikasi**")
        render_metric_table(
            metrics,
            "classification_comparison",
            ["Model", "Accuracy", "Precision", "Recall", "F1-Score"],
        )

        st.markdown("**Confusion Matrix Model Klasifikasi Terbaik**")
        render_confusion_matrix(metrics)

    with tab_smart_city:
        st.subheader("Interpretasi untuk Smart City")
        st.markdown(
            """
            **Manfaat model:** membantu pemerintah memetakan risiko kemiskinan dari indikator
            sosial ekonomi sehingga intervensi bisa lebih cepat dan berbasis data.

            **Manfaat bagi pemerintah/masyarakat:** prioritas bantuan sosial, pelatihan kerja,
            stabilisasi harga, dan pemberdayaan UMKM dapat diarahkan ke kondisi paling rentan.

            **Risiko prediksi salah:** bantuan dapat salah sasaran, wilayah rentan terlambat
            ditangani, atau anggaran diarahkan ke program yang kurang tepat.

            **Privasi data:** gunakan data agregat, minimalkan data pribadi, batasi akses file,
            dan lakukan anonymization jika dataset memuat identitas individu.
            """
        )

    with st.expander("Informasi Artifact"):
        st.write(f"Dataset: `{DATASET_PATH}`")
        st.write(f"Model bundle: `{MODEL_BUNDLE_PATH}`")
        st.write(f"Metrik evaluasi: `{METRICS_PATH}`")


if __name__ == "__main__":
    main()
