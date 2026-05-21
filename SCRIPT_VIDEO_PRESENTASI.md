# Script Video Presentasi UAS

Durasi target: 5-10 menit.

## 1. Pembukaan

Assalamualaikum, perkenalkan saya Nama Mahasiswa dengan NIM NIM Mahasiswa.
Pada video ini saya akan mempresentasikan project UAS Machine Learning berjudul
Prediksi Kemiskinan dan Prioritas Intervensi Sosial Jawa Barat. Project ini
masuk ke pilar Smart Governance dan Smart Society karena membantu pemerintah
menentukan prioritas kebijakan sosial berbasis data.

## 2. Dataset

Dataset yang digunakan adalah dataset indikator sosial ekonomi Jawa Barat.
Jumlah data adalah 324 baris. Fitur yang digunakan yaitu tahun, Gini Ratio,
Tingkat Pengangguran Terbuka, rata-rata inflasi tahunan, dan Indeks Pembangunan
Manusia. Target regresi adalah persentase kemiskinan, sedangkan target klasifikasi
adalah priority level yang terdiri dari Low Priority, Medium Priority, dan High Priority.

## 3. Proses Machine Learning

Tahapan Machine Learning dimulai dari load dataset, EDA sederhana, preprocessing,
penambahan target klasifikasi, pembagian data train-test, training model, evaluasi,
dan penyimpanan model. Pada preprocessing, data dibuat dalam format numerik yang
konsisten dan StandardScaler digunakan pada model linear dan logistic regression.

## 4. Algoritma dan Evaluasi

Untuk regresi, saya membandingkan Linear Regression, Decision Tree Regressor, dan
Random Forest Regressor. Untuk klasifikasi, saya membandingkan Logistic Regression,
Decision Tree Classifier, dan Random Forest Classifier.

Hasil terbaik untuk regresi adalah Linear Regression dengan MAE 0.274, RMSE 0.333,
dan R2 0.878. Hasil terbaik untuk klasifikasi adalah Logistic Regression dengan
accuracy 0.877 dan F1-Score 0.878. Model dipilih karena memiliki error paling kecil
dan performa klasifikasi paling stabil.

## 5. Demo Aplikasi

Sekarang saya menjalankan aplikasi dengan perintah `streamlit run app.py`.
Pada sidebar saya memasukkan tahun prediksi, Gini Ratio, tingkat pengangguran,
inflasi, dan IPM. Setelah input dimasukkan, aplikasi menampilkan prediksi
persentase kemiskinan, level prioritas, status risiko, dan rekomendasi kebijakan.

Pada tab dataset, aplikasi menampilkan sebagian dataset dan menyediakan upload CSV.
Pada tab evaluasi, aplikasi menampilkan tabel perbandingan model dan confusion
matrix. Pada tab Smart City, aplikasi menjelaskan manfaat, risiko, dan privasi data.

## 6. Kesimpulan

Kesimpulannya, model ini dapat membantu pemerintah membaca risiko kemiskinan dan
menentukan prioritas intervensi sosial. Manfaatnya adalah bantuan sosial dan program
ekonomi dapat diarahkan lebih tepat sasaran. Kendala project adalah kualitas prediksi
sangat bergantung pada dataset. Pengembangan ke depan adalah memakai dataset terbaru,
menambahkan peta wilayah, login sederhana, dan deploy online.

