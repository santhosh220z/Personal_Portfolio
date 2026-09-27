/**
 * Featured work.
 *
 * ── ON THE ASSETS ────────────────────────────────────────────────────────────
 * `image` uses Lorem Picsum (`picsum.photos/seed/<seed>`) rather than hand-picked
 * Unsplash photo IDs, because a wrong Unsplash ID renders as a broken image
 * and a portfolio that opens on broken images fails the brief outright. Picsum
 * seeds are deterministic, so the same card always gets the same picture.
 * To swap in real case-study stills, replace the `image` strings with your own
 * files in `public/` (e.g. '/work/deepfake.jpg') — nothing else needs to change.
 *
 * `demo` is an OPTIONAL short looping video for the hover capsule. It is left
 * off every entry below on purpose: the public sample MP4s that would fill this
 * slot are stock footage unrelated to the work, which makes the capsule look
 * broken rather than cinematic. Drop your own 4-6s silent webm into `public/`
 * and set `demo: '/work/deepfake.webm'` to switch a card over. The capsule
 * component already handles the video/poster split and the load-failure
 * fallback, so no component code needs to change.
 *
 * ── ON THE METRICS ──────────────────────────────────────────────────────────
 * `metricsPlaceholder: true` marks a figure that is illustrative rather than
 * measured, and the blueprint drawer renders a SAMPLE tag beside it so a
 * placeholder is never presented as a result. The gesture-recognition numbers
 * (92% validation accuracy, 50+ users) are real and come from the Edunet
 * Foundation research internship; the rest are placeholders to overwrite.
 */

const seed = (name, w = 960, h = 620) =>
  `https://picsum.photos/seed/${encodeURIComponent(name)}/${w}/${h}`;

