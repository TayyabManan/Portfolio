---
slug: "building-us-visa-prediction"
title: "Building a US Visa Prediction System: From EDA to Deployment"
description: "A deep technical dive into building an ML system that predicts PERM labor certification outcomes, covering EDA on 25K records, model selection across 5 boosting algorithms, threshold tuning for class imbalance, SHAP explainability, and deployment on Hugging Face Spaces."
date: "2026-04-05"
author: "Tayyab Manan"
category: "Machine Learning"
tags: ["Machine Learning", "Classification", "SHAP", "XGBoost", "FastAPI", "MLOps", "Explainable AI"]
image: "/projects/us-visa-prediction.webp"
readTime: "15 min read"
---

# Building a US Visa Prediction System: From EDA to Deployment

This post is the technical deep-dive behind the [US Visa Approval Prediction](/projects/us-visa-prediction) project. I'll walk through the full CRISP-DM pipeline, from understanding the problem through EDA and model selection, to SHAP explainability and Docker deployment.

## The Problem: PERM is Opaque and Expensive

When a U.S. employer wants to permanently hire a foreign worker, they file a PERM (Program Electronic Review Management) labor certification with the Department of Labor. The DOL either certifies or denies each case. The process takes 6-18 months, costs $5,000-$15,000 in legal fees, and a denial means starting over.

The frustrating part is that applicants and immigration attorneys have limited visibility into which factors actually drive outcomes. I wanted to build a system that predicts the outcome and, more importantly, explains *why*, so applicants can get a read on their chances before they file.

## Dataset: EasyVisa PERM Records

I used the EasyVisa dataset: 25,480 historical PERM records with 10 usable features and a binary target (`case_status`: Certified or Denied).

The class distribution is 66.8% Certified (17,021) vs 33.2% Denied (8,459), a 2:1 imbalance. This matters because a naive classifier that predicts "Certified" for every case gets 66.8% accuracy while catching zero denials.

### Feature Overview

The features capture information about the applicant, the employer, and the position:

- **Applicant features**: `continent` (origin), `education_of_employee` (highest degree), `has_job_experience` (Y/N)
- **Employer features**: `no_of_employees` (company size), `yr_of_estab` (transformed to `company_age`)
- **Position features**: `prevailing_wage`, `unit_of_wage`, `region_of_employment`, `full_time_position`, `requires_job_training`

I dropped `case_id` (no predictive value) and replaced `yr_of_estab` with `company_age`, a relative measure that doesn't go stale over time.

## Exploratory Data Analysis

### Class Imbalance

The 2:1 imbalance ruled out accuracy as the only metric. I needed something that penalizes missing denials. This led to the "accuracy with denied recall constraint" approach I'll get into in the modeling section.

### Feature Patterns

EDA turned up several patterns in the data.

**Education** has a clear ordinal relationship with approval: Doctorate holders get certified most often, High School the least. Makes sense, since PERM is designed for specialized skill positions. **Job experience** also correlates with certification, presumably because prior experience signals the worker already has the claimed skills.

On the flip side, **requiring job training** correlates with higher denial rates. If the applicant needs training, DOL is going to question whether they actually meet the requirements. **Prevailing wage** shows a positive correlation with certification too. High-wage positions tend to be specialized roles where qualified U.S. workers are harder to find.

**Company size** has a slight positive correlation. Larger employers probably have more established HR and legal processes for PERM filings, though the effect is small.

### Numeric Feature Distributions

`no_of_employees` and `company_age` are both heavily right-skewed, which motivated power transformation in preprocessing. `prevailing_wage` varies wildly by `unit_of_wage`: a $35/hour wage and $72,800/year are the same thing, but the raw numbers differ by 2,000x. The model handles this by seeing both features together.

No missing values in the dataset. All 25,480 records are complete.

## Data Preprocessing

### Encoding Strategy

Different encoding strategies matched feature semantics:

- **Ordinal Encoding** for `education_of_employee`, `has_job_experience`, `requires_job_training`, `full_time_position` (natural ordering or binary values)
- **One-Hot Encoding** for `continent`, `unit_of_wage`, `region_of_employment` (nominal features, no inherent order)
- **Power Transform** (Yeo-Johnson) for `no_of_employees`, `company_age` (normalizes the heavy right-skew)
- **Passthrough** for `prevailing_wage` (already well-distributed for tree models)

