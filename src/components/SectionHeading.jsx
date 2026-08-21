import React from 'react';
import { motion } from 'framer-motion';

const SectionHeading = ({ title, subtitle }) => {
  return (
    <div className="mb-16 text-center md:mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 font-mono label-sm text-ethereal-on-surface-variant">
          <span className="h-1.5 w-1.5 rounded-full bg-electric-violet"></span>
          {subtitle}
        </span>

        <h2 className="mt-5 font-display display-lg text-gradient">
          {title}
        </h2>

        <div className="mx-auto mt-7 h-1.5 w-24 rounded-full bg-gradient-to-r from-electric-violet via-tertiary to-secondary animate-pulse-glow" />
      </motion.div>
    </div>
  );
};

export default SectionHeading;