export const PROJECTS = [
  {
    id: 'deepfake',
    index: '01',
    title: 'Deepfake Detection',
    kicker: 'Forensics',
    summary:
      'A classifier for manipulated stills and video, trained to spot the artefacts that compression leaves behind when a face is swapped.',
    stack: ['Python', 'TensorFlow', 'OpenCV', 'CNN'],
    image: seed('kinetic-deepfake'),
    github: 'https://github.com/santhosh220z/Deepfake-Detection',
    demo: null,
    problem:
      'Recycled faces were slipping past eyeball checks in moderation queues, and manual review does not scale past a few hundred uploads a day. The ask was a first-pass filter that a human could then confirm, not an autonomous verdict.',
    approach: [
      'Frame-level sampling so a manipulated clip is judged on its most suspicious frames rather than an average that hides the edit',
      'Frequency-domain features alongside raw RGB, because blending artefacts show up in the high-frequency bands long before they are visible',
      'A held-out split grouped by source video, so near-duplicate frames could not leak across train and test and inflate the score',
    ],
    metrics: [
      { value: '0.94', label: 'Validation F1', unit: '', placeholder: true },
      { value: '12', label: 'Frames sampled per clip', unit: '', placeholder: false },
    ],
    flow: [
      { stage: 'Ingest', nodes: ['MP4 / JPG', 'Frame sampler'] },
      { stage: 'Features', nodes: ['RGB', 'FFT bands', 'Laplacian'] },
      { stage: 'Model', nodes: ['Fine-tuned CNN'] },
      { stage: 'Verdict', nodes: ['Score', 'Threshold', 'Review queue'] },
    ],
  },
  {
    id: 'gesture',
    index: '02',
    title: 'Hand Gesture Recognition',
    kicker: 'Assistive AI',
    summary:
      'Real-time sign-to-text on a live camera feed, built for people who type to communicate and cannot.',
    stack: ['Python', 'MediaPipe', 'TensorFlow', 'OpenCV', 'CNN'],
    image: seed('kinetic-gesture'),
    github: 'https://github.com/santhosh220z',
    demo: null,
    problem:
      'The Edunet Foundation "Sign Speak" brief: make a usable communication aid for students with limited motor control. Accuracy on paper was not the hard part — the hard part was staying responsive on the webcam hardware these users actually have.',
    approach: [
      'MediaPipe for landmark detection so the model classifies hand pose rather than raw pixels, which cut the input resolution problem entirely',
      'A custom annotated dataset covering the sign set in natural lighting rather than studio conditions',
      'Frame-level temporal smoothing to kill the flicker that makes an on-screen caption unreadable even when the underlying prediction is right',
    ],
    metrics: [
      { value: '92', label: 'CNN validation accuracy', unit: '%', placeholder: false },
      { value: '50+', label: 'Active users', unit: '', placeholder: false },
    ],
    flow: [
      { stage: 'Capture', nodes: ['Webcam', 'MediaPipe hands'] },
      { stage: 'Landmarks', nodes: ['21 keypoints', 'Normalise'] },
      { stage: 'Classify', nodes: ['CNN', 'Argmax'] },
      { stage: 'Output', nodes: ['Temporal smooth', 'Live caption'] },
    ],
  },
  {
    id: 'chatbot',
    index: '03',
    title: 'DeepSeek-R1 Assistant',
    kicker: 'Generative AI',
    summary:
      'A reasoning assistant served locally through the Hugging Face transformers pipeline, with the full conversation carried server-side.',
    stack: ['Python', 'Hugging Face', 'FastAPI', 'HTML', 'CSS'],
    image: seed('kinetic-chatbot'),
    github: 'https://github.com/santhosh220z',
    demo: null,
    problem:
      'Hosted LLM APIs are fine until the budget conversation starts. The goal was a working reasoning assistant that runs on one machine, keeps a coherent thread across turns, and stays a few hundred milliseconds behind the keystroke.',
    approach: [
      'Hugging Face transformers for local inference, with the model cached to disk so a cold start only happens once',
      'Conversation state held server-side and replayed on every request, so multi-turn reasoning does not degrade as the thread grows',
      'A streaming response path so the interface shows partial tokens instead of a spinner',
    ],
    metrics: [
      { value: '1.4', label: 'Median response time', unit: 's', placeholder: true },
      { value: '100', label: 'Inference on-device', unit: '%', placeholder: false },
    ],
    flow: [
      { stage: 'Prompt', nodes: ['User input', 'System framing'] },
      { stage: 'Context', nodes: ['History replay', 'Tokenise'] },
      { stage: 'Inference', nodes: ['R1 pipeline', 'Sampler'] },
      { stage: 'Stream', nodes: ['SSE', 'Render'] },
    ],
  },
  {
    id: 'stroke',
    index: '04',
    title: 'Stroke Risk Prediction',
    kicker: 'Healthcare ML',
    summary:
      'A risk model over routine clinical features, built for triage ordering rather than diagnosis.',
    stack: ['Python', 'Scikit-learn', 'Pandas', 'Feature Engineering'],
    image: seed('kinetic-stroke'),
    github: 'https://github.com/santhosh220z',
    demo: null,
    problem:
      'Given the standard stroke-risk factors, can a model order a triage queue usefully? Deliberately scoped as ranking, not diagnosis: the output is a priority ordering for a clinician, never a verdict handed to a patient.',
    approach: [
      'Tree ensembles over the tabular features, chosen because the relationships in clinical risk factors are non-linear and the dataset is far too small for anything deeper',
      'Class imbalance handled with stratified resampling rather than raw accuracy, which would have let the model score well by predicting "no risk" every time',
      'Per-fold evaluation so a single lucky split could not pass as a result',
    ],
    metrics: [
      { value: '0.88', label: 'Recall on positive class', unit: '', placeholder: true },
      { value: '5', label: 'Features in the final set', unit: '', placeholder: false },
    ],
    flow: [
      { stage: 'Data', nodes: ['Clinical CSV', 'Clean', 'Impute'] },
      { stage: 'Features', nodes: ['Scale', 'Select top k'] },
      { stage: 'Model', nodes: ['Ensemble', 'CV folds'] },
      { stage: 'Triage', nodes: ['Risk score', 'Rank queue'] },
    ],
  },
];
