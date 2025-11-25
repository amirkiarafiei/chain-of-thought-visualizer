"use client";

import { Globe, GraduationCap, Linkedin, Github, BookOpen, Code } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-900/60 backdrop-blur-md border-t border-white/10 px-4 py-3 shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Left side - Demo Disclaimer */}
        <div className="flex items-center gap-2 text-white/50">
          <span className="hidden md:inline text-yellow-500/80">⚠️</span>
          <p className="text-center md:text-left">
            <span className="text-yellow-500/80 font-medium">Educational Demo:</span>{" "}
            The &apos;Standard&apos; model is intentionally prompted to give wrong answers to demonstrate CoT benefits.
          </p>
        </div>

        {/* Right side - Links */}
        <div className="flex items-center gap-4">
          {/* Author Links */}
          <div className="flex items-center gap-2">
            <span className="text-white/30 hidden sm:inline">Author:</span>
            <div className="flex items-center gap-1">
              <a
                href="https://www.amirkia.tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/50 hover:text-white/80"
                title="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://scholar.google.com/citations?user=9geFFmwAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/50 hover:text-white/80"
                title="Google Scholar"
              >
                <GraduationCap className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/amirkiarafiei/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/50 hover:text-white/80"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/amirkiarafiei"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/50 hover:text-white/80"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-white/10 hidden sm:block" />

          {/* Project Links */}
          <div className="flex items-center gap-2">
            <a
              href="https://medium.com/@amirkiarafiei/why-i-built-a-chain-of-thought-visualizer-640ab9fa8eb2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-1 hover:bg-white/10 rounded transition-colors text-white/50 hover:text-white/80"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Article</span>
            </a>
            <a
              href="https://github.com/amirkiarafiei/chain-of-thought-visualizer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-1 hover:bg-white/10 rounded transition-colors text-white/50 hover:text-white/80"
            >
              <Code className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Source</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

