import argparse
from optimum.onnxruntime import ORTModelForSequenceClassification
from transformers import AutoTokenizer
import numpy as np

def run_inference(model_path, text):
    """
    Run inference using the ONNX exported model.
    """
    print(f"Loading ONNX model from {model_path}...")
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = ORTModelForSequenceClassification.from_pretrained(model_path)
    
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    outputs = model(**inputs)
    
    logits = outputs.logits.detach().numpy()
    probabilities = np.exp(logits) / np.sum(np.exp(logits), axis=-1, keepdims=True)
    predicted_class = np.argmax(probabilities, axis=-1)[0]
    
    labels = {0: "SAFE", 1: "PHISHING"}
    result = labels[predicted_class]
    confidence = probabilities[0][predicted_class]
    
    return result, confidence

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run inference on an email text.")
    parser.add_argument("--text", type=str, required=True, help="Email text to classify.")
    parser.add_argument("--model_path", type=str, default="./onnx_model", help="Path to the ONNX model directory.")
    
    args = parser.parse_args()
    
    result, confidence = run_inference(args.model_path, args.text)
    print("\n--- Inference Result ---")
    print(f"Text: {args.text[:50]}...")
    print(f"Classification: {result}")
    print(f"Confidence: {confidence:.4f}")
