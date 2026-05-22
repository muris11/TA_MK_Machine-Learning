# StreamKit — Aplikasi Prediksi Kemiskinan Jawa Barat

Aplikasi Streamlit untuk prediksi kemiskinan dan prioritas intervensi sosial di Jawa Barat.
Dibangun sebagai bagian dari UAS Machine Learning — D4 SIKC Politeknik Negeri Indramayu.

## Fitur

- Login sederhana (admin/uas2026, dosen/polindra, user/demo123)
- Prediksi kemiskinan dari 5 indikator sosial ekonomi
- Upload dataset CSV untuk eksperimen
- Tampilan dataset, statistik, dan distribusi
- Evaluasi model regresi & klasifikasi dengan metrik lengkap
- Confusion matrix visual
- Analisis tren dan korelasi fitur
- Analisis Smart City
- UI modern dengan dark theme

## Cara Menjalankan

```bash
cd streamkit
pip install -r requirements.txt
streamlit run app.py
```

Atau dari root project:
```bash
streamlit run streamkit/app.py
```

## Teknologi

- Python 3.10+
- Streamlit
- scikit-learn
- pandas, numpy
- matplotlib, seaborn
