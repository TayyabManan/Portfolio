export interface SkillMetadata {
  yearsOfExperience: number;
  proficiencyLevel: "Expert" | "Advanced" | "Proficient" | "Familiar";
  usageFrequency: "Daily" | "Weekly" | "Project-based" | "Occasional";
  projectCount?: number;
}

export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    location: string;
    website: string;
    github: string;
    linkedin: string;
    summary: string;
  };

  skills: {
    category: string;
    items: string[];
    metadata?: Record<string, SkillMetadata>;
  }[];

  experience: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string[];
    technologies: string[];
  }[];

  projects: {
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    urlText?: string;
    github?: string;
    githubText?: string;
    highlights: string[];
  }[];

  education: {
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    achievements?: string[];
  }[];

  certifications: {
    name: string;
    issuer: string;
    date: string;
    credentialUrl?: string;
  }[];

  achievements: {
    title: string;
    description: string;
    date: string;
  }[];
}

export const resumeData: ResumeData = {
  personalInfo: {
    name: "Tayyab Manan",
    title: "AI/ML Engineer",
    email: "m.tayyab.manan@gmail.com",
    location: "Islamabad, Pakistan",
    website: "https://tayyabmanan.com/",
    github: "https://github.com/TayyabManan",
    linkedin: "https://www.linkedin.com/in/tayyabmanan",
    summary:
      "AI/ML engineer working in PyTorch, TensorFlow, and LangChain. Shipped a groundwater model covering 145 districts, multi-agent workflows that save 15+ hours/week, and production ML models that cut processing time by 40%. MS in AI Engineering at COMSATS, AI Developer at Cointegration.",
  },

  skills: [
    {
      category: "Machine Learning & AI",
      items: [
        "PyTorch",
        "TensorFlow",
        "Scikit-learn",
        "LangChain",
        "AutoGen",
        "CrewAI",
      ],
      metadata: {
        PyTorch: {
          yearsOfExperience: 1,
          proficiencyLevel: "Proficient",
          usageFrequency: "Weekly",
          projectCount: 5,
        },
        TensorFlow: {
          yearsOfExperience: 1,
          proficiencyLevel: "Proficient",
          usageFrequency: "Project-based",
          projectCount: 4,
        },
        "Scikit-learn": {
          yearsOfExperience: 1,
          proficiencyLevel: "Advanced",
          usageFrequency: "Weekly",
          projectCount: 6,
        },
        LangChain: {
          yearsOfExperience: 1,
          proficiencyLevel: "Proficient",
          usageFrequency: "Project-based",
          projectCount: 3,
        },
        AutoGen: {
          yearsOfExperience: 1,
          proficiencyLevel: "Familiar",
          usageFrequency: "Occasional",
          projectCount: 2,
        },
        CrewAI: {
          yearsOfExperience: 1,
          proficiencyLevel: "Familiar",
          usageFrequency: "Occasional",
          projectCount: 2,
        },
      },
    },
    {
      category: "Deep Learning & Computer Vision",
      items: [
        "Computer Vision",
        "NLP",
        "Neural Networks",
        "Model Training",
        "Transfer Learning",
        "Spiking Neural Networks",
      ],
      metadata: {
        "Computer Vision": {
          yearsOfExperience: 2,
          proficiencyLevel: "Advanced",
          usageFrequency: "Weekly",
          projectCount: 5,
        },
        NLP: {
          yearsOfExperience: 1,
          proficiencyLevel: "Advanced",
          usageFrequency: "Daily",
          projectCount: 6,
        },
        "Neural Networks": {
          yearsOfExperience: 2,
          proficiencyLevel: "Advanced",
          usageFrequency: "Weekly",
          projectCount: 8,
        },
        "Model Training": {
          yearsOfExperience: 2,
          proficiencyLevel: "Advanced",
          usageFrequency: "Weekly",
          projectCount: 10,
        },
        "Transfer Learning": {
          yearsOfExperience: 1,
          proficiencyLevel: "Proficient",
          usageFrequency: "Project-based",
          projectCount: 4,
        },
        "Spiking Neural Networks": {
          yearsOfExperience: 1,
          proficiencyLevel: "Proficient",
          usageFrequency: "Project-based",
          projectCount: 1,
        },
      },
    },
    {
      category: "MLOps & Deployment",
      items: [
        "Flask APIs",
        "Model Deployment",
        "Docker",
        "CI/CD",
        "Model Context Protocol",
      ],
      metadata: {
        "Flask APIs": {
          yearsOfExperience: 2,
          proficiencyLevel: "Advanced",
          usageFrequency: "Weekly",
          projectCount: 8,
        },
        "Model Deployment": {
          yearsOfExperience: 1,
          proficiencyLevel: "Advanced",
          usageFrequency: "Weekly",
          projectCount: 5,
        },
        Docker: {
          yearsOfExperience: 1,
          proficiencyLevel: "Proficient",
          usageFrequency: "Weekly",
          projectCount: 5,
        },
        "CI/CD": {
          yearsOfExperience: 2,
          proficiencyLevel: "Proficient",
          usageFrequency: "Weekly",
          projectCount: 8,
        },
        "Model Context Protocol": {
          yearsOfExperience: 1,
          proficiencyLevel: "Advanced",
          usageFrequency: "Daily",
          projectCount: 3,
        },
      },
    },
    {
      category: "Programming Languages",
      items: ["Python", "JavaScript", "TypeScript", "SQL", "R"],
      metadata: {
        Python: {
          yearsOfExperience: 4,
          proficiencyLevel: "Expert",
          usageFrequency: "Daily",
          projectCount: 20,
        },
        JavaScript: {
          yearsOfExperience: 3,
          proficiencyLevel: "Advanced",
          usageFrequency: "Daily",
          projectCount: 12,
        },
        TypeScript: {
          yearsOfExperience: 2,
          proficiencyLevel: "Advanced",
          usageFrequency: "Daily",
          projectCount: 8,
        },
        SQL: {
          yearsOfExperience: 3,
          proficiencyLevel: "Advanced",
          usageFrequency: "Weekly",
          projectCount: 10,
        },
        R: {
          yearsOfExperience: 1,
          proficiencyLevel: "Proficient",
          usageFrequency: "Project-based",
          projectCount: 3,
        },
      },
    },
    {
      category: "Data Science & Analysis",
      items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter"],
      metadata: {
        Pandas: {
          yearsOfExperience: 4,
          proficiencyLevel: "Expert",
          usageFrequency: "Daily",
          projectCount: 20,
        },
        NumPy: {
          yearsOfExperience: 4,
          proficiencyLevel: "Expert",
          usageFrequency: "Daily",
          projectCount: 20,
        },
        Matplotlib: {
          yearsOfExperience: 3,
          proficiencyLevel: "Advanced",
          usageFrequency: "Weekly",
          projectCount: 15,
        },
        Seaborn: {
          yearsOfExperience: 2,
          proficiencyLevel: "Advanced",
          usageFrequency: "Weekly",
          projectCount: 10,
        },
        Jupyter: {
          yearsOfExperience: 3,
          proficiencyLevel: "Expert",
          usageFrequency: "Daily",
          projectCount: 15,
        },
      },
    },
    {
      category: "Geospatial AI & Remote Sensing",
      items: ["Google Earth Engine", "QGIS", "ArcGIS", "PostGIS", "GDAL"],
      metadata: {
        "Google Earth Engine": {
          yearsOfExperience: 2,
          proficiencyLevel: "Advanced",
          usageFrequency: "Weekly",
          projectCount: 6,
        },
        QGIS: {
          yearsOfExperience: 4,
          proficiencyLevel: "Advanced",
          usageFrequency: "Weekly",
          projectCount: 12,
        },
        ArcGIS: {
          yearsOfExperience: 3,
          proficiencyLevel: "Advanced",
          usageFrequency: "Project-based",
          projectCount: 10,
        },
        PostGIS: {
          yearsOfExperience: 2,
          proficiencyLevel: "Advanced",
          usageFrequency: "Project-based",
          projectCount: 8,
        },
        GDAL: {
          yearsOfExperience: 2,
          proficiencyLevel: "Proficient",
          usageFrequency: "Project-based",
          projectCount: 6,
        },
      },
    },
    {
      category: "Web Development",
      items: ["React", "Next.js", "Node.js", "Tailwind CSS", "REST APIs"],
      metadata: {
        React: {
          yearsOfExperience: 3,
          proficiencyLevel: "Expert",
          usageFrequency: "Daily",
          projectCount: 12,
        },
        "Next.js": {
          yearsOfExperience: 2,
          proficiencyLevel: "Advanced",
          usageFrequency: "Daily",
          projectCount: 8,
        },
        "Node.js": {
          yearsOfExperience: 2,
          proficiencyLevel: "Advanced",
          usageFrequency: "Weekly",
          projectCount: 10,
        },
        "Tailwind CSS": {
          yearsOfExperience: 2,
          proficiencyLevel: "Advanced",
          usageFrequency: "Daily",
          projectCount: 10,
        },
        "REST APIs": {
          yearsOfExperience: 3,
          proficiencyLevel: "Advanced",
          usageFrequency: "Weekly",
          projectCount: 12,
        },
      },
    },
    {
      category: "Databases & Cloud",
      items: ["PostgreSQL", "SQLite", "Firebase", "Google Cloud", "Vercel"],
      metadata: {
        PostgreSQL: {
          yearsOfExperience: 3,
          proficiencyLevel: "Advanced",
          usageFrequency: "Weekly",
          projectCount: 10,
        },
        SQLite: {
          yearsOfExperience: 2,
          proficiencyLevel: "Advanced",
          usageFrequency: "Project-based",
          projectCount: 8,
        },
        Firebase: {
          yearsOfExperience: 2,
          proficiencyLevel: "Advanced",
          usageFrequency: "Weekly",
          projectCount: 6,
        },
        "Google Cloud": {
          yearsOfExperience: 2,
          proficiencyLevel: "Advanced",
          usageFrequency: "Weekly",
          projectCount: 8,
        },
        Vercel: {
          yearsOfExperience: 2,
          proficiencyLevel: "Advanced",
          usageFrequency: "Weekly",
          projectCount: 10,
        },
      },
    },
    {
      category: "Tools & Methodologies",
      items: ["Git", "Agile", "OpenAI SDK", "Model Optimization"],
      metadata: {
        Git: {
          yearsOfExperience: 4,
          proficiencyLevel: "Expert",
          usageFrequency: "Daily",
          projectCount: 25,
        },
        Agile: {
          yearsOfExperience: 2,
          proficiencyLevel: "Advanced",
          usageFrequency: "Daily",
          projectCount: 10,
        },
        "OpenAI SDK": {
          yearsOfExperience: 1,
          proficiencyLevel: "Advanced",
          usageFrequency: "Daily",
          projectCount: 5,
        },
        "Model Optimization": {
          yearsOfExperience: 2,
          proficiencyLevel: "Advanced",
          usageFrequency: "Weekly",
          projectCount: 8,
        },
      },
    },
  ],

  experience: [
    {
      title: "Junior AI Developer",
      company: "COINTEGRATION",
      location: "Islamabad, Pakistan",
      startDate: "2025-01",
      endDate: "Present",
      current: true,
      description: [
        "Built 5+ production ML models reducing processing time by 40%",
        "Developed multi-agent systems using LangChain and AutoGen with 92% task completion accuracy",
        "Implemented automated workflows with Model Context Protocol, saving 15 hours/week",
      ],
      technologies: [
        "LangChain",
        "OpenAISdk",
        "AutoGen",
        "Model Context Protocol",
        "CrewAI",
      ],
    },
  ],

  projects: [
    {
      name: "MLOps Platform, Bring Your Own Model",
      description:
        "Self-serve MLOps platform on OpenShift turning an unedited notebook or an externally trained model file into a versioned, evaluated, and monitored deployment",
      technologies: [
        "OpenShift",
        "Kubernetes",
        "Argo CD",
        "GitOps",
        "MLflow",
        "Python",
        "Jupyter",
      ],
      highlights: [
        "Built a self-serve platform where an unedited notebook or an externally trained model file becomes a versioned, evaluated and monitored deployment; 23 model versions across 19 models, 9 serving live in production",
        "Eliminated train/serve version skew by executing uploaded code on the serving image itself, contained in a pod with no service-account token, no secrets, and a 30-minute / 4 Gi fence",
        "Gated every serving change behind a reviewed pull request carrying the requester's identity (Argo CD GitOps), with a seeded 20% holdout scored per run, drift alerting, and MLflow mirroring within 2 minutes",
      ],
    },
    {
      name: "Do Spikes Fail Differently? SNN vs ANN Reliability Study",
      description:
        "Matched-pair reliability study of a spiking neural network and its ReLU twin on DVS128Gesture, with a live demo that runs both models on damaged event-camera recordings",
      technologies: [
        "Python",
        "PyTorch",
        "SpikingJelly",
        "NumPy",
        "Modal",
        "FastAPI",
        "Next.js",
      ],
      url: "https://tayyabmanan.com/demo/spikes",
      urlText: "Live Demo",
      github: "https://github.com/TayyabManan/do-spikes-fail-differently",
      githubText: "GitHub",
      highlights: [
        "Held architecture, parameter count, data, seed, loss, and schedule constant and swapped only the neuron model, then measured accuracy, calibration, robustness under four corruptions, temporal sensitivity, and accounting-model energy, with bootstrap 95% CIs on every number (n=288)",
        "Found the spiking model gives up 3.5 accuracy points (McNemar p = 0.021) but ties on calibration (ECE 0.040 vs 0.039), leads by up to 28 points under sensor noise with confidence that tracks its accuracy while the ANN stays up to 34 points overconfident, and costs 18.7x less on the standard energy accounting",
        "Shipped a live demo on Modal (CPU, memory snapshot, scale to zero) behind a keyed proxy in the portfolio, replaying both models frame by frame on 33 held-out recordings with the published curves alongside",
      ],
    },
    {
      name: "Urdu LLM Fine-Tuning",
      description:
        "QLoRA fine-tuning of Qwen 2.5 7B Instruct for natural Urdu, Roman Urdu, and Urdu/English code-mixed chat, with RAG-aware retrieval over Urdu Wikipedia",
      technologies: [
        "Python",
        "PyTorch",
        "Unsloth",
        "QLoRA / PEFT",
        "Hugging Face",
        "Modal",
        "Gradio",
        "Haystack",
        "Qdrant",
      ],
      url: "https://huggingface.co/spaces/TayyabManan/urdu-llm-chat",
      urlText: "Live Demo",
      github: "https://github.com/TayyabManan/Urdu-LLM",
      githubText: "GitHub",
      highlights: [
        "Fine-tuned Qwen 2.5 7B with QLoRA (154 MB adapter, 0.82% of parameters, 8.56 GB peak VRAM) across three versions, built end-to-end for under $60",
        "Achieved 79.5% pairwise win rate over the base model across two independent LLM judges on a 100-prompt evaluation set, recovering every regression from the prior version",
        "Ran a data-centric iteration loop that lifted code-mixed task win rate from 0% to 80% and made retrieval deployable, cutting the base model's Chinese-fallback on Urdu context from 45/100 to 0",
      ],
    },
    {
      name: "US Visa Approval Prediction",
      description:
        "ML system predicting PERM labor certification outcomes with SHAP explainability",
      technologies: [
        "Python",
        "Scikit-learn",
        "XGBoost",
        "LightGBM",
        "CatBoost",
        "SHAP",
        "FastAPI",
        "Docker",
      ],
      url: "https://huggingface.co/spaces/TayyabManan/visa_prediction",
      urlText: "Live Demo",
      github: "https://github.com/TayyabManan/US-Visa-Prediction",
      githubText: "GitHub",
      highlights: [
        "Built threshold-tuned Gradient Boosting classifier achieving 73.2% accuracy with 61% denied recall on 25K PERM records",
        "Implemented SHAP TreeExplainer with feature mapping to provide per-prediction explanations across 10 input features",
        "Designed 5-stage modular MLOps pipeline (ingestion, validation, transformation, training, evaluation) with model promotion gating",
      ],
    },
    {
      name: "Face Expression Detection",
      description:
        "Deep learning system for facial expression recognition in group photos using ensemble models",
      technologies: [
        "PyTorch",
        "Flask",
        "MTCNN",
        "ResNet-18",
        "OpenCV",
        "Docker",
        "Hugging Face",
      ],
      url: "https://huggingface.co/spaces/TayyabManan/face-expression-detection",
      urlText: "Live Demo",
      github: "https://github.com/TayyabManan/Face-Expression-Detection",
      githubText: "GitHub",
      highlights: [
        "Built emotion classification model achieving 80% accuracy on RAF-DB dataset across 7 emotion classes",
        "Implemented ensemble learning combining ResNet-18 and EfficientNet-B2 to handle severe class imbalance",
        "Deployed Flask web application with MTCNN face detection on Hugging Face Spaces using Docker",
      ],
    },
    {
      name: "Wheat Yield Prediction using Machine Learning",
      description:
        "ML regression model for agricultural yield forecasting using satellite imagery and climate data",
      technologies: [
        "Scikit-learn",
        "Python",
        "NumPy",
        "Pandas",
        "Google Earth Engine",
        "Feature Engineering",
      ],
      url: "https://drive.google.com/drive/folders/1mccSUwvL9DRoHLEP0CiiKqybhka_rf2k?usp=sharing",
      urlText: "View Project",
      github: "https://github.com/TayyabManan",
      githubText: "GitHub",
      highlights: [
        "Built supervised ML model achieving 0.137 t/ha prediction error on test set",
        "Engineered features from multi-spectral satellite imagery and climate variables using Google Earth Engine",
        "Tuned hyperparameters under cross-validation",
      ],
    },
    {
      name: "TeacherRank",
      description:
        "Teacher rating and review platform for educational institutions",
      technologies: [
        "React",
        "TypeScript",
        "Supabase",
        "TanStack Query",
        "Tailwind CSS",
        "Vite",
      ],
      url: "https://teacherrank.vercel.app",
      urlText: "Live Demo",
      github: "https://github.com/TayyabManan/TeacherRank",
      githubText: "GitHub",
      highlights: [
        "Built full-stack web application with REST APIs for real-time data synchronization",
        "Achieved 60% bundle size reduction through code splitting and lazy loading optimizations",
      ],
    },
    {
      name: "WaterTrace Pakistan",
      description:
        "Geospatial AI system analyzing 22 years of satellite data for groundwater prediction (2002-2024)",
      technologies: [
        "Scikit-learn",
        "Flask",
        "Google Earth Engine",
        "React",
        "GRACE/GLDAS",
      ],
      url: "https://watertrace.vercel.app",
      urlText: "Live Demo",
      github: "https://github.com/TayyabManan/WaterTrace",
      githubText: "GitHub",
      highlights: [
        "Developed ML regression models achieving R²=0.89 for groundwater level predictions across 145 districts",
        "Deployed Flask REST API serving ML models with real-time GRACE satellite data processing",
        "Engineered feature extraction pipeline processing 22 years of geospatial time-series data",
      ],
    },
    {
      name: "EV Suitability Analysis - Geospatial AI",
      description:
        "ML-driven spatial optimization for Electric Vehicle infrastructure planning",
      technologies: [
        "Python",
        "Scikit-learn",
        "QGIS",
        "ArcGIS",
        "OpenStreetMap",
        "Multi-criteria Analysis",
      ],
      url: "https://ev-analysis.netlify.app/",
      urlText: "Live Demo",
      github: "https://github.com/TayyabManan/ev-suitability-analysis",
      githubText: "GitHub",
      highlights: [
        "Implemented weighted scoring algorithm processing demographic, economic, and infrastructure layers for 5 tehsils",
        "Ranked candidate sites with multi-criteria decision analysis to a 90%+ coverage target",
      ],
    },
  ],

  education: [
    {
      degree: "Masters in Artificial Intelligence Engineering",
      institution: "COMSATS",
      location: "Islamabad, Pakistan",
      startDate: "2025",
      endDate: "Present (Expected 2027)",
      gpa: "",
      achievements: [
      ],
    },
    {
      degree: "Bachelor of Science in Geographic Information Science",
      institution: "University of the Punjab",
      location: "Lahore, Pakistan",
      startDate: "2021",
      endDate: "2025",
      gpa: "",
      achievements: [
        "Quantitative coursework in remote sensing, spatial statistics, and Python-based satellite-data modeling",
      ],
    },
  ],

  certifications: [
    {
      name: "Registered Scrum Basics",
      issuer: "Scrum Inc.",
      date: "2026-03-01",
      credentialUrl: "",
    },
    {
      name: "Artificial Intelligence Training (Machine Learning and Deep Learning)",
      issuer: "AISkill Bridge",
      date: "2026-02-01",
      credentialUrl: "",
    },
    {
      name: "AI Training",
      issuer: "Samsung Innovation Campus",
      date: "2026-01-01",
      credentialUrl: "",
    },
    {
      name: "Exploring AI-Based Research Tools",
      issuer: "GIS Center, Punjab University",
      date: "2024-05-01",
      credentialUrl: "",
    },
    {
      name: "Cartography",
      issuer: "ESRI",
      date: "2024-03-01",
      credentialUrl:
        "https://www.esri.com/training/TrainingRecord/Certificate/Tayyab_Manan/6219dc60e7d51b251885afd3/-300",
    },
    {
      name: "Spatial Data Science",
      issuer: "ESRI",
      date: "2023-11-01",
      credentialUrl:
        "https://www.esri.com/training/TrainingRecord/Certificate/Tayyab_Manan/621b1dcce7d51b25188d2e6f/-300",
    },
    {
      name: "Shade Equity",
      issuer: "ESRI",
      date: "2023-06-01",
      credentialUrl:
        "https://www.esri.com/training/TrainingRecord/Certificate/Tayyab_Manan/662601921e716c28210c9098/-300",
    },
  ],

  achievements: [],
};

// Function to get formatted date
export function formatDate(dateString: string): string {
  if (dateString === "Present") return "Present";

  const date = new Date(dateString);

  // Check if date is invalid (for iOS Safari compatibility)
  if (isNaN(date.getTime())) {
    // If the date string is already in a readable format, return it as is
    // This handles cases like "September 2024" on iOS
    return dateString;
  }

  // Format in UTC: "YYYY-MM" strings parse as UTC midnight, so formatting in the
  // viewer's local timezone would shift the month backward west of UTC (e.g.
  // "2023-01" -> "Dec 2022" for US viewers). Pin to UTC to keep the intended month.
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}
