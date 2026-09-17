# Alcatraz AI - ML Pipeline

This directory contains the machine learning pipeline used to train the local, privacy-first phishing detection model for Alcatraz AI.

## Overview
Alcatraz AI uses a locally deployed Natural Language Processing (NLP) model to classify emails as Safe or Phishing. The model runs entirely on the edge (the user's device), meaning no emails are ever sent to an external server for processing.

### Model Architecture Choice: DistilBERT
We selected **DistilBERT-base-uncased** because it offers:
- 97% of BERT's performance
- 40% smaller model size
- 60% faster inference

This makes it an ideal candidate for edge deployment where memory and battery life are constrained.

### Dataset
We used the `ealvaradob/phishing-dataset` from Hugging Face. The dataset contains ~18,000 email bodies labeled for phishing or legitimate correspondence.
- Train set: ~14,400 emails
- Test set: ~3,600 emails

## Reproducing the Training

To train the model yourself:

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the training script**:
   ```bash
   python train_phishing_model.py
   ```
   *Note: This process takes ~12 minutes on an NVIDIA T4 GPU.*

3. **Outputs**:
   - PyTorch Model: `./results_model/`
   - ONNX Model: `./onnx_model/`
   - Metrics: `./results/`

## Deployment Strategy: ONNX & Web-AI

Once trained, the PyTorch model is converted to the **ONNX (Open Neural Network Exchange)** format using Hugging Face `optimum`. 

By exporting to ONNX and utilizing a library like **Transformers.js** in the browser, the model operates natively inside the web extension.

### Why Edge Deployment and Snapdragon NPU?
Running this model on the edge prevents sensitive email data from traversing the internet. Furthermore, by optimizing the ONNX model, it can leverage Qualcomm Snapdragon NPUs (Neural Processing Units) natively on Windows AI PCs. This leads to:
- Significantly lower latency for inference (instant analysis)
- Minimal CPU/GPU overhead
- Reduced battery consumption compared to running inference on standard compute units.
