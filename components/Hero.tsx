"use client";

import { motion } from "framer-motion";
import NeuronNetwork from "./NeuronNetwork";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <NeuronNetwork />
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center" style={{ position: 'relative', zIndex: 10 }}>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            Celer
          </span>
          <span className="text-textPrimary"> — </span>
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            The world's first end-to-end multiomics platform.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-textMuted mb-10 max-w-3xl mx-auto"
        >
          Pull and analyze complex biological data, all in one intelligent platform.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#waitlist"
            className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50"
          >
            Join the MVP Waitlist
          </a>
          <a
            href="#how-it-works"
            className="px-8 py-4 bg-transparent border-2 border-primary/50 hover:border-primary text-textPrimary font-bold rounded-lg transition-all"
          >
            See How It Works
          </a>
        </motion.div>
      </div>
    </section>
  );
}
