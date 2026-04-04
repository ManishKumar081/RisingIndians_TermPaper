from src.data_utils import load_raw_dataset, split_dataset
from src.models.bert_model import fine_tune_bert


def train_bert(raw_dir: str = "data/raw", out_dir: str = "models/bert"):
    df = load_raw_dataset(raw_dir)
    train_df, val_df, _ = split_dataset(df)

    # Fast option: small subset for CPU training
    train_df = train_df.sample(n=min(len(train_df), 2000), random_state=42)
    val_df = val_df.sample(n=min(len(val_df), 500), random_state=42)

    fine_tune_bert(
        train_texts=train_df["clean_text"],
        train_labels=train_df["label"],
        val_texts=val_df["clean_text"],
        val_labels=val_df["label"],
        output_dir=out_dir,
        epochs=1,
        batch_size=8,
    )
    print(f"BERT model saved to {out_dir}")


if __name__ == "__main__":
    train_bert()
