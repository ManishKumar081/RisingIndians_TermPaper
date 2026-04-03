from __future__ import annotations

from typing import Iterable

import numpy as np
import tensorflow as tf
from transformers import AutoTokenizer, TFAutoModelForSequenceClassification


def _encode_texts(tokenizer, texts: Iterable[str], max_length: int = 256):
    enc = tokenizer(
        list(texts),
        truncation=True,
        padding="max_length",
        max_length=max_length,
        return_tensors="np",
    )
    return {"input_ids": enc["input_ids"], "attention_mask": enc["attention_mask"]}


def fine_tune_bert(
    train_texts,
    train_labels,
    val_texts,
    val_labels,
    output_dir: str = "models/bert",
    model_name: str = "bert-base-uncased",
    epochs: int = 1,
    batch_size: int = 8,
):
    tokenizer = AutoTokenizer.from_pretrained(model_name)

    train_enc = _encode_texts(tokenizer, train_texts)
    val_enc = _encode_texts(tokenizer, val_texts)

    y_train = np.asarray(list(train_labels), dtype="int32")
    y_val = np.asarray(list(val_labels), dtype="int32")

    train_ds = tf.data.Dataset.from_tensor_slices((train_enc, y_train)).batch(batch_size)
    val_ds = tf.data.Dataset.from_tensor_slices((val_enc, y_val)).batch(batch_size)

    model = TFAutoModelForSequenceClassification.from_pretrained(
        model_name, num_labels=2
    )

    optimizer = tf.keras.optimizers.Adam(learning_rate=2e-5)
    loss = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
    metrics = [tf.keras.metrics.SparseCategoricalAccuracy(name="accuracy")]

    model.compile(optimizer=optimizer, loss=loss, metrics=metrics)
    model.fit(train_ds, validation_data=val_ds, epochs=epochs, verbose=1)

    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)


def predict_bert_proba(texts, model_dir: str = "models/bert"):
    tokenizer = AutoTokenizer.from_pretrained(model_dir)
    model = TFAutoModelForSequenceClassification.from_pretrained(model_dir)

    enc = _encode_texts(tokenizer, texts)
    outputs = model(enc)
    logits = outputs.logits.numpy()
    probs = tf.nn.softmax(logits, axis=1).numpy()[:, 1]
    return np.asarray(probs, dtype=float)
