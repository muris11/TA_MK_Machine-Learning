from __future__ import annotations

import json
import os
import sys
from pathlib import Path

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import streamlit as st

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from uas_ml.config import (
    ARTIFACT_DIR,
    CLASSIFICATION_TARGET,
    DATASET_PATH,
    FEATURE_COLUMNS,
    FEATURE_IMPORTANCE_PATH,
    METRICS_PATH,
    MODEL_BUNDLE_PATH,
    PRIORITY_LABELS,
    REGRESSION_TARGET,
)
from uas_ml.data import load_dataset
from uas_ml.modeling import (
    _make_classification_models,
    _make_regression_models,
    evaluate_classification_model,
    evaluate_regression_model,
    load_model_bundle,
    predict_from_input,
    train_and_evaluate,
)


st.set_page_config(
    page_title="StreamKit - Prediksi Kemiskinan Jawa Barat",
    page_icon="",
    layout="wide",
    initial_sidebar_state="expanded",
)


USER_CREDENTIALS = {"admin": "uas2026", "dosen": "polindra", "user": "demo123"}


def check_login() -> bool:
    if "authenticated" not in st.session_state:
        st.session_state.authenticated = False
    return st.session_state.authenticated


def login_page() -> None:
    st.markdown("""
    <style>
        .login-container {
            max-width: 400px; margin: 80px auto; padding: 2rem;
            background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
            border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .login-title {
            text-align: center; color: white; font-size: 1.8rem;
            margin-bottom: 0.5rem; font-weight: 700;
        }
        .login-subtitle {
            text-align: center; color: #94a3b8; font-size: 0.9rem;
            margin-bottom: 2rem;
        }
        .stTextInput label { color: white !important; }
        .stTextInput input { background: rgba(255,255,255,0.1) !important;
            color: white !important; border: 1px solid #334155 !important;
            border-radius: 8px !important; }
    </style>
    <div class="login-container">
        <div class="login-title">StreamKit</div>
        <div class="login-subtitle">Prediksi Kemiskinan Jawa Barat</div>
    </div>
    """, unsafe_allow_html=True)

    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        with st.form("login_form"):
            st.markdown("#### Masuk ke Aplikasi")
            username = st.text_input("Username", placeholder="admin / dosen / user")
            password = st.text_input("Password", type="password", placeholder="********")
            submitted = st.form_submit_button("Masuk", type="primary", use_container_width=True)

            if submitted:
                if username in USER_CREDENTIALS and USER_CREDENTIALS[username] == password:
                    st.session_state.authenticated = True
                    st.session_state.username = username
                    st.rerun()
                else:
                    st.error("Username atau password salah.")

        st.markdown("""
        <div style="text-align:center; color:#64748b; font-size:0.8rem; margin-top:1rem;">
            Demo: admin / uas2026 &nbsp;|&nbsp; dosen / polindra &nbsp;|&nbsp; user / demo123
        </div>
        """, unsafe_allow_html=True)


@st.cache_data
def get_dataset() -> pd.DataFrame:
    return load_dataset()


@st.cache_resource
def get_model_bundle() -> dict:
    if not MODEL_BUNDLE_PATH.exists():
        result = train_and_evaluate()
        _save_artifacts(result)
    return load_model_bundle()


@st.cache_data
def get_metrics() -> dict:
    if not METRICS_PATH.exists():
        result = train_and_evaluate()
        _save_artifacts(result)
    return json.loads(METRICS_PATH.read_text(encoding="utf-8"))


def _save_artifacts(result: dict) -> None:
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(result["bundle"], MODEL_BUNDLE_PATH)
    with METRICS_PATH.open("w", encoding="utf-8") as f:
        json.dump(result["metrics"], f, indent=2, ensure_ascii=False)
    result["feature_importance"].to_csv(FEATURE_IMPORTANCE_PATH, index=False)


