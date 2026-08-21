import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar } from 'lucide-react';
import SectionHeading from './SectionHeading';
import GoogleCloudLogo from '../../IMAGE/google-cloud.png';

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
    <section id="certifications" className="relative overflow-hidden section-spacing">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[780px] w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric-violet/5 blur-[140px]"></div>

      <div className="relative z-10 section-container">
        <SectionHeading title="Certifications" subtitle="My Google Skill Build Badges" />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {certificationsData.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
              className="group relative flex flex-col glass-card-hover"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl glass p-2 transition-transform duration-300 group-hover:scale-105">
                <img src={GoogleCloudLogo} alt="Google Cloud" className="w-full h-full object-contain" />
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="mb-2 font-display headline-sm text-ethereal-on-surface leading-tight transition-colors group-hover:text-electric-violet">
                  {cert.name}
                </h3>

                <div className="mb-4 flex items-center gap-2 font-mono label-sm text-ethereal-on-surface-variant">
                  <span className="text-tertiary">{cert.issuer}</span>
                  <span className="h-1 w-1 rounded-full bg-white/15"></span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {cert.date}
                  </span>
                </div>
              </div>

              <div className="mt-auto border-t border-white/10 pt-4">
                <a
                  href={cert.verifyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost inline-flex items-center gap-2"
                >
                  Verify Credential
                  <ExternalLink size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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