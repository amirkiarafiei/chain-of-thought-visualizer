# CoT Visualizer

**A "Chain-of-Thought" Reasoning Demo**

🔗 **[Live Demo](https://6924e8b43b0fcae1d80e96c3--cot-visualizer.netlify.app/)**  
✍️ **[Read the Story on Medium](https://medium.com/@amirkiarafiei/why-i-built-a-chain-of-thought-visualizer-640ab9fa8eb2)**

## ⚡ Overview

**CoT Visualizer** is a web app that demonstrates *how* Large Language Models (LLMs) reason. It compares two prompting strategies side-by-side:

1.  **Standard Prompting:** Fast, impulsive answers (often prone to errors).
2.  **Chain-of-Thought (CoT):** Slow, deliberate reasoning shown in a "thinking" terminal.

## ✨ Features

*   **Split-Screen Comparison:** Watch "System 1" vs "System 2" thinking simultaneously.
*   **Real-Time Visualization:** See the model "think" step-by-step.
*   **9 Interactive Challenges:** Deceptive logic, math, and riddles designed to trap intuition.
*   **Generative UI:** Smooth, physics-based animations powered by Framer Motion.

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
    Create a `.env.local` file with your [Google Gemini API Key](https://aistudio.google.com/app/apikey):
    ```env
    GOOGLE_API_KEY=your_key_here
    ```

3.  **Run**
    ```bash
    npm run dev
    ```

## 📝 License

MIT License.
