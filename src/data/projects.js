/**
 * Featured work.
 *
 * ── SOURCED, NOT INVENTED ────────────────────────────────────────────────────
 * Every figure in `metrics` is a fact read out of the repository it links to —
 * a dataset name, a hyperparameter, a number of camera sources, an architecture.
 * None of them is a benchmark result.
 *
 * That is a deliberate retreat. An earlier revision carried plausible-looking
 * numbers (0.94 F1, 92% accuracy, 1.4s median) flagged `placeholder: true` and
 * rendered with a SAMPLE tag. The audit behind this file found no trace of any
 * of them in the repos: `train_log.txt` for the gesture model covers Epoch 0
 * only and never reports a validation figure, and the deepfake README quotes no
 * metric at all. Shipping architecture facts is honest; shipping invented
 * benchmarks is not, and the drawer has no way to make that visible to a
 * visitor who does not read the fine print.
 *
 * `placeholder` is still honoured by BlueprintDrawer and now always false. It is
 * kept deliberately: it is the only thing standing between a future edit and a
 * fabricated result rendering as fact.
 *
 * The 1.0-everywhere metrics in StrokeSense's `models/training_info.json` are
 * NOT surfaced here. They come from 500 rows flagged `synthetic_data: true`, so
 * they measure a model memorising synthetic input. That file is a liability if a
 * reader finds it unprompted, and the methodology underneath it (SMOTE,
 * StratifiedKFold, a ResNet50V2 second modality) is the part actually worth
 * showing.
 *
 * Every `github` URL points at the repository that holds the work. Three of
 * these previously linked to the bare profile URL, and one of them — a locally
 * hosted reasoning assistant — has no repository at all and has been removed
 * rather than restated.
 *
 * There are deliberately no image or video fields. An earlier revision carried
 * `image` (a picsum.photos placeholder) and an optional `demo` clip so the work
 * list could show a cursor-following preview card. That card is gone, and with
 * it the only consumer of both fields, so carrying them would mean shipping
 * four placeholder URLs and a video code path that nothing renders.
 *
 * ── WHAT IS IN HERE, AND WHY ─────────────────────────────────────────────────
 * The list leads with the two systems that show engineering rather than
 * notebook work, because that is the distinction the rest of the page argues
 * for: a reinforcement-learning harness that reports its own eval separately
 * from training reward, and a detection service that will not raise an alert on
 * a single frame. The assistive and clinical work follow, and the two supporting
 * projects below sit outside this list entirely.
 *
 * `kicker` was dropped. It was declared on all four previous entries and read
 * by no component — a row renders index, title, stack and summary, and nothing
 * else — so it was a field that looked meaningful and did nothing.
 */

