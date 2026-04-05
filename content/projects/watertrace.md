---
slug: "watertrace"
title: "WaterTrace Pakistan"
subtitle: "Groundwater Prediction Using Satellite Data and ML"
description: "Machine learning system for groundwater monitoring and prediction in Pakistan, built on 22 years of satellite data (2002-2024) from GRACE and GLDAS. Features time-series forecasting with Gradient Boosting (R²=0.89), interactive district-level maps, and a Flask API for predictions."
category: "Geospatial AI & Predictive Analytics"
techStack: ["React", "Flask", "Pandas", "Scikit-learn", "Google Earth Engine", "Leaflet", "Recharts", "Tailwind CSS"]
image: "/projects/watertrace.webp"
demoUrl: "https://watertrace.vercel.app"
githubUrl: "https://github.com/TayyabManan/WaterTrace"
featured: true
date: "2025-01-09"
---

# WaterTrace Pakistan

## Overview
WaterTrace is a machine learning system for predicting and monitoring groundwater levels across Pakistan. It processes 22 years of satellite data from NASA's GRACE mission (2002-2017) and GLDAS land surface models (2018-2024) to forecast groundwater depletion patterns across all 145 districts. The model achieves R²=0.89, and the results are served through an interactive web dashboard with district-level maps and time-series charts.

**[Read the full technical deep-dive →](/blog/building-watertrace)**

## Key Features
- **Satellite Data Integration**: Combines GRACE gravity anomaly data and GLDAS soil moisture measurements across 22 years
- **District-Level Predictions**: Forecasts for all 145 districts of Pakistan with confidence intervals
- **Interactive Visualizations**: Time-series charts showing 22-year groundwater trends with data source indicators
- **Time-Series Forecasting**: Gradient Boosting model (R² = 0.89) for 6-month ahead predictions
- **Responsive Dashboard**: Mobile-optimized interface for browsing predictions and maps
- **RESTful API**: Endpoints for predictions and data access

## Technical Stack
The frontend uses React 18 with Recharts for time-series visualization. Flask serves the ML API backend. Pandas and NumPy handle feature engineering and data processing. Google Earth Engine provides access to satellite datasets, and Scikit-learn runs the regression modeling, cross-validation, and hyperparameter tuning. District maps with depletion overlays are rendered using Leaflet. Tailwind CSS handles the responsive layout.

## Satellite Data Sources

| Source | Details |
|--------|---------|
| GRACE Satellites (2002-2017) | Direct groundwater measurements via gravity anomalies |
| GLDAS V021 (2018-2024) | Deep soil moisture (100-200cm) as groundwater proxy |
| Temporal Resolution | Monthly aggregated data points |
| Spatial Coverage | All of Pakistan with district-level aggregation |
| Data Volume | 163 GRACE observations + 72 GLDAS measurements |

## Key Findings

| Metric | Value |
|--------|-------|
| Total groundwater loss (2002-2017) | 13.71 cm |
| Average depletion rate | 0.81 cm/year (p-value < 0.001) |
| Worst-hit areas | Quetta (-15.3 cm), Lahore (-12.5 cm), Punjab belt |
| Recent trend (GLDAS era) | +1.5 kg/m²/year improvement in some regions |
| Districts in critical stress | 15+ |

## Dashboard Features

| Feature | Description |
|---------|-------------|
| Time Series View | 22-year timeline with GRACE/GLDAS/prediction source indicators |
| District Map | Color-coded by groundwater stress level |
| Trend Analysis | Linear regression and seasonal decomposition |
| Statistics Panel | Depletion rates, rankings, and summary metrics |
| Data Export | Download for use in GIS software or further analysis |

## ML Pipeline

| Component | Details |
|-----------|---------|
| Feature Engineering | Lag features (1-12 months), seasonal sine/cosine transforms, rolling means, spatial features, trend coefficients |
| Models Compared | Linear Regression (R²=0.71), Random Forest (R²=0.84), Gradient Boosting (R²=0.89) |
| Validation | Time-series cross-validation (5 splits, chronological) to prevent leakage |
| Performance | RMSE = 0.67 cm, MAE = 0.52 cm, R² = 0.89 |
| Prediction Horizon | 6 months ahead with confidence intervals |
| Interpretability | SHAP values for feature importance |

## What I Learned

### Technical Skills
Processing and merging 22 years of satellite data from two different sources (GRACE and GLDAS) with different formats and temporal coverage was the first real challenge. I got comfortable with the Google Earth Engine API for large-scale geospatial processing, which meant learning to work with data without downloading it locally. Time-series forecasting taught me about seasonality, trend decomposition, and why temporal cross-validation matters (random splits leak future information). Building the full stack from React frontend to Flask API to the ML model gave me a better sense of how these pieces fit together in practice.

### Problem-Solving
The hardest problems were data problems. Merging GRACE with GLDAS proxy data while keeping predictions accurate required correlation analysis and calibration. Aggregating pixel-level satellite data to irregular district boundaries was fiddly. Model performance went from R² of 0.65 to 0.89 mostly through feature engineering (seasonal features and lag variables), not architecture changes. And optimizing the pipeline to handle 145 districts across 235 monthly observations without being painfully slow took some work.

### Domain Knowledge
I came in knowing ML but not hydrology. Working on this taught me about Pakistan's water crisis, how monsoon cycles drive groundwater recharge, and how infrastructure decisions affect depletion. Learning to translate model outputs into something useful for non-technical audiences (confidence intervals instead of point estimates, maps instead of tables) changed how I think about ML deployment. And building a system that could influence policy decisions made me more careful about communicating uncertainty.

### Key Takeaways
Starting with exploratory data analysis saved me weeks of debugging later. Real-world data is messy, and spending most of my time on data cleaning turned out to be normal, not a sign I was doing something wrong. Domain knowledge (monsoon seasonality, irrigation cycles) improved the model more than any algorithm swap. And iterative development with user feedback consistently led to better priorities than my initial assumptions.

## Future Development
Next steps include integrating GRACE Follow-On (GRACE-FO) data for direct measurements beyond 2018, experimenting with LSTM and Transformer architectures for multi-step forecasting, and adding real-time climate data (temperature, rainfall) as additional model inputs. I'd also like to build a district-level alert system for sudden depletion events and set up an MLOps pipeline for automated retraining as new satellite data becomes available.