The preprocessing is a scikit-learn `ColumnTransformer` serialized alongside the model, so transforms at inference are identical to training.

### Modular Pipeline Architecture

Each stage is an independent component under `visa_approval_prediction/components/`:

1. **DataIngestion**: Reads CSV, engineers `company_age`, drops unused columns, performs stratified train/test split
2. **DataValidation**: Validates column presence against a schema, runs Kolmogorov-Smirnov drift detection between train and test sets
3. **DataTransformation**: Builds and fits the ColumnTransformer on training data only (prevents leakage), saves transformed arrays

Each component receives a config object with paths and parameters, runs its logic, and returns an artifact object describing outputs. I can test, debug, or replace each stage independently, which saved me a lot of time during iteration.

## Model Training

### Handling Class Imbalance: Why Not SMOTEENN?

I tested SMOTEENN early on. It synthesizes minority samples and cleans noisy boundary samples. The results were disappointing: cross-validation scores looked inflated, but the gains didn't hold on the test set. The models were overfitting to synthetic samples near the decision boundary.

What worked better was training on the natural distribution and adjusting the decision threshold after training. This gives models a cleaner learning signal that reflects real-world class proportions. LightGBM and CatBoost also handle imbalance internally through native class weighting.

### Metric Selection: Accuracy + Denied Recall Constraint

I initially optimized F1, but this led to models that over-predicted denials: high recall at the cost of too many false alarms. The final approach:

- **Primary metric: Accuracy**, used in GridSearchCV. Most interpretable metric for stakeholders.
- **Constraint: Denied recall >= 60%**, applied through post-training threshold tuning. This ensures the model is actually useful for identifying at-risk applications.

For an advisory tool (not a decision system), this balance works. Users see confidence scores and SHAP explanations, so a false alarm with low confidence is easy to dismiss.

### Model Comparison

Five models were evaluated via GridSearchCV with 5-fold cross-validation:

| Model | Test Accuracy | Denied Recall | Denied F1 |
|-------|--------------|---------------|-----------|
| Random Forest | 73.8% | 48.1% | 55.0% |
| Gradient Boosting | 74.7% | 50.4% | 56.9% |
| XGBoost | 74.6% | 50.2% | 56.7% |
| LightGBM | 73.1% | 58.7% | 59.2% |
| CatBoost | 72.2% | 61.5% | 59.5% |
| Stacking (top 3) | 74.6% | 51.3% | 57.2% |
| **GBM + Threshold (0.37)** | **73.2%** | **61.4%** | **60.4%** |

Gradient Boosting had the highest individual accuracy (74.7%) but only 50.4% denied recall at the default 0.5 threshold. CatBoost got the best native denied recall (61.5%) through its built-in class weighting, but at lower accuracy. Stacking the top 3 models (RF, GBM, XGB) didn't help, which I probably should have expected since they're too architecturally similar to gain much from ensembling.

The winner was **threshold tuning** on Gradient Boosting (0.50 to 0.37), which traded 1.5% accuracy for +11% denied recall. Best tradeoff I found.

### Threshold Tuning

I swept the decision threshold from 0.30 to 0.70, plotting accuracy, denied recall, and F1 at each point. At 0.37, the model meets the 60% denied recall constraint with the highest possible accuracy.

The final model is wrapped in a `ThresholdClassifier` that applies this transparently. The rest of the pipeline sees a standard `predict()` / `predict_proba()` interface.

### Confusion Matrix Breakdown

On the test set (5,096 samples):

- **2,693 True Negatives**: Certified cases correctly predicted. 79.1% of certified applications identified correctly.
- **1,038 True Positives**: Denied cases caught. 61.4% detection rate.
- **711 False Positives**: Certified cases wrongly flagged as at-risk. That's a 20.9% false alarm rate, but confidence scores and SHAP explanations help users evaluate these.
- **654 False Negatives**: Denied cases missed. 38.6% miss rate. This is why I keep saying the tool is a risk indicator, not a definitive predictor.

## SHAP Explainability

A prediction by itself isn't very useful. Applicants need to know *why*: which factors helped, which hurt, and what they might change.

### TreeExplainer

I used SHAP's `TreeExplainer`, a fast, exact algorithm for tree-based models. For each prediction, SHAP computes a value for every feature showing how much it pushed the prediction toward Certified or Denied relative to the average case.

