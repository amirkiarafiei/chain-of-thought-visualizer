"use client";

import { Globe, GraduationCap, Linkedin, Github, BookOpen, Code, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-900/80 backdrop-blur-md border-t border-white/20 px-6 py-5 shrink-0">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
        {/* Row 1 - Disclaimer */}
        <div className="flex items-center gap-2 text-center">
          <span className="text-yellow-500 text-base">⚠️</span>
          <p className="text-sm text-white/70">
            <span className="text-yellow-400 font-semibold">Educational Demo:</span>{" "}
            The &apos;Standard&apos; model is intentionally prompted to give wrong answers to demonstrate CoT benefits.
          </p>
        </div>

        {/* Row 2 - Author & Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm text-white/60">
          {/* Author */}
          <span className="font-medium text-white/80">By Amirkia</span>
          <span className="text-white/30">•</span>
          
          {/* Website */}
          <a
            href="https://www.amirkia.tech/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>www.amirkia.tech</span>
          </a>
          <span className="text-white/30">•</span>

          {/* Social Links */}
          <a
            href="https://scholar.google.com/citations?user=9geFFmwAAAAJ&hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Scholar</span>
          </a>
          <span className="text-white/30">•</span>
          <a
            href="https://www.linkedin.com/in/amirkiarafiei/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </a>
          <span className="text-white/30">•</span>
          <a
            href="https://github.com/amirkiarafiei"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <span className="text-white/30">•</span>

          {/* Project Links */}
          <a
            href="https://arxiv.org/abs/2201.11903"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
            title="Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (Wei et al., 2022)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>CoT Paper</span>
          </a>
          <span className="text-white/30">•</span>
          <a
            href="https://medium.com/@amirkiarafiei/why-i-built-a-chain-of-thought-visualizer-640ab9fa8eb2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Medium Article</span>
          </a>
          <span className="text-white/30">•</span>
          <a
            href="https://github.com/amirkiarafiei/chain-of-thought-visualizer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Source</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
