---
slug: "us-visa-prediction"
title: "US Visa Approval Prediction"
subtitle: "ML-Powered PERM Certification Predictor with SHAP Explainability"
description: "Machine learning system that predicts US PERM labor certification outcomes and explains why using SHAP. Features a 5-stage MLOps pipeline, GridSearchCV across 5 boosting models, threshold-tuned Gradient Boosting, and a FastAPI backend with per-prediction explainability."
category: "Machine Learning & MLOps"
techStack: ["Python", "Scikit-learn", "XGBoost", "LightGBM", "CatBoost", "SHAP", "FastAPI", "Docker"]
image: "/projects/us-visa-prediction.webp"
demoUrl: "https://huggingface.co/spaces/TayyabManan/visa_prediction"
githubUrl: "https://github.com/TayyabManan/US-Visa-Prediction"
featured: true
date: "2026-04-05"
---

# US Visa Approval Prediction System

## Overview
When a U.S. employer wants to hire a foreign worker permanently, they file a PERM labor certification with the Department of Labor. The process is opaque, takes 6-18 months, and costs $5,000-$15,000 in legal fees. A denial means starting over.

This system predicts whether a PERM application will be certified or denied, and explains *why*, so applicants and attorneys can evaluate case strength before they file. Built following the CRISP-DM methodology with a modular MLOps pipeline.

**[Read the full technical deep-dive →](/blog/building-us-visa-prediction)**

## Key Features
- **Outcome Prediction**: Gradient Boosting classifier predicting PERM certification or denial with 73.2% accuracy
- **SHAP Explainability**: Per-prediction explanations showing which factors help and hurt each application, with strengths, weaknesses, and suggestions
- **Threshold-Tuned Classification**: Custom decision threshold (0.37) that trades 1.5% accuracy for +11% denied recall, optimized for an advisory tool
- **5-Stage Training Pipeline**: Modular components for ingestion, validation (KS drift detection), transformation, training (GridSearchCV across 5 models), and evaluation (gated promotion)
- **Confidence Scoring**: Calibrated probability output with high/moderate/low confidence bands
- **Rule-Based Fallback**: Heuristic explanations when SHAP hits edge cases, so every prediction gets an explanation

## Technical Architecture
The system uses a modular component architecture where each pipeline stage produces artifact dataclasses consumed by the next. The training pipeline evaluates Random Forest, Gradient Boosting, XGBoost, LightGBM, and CatBoost via GridSearchCV with 5-fold cross-validation, followed by stacking ensemble and threshold tuning. The final model is promoted only if it beats the existing model's F1 by a configurable threshold.

Preprocessing uses a scikit-learn ColumnTransformer with ordinal encoding for ordered features, one-hot encoding for nominal features, and Yeo-Johnson power transforms for skewed numerics. The entire pipeline (preprocessor + model) is serialized together for consistent inference.

## Model Performance

| Metric | Value |
|--------|-------|
| Overall accuracy | 73.2% (vs 66.8% naive baseline) |
| Denied recall | 61.4% |
| Denied F1 | 60.4% |
| Certified recall | 79.1% |
| Optimal threshold | 0.37 |

The model catches 61.4% of actual denials while maintaining reasonable overall accuracy. For cases it flags as at-risk, SHAP explanations point to the specific factors behind the prediction.

## Explainability with SHAP
Every prediction comes with SHAP-powered explanations mapped back to the original 10 input features. Negative SHAP values indicate factors pushing toward certification (strengths), positive values push toward denial (weaknesses). The system aggregates one-hot encoded SHAP values back to their original feature names so the output is actually readable.

## Design Decisions
- **Tree-based models over deep learning**: 25K records is too small for neural networks to shine. Trees consistently outperform on tabular data at this scale and allow exact SHAP explanations.
- **Natural distribution + threshold tuning over SMOTEENN**: Synthetic resampling degraded generalization. Training on real data with post-hoc threshold adjustment gave cleaner learning signals.
- **Accuracy + denied recall constraint over F1**: Optimizing F1 alone led to over-predicting denials. The constraint approach produces better-calibrated predictions for an advisory tool.
- **FastAPI over Flask**: Async request handling, automatic Pydantic validation, and built-in OpenAPI docs with less boilerplate.

## What I Learned

### ML Engineering
- **Threshold tuning** turned out to be the most effective lever for improving minority class recall without introducing resampling artifacts. Shifting the decision boundary post-training is simple and it works.
- **SHAP on transformed features** required building a mapping system to aggregate one-hot encoded SHAP values back to original feature names. Without this, the explanations are useless to anyone who isn't staring at the preprocessing code.
- **Pipeline modularity** paid off during iteration. Each component (ingestion, validation, transformation, training, evaluation) has its own config/artifact interface, so I could debug and swap parts independently.

### Practical Insights
- **SMOTEENN looked great in cross-validation but degraded test performance.** This was my clearest lesson in the gap between training metrics and deployment reality.
- **Automated model evaluation gates** that compare against the existing production model prevent regressions during retraining. Worth setting up early.
- **The 2:1 class imbalance was moderate enough** that native class weighting (LightGBM, CatBoost) and threshold tuning outperformed external resampling. Not every imbalanced dataset needs SMOTE.

### Deployment
- **Docker + Hugging Face Spaces** gives you containerized deployment on free infrastructure. No cloud costs for a demo.
- **Model caching** (loading once at startup, serving via class-level cache) eliminates repeated deserialization overhead. Simple fix, big difference.

## Future Improvements
Probability calibration with Platt scaling would give better-calibrated confidence scores. Feature expansion with SOC codes, NAICS industry codes, and wage ratios could improve accuracy. Temporal weighting would help capture evolving DOL decision patterns. Automated SHAP-based fairness auditing across model versions would catch bias drift. And scheduled retraining triggered by quarterly DOL data releases would keep the model current.