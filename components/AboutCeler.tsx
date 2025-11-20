"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function AboutCeler() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="py-24 px-6 bg-gradient-to-b from-background to-background/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-textPrimary mb-6">
            End-to-End Multiomics Platform
          </h2>
          <p className="text-xl text-textMuted mb-4 max-w-4xl mx-auto leading-relaxed">
            Celer is an AI-powered, agentic platform that radically simplifies multiomics data analysis.
            It automatically fetches datasets from repositories like GEO, PRIDE, and Metabolomics Workbench,
            transforms them into clean, analysis-ready formats, runs standardized pipelines, enabling researchers to move from{" "}
            <span className="text-primary font-bold">raw data to discovery in minutes</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
