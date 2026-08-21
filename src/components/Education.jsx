import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, BookOpen } from 'lucide-react';
import SectionHeading from './SectionHeading';

const Education = () => {
  const educationData = [
    {
      degree: "Bachelor of Technology (B.Tech)",
      major: "Computer Science Engineering (AIML)",
      institution: "Kakinada Institute of Engineering and Technology – II, Kakinada",
      period: "2022 - 2026",
      details: "CGPA: 7.44. Specialized in Artificial Intelligence, Machine Learning and deep neural networks.",
      courses: ["Artificial Intelligence", "Machine Learning", "Data Structures", "Algorithms", "Computer Vision"]
    },
    {
      degree: "Intermediate – MPC",
      major: "Maths, Physics, Chemistry",
      institution: "GRC Modern Junior College, Ramachandrapuram",
      period: "2020 - 2022",
      details: "Focused on core science and mathematics subjects.",
      courses: ["Mathematics", "Physics", "Chemistry"]
    },
    {
      degree: "Secondary School Certificate (SSC)",
      major: "General Studies",
      institution: "Zilla Praja Parishad High School, Draksharama",
      period: "2019 - 2020",
      details: "Completed secondary education with strong academic performance.",
      courses: []
    }
  ];

  return (
    <section id="education" className="relative section-spacing">
      <div className="relative z-10 section-container">
        <SectionHeading title="Education" subtitle="Academic Background" />

        <div className="flex w-full max-w-4xl flex-col gap-8">
          {educationData.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl glass-card-hover p-8 md:p-10"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-tertiary/10 blur-[80px] transition-transform duration-700 group-hover:scale-110"></div>

              <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row">
                <div className="flex-shrink-0 rounded-xl border border-tertiary/30 bg-tertiary-container/20 p-4">
                  {index === 0 ? <GraduationCap size={34} className="text-tertiary" /> : <BookOpen size={34} className="text-tertiary" />}
                </div>

                <div className="flex-1 w-full">
                  <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="mb-2 font-display headline-sm text-ethereal-on-surface">{edu.degree}</h3>
                      <h4 className="mb-1 font-display text-lg font-medium text-tertiary">{edu.major}</h4>
                      <p className="body-md text-ethereal-on-surface-variant">{edu.institution}</p>
                    </div>

                    <div className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-xl glass px-3 py-1.5">
                      <Calendar size={16} className="text-tertiary" />
                      <span className="font-mono label-sm text-ethereal-on-surface-variant">{edu.period}</span>
                    </div>
                  </div>

                  <p className="mb-6 max-w-2xl body-lg text-ethereal-on-surface-variant leading-relaxed">
                    {edu.details}
                  </p>

                  {edu.courses.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {edu.courses.map((course, idx) => (
                        <span
                          key={idx}
                          className="chip"
                        >
                          {course}
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

export default Education;