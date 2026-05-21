from __future__ import annotations

import numpy as np
import pandas as pd

from uas_ml.config import CLASSIFICATION_TARGET, DATASET_PATH


REGIONS = [
    "Kabupaten Bogor",
    "Kabupaten Sukabumi",
    "Kabupaten Cianjur",
    "Kabupaten Bandung",
    "Kabupaten Garut",
    "Kabupaten Tasikmalaya",
    "Kabupaten Ciamis",
    "Kabupaten Kuningan",
    "Kabupaten Cirebon",
    "Kabupaten Majalengka",
    "Kabupaten Sumedang",
    "Kabupaten Indramayu",
    "Kabupaten Subang",
    "Kabupaten Purwakarta",
    "Kabupaten Karawang",
    "Kabupaten Bekasi",
    "Kabupaten Bandung Barat",
    "Kabupaten Pangandaran",
    "Kota Bogor",
    "Kota Sukabumi",
    "Kota Bandung",
    "Kota Cirebon",
    "Kota Bekasi",
    "Kota Depok",
    "Kota Cimahi",
    "Kota Tasikmalaya",
    "Kota Banjar",
]

INFLATION_BY_YEAR = {
    2014: 6.4,
    2015: 3.9,
    2016: 2.75,
    2017: 3.6,
    2018: 3.2,
    2019: 2.7,
    2020: 1.7,
    2021: 1.9,
    2022: 4.2,
    2023: 3.1,
    2024: 2.3,
    2025: 2.2,
}


def classify_priority(value: float, low_threshold: float, high_threshold: float) -> str:
    if value <= low_threshold:
        return "Low Priority"
    if value <= high_threshold:
        return "Medium Priority"
    return "High Priority"


def build_priority_thresholds(df: pd.DataFrame) -> dict[str, float]:
    poverty = df["persentase_kemiskinan"]
    return {
        "low_threshold": float(poverty.quantile(0.33)),
        "high_threshold": float(poverty.quantile(0.66)),
    }


def add_priority_labels(df: pd.DataFrame) -> pd.DataFrame:
    thresholds = build_priority_thresholds(df)
    output = df.copy()
    output[CLASSIFICATION_TARGET] = output["persentase_kemiskinan"].apply(
        lambda value: classify_priority(
            float(value),
            thresholds["low_threshold"],
            thresholds["high_threshold"],
        )
    )
    return output


def generate_dataset(seed: int = 42) -> pd.DataFrame:
    """Create a reproducible learning dataset for the UAS submission.

    The original UTS CSV is not present in this repository. This dataset keeps the
    same case study and variables, then adds wilayah-level and year-level
    variation so the model training notebook can be rerun end to end.
    """

    rng = np.random.default_rng(seed)
    rows: list[list[object]] = []

    for region in REGIONS:
        is_city = region.startswith("Kota")
        region_risk = rng.normal(0, 0.45) + (0.2 if not is_city else -0.35)
        base_ipm = rng.normal(70.5 + is_city * 5.5 - region_risk * 1.2, 1.5)
        base_gini = rng.normal(382 + is_city * 12 + region_risk * 18, 18)
        base_tpt = rng.normal(6.2 + is_city * 0.6 + region_risk * 0.5, 0.75)

        for year in range(2014, 2026):
            progress = year - 2014
            macro_cycle = np.sin((year - 2014) / 1.7) * 0.18
            shock = 0.55 if year in (2020, 2021) else (0.15 if year == 2022 else 0)

            ipm = base_ipm + progress * 0.34 - shock * 0.25 + rng.normal(0, 0.22)
            unemployment = base_tpt - progress * 0.055 + shock * 1.4 + rng.normal(0, 0.25)
            gini = base_gini - progress * 1.1 + shock * 8 + rng.normal(0, 5.0)
            inflation = INFLATION_BY_YEAR[year] + rng.normal(0, 0.22)
            poverty = (
                8.75
                + region_risk * 0.85
                - (ipm - 70) * 0.145
                + (unemployment - 5.5) * 0.23
                + (gini - 380) * 0.006
                + inflation * 0.035
                + shock * 0.9
                + macro_cycle
                + rng.normal(0, 0.16)
            )

            rows.append(
                [
                    region,
                    year,
                    round(float(gini), 2),
                    round(float(max(unemployment, 1)), 2),
                    round(float(inflation), 2),
                    round(float(ipm), 2),
                    round(float(max(poverty, 2.5)), 2),
                ]
            )

    columns = [
        "wilayah",
        "tahun",
        "gini_ratio",
        "tingkat_penganggur_terbuka",
        "rata_rata_inflasi_tahunan",
        "indeks_pembangunan_manusia",
        "persentase_kemiskinan",
    ]
    return add_priority_labels(pd.DataFrame(rows, columns=columns))


def load_dataset(path=DATASET_PATH) -> pd.DataFrame:
    path = DATASET_PATH if path is None else path
    if not path.exists():
        return generate_dataset()
    return pd.read_csv(path)


def save_dataset(path=DATASET_PATH) -> pd.DataFrame:
    df = generate_dataset()
    path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(path, index=False)
    return df