### The Feature Mapping Challenge

The preprocessing pipeline transforms 10 raw features into about 20 encoded features (because of one-hot encoding). SHAP operates on these transformed features. I built a mapping (`_build_feature_mapping` in `shap_explainer.py`) that aggregates encoded SHAP values back to original feature names. So the 6 one-hot columns for `continent` get summed into a single "continent" SHAP value.

This was trickier than I expected. Papers make SHAP look like a drop-in, but the gap between "here's a SHAP bar chart" and "here's an explanation a person can actually read" is nontrivial.

### Interpretation

- **Negative SHAP** = pushes toward Certified (strength)
- **Positive SHAP** = pushes toward Denied (weakness)
- Magnitude: >1.0 is strong, 0.3-1.0 is moderate, <0.3 is slight

### Rule-Based Fallback

SHAP can occasionally fail on edge cases. I added a rule-based fallback that provides heuristic explanations based on known data patterns: education thresholds, wage benchmarks, company size breakpoints. Every prediction gets an explanation, even if SHAP chokes.

## Deployment

### Architecture

The system uses FastAPI with Uvicorn for the backend, Jinja2 templates for the prediction UI, and Docker for containerized deployment on Hugging Face Spaces.

**Why FastAPI over Flask?** Async-native request handling means one slow SHAP computation doesn't block the whole server. Pydantic models validate incoming JSON automatically. And you get free OpenAPI docs at `/docs` for testing.

### Model Serving

The model loads once through a `visaModel` wrapper (preprocessing + classifier) and is cached as a class variable. The SHAP explainer is similarly cached after first use. No repeated deserialization overhead.

### Training Pipeline

The full pipeline runs 5 stages in sequence:

```
DataIngestion → DataValidation → DataTransformation → ModelTrainer → ModelEvaluation
```

Each stage produces timestamped artifacts under `artifact/<timestamp>/`. The `ModelEvaluation` stage compares the new model against the existing production model and only promotes it if F1 improves by at least 0.07. This prevents regressions during retraining.

## Ethical Considerations

### Continent as a Feature

The model uses `continent` (applicant's origin) as input, which is effectively a proxy for nationality. I went back and forth on this.

I kept it in because removing it would reduce accuracy without actually eliminating bias. Other features like education and wage partially encode the same information anyway. Instead, I leaned on transparency: SHAP explanations explicitly surface when continent influences a prediction, so users can evaluate the reasoning rather than accepting it at face value.

Worth saying directly: the model reflects historical DOL patterns, which may contain systemic biases. It should not be used as a decision-making tool, only as an informational aid.

### Other Considerations

The UI explicitly states this is informational, not legal advice. I hosted the tool for free to avoid creating information asymmetry. Feedback loops are worth watching though: if attorneys selectively file "likely certified" cases, the training data could reinforce existing biases over time.

## Design Decisions Summary

| Decision | Chosen | Alternative | Why |
|----------|--------|-------------|-----|
| Model family | Tree-based (GBM) | Deep learning | 25K records too small for NNs; exact SHAP explanations |
| Imbalance handling | Natural distribution + threshold | SMOTEENN | Resampling degraded generalization |
| Primary metric | Accuracy + recall constraint | F1 | F1 alone caused over-prediction of denials |
| Backend | FastAPI | Flask | Async, Pydantic validation, less boilerplate |
| Deployment | Docker + HF Spaces | AWS | Free hosting, simpler for demo purposes |

## What I Learned

**Class imbalance doesn't always need resampling.** SMOTEENN looked great in cross-validation but fell apart on held-out data. The simpler approach, training on real data and adjusting the threshold, worked better in practice. I spent a lot of time on SMOTEENN before accepting this.

Building the SHAP feature mapping taught me how messy explainability gets once you leave the notebook. The gap between a SHAP summary plot and an explanation a user can act on is mostly engineering, not research.

The modular pipeline design paid for itself during iteration. When I needed to swap encoding strategies or add drift detection, I could modify one component without touching anything else. Config/artifact interfaces kept the boundaries clean.

## Links

- [Live Demo](https://huggingface.co/spaces/TayyabManan/visa_prediction)
- [Source Code](https://github.com/TayyabManan/US-Visa-Prediction)
- [Project Page](/projects/us-visa-prediction)