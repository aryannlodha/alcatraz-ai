import os
import torch
import logging
from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
    DataCollatorWithPadding
)
from optimum.onnxruntime import ORTModelForSequenceClassification
import evaluate
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix
import json

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Constants
MODEL_NAME = "distilbert-base-uncased"
DATASET_NAME = "ealvaradob/phishing-dataset"
OUTPUT_DIR = "./results_model"
ONNX_DIR = "./onnx_model"
RESULTS_DIR = "./results"
EPOCHS = 3
BATCH_SIZE = 16

def compute_metrics(eval_pred):
    metric = evaluate.load("accuracy")
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    return metric.compute(predictions=predictions, references=labels)

def main():
    os.makedirs(RESULTS_DIR, exist_ok=True)
    
    logger.info("Loading dataset...")
    # Load the phishing dataset
    dataset = load_dataset(DATASET_NAME)
    
    # We assume 'text' and 'label' columns exist (adjust based on actual dataset schema)
    # The ealvaradob/phishing-dataset contains 'text' and 'label' where 1 = phishing, 0 = safe.
    
    # Split into train/test (if not already split)
    if "test" not in dataset:
        dataset = dataset["train"].train_test_split(test_size=0.2, seed=42)
    
    logger.info("Loading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    
    def tokenize_function(examples):
        return tokenizer(examples["text"], padding="max_length", truncation=True, max_length=512)
    
    logger.info("Tokenizing dataset...")
    tokenized_datasets = dataset.map(tokenize_function, batched=True)
    
    logger.info("Loading model...")
    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME, 
        num_labels=2, 
        id2label={0: "SAFE", 1: "PHISHING"},
        label2id={"SAFE": 0, "PHISHING": 1}
    )
    
    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        learning_rate=2e-5,
        per_device_train_batch_size=BATCH_SIZE,
        per_device_eval_batch_size=BATCH_SIZE,
        num_train_epochs=EPOCHS,
        weight_decay=0.01,
        load_best_model_at_end=True,
        logging_dir='./logs',
        logging_steps=100,
    )
    
    data_collator = DataCollatorWithPadding(tokenizer=tokenizer)
    
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_datasets["train"],
        eval_dataset=tokenized_datasets["test"],
        tokenizer=tokenizer,
        data_collator=data_collator,
        compute_metrics=compute_metrics,
    )
    
    logger.info("Starting training...")
    trainer.train()
    
    logger.info("Evaluating model...")
    predictions = trainer.predict(tokenized_datasets["test"])
    preds = np.argmax(predictions.predictions, axis=-1)
    labels = predictions.label_ids
    
    # Generate classification report
    report = classification_report(labels, preds, target_names=["SAFE", "PHISHING"])
    logger.info(f"Classification Report:\n{report}")
    
    with open(os.path.join(RESULTS_DIR, "classification_report.txt"), "w") as f:
        f.write(report)
        
    # Generate confusion matrix
    cm = confusion_matrix(labels, preds)
    logger.info(f"Confusion Matrix:\n{cm}")
    np.savetxt(os.path.join(RESULTS_DIR, "confusion_matrix.txt"), cm, fmt="%d")
    
    logger.info("Saving PyTorch model...")
    trainer.save_model(OUTPUT_DIR)
    
    logger.info("Exporting to ONNX format...")
    ort_model = ORTModelForSequenceClassification.from_pretrained(OUTPUT_DIR, export=True)
    tokenizer.save_pretrained(ONNX_DIR)
    ort_model.save_pretrained(ONNX_DIR)
    
    logger.info("Training and export complete!")

if __name__ == "__main__":
    main()