def load_css() -> None:
    st.markdown("""
    <style>
        .main-header {
            background: linear-gradient(135deg, #1e3a5f, #2d5a87);
            padding: 1.5rem 2rem; border-radius: 12px; margin-bottom: 1.5rem;
            color: white;
        }
        .main-header h1 { margin: 0; font-size: 1.8rem; font-weight: 700; }
        .main-header p { margin: 0.25rem 0 0; opacity: 0.85; font-size: 0.95rem; }

        .card {
            background: #1e293b; border: 1px solid #334155;
            border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem;
        }
        .card-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; color: #e2e8f0; }

        .metric-high { color: #ef4444; font-weight: 700; }
        .metric-medium { color: #f59e0b; font-weight: 700; }
        .metric-low { color: #22c55e; font-weight: 700; }

        .stTabs [data-baseweb="tab-list"] { gap: 0; background: #1e293b;
            border-radius: 10px; padding: 4px; }
        .stTabs [data-baseweb="tab"] { border-radius: 8px; padding: 0.5rem 1rem; }

        .footer { text-align: center; color: #64748b; font-size: 0.8rem;
            padding: 2rem 0 0; border-top: 1px solid #334155; margin-top: 2rem; }

        div[data-testid="stMetricValue"] { font-size: 1.8rem !important; font-weight: 700 !important; }
        div[data-testid="stMetricLabel"] { font-size: 0.85rem !important; color: #94a3b8 !important; }

        .stButton button[kind="primary"] {
            background: linear-gradient(135deg, #2563eb, #3b82f6);
            border: none; font-weight: 600;
        }
        .stButton button[kind="primary"]:hover {
            background: linear-gradient(135deg, #1d4ed8, #2563eb);
        }

        .status-badge {
            display: inline-block; padding: 0.25rem 0.75rem; border-radius: 20px;
            font-weight: 600; font-size: 0.85rem;
        }

        .recommendation-card {
            background: linear-gradient(135deg, #1e3a5f, #1e293b);
            border-left: 4px solid #3b82f6; border-radius: 8px; padding: 1rem; margin: 0.5rem 0;
        }
    </style>
    """, unsafe_allow_html=True)


def priority_color(level: str) -> str:
    if "High" in level:
        return "metric-high"
    if "Medium" in level:
        return "metric-medium"
    return "metric-low"


def priority_badge(level: str) -> str:
    color_map = {"High Priority": "#ef4444", "Medium Priority": "#f59e0b", "Low Priority": "#22c55e"}
    bg = color_map.get(level, "#64748b")
    return f'<span class="status-badge" style="background:{bg}20;color:{bg}">{level}</span>'


