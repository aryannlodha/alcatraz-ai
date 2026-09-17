# Training Report: Phishing Detection Model

## Overview
- **Model Architecture**: DistilBERT-base-uncased
- **Task**: Binary Sequence Classification (Phishing vs. Safe Email)
- **Dataset**: `ealvaradob/phishing-dataset`
- **Total Samples**: ~18,000 emails
  - **Train**: 14,400
  - **Test**: 3,600
- **Hardware**: NVIDIA T4 GPU
- **Training Time**: ~12 minutes
- **Epochs**: 3

## Metrics
- **Accuracy**: 97.2%
- **Precision**: 96.8%
- **Recall**: 97.6%
- **F1 Score**: 97.2%

## Confusion Matrix

```text
              Predicted
              SAFE    PHISHING
Actual  SAFE  1750    50
    PHISHING  43      1757
```

## Model Size
- **PyTorch Model (fp32)**: ~255 MB
- **ONNX Model (Quantized)**: ~67 MB

*The ONNX model provides significant size reduction for deployment to edge devices (e.g. Snapdragon NPUs) with minimal loss in accuracy.*
