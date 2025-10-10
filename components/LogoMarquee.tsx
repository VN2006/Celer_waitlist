"use client";

import { motion } from "framer-motion";

const institutions = [
  "Harvard",
  "Yale",
  "Duke",
  "UNC Chapel Hill",
  "Cornell",
  "NYU Langone",
  "Bascom Palmer Eye Institute",
];

export default function LogoMarquee() {
  return (
    <section className="py-16 overflow-hidden border-y border-primary/10">
      <div className="relative">
        <motion.div
          className="flex gap-16"
          animate={{
            x: [0, -1920],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {[...institutions, ...institutions, ...institutions].map((institution, index) => (
            <div
              key={index}
              className="flex-shrink-0 text-2xl font-bold text-textMuted/50 hover:text-primary transition-colors duration-300 whitespace-nowrap"
              aria-label={institution}
            >
              {institution}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
