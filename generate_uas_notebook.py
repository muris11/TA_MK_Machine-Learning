from __future__ import annotations

from pathlib import Path

import nbformat as nbf


OUTPUT_PATH = Path("UAS_ML_Nama_NIM.ipynb")


def code_cell(source: str):
    return nbf.v4.new_code_cell(source.strip())


def markdown_cell(source: str):
    return nbf.v4.new_markdown_cell(source.strip())


def build_notebook():
    nb = nbf.v4.new_notebook()
    nb["cells"] = [
        markdown_cell(
            """
            # UAS Machine Learning

            **Judul:** Prediksi Kemiskinan dan Prioritas Intervensi Sosial Jawa Barat  
            **Pilar Smart City:** Smart Governance / Smart Society  
            **Nama:** Nama Mahasiswa  
            **NIM:** NIM Mahasiswa

            Notebook ini berisi dataset, EDA sederhana, preprocessing, training minimal dua
            algoritma, evaluasi model, perbandingan model, dan contoh prediksi.
            """
        ),
        markdown_cell(
            """
            ## 1. Import Library dan Load Dataset
            Dataset menggunakan studi kasus kemiskinan Jawa Barat dengan fitur tahun, Gini Ratio,
            Tingkat Pengangguran Terbuka, rata-rata inflasi tahunan, dan IPM.
            """
        ),
        code_cell(
            """
            import json
            import joblib
            import matplotlib.pyplot as plt
            import pandas as pd
            import seaborn as sns

            from uas_ml.config import FEATURE_COLUMNS, MODEL_BUNDLE_PATH, METRICS_PATH
            from uas_ml.data import load_dataset, save_dataset
            from uas_ml.modeling import train_and_save, predict_from_input

            df = save_dataset()
            df.head()
            """
        ),
        markdown_cell("## 2. EDA Sederhana"),
        code_cell(
            """
            print(df.shape)
            display(df.describe(include='all'))
            display(df['priority_level'].value_counts())
            """
        ),
        code_cell(
            """
            plt.figure(figsize=(8, 4))
            sns.lineplot(data=df, x='tahun', y='persentase_kemiskinan', errorbar=None)
            plt.title('Tren Rata-rata Kemiskinan Jawa Barat')
            plt.ylabel('Persentase Kemiskinan')
            plt.show()

            plt.figure(figsize=(8, 4))
            sns.countplot(data=df, x='priority_level', order=['Low Priority', 'Medium Priority', 'High Priority'])
            plt.title('Distribusi Kelas Prioritas')
            plt.show()
            """
        ),
        markdown_cell(
            """
            ## 3. Preprocessing dan Penambahan Fitur Target

            Perbaikan yang dilakukan:

            - Dataset dibersihkan menjadi kolom numerik yang konsisten.
            - Target regresi memakai `persentase_kemiskinan`.
            - Target klasifikasi `priority_level` ditambahkan dari threshold kuantil kemiskinan.
            - StandardScaler digunakan pada model linear/logistic supaya skala fitur tidak timpang.
            """
        ),
        code_cell(
            """
            print('Fitur input:')
            for col in FEATURE_COLUMNS:
                print('-', col)

            print('\\nTarget regresi: persentase_kemiskinan')
            print('Target klasifikasi: priority_level')
            """
        ),
        markdown_cell("## 4. Training dan Evaluasi Model"),
        code_cell(
            """
            result = train_and_save()
            metrics = result['metrics']

            regression_eval = pd.DataFrame(metrics['regression_comparison'])
            classification_eval = pd.DataFrame(metrics['classification_comparison'])

            display(regression_eval[['Model', 'MAE', 'RMSE', 'R2']])
            display(classification_eval[['Model', 'Accuracy', 'Precision', 'Recall', 'F1-Score']])
            """
        ),
        code_cell(
            """
            best_cls = metrics['best_models']['classification']
            best_cls_row = next(row for row in metrics['classification_comparison'] if row['Model'] == best_cls)
            cm = pd.DataFrame(
                best_cls_row['Confusion Matrix'],
                index=['Aktual Low', 'Aktual Medium', 'Aktual High'],
                columns=['Pred Low', 'Pred Medium', 'Pred High'],
            )
            display(cm)

            plt.figure(figsize=(5, 4))
            sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
            plt.title(f'Confusion Matrix - {best_cls}')
            plt.show()
            """
        ),
        markdown_cell("## 5. Perbandingan dan Pemilihan Model Terbaik"),
        code_cell(
            """
            print('Model regresi terbaik:', metrics['best_models']['regression'])
            print('Model klasifikasi terbaik:', metrics['best_models']['classification'])
            print('\\nAlasan:')
            print('- Regresi dipilih berdasarkan RMSE dan MAE paling kecil serta R2 paling tinggi.')
            print('- Klasifikasi dipilih berdasarkan F1-Score dan accuracy paling tinggi.')
            """
        ),
        markdown_cell("## 6. Prediksi Data Baru"),
        code_cell(
            """
            sample_input = {
                'tahun': 2026,
                'gini_ratio': 385.0,
                'tingkat_penganggur_terbuka': 5.8,
                'rata_rata_inflasi_tahunan': 2.4,
                'indeks_pembangunan_manusia': 73.5,
            }

            bundle = joblib.load(MODEL_BUNDLE_PATH)
            prediction = predict_from_input(sample_input, bundle=bundle)
            prediction
            """
        ),
        markdown_cell(
            """
            ## 7. Analisis Smart City

            Model membantu Smart City dengan memberikan estimasi risiko kemiskinan berbasis data.
            Pemerintah dapat memakai hasil ini untuk menentukan prioritas bantuan sosial,
            pelatihan kerja, stabilisasi harga, dan pemberdayaan UMKM.

            Risiko jika prediksi salah adalah bantuan salah sasaran, wilayah rentan terlambat
            ditangani, dan alokasi anggaran kurang tepat. Privasi dijaga dengan memakai data
            agregat, anonymization, pembatasan akses, dan tidak menyimpan identitas individu
            yang tidak diperlukan.
            """
        ),
    ]
    return nb


def main() -> None:
    nb = build_notebook()
    nbf.write(nb, OUTPUT_PATH)
    print(f"Notebook saved: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()

