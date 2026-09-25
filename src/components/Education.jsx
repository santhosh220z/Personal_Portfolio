import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GraduationCap, Calendar, BookOpen } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { makeReveal, revealViewport } from '../lib/motion';

const Education = () => {
  const reduceMotion = useReducedMotion();
  const { container, item } = makeReveal(reduceMotion);
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
        <SectionHeading title="Education" />

        {/* Deliberately a different layout family from Experience: Experience is a
            vertical timeline stack, Education is a 2-column card grid. Two
            consecutive sections must not share a family. */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {educationData.map((edu, index) => (
            <motion.article
              key={edu.institution ?? edu.degree ?? index}
              variants={item}
              className="flex flex-col rounded-2xl surface surface-card-hover p-7"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent-line bg-accent-soft">
                  {index === 0 ? (
                    <GraduationCap size={19} className="text-electric-violet" aria-hidden="true" />
                  ) : (
                    <BookOpen size={19} className="text-electric-violet" aria-hidden="true" />
                  )}
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs text-ethereal-on-surface-variant">
                  <Calendar size={13} aria-hidden="true" />
                  {edu.period}
                </span>
              </div>

              <h3 className="text-xl font-semibold tracking-tight text-balance text-ethereal-on-surface">
                {edu.degree}
              </h3>
              <p className="mt-1.5 text-sm text-electric-violet">{edu.major}</p>
              <p className="mt-3 text-sm text-ethereal-on-surface-variant">{edu.institution}</p>

              <p className="mt-4 text-sm leading-relaxed text-ethereal-on-surface-variant">
                {edu.details}
              </p>

              {edu.courses.length > 0 ? (
                <ul className="mt-5 flex list-none flex-wrap gap-2 p-0">
                  {edu.courses.map((course) => (
                    <li key={course} className="chip">
                      {course}
                    </li>
                  ))}
                </ul>
              ) : null}
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Education;