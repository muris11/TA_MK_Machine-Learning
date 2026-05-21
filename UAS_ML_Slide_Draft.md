# Slide 1 - Judul

Prediksi Kemiskinan dan Prioritas Intervensi Sosial Jawa Barat  
Nama Mahasiswa - NIM  
Pilar Smart City: Smart Governance / Smart Society

# Slide 2 - Dataset

- Studi kasus: kemiskinan Jawa Barat.
- Jumlah data: 324 baris.
- Fitur: tahun, Gini Ratio, TPT, inflasi, IPM.
- Target regresi: persentase kemiskinan.
- Target klasifikasi: priority_level.

# Slide 3 - Metode

- Preprocessing data numerik.
- StandardScaler untuk model linear/logistic.
- Penambahan target priority_level dari threshold kuantil.
- Algoritma regresi: Linear Regression, Decision Tree, Random Forest.
- Algoritma klasifikasi: Logistic Regression, Decision Tree, Random Forest.

# Slide 4 - Evaluasi

- Regresi terbaik: Linear Regression.
- MAE: 0.274.
- RMSE: 0.333.
- R2: 0.878.
- Klasifikasi terbaik: Logistic Regression.
- Accuracy: 0.877.
- F1-Score: 0.878.

# Slide 5 - Demo Aplikasi

- Jalankan `streamlit run app.py`.
- Masukkan indikator sosial ekonomi.
- Tampilkan prediksi kemiskinan.
- Tampilkan level prioritas dan rekomendasi.
- Tampilkan dataset, grafik, evaluasi, dan confusion matrix.

# Slide 6 - Kesimpulan

- Sistem membantu prioritas intervensi sosial berbasis data.
- Manfaat: bantuan lebih tepat sasaran, monitoring lebih cepat, kebijakan lebih terukur.
- Risiko: prediksi salah dapat menyebabkan salah sasaran.
- Pengembangan: gunakan dataset real-time, peta wilayah, login, dan deploy online.

