import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin } from 'lucide-react';
import SectionHeading from './SectionHeading';

const Contact = () => {
  const contactItems = [
    {
      label: 'Email',
      value: 'santhoshsunkarasbe@gmail.com',
      href: 'mailto:santhoshsunkarasbe@gmail.com',
      Icon: Mail,
      iconColor: 'text-electric-violet',
      iconBg: 'bg-primary-container/20 border-primary-container/30',
    },
    {
      label: 'LinkedIn',
      value: 'santhosh sunkara',
      href: 'https://www.linkedin.com/in/siva-sambhavi-santhosh-sunkara-588a24265/',
      Icon: Linkedin,
      iconColor: 'text-tertiary',
      iconBg: 'bg-tertiary-container/20 border-tertiary/30',
    },
    {
      label: 'GitHub',
      value: '@santhosh220z',
      href: 'https://github.com/santhosh220z',
      Icon: Github,
      iconColor: 'text-electric-violet',
      iconBg: 'bg-primary-container/20 border-primary-container/30',
    }
  ];

  return (
    <section id="contact" className="relative section-spacing">
      <div className="relative z-10 section-container">
        <SectionHeading title="Get In Touch" subtitle="Contact Me" />

        <div className="mx-auto mt-8 w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-10 text-center"
          >
            <div className="glass-card text-center">
              <h3 className="mb-4 font-display headline-md text-ethereal-on-surface">Let's build something meaningful</h3>
              <p className="mx-auto max-w-2xl body-lg text-ethereal-on-surface-variant leading-relaxed">
                I'm currently looking for new opportunities in AI/ML engineering, research roles, 
                and software development. Whether you have a question or just want to say hi, 
                I'll try my best to get back to you!
              </p>
            </div>

            <div className="grid w-full gap-6 md:grid-cols-3">
              {contactItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="group flex flex-col items-center gap-4 glass-card-hover text-center"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl border transition-colors ${item.iconBg}`}>
                    <item.Icon size={26} className={item.iconColor} />
                  </div>
                  <div>
                    <div className="mb-1 font-mono label-sm text-ethereal-on-surface-variant">{item.label}</div>
                    <div className="font-display text-lg font-medium text-ethereal-on-surface">{item.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;