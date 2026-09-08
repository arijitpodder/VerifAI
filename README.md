# VERIFAI — AI Multi-Layer Identity & Document Forensics

**VERIFAI** is a defense-grade multi-layer identity and document verification system designed to detect forged, tampered, and impersonated identity credentials.

---

## Key Modules & Features

### 1. ID & Live Face Matcher (`1:1 KYC Verification`) — *NEW*
- **Upload Any ID Document**: Upload any national ID, passport, driver's license, Aadhaar card, or badge (JPG, PNG, WEBP, SVG), or test with pre-configured samples.
- **Voice & Text Name Input ("Tell It")**: Interactive voice prompt leveraging the Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) to speak the cardholder name aloud, with manual text typing and instant OCR suggestion.
- **Automated ID Photo Scanning & Extraction**: Optical laser sweep that detects the cardholder's portrait on the ID substrate, isolating the face in high resolution.
- **Live Webcam Face Verification**: HUD biometric reticle with live alignment guide, eye-level indicator, and 3-second auto-capture.
- **Same-Person 1:1 Biometric Match**: Pixel-by-pixel mathematical biometric cross-correlation (Normalized Cross-Correlation, Sobel edge geometry, and color spectrum histograms) combined with name verification to confirm whether the ID belongs to the same person.

### 2. Full 6-Layer Multi-Step Pipeline
1. **Document Ingestion & Scenario Selection**: Multi-format ID upload with curated real-world fraud scenarios.
2. **OCR & Consistency Analysis**: Real client-side OCR parsing with ICAO Doc 9303 MRZ cryptographic checksums and cross-field logic validation.
3. **Forensic Tamper Viewer**: Pixel-level Error Level Analysis (ELA), edge discontinuity analysis, and substrate tampering heatmaps.
4. **Authority Database Cross-Check**: Simulated ICAO PKD, Interpol SLTD, and state registry verification with cryptographic ledger transaction hashing.
5. **Biometric Face Match & Liveness**: 1:1 biometric comparison between ID photo and live webcam stream with active liveness challenge.
6. **Zero-Trust Risk Engine**: Multi-factor composite risk scoring, positive security signals, risk factor diagnostics, and downloadable official audit reports.

### 3. ID Verification Lab
A dedicated laboratory for detailed document analysis, interactive tampering simulators, ELA amplification, and raw OCR field inspection.

### 4. Face Verification Lab
A biometric laboratory to test facial alignment, illumination tolerances, and divergence metrics between reference documents and live selfies.

---

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Computer Vision & Biometrics**: Canvas 2D Normalized Cross-Correlation (NCC), Sobel Edge Gradient Geometry, Color Spectrum Histograms, Chromium Shape Detection API
- **OCR Engine**: Tesseract.js client-side OCR & SVG XML DOM parser
- **Styling**: Vanilla CSS tokens, glassmorphism, JetBrains Mono & Plus Jakarta Sans typography
- **Icons**: Lucide React
