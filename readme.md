# 🧩 PatternHive – Intelligent Data Extraction Tool

> **A futuristic, interactive web application that extracts emails, phone numbers, and names from unstructured text using regex. Inspired by Igloo Inc.'s design philosophy, featuring immersive WebGL effects, real-time processing, and responsive micro-interactions.**

🌐 **Live Demo**: [https://patternhive-demo.netlify.app](https://patternhive-demo.netlify.app) *(Coming Soon)*  
🔧 **Tech Stack**: HTML/CSS/JS (Frontend) + Python Flask (Backend)  
🎨 **Design**: Futuristic dark-tech UI with WebGL, animations, and smart interactions  
📥 **Export**: CSV, JSON, and formatted reports  
📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile

---

## ✨ Features

- ✅ **Smart Text Processing**  
  Paste, type, or upload raw text (logs, resumes, scraped content) for instant analysis.

- 🔍 **Intelligent Data Extraction**  
  Automatically detects:
  - ✉️ Email addresses (with validation)
  - 📞 Phone numbers (including international formats)
  - 👤 Full names (with confidence scoring)

- ⚡ **Real-Time Processing**  
  Live preview and animated counters as you type — no delay, instant feedback.

- 📄 **Export Options**  
  Download results in multiple formats:
  - CSV (for spreadsheets)
  - JSON (for developers)
  - Formatted reports (PDF-ready structure)

- 🎨 **Immersive UI/UX**  
  Futuristic interface with:
  - Animated glitch text
  - Ice crystal loading animations
  - 3D-style data cards with hover effects
  - Neon progress bars and micro-interactions

- 🖱️ **Interactive Micro-Interactions**  
  - Cursor particle trails
  - Hover glow & rotation on data cards
  - Morphing export buttons
  - Smooth transitions and parallax depth

- 📱 **Fully Responsive**  
  Optimized for all devices — desktop, tablet, and mobile.

- 🔐 **Secure & Accessible**  
  - Input sanitization
  - File type validation
  - WCAG 2.1 AA compliant
  - Keyboard navigable

---

## 🎨 Design System & UI/UX Vision

### 🎨 Visual Identity

| Element | Color | Hex Code | Usage |
|-------|-------|---------|--------|
| **Primary Background** | Deep Charcoal | `#0D0D0D` | Main canvas, dark foundation |
| **Secondary Background** | Soft Slate | `#1A1B23` | Cards, containers |
| **Primary Accent** | Electric Blue | `#4AE3EC` | CTAs, progress bars |
| **Secondary Accent** | Frost Blue | `#4C6FFF` | Links, highlights |
| **Success State** | Neon Green | `#10B981` | Valid extractions |
| **Warning State** | Amber Glow | `#F59E0B` | Processing, caution |
| **Error State** | Crimson Red | `#EF4444` | Invalid input, errors |
| **Text Primary** | Ice White | `#F6F8FA` | Headings, content |
| **Text Secondary** | Cool Gray | `#9CA3AF` | Descriptions, metadata |
| **Borders** | Translucent Blue | `#334155` | Glass-morphism dividers |

### 🖋️ Typography & Motion

- **Primary Font**: `Orbitron` (futuristic, tech-inspired)  
- **Secondary Font**: `Inter` (clean, readable body text)  
- **Animations**: GSAP + CSS3 + WebGL shaders  
- **Micro-Interactions**: Particle systems, glitch effects, morphing transitions

---

## 🧱 Tech Stack

### 🌐 Frontend (Vanilla Stack)
- **HTML5** – Semantic structure
- **CSS3** – Tailwind-inspired utility classes + custom animations
- **JavaScript (ES6+)** – DOM manipulation, real-time logic
- **Three.js** – 3D background effects (floating geometric shapes)
- **GSAP** – Scroll animations, smooth transitions
- **WebGL Shaders** – Ice crystal growth, frost overlay, displacement effects

> 🚫 **No React, No Frameworks** – Pure HTML/CSS/JS for lightweight, fast performance.

### ⚙️ Backend (Python Flask)
- **Framework**: Flask + Flask-CORS
- **Regex Engine**: Python `re` module with optimized patterns
- **File Processing**:
  - `pdfplumber` – Extract text from PDFs
  - `python-docx` – Parse .docx files
  - `openpyxl` – Read .xlsx spreadsheets
- **Data Export**:
  - `pandas` – Generate CSV/Excel
  - `json` – Structured JSON output
- **Validation**:
  - `email-validator` – Verify email syntax
  - `phonenumbers` – Validate & format phone numbers
- **API**: RESTful endpoints returning JSON
- **Security**: Input sanitization, rate limiting, file type checks

---

## 📁 Project Structure

Qwen3-235B-A22B-2507
1:23 AM
Here's a complete, downloadable README.md file tailored to your project’s specifications. It reflects a robust, modern web app using HTML (vanilla frontend) and Python Flask (backend), with all the futuristic features, design details, and functionality from your vision — without any React or Expo dependencies.

You can copy and save this as README.md in your project root.

markdown


35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
# 🧩 PatternHive – Intelligent Data Extraction Tool
  - Animated glitch text
  - Ice crystal loading animations
  - 3D-style data cards with hover effects
  - Neon progress bars and micro-interactions

- 🖱️ **Interactive Micro-Interactions**  
  - Cursor particle trails
  - Hover glow & rotation on data cards
  - Morphing export buttons
  - Smooth transitions and parallax depth

- 📱 **Fully Responsive**  
  Optimized for all devices — desktop, tablet, and mobile.

- 🔐 **Secure & Accessible**  
  - Input sanitization
  - File type validation
  - WCAG 2.1 AA compliant
  - Keyboard navigable

---

## 🎨 Design System & UI/UX Vision

### 🎨 Visual Identity

| Element | Color | Hex Code | Usage |
|-------|-------|---------|--------|
| **Primary Background** | Deep Charcoal | `#0D0D0D` | Main canvas, dark foundation |
| **Secondary Background** | Soft Slate | `#1A1B23` | Cards, containers |
| **Primary Accent** | Electric Blue | `#4AE3EC` | CTAs, progress bars |
| **Secondary Accent** | Frost Blue | `#4C6FFF` | Links, highlights |
| **Success State** | Neon Green | `#10B981` | Valid extractions |
| **Warning State** | Amber Glow | `#F59E0B` | Processing, caution |
| **Error State** | Crimson Red | `#EF4444` | Invalid input, errors |
| **Text Primary** | Ice White | `#F6F8FA` | Headings, content |
| **Text Secondary** | Cool Gray | `#9CA3AF` | Descriptions, metadata |
| **Borders** | Translucent Blue | `#334155` | Glass-morphism dividers |

### 🖋️ Typography & Motion

- **Primary Font**: `Orbitron` (futuristic, tech-inspired)  
- **Secondary Font**: `Inter` (clean, readable body text)  
- **Animations**: GSAP + CSS3 + WebGL shaders  
- **Micro-Interactions**: Particle systems, glitch effects, morphing transitions

---

## 🧱 Tech Stack

### 🌐 Frontend (Vanilla Stack)
- **HTML5** – Semantic structure
- **CSS3** – Tailwind-inspired utility classes + custom animations
- **JavaScript (ES6+)** – DOM manipulation, real-time logic
- **Three.js** – 3D background effects (floating geometric shapes)
- **GSAP** – Scroll animations, smooth transitions
- **WebGL Shaders** – Ice crystal growth, frost overlay, displacement effects

> 🚫 **No React, No Frameworks** – Pure HTML/CSS/JS for lightweight, fast performance.

### ⚙️ Backend (Python Flask)
- **Framework**: Flask + Flask-CORS
- **Regex Engine**: Python `re` module with optimized patterns
- **File Processing**:
  - `pdfplumber` – Extract text from PDFs
  - `python-docx` – Parse .docx files
  - `openpyxl` – Read .xlsx spreadsheets
- **Data Export**:
  - `pandas` – Generate CSV/Excel
  - `json` – Structured JSON output
- **Validation**:
  - `email-validator` – Verify email syntax
  - `phonenumbers` – Validate & format phone numbers
- **API**: RESTful endpoints returning JSON
- **Security**: Input sanitization, rate limiting, file type checks

---

## 📁 Project Structure

patternhive/
│
├── app.py # Flask backend server
├── requirements.txt # Python dependencies
├── static/
│ ├── css/
│ │ └── style.css # Custom styles & animations
│ ├── js/
│ │ ├── main.js # Frontend logic
│ │ ├── three-setup.js # WebGL background
│ │ └── gsap-animations.js # Scroll & hover effects
│ └── assets/
│ ├── icons/ # SVG icons
│ └── fonts/ # Orbitron, Inter
│
├── templates/
│ └── index.html # Single-page HTML frontend
│
├── uploads/ # Temporary file storage (user uploads)
├── exports/ # Generated files (CSV, JSON)
├── .env # Environment variables
└── README.md # This file


Flask==2.3.3
Flask-CORS==4.0.0
pandas==2.0.3
email-validator==2.0.0
phonenumbers==8.13.19
pdfplumber==0.9.0
python-docx==0.8.11
openpyxl==3.1.2


Frontend Libraries (CDN or Local)
Three.js (https://cdn.jsdelivr.net/npm/three@0.155.0)
GSAP (https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js)
Google Fonts: Orbitron, Inter
🚀 User Experience Flow
1. Landing Experience
Animated logo with particle effects
Glitch-style subtitle: "Parse • Extract • Analyze"
Floating 3D geometric background
Smooth scroll indicator with ice crystal animation
2. Data Input
Paste Zone: Real-time detection as you type
File Upload: Drag-and-drop with morphing border feedback
Live Preview: Detected patterns highlighted instantly
Counter Animations: Character, word, line counts update smoothly
3. Processing & Results
Extraction Preview: 3D-style cards for emails, phones, names
Confidence Scoring: Color-coded indicators (green = high, amber = medium)
Progress Bars: Neon glow with smooth fill animation
Ice Crystal Effect: Animates during processing
4. Export & Share
Format Selection: CSV, JSON, Report
Morphing Buttons: Ripple and particle effects on click
Download Simulation: Progress animation before file generation
Session Recovery: Work saved in localStorage (optional)
🔄 API Endpoints (Flask)
METHOD
ENDPOINT
DESCRIPTION
GET
/
Serve main HTML page
POST
/api/extract
Extract data from raw text
POST
/api/upload
Upload and parse PDF/DOCX/XLSX
GET
/api/export/csv
Download CSV
GET
/api/export/json
Return JSON
GET
/api/export/report
Generate formatted report

All endpoints return structured JSON with emails, phones, names, and stats. 

🛠️ Future Enhancements
PHASE
FEATURE
Phase 1
WebGL ice crystal background, real-time regex visualization
Phase 2
ML-powered name detection, custom pattern builder
Phase 3
Batch processing, CRM integration, collaborative workspace

🎥 Key Interactions
Hover on Data Cards → Glow, slight rotation, particle trail
Typing in Input → Cursor trails, live counter updates
Click Export → Morphing icon, crystallization animation
Upload File → Border pulses, format validation feedback
Error State → Gentle shake + color pulse in crimson
🤝 Contributing
We welcome contributions! Please follow these guidelines:

Areas of Focus:
Improve WebGL shaders (ice, frost, glitch)
Add new extraction patterns (addresses, URLs, dates)
Enhance accessibility (screen reader support, contrast)
Optimize performance (lazy load 3D, reduce bundle size)
Refine mobile touch interactions
How to Contribute:
Fork the repo
Create a feature branch: git checkout -b feature/new-animation
Commit your changes
Push and open a PR
📄 License
MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

