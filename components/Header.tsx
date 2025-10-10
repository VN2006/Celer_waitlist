"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-sm border-b border-primary/10"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
            <Image
              src="/c-logo-3d-purple-black-2048.png"
              alt="Celer Logo"
              fill
              sizes="40px"
              className="object-contain drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]"
            />
          </div>
          <span className="text-2xl font-extrabold text-textPrimary">Celer</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-textMuted hover:text-primary transition-colors">
            About
          </a>
          <a href="#how-it-works" className="text-textMuted hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="#waitlist" className="text-textMuted hover:text-primary transition-colors">
            Waitlist
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