export const PROJECTS = [
  {
    id: 'pyroguard',
    index: '01',
    title: 'PyroGuard',
    summary:
      'Real-time fire and smoke detection across camera streams, where an alert is only raised after the fire is confirmed across several frames rather than on the first one that looks like flame.',
    stack: ['Python', 'PyTorch', 'YOLOv8', 'FastAPI', 'OpenCV', 'Docker'],
    github: 'https://github.com/santhosh220z/PyroGuard',
    problem:
      'A flame flickers and a compressed stream smears, so a detector that fires on a single frame floods responders with false alarms — and the ones who learn to ignore it are the cost. The hard part was never spotting fire; it was deciding when the evidence is strong enough to act on.',
    approach: [
      'YOLOv8 over a configurable confidence and IoU threshold, with a CPU fallback so the service still runs where no GPU is present',
      'Temporal verification: fire is confirmed only after N detections inside a time window, so one ambiguous frame cannot open an incident',
      'Pluggable alert providers — SMTP, Telegram, webhook — behind a cooldown, a dedupe check and a circuit breaker, defaulting to dry-run so a development run cannot page anyone',
      'Evidence capture and a SQLite incident lifecycle, so a raised alert leaves an auditable record with snapshots and status rather than a log line',
    ],
    metrics: [
      { value: '3', label: 'Camera sources', unit: '', placeholder: false },
      { value: '3', label: 'Alert providers', unit: '', placeholder: false },
    ],
    flow: [
      { stage: 'Detect', nodes: ['Stream', 'YOLOv8', 'Confidence gate'] },
      { stage: 'Verify', nodes: ['Frame window', 'N-of-M hits'] },
      { stage: 'Alert', nodes: ['Cooldown', 'SMTP', 'Telegram', 'Webhook'] },
      { stage: 'Record', nodes: ['Snapshot', 'SQLite', 'Incident status'] },
    ],
  },
  {
    id: 'driving-rl',
    index: '02',
    title: 'Driving with PPO',
    summary:
      'A PPO agent learning to drive CarRacing-v3 from raw pixels, built around an evaluation harness that reports its own score separately from the training reward.',
    stack: ['Python', 'PyTorch', 'Stable-Baselines3', 'Gymnasium', 'TensorBoard'],
    github: 'https://github.com/santhosh220z/Learn-to-drive-with-RL',
    problem:
      'CarRacing is scored on a reward curve that a badly configured run will still climb, so a training script that reports nothing at all is indistinguishable from one that is working. The interesting constraint is being able to tell the two apart.',
    approach: [
      'CnnPolicy over stacked grayscale frames, so the policy reads motion across time rather than a single still it could memorise',
      'An evaluation callback writing per-episode rewards to eval.json, kept distinct from the training reward because only the held-out number is comparable across runs',
      'Action smoothing, reward shaping and frame-skip wrappers, all off by default so the native reward stays the honest signal and shaping can be turned on as an explicit ablation',
      'Contract tests over the vectorised environment covering observation shape, action space and step semantics, because a wrapper that silently changes the action scale produces a run that looks fine and is not',
    ],
    metrics: [
      { value: '84×84', label: 'Stacked grayscale frame', unit: '', placeholder: false },
      { value: '10k', label: 'Smoke-test steps', unit: '', placeholder: false },
    ],
    flow: [
      { stage: 'Env', nodes: ['CarRacing-v3', 'Gray + resize', 'Frame stack', 'VecEnv'] },
      { stage: 'Policy', nodes: ['CnnPolicy', 'Actor + critic'] },
      { stage: 'Train', nodes: ['PPO', 'TensorBoard', 'Best-model callback'] },
      { stage: 'Evaluate', nodes: ['eval.json', 'Mean ± std', 'Video'] },
    ],
  },
  {
    id: 'algorithm-visualizer',
    index: '03',
    title: 'Algorithm Visualizer',
    summary:
      'Algorithms and data structures animated in lockstep with their own pseudocode, plus a mode that executes a program you paste in, line by line, with live variables and a call stack.',
    stack: ['React 19', 'TypeScript', 'Vite', 'Zustand', 'Tailwind CSS'],
    github: 'https://github.com/santhosh220z/code-and-algorithm-visualizer',
    problem:
      'Most algorithm visualisers animate a picture without explaining it. You watch bars swap positions and learn nothing about which line is running, why i is 3, or what the call stack looks like halfway through a recursion. The animation is the easy half.',
    approach: [
      'A step model as the single source of truth — the animation, the pseudocode highlight, the variable table and the structure views all render from one step index, so they cannot drift out of sync',
      'Per-line hit counters and execution trails, which turns an algorithm’s cost into something the learner watches accumulate rather than something the page asserts',
      'A recursive call stack panel, because recursion is the one thing a bar chart structurally cannot show',
      'Editable inputs — resize arrays, drag graph nodes, paint grid walls — so the tool is an instrument for testing a hypothesis rather than a fixed animation to watch',
    ],
    metrics: [
      { value: '6', label: 'Linked data structures', unit: '', placeholder: false },
      { value: '1', label: 'Step-through interpreter', unit: '', placeholder: false },
    ],
    flow: [
      { stage: 'Input', nodes: ['Array', 'Graph', 'Grid', 'Table', 'Tree', 'List'] },
      { stage: 'Step', nodes: ['Stepper', 'Pseudocode', 'Variables', 'Call stack'] },
      { stage: 'Render', nodes: ['Linked views', 'Play / step', 'Hit counters'] },
    ],
  },
  {
    id: 'deepfake',
    index: '04',
    title: 'Deepfake Detection',
    summary:
      'A served classifier for manipulated media: a Hugging Face checkpoint for stills and a GenConViT branch for video, behind a FastAPI endpoint that runs without a GPU.',
    stack: ['Python', 'PyTorch', 'Hugging Face', 'timm', 'OpenCV', 'FastAPI'],
    github: 'https://github.com/santhosh220z/Deepfake-Detection',
    problem:
      'Moderation queues are volume-bound, and eyeballing a short clip is slow and inconsistent. The useful shape for a first pass is a score a human then confirms — an autonomous verdict is the thing to avoid, because a confident wrong answer is more expensive than no answer.',
    approach: [
      'A pretrained image-classification checkpoint from the Hugging Face Hub rather than a model trained from scratch, which puts the effort into inference and serving instead of into assembling a dataset',
      'Label normalisation derived from the checkpoint’s own id2label, so swapping the model cannot silently invert the verdict from fake to real',
      'A separate GenConViT branch for video, because averaging frame scores hides the one edited segment that actually matters',
      'A device check that falls back to CPU and a render.yaml, so the service deploys as a URL rather than as a local setup guide',
    ],
    metrics: [
      { value: 'GenConViT', label: 'Video branch architecture', unit: '', placeholder: false },
      { value: '2', label: 'Stills + video branches', unit: '', placeholder: false },
    ],
    flow: [
      { stage: 'Media', nodes: ['Image', 'Video frames'] },
      { stage: 'Detect', nodes: ['HF checkpoint', 'GenConViT'] },
      { stage: 'Score', nodes: ['Label map', 'Confidence'] },
      { stage: 'Serve', nodes: ['FastAPI', 'Render deploy'] },
    ],
  },
  {
    id: 'sign-speak',
    index: '05',
    title: 'Sign Speak',
    summary:
      'Sign-language input turned into speech on screen, built for students who type to communicate and cannot. Selected for the regional round at TechSakshyam.',
    stack: ['Python', 'PyTorch', 'MediaPipe', 'OpenCV', 'Streamlit', 'scikit-learn'],
    github: 'https://github.com/santhosh220z/SIGN_SPEAK-The-Silent-Communicator',
    problem:
      'The TechSakshyam brief was a usable communication aid for students with limited motor control. Accuracy on paper was never the hard part — the hard part was staying responsive on the webcam hardware these users actually have, and staying still when the prediction is briefly wrong.',
    approach: [
      'MediaPipe hand landmarks so the model classifies pose rather than raw pixels, which collapses the input-resolution problem instead of buying hardware around it',
      'A custom annotated dataset covering the sign set in natural light rather than studio conditions, because a model trained on clean backgrounds fails the moment the room is not a studio',
      'Frame-level temporal smoothing to kill the flicker that makes an on-screen caption unreadable even when the underlying prediction is correct',
      'Speech output rather than text alone, so the result is heard by the person it is for and not only read by the person delivering it',
    ],
    metrics: [
      { value: '50+', label: 'Active users', unit: '', placeholder: false },
      { value: 'NSLT100', label: 'Training set', unit: '', placeholder: false },
    ],
    flow: [
      { stage: 'Capture', nodes: ['Webcam', 'MediaPipe hands'] },
      { stage: 'Landmarks', nodes: ['21 keypoints', 'Normalise'] },
      { stage: 'Classify', nodes: ['CNN', 'Argmax', 'Temporal smooth'] },
      { stage: 'Speak', nodes: ['Caption', 'Text to speech'] },
    ],
  },
  {
    id: 'strokesense',
    index: '06',
    title: 'StrokeSense',
    summary:
      'Stroke risk from two directions that never arrive together: a tabular clinical model and an MRI classifier, served by Flask behind a React client.',
    stack: ['Python', 'TensorFlow', 'scikit-learn', 'SMOTE', 'Flask', 'React'],
    github: 'https://github.com/santhosh220z/ISCHEMIC_STOKE_PREDICTION',
    problem:
      'Stroke triage has two inputs — a patient chart and a scan — and they rarely turn up together. A single model has to be trusted with whichever one is available, so the two modalities need separate treatment and a common way to report back.',
    approach: [
      'A Random Forest over the clinical risk factors, cross-validated with StratifiedKFold so one lucky split cannot pass as a result',
      'SMOTE oversampling of the positive class, because the dataset is imbalanced enough that raw accuracy would be won outright by predicting no risk every time',
      'A separate ResNet50V2 classifier for the MRI branch, since a scan and a chart are different modalities and forcing them through one head loses whichever one the head was not built for',
      'All three model artifacts served behind one Flask request path to a Vite and React client, so the chart-derived score and the scan-derived verdict arrive together',
    ],
    metrics: [
      { value: '3', label: 'Model artifacts shipped', unit: '', placeholder: false },
      { value: '2', label: 'Input modalities', unit: '', placeholder: false },
    ],
    flow: [
      { stage: 'Input', nodes: ['Clinical chart', 'MRI scan'] },
      { stage: 'Model', nodes: ['Random Forest', 'SMOTE', 'ResNet50V2'] },
      { stage: 'Score', nodes: ['Risk score', 'Scan verdict'] },
      { stage: 'UI', nodes: ['Flask API', 'React client'] },
    ],
  },
];

