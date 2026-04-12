---
slug: "ev-analysis"
title: "EV Suitability Analysis"
subtitle: "Geospatial Analysis for EV Infrastructure Planning"
description: "Multi-criteria spatial optimization for EV charging station site selection in Lahore using weighted scoring algorithms, demographic analysis, and geospatial data to find the best locations for charging infrastructure."
category: "Geospatial AI"
techStack: ["Python", "QGIS", "ArcGIS", "Open Street Map", "Demographic Data"]
image: "/projects/ev-analysis.webp"
demoUrl: "https://ev-analysis.netlify.app/"
githubUrl: "https://github.com/TayyabManan/ev-suitability-analysis"
featured: true
date: "2024-11-20"
---

# Electric Vehicle Suitability Analysis

## Overview
A geospatial project for figuring out where to put EV charging stations in Lahore. The system combines demographic data, economic indicators, infrastructure networks, and spatial analysis to score and rank potential sites across Lahore's 5 tehsils using multi-criteria decision analysis and weighted scoring.

## Key Features
- **Site Selection Algorithm**: Multi-criteria optimization for EV charging station placement across Lahore's 5 tehsils
- **Weighted Scoring Model**: Scoring algorithm that integrates demographic, accessibility, and growth factors with tunable weights (population 30%, growth 20%, accessibility 25%, infrastructure 15%, economic 10%)
- **Interactive Maps**: Dynamic geospatial visualizations showing suitability scores and ranked results
- **Reproducible Pipeline**: Python-based analysis pipeline that can be rerun with updated data
- **Results**: 5 priority sites identified and ranked, 3-phase deployment strategy, 90%+ coverage target
- **Multi-Source Data**: 2023 Pakistan Census, OpenStreetMap, administrative boundaries

## Technical Architecture
Python-based geospatial pipeline using GeoPandas and Shapely for spatial operations, NumPy for numerical computation, and Folium for interactive map visualizations. OpenStreetMap Overpass API pulls infrastructure data. The core algorithm is a multi-criteria decision analysis (MCDA) with weighted linear combination for site scoring. The frontend is HTML/JavaScript for exploring the ranked results. CSV/JSON data interchange keeps the analysis reproducible.

## Environmental Impact

| Impact Area | How |
|-------------|-----|
| Air Quality | Site selection targets areas where EV adoption would reduce the most vehicle emissions |
| Greenhouse Gas Reduction | Coverage optimization aims for maximum carbon offset per station |
| Noise Pollution | Placement prioritizes high-traffic areas where EVs would reduce noise |
| Urban Planning | Analysis accounts for green infrastructure and urban heat considerations |

## Data Sources

| Source | Description |
|--------|-------------|
| OpenStreetMap | Freely available geospatial data |
| Census Data | Demographic data from the 2023 Pakistan Census |

## What I Learned

### Technical Skills
Working with multiple GIS platforms (QGIS, ArcGIS) taught me their different strengths for spatial analysis tasks. Implementing the MCDA algorithm was where I learned the most about balancing competing priorities in site selection. I got comfortable with the OpenStreetMap Overpass API for extracting real-world infrastructure data, and with GeoPandas and Shapely for geometric operations and spatial joins. Folium turned out to be a good fit for communicating spatial results to people who don't work with GIS.

### Problem-Solving
The hardest part was weight optimization: finding the right balance between demographic, accessibility, and infrastructure factors. There's no objectively correct answer, which made it interesting. Combining census data, OSM data, and administrative boundaries with different coordinate reference systems was a recurring headache. I also had to develop ways to validate the algorithmically-generated recommendations against real-world feasibility, things like whether a site actually has available land or grid capacity. The pipeline is designed to be reproducible and applicable to other cities with minimal changes.

### Domain Knowledge
I came into this thinking it was mostly a technical problem, but urban infrastructure planning has layers I didn't expect. Accessibility and equity matter as much as optimization scores. EV adoption barriers go beyond charging availability. And the gap between what an algorithm recommends and what's actually buildable is real. Understanding how this kind of analysis can inform government investment decisions gave the project more weight than a pure technical exercise.

### Key Insights
Geospatial analysis lives and dies by coordinate reference systems and data quality. Multi-criteria optimization always involves tradeoffs that benefit from domain expertise, not just parameter tuning. Visualization matters more than I initially thought for communicating spatial results to non-technical audiences. And real-world constraints (land availability, grid capacity) can override what the algorithm thinks is optimal.

## Future Development
The next steps include deep learning for demand prediction, scaling the pipeline to other Pakistani cities, and integrating real-time traffic data for dynamic optimization. I'd also like to add economic feasibility modeling for ROI estimates, energy grid capacity analysis for load balancing, and satellite imagery analysis for automated site validation.