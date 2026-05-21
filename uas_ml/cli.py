from __future__ import annotations

import argparse
import json

from uas_ml.config import DATASET_PATH, METRICS_PATH, MODEL_BUNDLE_PATH
from uas_ml.data import save_dataset
from uas_ml.modeling import train_and_save


def main() -> None:
    parser = argparse.ArgumentParser(description="Prepare UAS ML dataset and model artifacts.")
    parser.add_argument(
        "--dataset-only",
        action="store_true",
        help="Only generate the CSV dataset.",
    )
    args = parser.parse_args()

    df = save_dataset()
    print(f"Dataset saved: {DATASET_PATH} ({len(df)} rows)")

    if args.dataset_only:
        return

    result = train_and_save()
    print(f"Model bundle saved: {MODEL_BUNDLE_PATH}")
    print(f"Metrics saved: {METRICS_PATH}")
    print(json.dumps(result["metrics"]["best_models"], indent=2))


if __name__ == "__main__":
    main()

