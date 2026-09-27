// Resume content, lifted out of the components so the presentation layer holds
// no hardcoded copy. Ordering here is the ordering on the page.

export const ABOUT = {
  headline: ['I turn research', 'into running', 'systems.'],
  bio: [
    'I build vision and language systems that hold up outside a notebook — real-time gesture recognition, deepfake detection, predictive clinical models. The interesting part is rarely the model; it is everything around it that decides whether anyone ever sees a prediction.',
    'Currently finishing a B.Tech in Computer Science (AI & ML) at KIET, Kakinada. Previously a research intern at the Edunet Foundation and a machine learning engineering intern on the Google AI-ML programme, where I shipped three production-ready models onto Google Cloud.',
  ],
  facts: [
    { value: '10+', label: 'Models shipped' },
    { value: '18', label: 'Cloud badges' },
    { value: '3', label: 'Production deployments' },
  ],
  languages: ['English', 'Telugu', 'Hindi'],
  award:
    'Selected for the regional round at Edunet — Sign Speak: The Silent Communicator.',
};

export const EXPERIENCES = [
  {
    role: 'Machine Learning Engineer',
    company: 'Google AI-ML Virtual Internship',
    period: '2024 — 2025',
    description:
      'An immersive programme across ML concepts, algorithms, and production deployment. Built and deployed scalable models with TensorFlow and PyTorch on Google Cloud.',
    stack: ['TensorFlow', 'PyTorch', 'Google Cloud AI', 'Model Deployment', 'MLOps'],
    impact: 'Delivered 3 production-ready ML models for real-time prediction services',
  },
  {
    role: 'Research Intern',
    company: 'Edunet Foundation',
    period: '2024 — 2025',
    description:
      'Built a real-time hand sign recognition system with OpenCV and MediaPipe to improve gesture interpretation and communication accessibility. Trained CNN models on a custom annotated dataset.',
    stack: ['Python', 'OpenCV', 'MediaPipe', 'TensorFlow', 'CNN', 'Data Annotation'],
    impact: 'Created an accessible AI tool used by 50+ users for communication assistance',
  },
  {
    role: 'Machine Learning Teaching Assistant',
    company: 'KIET College',
    period: '2023 — 2024',
    description:
      'Delivered ML coursework, graded assignments, and guided final-year projects on regression, trees, and neural networks, with review sessions structured around industry-style ML workflows.',
    stack: ['Scikit-learn', 'Matplotlib', 'Student Mentoring', 'ML Workflow Design'],
    impact: 'Helped 85% of students pass the final ML assessment',
  },
];

export const SKILL_GROUPS = [
  {
    id: 'ml',
    label: 'Model',
    title: 'Machine Learning & AI',
    items: [
      'Python',
      'Machine Learning',
      'Deep Learning',
      'Neural Networks',
      'NLP',
      'Prompt Engineering',
      'Generative AI',
      'Transfer Learning',
      'Ensemble Methods',
    ],
  },
  {
    id: 'vision',
    label: 'Vision',
    title: 'Computer Vision',
    items: [
      'OpenCV',
      'MediaPipe',
      'YOLO',
      'SSD',
      'Faster R-CNN',
      'Mask R-CNN',
      'Object Detection',
      'Image Segmentation',
      'Video Analysis',
      'Gesture Recognition',
    ],
  },
  {
    id: 'mlops',
    label: 'Ship',
    title: 'MLOps & Deployment',
    items: [
      'n8n Workflow Automation',
      'Git',
      'GitHub Actions',
      'Docker',
      'Vertex AI',
      'API Deployment',
    ],
  },
  {
    id: 'data',
    label: 'Data',
    title: 'Data Engineering',
    items: [
      'Pandas',
      'NumPy',
      'Data Preprocessing',
      'Feature Engineering',
      'SQL',
      'Stream Processing',
      'Airflow',
    ],
  },
];

/**
 * The stack rendered as a left-to-right pipeline in the Architecture section.
 * `depth` is a real architectural layer, not decoration: each stage consumes
 * the previous one's output, which is what the section's diagram asserts.
 */
export const PIPELINE = [
  {
    id: 'signal',
    label: 'Signal',
    caption: 'Ingest',
    detail: 'Cameras, video files, and tabular clinical data arriving as bytes.',
  },
  {
    id: 'features',
    label: 'Features',
    caption: 'Prepare',
    detail: 'Landmarks, frequency bands, encodings — the frame becomes a vector.',
  },
  {
    id: 'model',
    label: 'Model',
    caption: 'Infer',
    detail: 'Convolutions and trees, versioned and served behind one interface.',
  },
  {
    id: 'surface',
    label: 'Surface',
    caption: 'Deliver',
    detail: 'A caption, a score, a queue — the output a non-specialist can use.',
  },
];

export const EDUCATION = [
  {
    degree: 'Bachelor of Technology',
    major: 'Computer Science Engineering (AI & ML)',
    institution: 'Kakinada Institute of Engineering and Technology – II',
    period: '2022 — 2026',
    details: 'CGPA 7.44. Focus on artificial intelligence, machine learning, and deep neural networks.',
    courses: ['Artificial Intelligence', 'Machine Learning', 'Data Structures', 'Algorithms', 'Computer Vision'],
  },
  {
    degree: 'Intermediate — MPC',
    major: 'Maths, Physics, Chemistry',
    institution: 'GRC Modern Junior College, Ramachandrapuram',
    period: '2020 — 2022',
    details: 'Core science and mathematics.',
    courses: ['Mathematics', 'Physics', 'Chemistry'],
  },
  {
    degree: 'Secondary School Certificate',
    major: 'General Studies',
    institution: 'Zilla Praja Parishad High School, Draksharama',
    period: '2019 — 2020',
    details: 'Secondary education.',
    courses: [],
  },
];

export const CERTIFICATIONS = [
  ['Machine Learning Operations (MLOps) for Generative AI', 'Sep 11, 2024', '11270258'],
  ['Introduction to Vertex AI Studio', 'Sep 11, 2024', '11269094'],
  ['Create Image Captioning Models', 'Sep 11, 2024', '11267817'],
  ['Transformer Models and BERT Model', 'Sep 11, 2024', '11264871'],
  ['Encoder-Decoder Architecture', 'Sep 11, 2024', '11264103'],
  ['Attention Mechanism', 'Sep 11, 2024', '11263590'],
  ['Introduction to Image Generation', 'Sep 11, 2024', '11262973'],
  ['Gemini for end-to-end SDLC', 'Sep 8, 2024', '11226162'],
  ['Gemini for DevOps Engineers', 'Sep 8, 2024', '11225883'],
  ['Gemini for Security Engineers', 'Sep 8, 2024', '11224859'],
  ['Gemini for Network Engineers', 'Sep 8, 2024', '11224362'],
  ['Gemini for Data Scientists and Analysts', 'Sep 8, 2024', '11223945'],
  ['Gemini for Cloud Architects', 'Sep 6, 2024', '11202445'],
  ['Responsible AI: Applying AI Principles', 'Aug 19, 2024', '10686803'],
  ['Prompt Design in Vertex AI', 'Aug 15, 2024', '10600787'],
  ['Introduction to Responsible AI', 'Aug 8, 2024', '10479981'],
  ['Introduction to Large Language Models', 'Aug 8, 2024', '10469487'],
  ['Introduction to Generative AI', 'Aug 2, 2024', '10329047'],
].map(([name, date, id]) => ({
  name,
  date,
  href: `https://www.skills.google/public_profiles/b97527e0-fd88-4299-896f-66fa6547079c/badges/${id}`,
}));
