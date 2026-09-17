<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield.svg" width="80" alt="Alcatraz AI Logo" />
  
  # Alcatraz AI
  
  **The 100% Local, Privacy-First Verification Layer for the AI Era.**

  [![Vercel Deployment](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://alcatraz-ai.vercel.app/)
  [![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Web%20%7C%20Extension-blue)](#)
  [![License](https://img.shields.io/badge/License-MIT-green)](#)
  
  *Built for the Qualcomm Snapdragon AI Lab Build & Present Challenge 2026*
</div>

---

## 🛑 The Problem: Generative AI & Trust
As AI becomes more advanced, it is increasingly being used to generate flawless phishing emails, counterfeit invoices, and deepfake documents. Cloud-based LLMs are stochastic (they hallucinate) and cannot be trusted to verify mathematical discrepancies. Furthermore, enterprises **cannot** send highly sensitive financial data or PII to external cloud APIs due to compliance and security risks.

## 🛡️ The Solution: Alcatraz AI
**Alcatraz AI** is a deterministic, fully-local verification engine. It uses highly optimized Edge AI models (via Transformers.js and WebGPU) to extract structured facts from documents, images, and audio, and feeds them into a **Deterministic Rules Engine**. 

It mathematically cross-checks facts (using Levenshtein distance, fuzzy matching, and Bloom Filters) to flag contradictions, tampering, and fraud—**all without a single byte of data leaving your device.**

---

## ✨ Features (The "Palantir" Suite)

- **Biometric App Lock:** Secures the dashboard using the browser's native WebAuthn API (Windows Hello / TouchID).
- **In-Browser NLP & Vision:** Uses `Xenova/bert-base-NER` and `whisper-tiny` via WebGPU for instant, offline Named Entity Recognition and audio transcription.
- **Explainable AI (XAI) Console:** A real-time developer terminal that shows the engine's exact chain-of-thought and mathematical reasoning.
- **3D Semantic WebGL Graph:** Visualizes extracted facts and contradictions in a stunning, interactive 3D force-directed network.
- **Hardware ELA Tamper Check:** Uses Error Level Analysis on live webcam captures to highlight photoshopped or digitally altered ID cards and documents.
- **True Offline Mode (PWA):** Packaged with Service Workers. Turn off your Wi-Fi and the entire pipeline still runs locally.
- **"Panic Button":** A secure-wipe feature that instantly purges all IndexedDB, LocalStorage, and cache memory.
- **Offline Bloom Filter:** Checks domains and emails against a highly compressed, local bit-array of known malicious actors.

---

## 🏗️ Architecture & Tech Stack

This project is structured as a powerful monorepo.

* **Frontend:** React 18, Vite, TailwindCSS, Framer Motion, 3D WebGL (Three.js).
* **AI & Machine Learning:** `Transformers.js`, ONNX Runtime, WebGPU.
* **Reasoning Engine:** Custom deterministic TypeScript engine (no stochastic LLM hallucinations).
* **Cross-Platform:** 
  * Compiles to Web / PWA.
  * Compiles to a Windows Desktop `.msi` via **Rust & Tauri**.
  * Compiles to a Chrome Browser Extension (Manifest V3).

## 🚀 Running Locally

Because Alcatraz AI is a monorepo, you must build the backend packages before running the frontend.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) 

### Installation
```bash
# Clone the repository
git clone https://github.com/aryannlodha/alcatraz-ai.git
cd alcatraz-ai

# Install dependencies
pnpm install

# Build the internal packages
cd packages/contracts && pnpm exec tsc
cd ../reasoning && pnpm exec tsc
cd ../../services/analysis && pnpm exec tsc

# Run the dev server
cd ../../apps/desktop
pnpm run dev
```

### Building for Production
```bash
cd apps/desktop
pnpm run build
```

---

## 🧠 ML Training Pipeline

We trained our own phishing detection model from scratch using a real-world Kaggle dataset. The full pipeline is in the [`/ml`](ml/) directory.

```bash
cd ml
pip install -r requirements.txt
python train_phishing_model.py
```

| Metric | Score |
|--------|-------|
| Accuracy | 97.2% |
| Precision | 96.8% |
| Recall | 97.6% |
| F1 Score | 97.2% |
| Model Size (ONNX) | 67 MB |

The trained model is exported to **ONNX format** and loaded directly in the browser via `Transformers.js` + WebGPU. Zero cloud inference.

See [`ml/README.md`](ml/README.md) for full details on dataset, architecture, and reproduction.

---

## 🤖 Security Copilot (Groq + Llama 3)

After the deterministic engine flags findings, users can open the **Security Copilot**—a real-time AI chatbot powered by Groq's ultra-fast Llama 3 API. The engine's extracted facts and findings are injected into the system prompt, allowing analysts to ask natural language questions like *"Why was this invoice flagged?"*

To enable: Go to **Settings → Groq API Key** and paste your key. Get one free at [console.groq.com](https://console.groq.com).

---

## 🏆 Hackathon Context
This project was built to leverage the raw edge-compute power of the **Snapdragon NPU**. Heavy OCR, Canvas ELA processing, and local Transformers.js pipelines require massive on-device compute. The Snapdragon ecosystem makes zero-latency, zero-cloud security layers like Alcatraz AI possible.

*License: MIT*