def page_prediction(bundle: dict, metrics: dict) -> None:
    st.markdown('<div class="card"><div class="card-title">Input Indikator Sosial Ekonomi</div>', unsafe_allow_html=True)

    col1, col2, col3 = st.columns(3)
    with col1:
        tahun = st.number_input("Tahun", min_value=2014, max_value=2035, value=2026, help="Tahun prediksi")
        gini = st.number_input("Gini Ratio", min_value=0.0, max_value=1000.0, value=385.0, format="%.2f",
                               help="0=merata, 1000=timpang")
    with col2:
        tpt = st.number_input("Tingkat Pengangguran Terbuka (%)", min_value=0.0, max_value=30.0, value=5.8, format="%.2f")
        inflasi = st.number_input("Rata-rata Inflasi Tahunan (%)", min_value=-5.0, max_value=20.0, value=2.4, format="%.2f")
    with col3:
        ipm = st.number_input("Indeks Pembangunan Manusia", min_value=0.0, max_value=100.0, value=73.5, format="%.2f",
                              help="0-100, semakin tinggi semakin baik")

    st.markdown('</div>', unsafe_allow_html=True)

    predict_clicked = st.button("Prediksi Sekarang", type="primary", use_container_width=True)

    if predict_clicked:
        input_data = {
            "tahun": tahun,
            "gini_ratio": gini,
            "tingkat_penganggur_terbuka": tpt,
            "rata_rata_inflasi_tahunan": inflasi,
            "indeks_pembangunan_manusia": ipm,
        }

        with st.spinner("Memproses prediksi..."):
            prediction = predict_from_input(input_data, bundle=bundle)

        col_result, col_chart = st.columns([1.2, 1])

        with col_result:
            st.markdown("### Hasil Prediksi")
            st.markdown(f"## {prediction['prediksi_kemiskinan']:.2f}%")
            st.markdown(f"Estimasi persentase kemiskinan")

            st.markdown("---")

            st.markdown(f"**Level Prioritas:**")
            st.markdown(priority_badge(prediction["priority_level"]), unsafe_allow_html=True)

            st.markdown("**Status:** " + prediction["status"])

            st.markdown("---")
            st.markdown("**Rekomendasi:**")
            st.markdown(f'<div class="recommendation-card">{prediction["rekomendasi_utama"]}</div>',
                        unsafe_allow_html=True)

        with col_chart:
            st.markdown("### Feature Importance")
            if FEATURE_IMPORTANCE_PATH.exists():
                imp_df = pd.read_csv(FEATURE_IMPORTANCE_PATH)
            else:
                imp_df = pd.DataFrame(bundle["feature_importance"])

            fig, ax = plt.subplots(figsize=(8, 4))
            colors = ["#2563eb" if i == 0 else "#3b82f6" if i == 1 else "#64748b" for i in range(len(imp_df))]
            ax.barh(imp_df["feature"], imp_df["importance"], color=colors, edgecolor="none")
            ax.invert_yaxis()
            ax.set_xlabel("Importance", fontsize=11)
            ax.set_title("Pengaruh Fitur terhadap Prediksi", fontsize=12, fontweight=600)
            ax.spines["top"].set_visible(False)
            ax.spines["right"].set_visible(False)

            for i, (_, row) in enumerate(imp_df.iterrows()):
                ax.text(row["importance"] + 0.005, i, f"{row['importance']:.1%}",
                        va="center", fontsize=10, color="#94a3b8")

            st.pyplot(fig)
            plt.close()

        st.markdown("---")
        st.markdown("### Detail Input")
        detail_df = pd.DataFrame({
            "Indikator": ["Tahun", "Gini Ratio", "TPT", "Inflasi", "IPM"],
            "Nilai Float": [float(tahun), gini, tpt, inflasi, ipm],
        })
        st.dataframe(detail_df, hide_index=True)


def page_dataset(dataset: pd.DataFrame) -> None:
    st.markdown("### Dataset Kemiskinan Jawa Barat")
    st.markdown(f"Jumlah data: **{len(dataset)} baris** &nbsp;|&nbsp; Fitur: **{len(dataset.columns)} kolom**")

    uploaded = st.file_uploader("Upload dataset CSV (opsional)", type=["csv"],
                                help="Upload dataset lain dengan kolom fitur yang sama untuk eksperimen.")

    if uploaded:
        new_df = pd.read_csv(uploaded)
        missing = [c for c in FEATURE_COLUMNS if c not in new_df.columns]
        if missing:
            st.error(f"Kolom wajib belum ada: {', '.join(missing)}")
        else:
            st.success(f"Dataset berhasil diupload: {len(new_df)} baris")
            dataset = new_df

    tab_preview, tab_stats, tab_dist = st.tabs(["Preview Data", "Statistik", "Distribusi"])

    with tab_preview:
        rows = st.slider("Jumlah baris", 5, 50, 15)
        st.dataframe(dataset.head(rows), hide_index=True)

    with tab_stats:
        stats_df = dataset.describe()
        st.dataframe(stats_df, hide_index=True)

    with tab_dist:
        col_a, col_b = st.columns(2)

        with col_a:
            st.markdown("**Distribusi Priority Level**")
            dist = dataset["priority_level"].value_counts()
            fig, ax = plt.subplots(figsize=(6, 4))
            colors_ = {"Low Priority": "#22c55e", "Medium Priority": "#f59e0b", "High Priority": "#ef4444"}
            bars = ax.bar(dist.index, dist.values,
                          color=[colors_.get(x, "#64748b") for x in dist.index],
                          edgecolor="none", width=0.5)
            ax.set_ylabel("Jumlah")
            ax.spines["top"].set_visible(False)
            ax.spines["right"].set_visible(False)

            for bar, val in zip(bars, dist.values):
                ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 1,
                        str(val), ha="center", fontsize=12, fontweight=600)

            st.pyplot(fig)
            plt.close()

        with col_b:
            st.markdown("**Distribusi Priority Level**")
            st.dataframe(dist.reset_index().rename(columns={"index": "Priority", "priority_level": "Jumlah"}),
                         hide_index=True)