/**
 * Supporting work, rendered as a compact strip beneath the featured list rather
 * than as blueprint rows.
 *
 * The distinction is depth, not quality. Each of these is a real repository with
 * a real implementation, but neither carries the problem/approach/flow narrative
 * that earns a full row, and inflating them to the featured shape would pad the
 * list with writing rather than evidence. So they get a title, a stack and a
 * link — and one honest sentence about what they actually are.
 *
 * The chemical reactions project is a deterministic stoichiometry engine, not a
 * learned model: `core/engine.py` balances equations and resolves the limiting
 * reagent from first principles. Its README describes a TensorFlow ANN and a
 * scikit-learn scaler, but `app.py` imports Flask and nothing else and
 * `requirements.txt` lists only flask and requests. It is described here as the
 * rules engine it is, which is also the more interesting claim.
 */
export const SUPPORTING = [
  {
    id: 'chemical-reactions',
    index: '07',
    title: 'Chemical Reaction Predictor',
    summary:
      'A Flask service that takes reactants, masses and temperature, then balances the equation, identifies the limiting reagent and reports the expected yield. A deterministic engine built on reaction templates and formula parsing, not a learned model.',
    stack: ['Python', 'Flask', 'Stoichiometry', 'Rule Engine'],
    github: 'https://github.com/santhosh220z/CHEMICAL-REACTIONS-PROJECT',
  },
  {
    id: 'disaster-sim',
    index: '08',
    title: 'Disaster Management Sim',
    summary:
      'A Q-learning agent allocating beds, water and power across a simulated disaster, written directly against NumPy with no reinforcement-learning framework, and watched live on a Streamlit and Plotly dashboard across four disaster scenarios.',
    stack: ['Python', 'Q-Learning', 'NumPy', 'Streamlit', 'Plotly'],
    github: 'https://github.com/santhosh220z/disaster_management_simulation_using_RL',
  },
];
