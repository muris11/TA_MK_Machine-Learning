# Laporan UAS Machine Learning

**Judul:** Prediksi Kemiskinan dan Prioritas Intervensi Sosial Jawa Barat  
**Nama:** Nama Mahasiswa  
**NIM:** NIM Mahasiswa  
**Pilar Smart City:** Smart Governance / Smart Society  
**Link Colab:** isi link Colab  
**Link YouTube:** isi link video presentasi  

## 1. Pendahuluan

Kemiskinan merupakan salah satu indikator penting dalam pengelolaan kota dan
provinsi cerdas. Pemerintah membutuhkan sistem pendukung keputusan yang dapat
membantu membaca kondisi sosial ekonomi dan menentukan prioritas intervensi.
Project ini membangun model Machine Learning untuk memprediksi persentase
kemiskinan dan mengklasifikasikan level prioritas intervensi sosial di Jawa Barat.

## 2. Dataset

Dataset berisi indikator sosial ekonomi Jawa Barat dengan kolom:

- `wilayah`
- `tahun`
- `gini_ratio`
- `tingkat_penganggur_terbuka`
- `rata_rata_inflasi_tahunan`
- `indeks_pembangunan_manusia`
- `persentase_kemiskinan`
- `priority_level`

Jumlah data: 324 baris. Target regresi adalah `persentase_kemiskinan`, sedangkan
target klasifikasi adalah `priority_level` dengan kelas Low Priority, Medium
Priority, dan High Priority.

## 3. Metode

Perbaikan yang dilakukan pada UAS:

- Preprocessing memakai kolom numerik yang konsisten.
- StandardScaler digunakan untuk Linear Regression dan Logistic Regression.
- Menambahkan target klasifikasi `priority_level` dari threshold kuantil.
- Membandingkan beberapa algoritma supaya model terbaik dipilih dari hasil evaluasi.

Algoritma yang digunakan:

- Regresi: Linear Regression, Decision Tree Regressor, Random Forest Regressor.
- Klasifikasi: Logistic Regression, Decision Tree Classifier, Random Forest Classifier.

## 4. Hasil Evaluasi

Model regresi terbaik: **Linear Regression**.

| Model | MAE | RMSE | R2 |
|---|---:|---:|---:|
| Linear Regression | 0.274 | 0.333 | 0.878 |
| Random Forest Regressor | 0.291 | 0.351 | 0.864 |
| Decision Tree Regressor | 0.366 | 0.446 | 0.781 |

Model klasifikasi terbaik: **Logistic Regression**.

| Model | Accuracy | Precision | Recall | F1-Score |
|---|---:|---:|---:|---:|
| Logistic Regression | 0.877 | 0.888 | 0.877 | 0.878 |
| Decision Tree Classifier | 0.800 | 0.813 | 0.800 | 0.803 |
| Random Forest Classifier | 0.738 | 0.741 | 0.738 | 0.739 |

Alasan pemilihan model terbaik:

- Regresi dipilih berdasarkan RMSE dan MAE paling kecil serta R2 paling tinggi.
- Klasifikasi dipilih berdasarkan F1-Score dan accuracy paling tinggi.

## 5. Implementasi Aplikasi

Aplikasi dibuat menggunakan Streamlit pada file `app.py`. Fitur aplikasi:

- Input data indikator sosial ekonomi.
- Prediksi persentase kemiskinan dan level prioritas.
- Tampilan dataset dan upload CSV.
- Visualisasi feature importance dan distribusi prioritas.
- Tabel evaluasi model dan confusion matrix.
- Analisis manfaat sistem untuk Smart City.

Cara menjalankan:

```bash
python -m pip install -r requirements-uas.txt
python -m uas_ml.cli
streamlit run app.py
```

## 6. Kesimpulan

Model Machine Learning dapat membantu pemerintah membaca risiko kemiskinan dan
menyusun prioritas intervensi sosial berbasis data. Sistem ini bermanfaat untuk
pengambilan keputusan, perencanaan bantuan sosial, pelatihan kerja, stabilisasi
harga, dan monitoring indikator Smart City.

Risiko utama adalah prediksi yang salah dapat menyebabkan bantuan tidak tepat
sasaran. Oleh karena itu, hasil model harus divalidasi dengan data terbaru dan
keputusan akhir tetap mempertimbangkan konteks lapangan. Privasi data dijaga
dengan menggunakan data agregat, membatasi akses, dan menghindari penyimpanan
identitas pribadi yang tidak diperlukan.

