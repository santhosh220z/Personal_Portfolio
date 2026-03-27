import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Award, Calendar } from 'lucide-react';
import SectionHeading from './SectionHeading';

const certificationsData = [
  {
    name: "Machine Learning Operations (MLOps) for Generative AI",
    issuer: "Google Cloud",
    date: "Sep 11, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11270258"
  },
  {
    name: "Introduction to Vertex AI Studio",
    issuer: "Google Cloud",
    date: "Sep 11, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11269094"
  },
  {
    name: "Create Image Captioning Models",
    issuer: "Google Cloud",
    date: "Sep 11, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11267817"
  },
  {
    name: "Transformer Models and BERT Model",
    issuer: "Google Cloud",
    date: "Sep 11, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11264871"
  },
  {
    name: "Encoder-Decoder Architecture",
    issuer: "Google Cloud",
    date: "Sep 11, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11264103"
  },
  {
    name: "Attention Mechanism",
    issuer: "Google Cloud",
    date: "Sep 11, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11263590"
  },
  {
    name: "Introduction to Image Generation",
    issuer: "Google Cloud",
    date: "Sep 11, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11262973"
  },
  {
    name: "Gemini for end-to-end SDLC",
    issuer: "Google Cloud",
    date: "Sep 8, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11226162"
  },
  {
    name: "Gemini for DevOps Engineers",
    issuer: "Google Cloud",
    date: "Sep 8, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11225883"
  },
  {
    name: "Gemini for Security Engineers",
    issuer: "Google Cloud",
    date: "Sep 8, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11224859"
  },
  {
    name: "Gemini for Network Engineers",
    issuer: "Google Cloud",
    date: "Sep 8, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11224362"
  },
  {
    name: "Gemini for Data Scientists and Analysts",
    issuer: "Google Cloud",
    date: "Sep 8, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11223945"
  },
  {
    name: "Gemini for Cloud Architects",
    issuer: "Google Cloud",
    date: "Sep 6, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/11202445"
  },
  {
    name: "Responsible AI: Applying AI Principles with Google Cloud",
    issuer: "Google Cloud",
    date: "Aug 19, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/10686803"
  },
  {
    name: "Prompt Design in Vertex AI",
    issuer: "Google Cloud",
    date: "Aug 15, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/10600787"
  },
  {
    name: "Introduction to Responsible AI",
    issuer: "Google Cloud",
    date: "Aug 8, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/10479981"
  },
  {
    name: "Introduction to Large Language Models",
    issuer: "Google Cloud",
    date: "Aug 8, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/10469487"
  },
  {
    name: "Introduction to Generative AI",
    issuer: "Google Cloud",
    date: "Aug 2, 2024",
    verifyLink: "https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/10329047"
  }
];

const Certifications = () => {
  return (
    <section id="certifications" className="py-24 relative bg-chlorophyll-surface overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-chlorophyll-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <SectionHeading title="Certifications" subtitle="My Google Skill Build Badges" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
          {certificationsData.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
              className="group relative flex flex-col bg-chlorophyll-surface-low border border-chlorophyll-outline-variant/30 rounded-2xl p-6 hover:border-chlorophyll-primary/50 transition-all duration-300 shadow-lg hover:shadow-[0_8px_30px_rgb(175,209,136,0.12)]"
            >
              {/* Badge Icon Area */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-chlorophyll-surface-high to-chlorophyll-surface-highest flex items-center justify-center mb-6 border border-chlorophyll-outline-variant/50 group-hover:scale-105 transition-transform duration-300">
                <Award className="text-chlorophyll-primary" size={32} />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-display font-bold text-chlorophyll-on-surface mb-2 leading-tight group-hover:text-chlorophyll-primary transition-colors">
                  {cert.name}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-chlorophyll-on-surface-variant mb-4">
                  <span className="font-medium text-chlorophyll-secondary">{cert.issuer}</span>
                  <span className="w-1 h-1 rounded-full bg-chlorophyll-outline-variant"></span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {cert.date}
                  </span>
                </div>
              </div>

              {/* Verify Link */}
              <div className="mt-auto pt-4 border-t border-chlorophyll-outline-variant/30">
                <a 
                  href={cert.verifyLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-chlorophyll-on-surface-variant hover:text-chlorophyll-primary transition-colors group/link"
                >
                  Verify Credential
                  <ExternalLink size={16} className="group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