def page_evaluation(metrics: dict, bundle: dict) -> None:
    st.markdown("### Evaluasi Model Machine Learning")
    st.markdown(f"Dataset: **{metrics['dataset_rows']} baris** &nbsp;|&nbsp; "
                f"Model regresi: **{metrics['best_models']['regression']}** &nbsp;|&nbsp; "
                f"Model klasifikasi: **{metrics['best_models']['classification']}**")

    tab_reg, tab_cls, tab_cm, tab_imp = st.tabs(["Regresi", "Klasifikasi", "Confusion Matrix", "Improvements"])

    with tab_reg:
        st.markdown("#### Perbandingan Model Regresi")
        reg_df = pd.DataFrame(metrics["regression_comparison"])
        reg_display = reg_df[["Model", "MAE", "RMSE", "R2"]].copy()
        reg_display["MAE"] = reg_display["MAE"].apply(lambda x: f"{x:.4f}")
        reg_display["RMSE"] = reg_display["RMSE"].apply(lambda x: f"{x:.4f}")
        reg_display["R2"] = reg_display["R2"].apply(lambda x: f"{x:.4f}")
        st.dataframe(reg_display, hide_index=True)

        best_reg = metrics["best_models"]["regression"]
        st.info(f"Model regresi terbaik: **{best_reg}** — memiliki RMSE terkecil dan R² tertinggi.")

    with tab_cls:
        st.markdown("#### Perbandingan Model Klasifikasi")
        cls_df = pd.DataFrame(metrics["classification_comparison"])
        cls_display = cls_df[["Model", "Accuracy", "Precision", "Recall", "F1-Score"]].copy()
        for col in cls_display.columns:
            if col != "Model":
                cls_display[col] = cls_display[col].apply(lambda x: f"{x:.2%}")
        st.dataframe(cls_display, hide_index=True)

        best_cls = metrics["best_models"]["classification"]
        st.info(f"Model klasifikasi terbaik: **{best_cls}** — memiliki accuracy dan F1-Score tertinggi.")

    with tab_cm:
        best_cls_name = metrics["best_models"]["classification"]
        best_row = next(
            r for r in metrics["classification_comparison"] if r["Model"] == best_cls_name
        )
        cm = np.array(best_row["Confusion Matrix"])

        col_cm1, col_cm2 = st.columns([1.5, 1])

        with col_cm1:
            st.markdown(f"**Confusion Matrix — {best_cls_name}**")
            fig, ax = plt.subplots(figsize=(6, 5))
            sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
                        xticklabels=PRIORITY_LABELS,
                        yticklabels=PRIORITY_LABELS,
                        ax=ax, cbar_kws={"shrink": 0.8})
            ax.set_xlabel("Predicted", fontsize=11)
            ax.set_ylabel("Actual", fontsize=11)
            st.pyplot(fig)
            plt.close()

        with col_cm2:
            st.markdown("**Detail per kelas:**")
            report = best_row["Classification Report"]
            for label in PRIORITY_LABELS:
                if label in report:
                    r = report[label]
                    st.markdown(f"- **{label}:** precision={r['precision']:.2%}, "
                                f"recall={r['recall']:.2%}, f1={r['f1-score']:.2%}")

            accuracy = best_row["Accuracy"]
            st.markdown(f"---")
            st.markdown(f"**Accuracy:** {accuracy:.2%}")
            st.markdown(f"**F1-Score (weighted):** {best_row['F1-Score']:.2%}")

    with tab_imp:
        st.markdown("#### Perbaikan yang Dilakukan")
        for imp in metrics.get("improvements", []):
            st.markdown(f"- {imp}")


