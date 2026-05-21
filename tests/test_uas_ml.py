from __future__ import annotations

from uas_ml.config import FEATURE_COLUMNS
from uas_ml.data import generate_dataset
from uas_ml.modeling import predict_from_input, train_and_evaluate


def test_generate_dataset_has_required_columns() -> None:
    df = generate_dataset()

    required = set(FEATURE_COLUMNS + ["persentase_kemiskinan", "priority_level", "wilayah"])

    assert required.issubset(df.columns)
    assert len(df) >= 300
    assert df["priority_level"].nunique() == 3


def test_train_and_predict_pipeline_runs() -> None:
    result = train_and_evaluate()
    bundle = result["bundle"]
    sample = result["dataset"].iloc[0][FEATURE_COLUMNS].to_dict()

    prediction = predict_from_input(sample, bundle=bundle)

    assert prediction["prediksi_kemiskinan"] > 0
    assert prediction["priority_level"] in {"Low Priority", "Medium Priority", "High Priority"}
    assert result["metrics"]["best_models"]["regression"]
    assert result["metrics"]["best_models"]["classification"]

