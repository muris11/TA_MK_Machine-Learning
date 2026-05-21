# Paket UAS Machine Learning

Project ini sekarang memiliki dua bagian:

- Aplikasi web Next.js yang sudah ada sebagai bonus tampilan.
- Paket UAS Python sesuai instruksi dosen: dataset CSV, notebook, model artifact, dan `app.py` Streamlit.

## File Penting

- `dataset_kemiskinan_jabar_uas.csv` - dataset untuk training.
- `UAS_ML_Nama_NIM.ipynb` - notebook ML, ganti nama file sesuai Nama dan NIM.
- `app.py` - aplikasi Streamlit untuk demo UAS.
- `ml_artifacts/uas_poverty_model_bundle.pkl` - model terbaik hasil training.
- `ml_artifacts/uas_evaluation_metrics.json` - metrik evaluasi lengkap.
- `requirements-uas.txt` - dependency Python.

## Cara Menjalankan

```bash
python -m pip install -r requirements-uas.txt
python -m uas_ml.cli
python generate_uas_notebook.py
streamlit run app.py
```

Kalau `streamlit` belum tersedia, install dulu dari `requirements-uas.txt`.

## Yang Sudah Memenuhi Rubrik

- Minimal 2 algoritma: Linear Regression, Decision Tree, Random Forest untuk regresi; Logistic Regression, Decision Tree, Random Forest untuk klasifikasi.
- Evaluasi regresi: MAE, RMSE, R2.
- Evaluasi klasifikasi: Accuracy, Precision, Recall, F1-Score, Confusion Matrix.
- Aplikasi Streamlit: input data, prediksi, tampilan dataset, upload CSV, grafik, dan evaluasi.
- Analisis Smart City tersedia di notebook dan aplikasi.

## Catatan Dataset

Dataset UTS asli tidak ditemukan di repository ini. Dataset CSV yang dibuat di sini adalah dataset pembelajaran reproducible dengan studi kasus dan fitur yang sama. Jika dataset UTS asli sudah ada, ganti `dataset_kemiskinan_jabar_uas.csv`, lalu jalankan ulang:

```bash
python -m uas_ml.cli
```