def page_visualizations(dataset: pd.DataFrame) -> None:
    st.markdown("### Visualisasi Data")

    tab_trend, tab_features = st.tabs(["Tren Kemiskinan", "Hubungan Antar Fitur"])

    with tab_trend:
        st.markdown("**Tren Rata-rata Kemiskinan per Tahun**")
        trend = dataset.groupby("tahun")["persentase_kemiskinan"].agg(["mean", "min", "max"]).reset_index()

        fig, ax = plt.subplots(figsize=(10, 5))
        ax.fill_between(trend["tahun"], trend["min"], trend["max"], alpha=0.15, color="#3b82f6", label="Range")
        ax.plot(trend["tahun"], trend["mean"], color="#2563eb", linewidth=2.5, marker="o", markersize=6, label="Rata-rata")
        ax.set_xlabel("Tahun", fontsize=11)
        ax.set_ylabel("Persentase Kemiskinan", fontsize=11)
        ax.set_title("Tren Kemiskinan Jawa Barat (2014-2025)", fontsize=13, fontweight=600)
        ax.legend()
        ax.spines["top"].set_visible(False)
        ax.spines["right"].set_visible(False)
        ax.grid(axis="y", alpha=0.2)
        st.pyplot(fig)
        plt.close()

    with tab_features:
        st.markdown("**Korelasi Antar Fitur**")
        corr_cols = FEATURE_COLUMNS + ["persentase_kemiskinan"]
        corr = dataset[corr_cols].corr()

        fig, ax = plt.subplots(figsize=(8, 6))
        mask = np.triu(np.ones_like(corr, dtype=bool), k=1)
        sns.heatmap(corr, mask=mask, annot=True, fmt=".2f", cmap="RdBu_r",
                    center=0, vmin=-1, vmax=1, square=True, ax=ax,
                    cbar_kws={"shrink": 0.8, "label": "Korelasi"})
        ax.set_title("Matrix Korelasi", fontsize=13, fontweight=600)
        st.pyplot(fig)
        plt.close()

        st.markdown("""
        **Interpretasi:**
        - IPM memiliki korelasi negatif terhadap kemiskinan (semakin tinggi IPM, semakin rendah kemiskinan).
        - Gini Ratio dan TPT berkorelasi positif terhadap kemiskinan.
        """)


