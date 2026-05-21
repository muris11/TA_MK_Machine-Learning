from __future__ import annotations

import html
import json
import textwrap
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parent
METRICS_PATH = ROOT / "ml_artifacts" / "uas_evaluation_metrics.json"
REPORT_PATH = ROOT / "UAS_ML_Nama_NIM.pdf"
PPTX_PATH = ROOT / "UAS_ML_Nama_NIM.pptx"


def load_metrics() -> dict:
    return json.loads(METRICS_PATH.read_text(encoding="utf-8"))


def wrap_text(text: str, width: int = 92) -> list[str]:
    lines: list[str] = []
    for paragraph in text.splitlines():
        if not paragraph.strip():
            lines.append("")
            continue
        lines.extend(textwrap.wrap(paragraph, width=width))
    return lines


def escape_pdf_text(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def write_simple_pdf(path: Path, title: str, lines: list[str]) -> None:
    objects: list[bytes] = []

    def add_object(payload: str | bytes) -> int:
        data = payload.encode("latin-1", errors="replace") if isinstance(payload, str) else payload
        objects.append(data)
        return len(objects)

    font_id = add_object("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
    page_ids: list[int] = []

    lines_per_page = 42
    pages = [lines[index : index + lines_per_page] for index in range(0, len(lines), lines_per_page)]

    for page in pages:
        commands = ["BT", "/F1 11 Tf", "50 790 Td", "14 TL"]
        for line in page:
            commands.append(f"({escape_pdf_text(line)}) Tj")
            commands.append("T*")
        commands.append("ET")
        stream = "\n".join(commands).encode("latin-1", errors="replace")
        content_id = add_object(
            b"<< /Length "
            + str(len(stream)).encode("ascii")
            + b" >>\nstream\n"
            + stream
            + b"\nendstream"
        )
        page_id = add_object(
            f"<< /Type /Page /Parent 0 0 R /MediaBox [0 0 595 842] "
            f"/Resources << /Font << /F1 {font_id} 0 R >> >> "
            f"/Contents {content_id} 0 R >>"
        )
        page_ids.append(page_id)

    pages_id = len(objects) + 1
    kids = " ".join(f"{page_id} 0 R" for page_id in page_ids)
    add_object(f"<< /Type /Pages /Kids [{kids}] /Count {len(page_ids)} >>")

    for index, payload in enumerate(objects):
        if b"/Parent 0 0 R" in payload:
            objects[index] = payload.replace(b"/Parent 0 0 R", f"/Parent {pages_id} 0 R".encode("ascii"))

    catalog_id = add_object(f"<< /Type /Catalog /Pages {pages_id} 0 R >>")

    output = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for index, payload in enumerate(objects, start=1):
        offsets.append(len(output))
        output.extend(f"{index} 0 obj\n".encode("ascii"))
        output.extend(payload)
        output.extend(b"\nendobj\n")

    xref_offset = len(output)
    output.extend(f"xref\n0 {len(objects) + 1}\n".encode("ascii"))
    output.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        output.extend(f"{offset:010d} 00000 n \n".encode("ascii"))
    output.extend(
        f"trailer\n<< /Size {len(objects) + 1} /Root {catalog_id} 0 R /Info << /Title ({escape_pdf_text(title)}) >> >>\n"
        f"startxref\n{xref_offset}\n%%EOF\n".encode("latin-1", errors="replace")
    )
    path.write_bytes(output)


def build_report_lines(metrics: dict) -> list[str]:
    reg = metrics["regression_comparison"]
    cls = metrics["classification_comparison"]
    best_reg = metrics["best_models"]["regression"]
    best_cls = metrics["best_models"]["classification"]

    content = [
        "LAPORAN UAS MACHINE LEARNING",
        "Prediksi Kemiskinan dan Prioritas Intervensi Sosial Jawa Barat",
        "Nama: Nama Mahasiswa",
        "NIM: NIM Mahasiswa",
        "Pilar Smart City: Smart Governance / Smart Society",
        "Link Colab: isi link Colab",
        "Link YouTube: isi link video presentasi",
        "",
        "1. Pendahuluan",
        "Project ini membangun model Machine Learning untuk memprediksi persentase kemiskinan "
        "dan menentukan prioritas intervensi sosial di Jawa Barat. Sistem ini mendukung "
        "pengambilan keputusan berbasis data untuk konteks Smart City.",
        "",
        "2. Dataset",
        f"Dataset berisi {metrics['dataset_rows']} baris data. Fitur input yang digunakan adalah "
        "tahun, Gini Ratio, Tingkat Pengangguran Terbuka, rata-rata inflasi tahunan, dan "
        "Indeks Pembangunan Manusia. Target regresi adalah persentase kemiskinan dan target "
        "klasifikasi adalah priority_level.",
        "",
        "3. Metode",
        "Perbaikan UAS meliputi preprocessing numerik, StandardScaler untuk model linear/logistic, "
        "penambahan target priority_level dari threshold kuantil, serta perbandingan beberapa "
        "algoritma Machine Learning.",
        "Algoritma regresi: Linear Regression, Decision Tree Regressor, Random Forest Regressor.",
        "Algoritma klasifikasi: Logistic Regression, Decision Tree Classifier, Random Forest Classifier.",
        "",
        "4. Hasil Evaluasi",
        f"Model regresi terbaik: {best_reg}.",
    ]

    for row in reg:
        content.append(
            f"- {row['Model']}: MAE {row['MAE']:.3f}, RMSE {row['RMSE']:.3f}, R2 {row['R2']:.3f}"
        )

    content.append("")
    content.append(f"Model klasifikasi terbaik: {best_cls}.")
    for row in cls:
        content.append(
            f"- {row['Model']}: Accuracy {row['Accuracy']:.3f}, Precision {row['Precision']:.3f}, "
            f"Recall {row['Recall']:.3f}, F1 {row['F1-Score']:.3f}"
        )

    content.extend(
        [
            "",
            "5. Implementasi Aplikasi",
            "Aplikasi dibuat dengan Streamlit pada file app.py. Fitur aplikasi meliputi input data, "
            "prediksi, tampilan dataset, upload CSV, visualisasi feature importance, tabel evaluasi, "
            "confusion matrix, dan analisis Smart City.",
            "",
            "6. Kesimpulan",
            "Model membantu pemerintah membaca risiko kemiskinan dan menentukan prioritas intervensi "
            "sosial. Risiko prediksi salah adalah bantuan tidak tepat sasaran, sehingga hasil model "
            "harus divalidasi dengan data terbaru dan konteks lapangan. Privasi dijaga dengan data "
            "agregat, anonymization, dan pembatasan akses.",
        ]
    )

    lines: list[str] = []
    for item in content:
        lines.extend(wrap_text(item))
    return lines


def xml_escape(text: str) -> str:
    return html.escape(text, quote=True)


def slide_xml(title: str, bullets: list[str]) -> str:
    bullet_xml = "\n".join(
        f"""
        <a:p>
          <a:pPr marL="342900" indent="-171450"><a:buChar char="&#8226;"/></a:pPr>
          <a:r><a:rPr lang="id-ID" sz="2200"/><a:t>{xml_escape(bullet)}</a:t></a:r>
        </a:p>
        """
        for bullet in bullets
    )
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
       xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm>
      </p:grpSpPr>
      <p:sp>
        <p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>
        <p:spPr><a:xfrm><a:off x="548640" y="365760"/><a:ext cx="8046720" cy="731520"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
        <p:txBody>
          <a:bodyPr/><a:lstStyle/>
          <a:p><a:r><a:rPr lang="id-ID" sz="3600" b="1"/><a:t>{xml_escape(title)}</a:t></a:r></a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr><p:cNvPr id="3" name="Content"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>
        <p:spPr><a:xfrm><a:off x="731520" y="1371600"/><a:ext cx="7680960" cy="4572000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
        <p:txBody>
          <a:bodyPr/><a:lstStyle/>
          {bullet_xml}
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>"""


def build_slide_data(metrics: dict) -> list[tuple[str, list[str]]]:
    best_reg = metrics["best_models"]["regression"]
    best_cls = metrics["best_models"]["classification"]
    reg_row = next(row for row in metrics["regression_comparison"] if row["Model"] == best_reg)
    cls_row = next(row for row in metrics["classification_comparison"] if row["Model"] == best_cls)
    return [
        (
            "Prediksi Kemiskinan Jawa Barat",
            [
                "Nama Mahasiswa - NIM",
                "Pilar Smart City: Smart Governance / Smart Society",
                "UAS Machine Learning 2025/2026",
            ],
        ),
        (
            "Dataset",
            [
                f"Jumlah data: {metrics['dataset_rows']} baris",
                "Fitur: tahun, Gini Ratio, TPT, inflasi, IPM",
                "Target regresi: persentase kemiskinan",
                "Target klasifikasi: priority_level",
            ],
        ),
        (
            "Metode",
            [
                "Preprocessing numerik dan StandardScaler",
                "Penambahan fitur target priority_level",
                "Regresi: Linear Regression, Decision Tree, Random Forest",
                "Klasifikasi: Logistic Regression, Decision Tree, Random Forest",
            ],
        ),
        (
            "Evaluasi",
            [
                f"Regresi terbaik: {best_reg}",
                f"MAE {reg_row['MAE']:.3f}, RMSE {reg_row['RMSE']:.3f}, R2 {reg_row['R2']:.3f}",
                f"Klasifikasi terbaik: {best_cls}",
                f"Accuracy {cls_row['Accuracy']:.3f}, F1 {cls_row['F1-Score']:.3f}",
            ],
        ),
        (
            "Demo Aplikasi",
            [
                "Jalankan: streamlit run app.py",
                "Input indikator sosial ekonomi",
                "Tampilkan prediksi, prioritas, dan rekomendasi",
                "Tampilkan dataset, grafik, evaluasi, dan confusion matrix",
            ],
        ),
        (
            "Kesimpulan",
            [
                "Sistem membantu prioritas intervensi sosial berbasis data",
                "Manfaat: bantuan lebih tepat sasaran dan monitoring lebih cepat",
                "Risiko: prediksi salah dapat menyebabkan salah sasaran",
                "Pengembangan: dataset terbaru, peta wilayah, login, deploy online",
            ],
        ),
    ]


def write_pptx(path: Path, slides: list[tuple[str, list[str]]]) -> None:
    content_types = [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
        '<Default Extension="xml" ContentType="application/xml"/>',
        '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>',
    ]
    for index in range(1, len(slides) + 1):
        content_types.append(
            f'<Override PartName="/ppt/slides/slide{index}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>'
        )
    content_types.append("</Types>")

    presentation_ids = "\n".join(
        f'<p:sldId id="{255 + index}" r:id="rId{index}"/>'
        for index in range(1, len(slides) + 1)
    )
    presentation = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
                xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
                xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldSz cx="9144000" cy="6858000" type="screen4x3"/>
  <p:notesSz cx="6858000" cy="9144000"/>
  <p:sldIdLst>{presentation_ids}</p:sldIdLst>
</p:presentation>"""

    rels = [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>',
        "</Relationships>",
    ]
    presentation_rels = [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    ]
    for index in range(1, len(slides) + 1):
        presentation_rels.append(
            f'<Relationship Id="rId{index}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{index}.xml"/>'
        )
    presentation_rels.append("</Relationships>")

    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as pptx:
        pptx.writestr("[Content_Types].xml", "\n".join(content_types))
        pptx.writestr("_rels/.rels", "\n".join(rels))
        pptx.writestr("ppt/presentation.xml", presentation)
        pptx.writestr("ppt/_rels/presentation.xml.rels", "\n".join(presentation_rels))
        for index, (title, bullets) in enumerate(slides, start=1):
            pptx.writestr(f"ppt/slides/slide{index}.xml", slide_xml(title, bullets))


def main() -> None:
    metrics = load_metrics()
    write_simple_pdf(REPORT_PATH, "Laporan UAS Machine Learning", build_report_lines(metrics))
    write_pptx(PPTX_PATH, build_slide_data(metrics))
    print(f"PDF saved: {REPORT_PATH}")
    print(f"PPTX saved: {PPTX_PATH}")


if __name__ == "__main__":
    main()

