import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import SectionHeading from './SectionHeading';

const Experience = () => {
  const experiences = [
    {
      role: "Machine Learning Engineer",
      company: "Google AI-ML Virtual Internship",
      companyFull: "Google",
      period: "2024 - 2025",
      description: "Completed an immersive virtual internship focused on Artificial Intelligence and Machine Learning concepts, algorithms, and real-world applications. Built and deployed scalable ML models using TensorFlow and PyTorch on Google Cloud Platform.",
      skills: ["TensorFlow", "PyTorch", "Google Cloud AI", "Model Deployment", "MLOps"],
      impact: "Delivered 3 production-ready ML models for real-time prediction services"
    },
    {
      role: "Research Intern",
      company: "Edunet Foundation",
      period: "2024 - 2025",
      description: "Developed a real-time hand sign recognition system using Python, OpenCV, and Mediapipe to improve gesture interpretation and communication accessibility. Trained CNN models with 92% accuracy on custom dataset.",
      skills: ["Python", "OpenCV", "Mediapipe", "TensorFlow", "CNN", "Data Annotation"],
      impact: "Created accessible AI tool used by 50+ users for communication assistance"
    },
    {
      role: "Machine Learning Teaching Assistant",
      company: "KIET College",
      period: "2023 - 2024",
      description: "Assisted faculty in delivering Machine Learning courses, grading assignments, and guiding 30+ students on linear regression, decision trees, and neural network projects. Conducted review sessions for industry-style ML workflows.",
      skills: ["Scikit-learn", "Matplotlib", "Student Mentoring", "ML Workflow Design"],
      impact: "Helped 85% of students pass the final ML assessment"
    }
  ];

  return (
    <section id="experience" className="relative section-spacing">
      <div className="relative z-10 section-container">
        <SectionHeading title="Experience" subtitle="Machine Learning Engineering" />

        <div className="relative flex w-full max-w-4xl flex-col gap-8">
          <div className="pointer-events-none absolute left-6 top-10 hidden h-[calc(100%-4.5rem)] w-[2px] bg-gradient-to-b from-electric-violet/50 via-tertiary/30 to-transparent md:block"></div>

          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl glass-card-hover p-7 md:p-9"
            >
              <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-electric-violet/10 blur-[80px] transition-transform duration-700 group-hover:scale-110"></div>

              <div className="relative z-10 flex flex-col items-start gap-6 md:flex-col">
                <div className="flex-shrink-0 rounded-xl border border-electric-violet/30 bg-primary-container/20 p-4">
                  <Briefcase size={34} className="text-electric-violet" />
                </div>

                <div className="flex-1 w-full">
                  <div className="mb-4 flex flex-col gap-4 md:flex-col md:items-start md:justify-between">
                    <div>
                      <h3 className="mb-2 font-display headline-sm text-ethereal-on-surface">{exp.role}</h3>
                      <h4 className="font-display text-lg font-medium text-tertiary">{exp.company}</h4>
                      <p className="body-md text-ethereal-on-surface-variant small"> {exp.period}</p>
                    </div>

                    <div className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-xl glass px-3 py-1.5">
                      <Calendar size={16} className="text-electric-violet" />
                      <span className="font-mono label-sm text-ethereal-on-surface-variant">{exp.period}</span>
                    </div>
                  </div>

                  <p className="mb-6 max-w-2xl body-lg text-ethereal-on-surface-variant leading-relaxed">
                    {exp.description}
                  </p>

                  {exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {exp.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="chip"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;