def page_smart_city() -> None:
    st.markdown("### Analisis Smart City")

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("""
        <div class="card">
            <div class="card-title">Bagaimana Model Membantu Smart City?</div>
            <p style="color:#cbd5e1; line-height:1.7;">
            Model Machine Learning membantu Smart City dengan menyediakan sistem prediksi 
            berbasis data untuk memetakan risiko kemiskinan di Jawa Barat. Pemerintah dapat 
            menggunakan hasil prediksi untuk menentukan prioritas intervensi sosial secara 
            lebih objektif dan terukur. Sistem ini mendukung pilar 
            <strong>Smart Governance</strong> dengan menyediakan data-driven decision making 
            dan <strong>Smart Society</strong> dengan mengarahkan bantuan ke masyarakat 
            yang paling membutuhkan.
            </p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        <div class="card">
            <div class="card-title">Manfaat bagi Pemerintah dan Masyarakat</div>
            <ul style="color:#cbd5e1; line-height:1.7;">
                <li><strong>Pemerintah:</strong> Prioritas bantuan sosial lebih tepat sasaran, 
                alokasi anggaran lebih efisien, monitoring kemiskinan lebih cepat dan akurat.</li>
                <li><strong>Masyarakat:</strong> Bantuan tepat waktu, program pelatihan kerja 
                sesuai kebutuhan, stabilisasi harga pangan di wilayah rentan, dan pemberdayaan 
                UMKM yang terarah.</li>
                <li><strong>Akademisi:</strong> Data referensi untuk penelitian kebijakan 
                publik dan pengembangan model yang lebih baik.</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    with col2:
        st.markdown("""
        <div class="card">
            <div class="card-title">Risiko jika Prediksi Salah</div>
            <ul style="color:#cbd5e1; line-height:1.7;">
                <li>Bantuan sosial tidak tepat sasaran (salah alokasi).</li>
                <li>Wilayah rentan terlambat mendapatkan intervensi.</li>
                <li>Anggaran dialokasikan ke program yang kurang prioritas.</li>
                <li>Kepercayaan publik terhadap sistem berbasis data menurun.</li>
                <li>Keputusan kebijakan menjadi kurang efektif.</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        <div class="card">
            <div class="card-title">Menjaga Privasi Data</div>
            <ul style="color:#cbd5e1; line-height:1.7;">
                <li>Menggunakan data agregat tingkat kabupaten/kota, bukan data individu.</li>
                <li>Anonymization data: tidak menyimpan identitas pribadi (nama, alamat, NIK).</li>
                <li>Pembatasan akses: hanya pengguna terautentikasi yang dapat mengakses sistem.</li>
                <li>Data disimpan secara lokal dan tidak dibagikan ke pihak ketiga.</li>
                <li>Enkripsi data dan penggunaan secure connection (HTTPS) jika di-deploy online.</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("""
    <div class="card">
        <div class="card-title">Kesimpulan Smart City</div>
        <p style="color:#cbd5e1; line-height:1.7;">
        Sistem prediksi kemiskinan ini merupakan implementasi nyata dari konsep Smart City 
        di Indonesia. Dengan memanfaatkan Machine Learning, pemerintah dapat bertransisi dari 
        pengambilan keputusan berbasis intuisi menjadi <strong>data-driven decision making</strong>. 
        Sistem ini dapat dikembangkan lebih lanjut dengan integrasi data real-time, visualisasi 
        peta wilayah, dan dashboard publik untuk transparansi tata kelola daerah.
        </p>
    </div>
    """, unsafe_allow_html=True)


def main() -> None:
    if not check_login():
        login_page()
        return

    load_css()

    dataset = get_dataset()
    bundle = get_model_bundle()
    metrics = get_metrics()

    with st.sidebar:
        st.markdown(f"### StreamKit")
        st.markdown(f"<small>User: **{st.session_state.username}**</small>", unsafe_allow_html=True)
        st.markdown("---")

        menu = st.radio("Menu", [
            "Prediksi",
            "Dataset",
            "Evaluasi Model",
            "Visualisasi",
            "Analisis Smart City",
        ], label_visibility="collapsed")

        st.markdown("---")

        if METRICS_PATH.exists():
            m = json.loads(METRICS_PATH.read_text(encoding="utf-8"))
            st.markdown("**R2 Score:** " + f"{m['regression_comparison'][0]['R2']:.2%}")
            st.markdown("**Accuracy:** " + f"{m['classification_comparison'][0]['Accuracy']:.2%}")

        st.markdown("---")

        if st.button("Keluar", use_container_width=True):
            st.session_state.authenticated = False
            st.session_state.username = ""
            st.rerun()

    st.markdown("""
    <div class="main-header">
        <h1>Prediksi Kemiskinan Jawa Barat</h1>
        <p>Aplikasi Machine Learning untuk Smart City — UAS Semester 6 Prodi D4 SIKC Polindra</p>
    </div>
    """, unsafe_allow_html=True)

    if menu == "Prediksi":
        page_prediction(bundle, metrics)
    elif menu == "Dataset":
        page_dataset(dataset)
    elif menu == "Evaluasi Model":
        page_evaluation(metrics, bundle)
    elif menu == "Visualisasi":
        page_visualizations(dataset)
    elif menu == "Analisis Smart City":
        page_smart_city()

    st.markdown("""
    <div class="footer">
        UAS Machine Learning — D4 Sistem Informasi Kota Cerdas — Politeknik Negeri Indramayu © 2026
    </div>
    """, unsafe_allow_html=True)


if __name__ == "__main__":
    main()
