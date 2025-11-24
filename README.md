# CoT Visualizer

**A "Chain-of-Thought" Reasoning Demo**

> **Note:** This project accompanies an upcoming Medium article on Generative UI patterns.

## ⚡ Overview

**CoT Visualizer** is a web app that demonstrates how Large Language Models (LLMs) reason. It compares two prompting strategies side-by-side:

1.  **Standard Prompting:** Fast, direct answers (deliberately prone to errors).
2.  **Chain-of-Thought (CoT):** Detailed step-by-step reasoning shown in a "thinking" terminal before the final answer.

## ✨ Features

*   **Split-Screen Comparison:** Watch "Fast" vs. "Slow" thinking happen simultaneously.
*   **Real-Time Visualization:** See the model "think" with a streaming terminal UI.
*   **5 Interactive Challenges:** Logic, Math, and Riddles designed to test reasoning.
*   **Generative UI:** Smooth animations powered by Framer Motion.

## 🛠️ Tech Stack

*   **Next.js 15** (App Router)
*   **Tailwind CSS** + **Shadcn/UI**
*   **Framer Motion**
*   **Google Gemini API**

## 🚀 Quick Start

1.  **Clone & Install**
    ```bash
    git clone https://github.com/yourusername/cot-visualizer.git
    cd cot-visualizer
    npm install
    ```

2.  **Set API Key**
    Create a `.env.local` file and add your [Google Gemini API Key](https://aistudio.google.com/app/apikey):
    ```env
    GOOGLE_API_KEY=your_key_here
    ```

3.  **Run**
    ```bash
    npm run dev
    ```

## 📝 License

MIT License.
