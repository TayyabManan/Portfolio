---
slug: "building-watertrace"
title: "Building WaterTrace: ML-Powered Groundwater Prediction Using 22 Years of Satellite Data"
description: "Technical deep-dive into building a geospatial AI system for groundwater monitoring in Pakistan. From processing NASA satellite data to deploying time-series ML models achieving R²=0.89 accuracy."
date: "2025-01-20"
author: "Tayyab Manan"
category: "Machine Learning"
tags: ["Machine Learning", "Geospatial AI", "Python", "Flask", "Google Earth Engine", "Time Series", "React", "Data Science"]
image: "/projects/watertrace.webp"
readTime: "12 min read"
---

# Building WaterTrace: ML-Powered Groundwater Prediction Using Satellite Data

Pakistan has a serious water problem. Groundwater levels are dropping, agricultural regions are under water stress, and policymakers don't have the predictive tools to get ahead of it. Cities like Quetta and Lahore have lost over 15 cm of groundwater in just 15 years.

I built **WaterTrace** to do something about this with ML and geospatial analysis. The platform processes 22 years of satellite data (2002-2024) from NASA's GRACE mission and GLDAS models to predict groundwater trends across all 145 districts of Pakistan with 89% accuracy.

## The Problem: Data-Driven Water Management

Water scarcity in Pakistan isn't hypothetical. The country ranks among the world's most water-stressed, yet groundwater monitoring relies on sparse ground-based measurements that are expensive, inconsistent, and don't cover enough area.

I wanted to answer a few specific questions: Can satellite data monitor groundwater at scale? How accurately can ML predict depletion trends? And can the results be made accessible to people who aren't remote sensing experts?

## Technical Architecture and Data Sources

The system pulls together several technologies, each picked for what it's good at with large-scale geospatial data and ML workflows.

### Satellite Data Integration

WaterTrace is built on 22 years of satellite observations from two complementary sources.

**GRACE Satellites (2002-2017)** measure groundwater directly through gravity anomaly detection. The twin GRACE satellites detect tiny variations in Earth's gravitational field caused by changes in water mass. When groundwater depletes, the local gravitational field weakens, and GRACE can pick that up with surprising precision.

**GLDAS Land Surface Models (2018-2024)** serve as a groundwater proxy after GRACE's mission ended. GLDAS provides deep soil moisture measurements (100-200cm depth) that correlate well with groundwater levels. It's not a direct measurement like GRACE, but it offers continuous monthly coverage.

Merging these two heterogeneous data sources into a unified dataset that ML models could learn from was the first real challenge.

### Tech Stack Selection

**Google Earth Engine** does the heavy geospatial processing. Instead of downloading terabytes of satellite imagery, Earth Engine processes data in Google's data centers. I wrote Python scripts using the `ee` API to filter, aggregate, and export district-level statistics from pixel-level satellite observations.

**Flask** provides the ML API backend. It handles prediction requests, loads trained Scikit-learn models, processes input features, and returns forecasts with confidence intervals. Flask's simplicity let me iterate fast during development while staying production-ready.

**React 18 with Recharts** powers the frontend. The dashboard needed to make 22 years of temporal data understandable at a glance. Recharts gave me the flexibility to build custom time-series visualizations with interactive tooltips, zoom, and responsive design.

**Leaflet** renders the interactive district map with color-coded groundwater stress indicators. GeoJSON district boundaries overlay depletion data, giving users an intuitive geographic way to explore regional patterns.

**Pandas and NumPy** handle data manipulation and feature engineering. Working with 235 monthly observations across 145 districts (34,075 data points) meant I needed optimized array operations.

**Scikit-learn** runs the ML pipeline: preprocessing, model training, cross-validation, and hyperparameter tuning. I compared Linear Regression, Random Forest, and Gradient Boosting before going with an approach that uses Gradient Boosting for production.

## Building the Data Pipeline

### Geospatial Data Processing

The first big challenge was turning raw satellite raster data into district-level features suitable for ML training.

Google Earth Engine gave me access to the datasets, but extracting useful statistics required careful spatial aggregation:

```python
# Define Pakistan's district boundaries
districts = ee.FeatureCollection('projects/watertrace/pakistan_districts')

# Load GRACE data
grace = ee.ImageCollection('NASA/GRACE/MASS_GRIDS/MASCON')
  .filterDate('2002-01-01', '2017-12-31')
  .select('lwe_thickness')

# Aggregate to district level
def extract_district_mean(image):
  date = image.date().format('YYYY-MM')
  means = image.reduceRegions({
    'collection': districts,
    'reducer': ee.Reducer.mean(),
    'scale': 25000
  })
  return means.map(lambda f: f.set('date', date))

district_data = grace.map(extract_district_mean).flatten()
```

This processes over 163 GRACE images and 72 GLDAS images, computing spatial averages for each of Pakistan's 145 administrative districts. The output is a clean tabular dataset with columns for district ID, date, and groundwater measurements.

### Handling Data Gaps and Discontinuities

GRACE had a mission gap from June 2017 to May 2018 before GRACE-FO launched. GLDAS continued uninterrupted. This created a real problem: how do you maintain prediction continuity across different data sources?

I handled it in three steps. First, **correlation analysis** confirmed that GLDAS soil moisture correlates well (r=0.78) with GRACE groundwater measurements during the overlap period (2002-2017). Second, I applied a **linear calibration** to GLDAS values to match GRACE's scale: `GLDAS_calibrated = 0.85 × GLDAS + offset`. Third, I **widened the confidence intervals** for post-2017 forecasts to reflect the fact that we're working with proxy data.

The transition isn't perfect, but validation showed prediction errors stayed within acceptable bounds (RMSE < 0.7 cm).

## Machine Learning Implementation

### Feature Engineering for Time-Series Prediction

Raw satellite measurements alone aren't enough for accurate forecasting. The model needed features that capture temporal patterns, seasonality, and spatial context.

I engineered several categories of features.

**Temporal features** capture time-based patterns: year, month, season (winter/summer monsoon cycles), days since baseline (2002-01-01), and lag features showing groundwater levels from the previous 1, 3, 6, and 12 months.

**Trend features** quantify long-term changes: rolling means over 6-month and 12-month windows, linear trend coefficients for each district, and rate of change (first derivative).

**Seasonal features** model monsoon-driven patterns: sine and cosine transformations of month (captures cyclical behavior), historical monthly averages for each district, and deviation from the seasonal baseline.

**Spatial features** incorporate geographic context: district latitude/longitude centroids, neighboring district averages (spatial autocorrelation), and distance from major rivers (Indus, Chenab, Ravi).

This feature engineering pushed model R² from 0.65 to 0.89. Domain knowledge made a bigger difference than any algorithm change.

### Model Development and Validation

The ML pipeline follows time-series best practices to prevent data leakage and get realistic performance estimates.

**Time-Series Cross-Validation** splits data chronologically, not randomly. The model trains on historical data (2002-2019) and validates on recent data (2020-2024). This simulates real deployment where the model predicts future conditions from past observations.

```python
from sklearn.model_selection import TimeSeriesSplit
from sklearn.ensemble import GradientBoostingRegressor

# Temporal split: train on past, test on future
tscv = TimeSeriesSplit(n_splits=5)

for train_idx, test_idx in tscv.split(X):
    X_train, X_test = X[train_idx], X[test_idx]
    y_train, y_test = y[train_idx], y[test_idx]

    model.fit(X_train, y_train)
    predictions = model.predict(X_test)
    scores.append(r2_score(y_test, predictions))
```

**Model comparison** across three algorithms:

- **Linear Regression** (R² = 0.71): Fast and interpretable, but struggles with non-linear seasonal patterns
- **Random Forest** (R² = 0.84): Handles non-linearity well, but prone to overfitting on temporal features
- **Gradient Boosting** (R² = 0.89): Best performance through sequential error correction, selected for production

**Hyperparameter tuning** used grid search with cross-validation:

```python
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [3, 5, 7],
    'learning_rate': [0.01, 0.05, 0.1],
    'min_samples_leaf': [5, 10, 20]
}

grid_search = GridSearchCV(
    GradientBoostingRegressor(),
    param_grid,
    cv=tscv,
    scoring='r2',
    n_jobs=-1
)
```

The final production model achieved R² = 0.89 (89% of groundwater variance explained), RMSE = 0.67 cm (typical prediction error), and MAE = 0.52 cm (average absolute error).

### Model Interpretation with SHAP

If policymakers can't understand why the model makes a prediction, they won't trust it. I used SHAP to explain individual predictions:

```python
import shap

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# Visualize feature importance
shap.summary_plot(shap_values, X_test, feature_names=feature_names)
```

The SHAP analysis showed that **lag features** (previous months' measurements) contribute 45% of prediction power, **seasonal indicators** account for 25% (capturing monsoon cycles), **spatial features** (neighboring districts) provide 15% (confirming spatial autocorrelation), and **long-term trends** explain the remaining 15%.

This breakdown helps validate that the model is learning real patterns rather than noise.

## Frontend Development and Visualization

### Interactive Time-Series Dashboard

The dashboard needed to communicate 22 years of complex geospatial data to audiences with different technical backgrounds. I went with progressive disclosure: overview first, details on demand.

The main time-series chart shows the complete dataset with clear visual separation between data sources:

```typescript
<ResponsiveContainer width="100%" height={400}>
  <LineChart data={districtData}>
    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
    <XAxis
      dataKey="date"
      label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
    />
    <YAxis
      label={{ value: 'Groundwater (cm)', angle: -90, position: 'insideLeft' }}
    />
    <Tooltip content={<CustomTooltip />} />
    <Legend />

    {/* GRACE data (2002-2017) */}
    <Line
      type="monotone"
      dataKey="grace"
      stroke="#3b82f6"
      strokeWidth={2}
      dot={false}
    />

    {/* GLDAS data (2018-2024) */}
    <Line
      type="monotone"
      dataKey="gldas"
      stroke="#10b981"
      strokeWidth={2}
      dot={false}
      strokeDasharray="5 5"
    />

    {/* ML predictions with confidence intervals */}
    <Line
      type="monotone"
      dataKey="prediction"
      stroke="#f59e0b"
      strokeWidth={2}
      strokeDasharray="3 3"
    />
  </LineChart>
</ResponsiveContainer>
```

Blue is for GRACE observations, green for GLDAS measurements, orange for ML predictions. The dashed styling on predictions signals uncertainty.

### Geospatial Visualization with Leaflet

The district map gives spatial context to the temporal trends. Districts are color-coded by depletion severity:

```typescript
const getColorByDepletion = (depletion: number) => {
  if (depletion < -10) return '#dc2626' // Critical (red)
  if (depletion < -5) return '#f59e0b'  // High (orange)
  if (depletion < 0) return '#fbbf24'   // Moderate (yellow)
  if (depletion < 2) return '#34d399'   // Stable (green)
  return '#10b981'                      // Improving (dark green)
}

const districtStyle = (feature: Feature) => ({
  fillColor: getColorByDepletion(feature.properties.depletion),
  weight: 1,
  opacity: 1,
  color: 'white',
  fillOpacity: 0.7
})
```

Clicking a district loads its historical data into the time-series chart, connecting the spatial and temporal views.

## Performance Optimization and Deployment

### API Response Time Optimization

The initial Flask API took over 2 seconds to respond to prediction requests. That's too slow for an interactive web app. The bottleneck was loading the Scikit-learn model from disk on every request.

**Fix: model caching.**

```python
from functools import lru_cache
import joblib

@lru_cache(maxsize=1)
def load_model():
    return joblib.load('models/groundwater_model.pkl')

@app.route('/api/predict/<district_id>')
def predict(district_id):
    model = load_model()  # Cached after first call
    features = prepare_features(district_id)
    prediction = model.predict(features)
    return jsonify({'prediction': prediction.tolist()})
```

Response time dropped to 120ms, a 94% improvement. The model loads once on startup and stays in memory.

### Hosting Challenges: From Render to Cloudflare

Deployment taught me a lesson about what "works" actually means in production.

**The Render problem.** I initially deployed the Flask API on Render's free tier. Setup was straightforward, deployment pipeline worked fine, everything looked good. Then users started complaining about inconsistent performance.

The issue was cold starts. Render's free tier puts inactive services to sleep after 15 minutes. When a user visited WaterTrace after a quiet period, the first API request would wake the server, and response times would spike to 30-45 seconds. The ML model had to load, dependencies had to initialize, and only then could predictions be served. The charts would hang, users would assume the site was broken, and many would leave. Sometimes the site was fast (warm server), sometimes unusable (cold start). The inconsistency made it worse than being uniformly slow.

**The Cloudflare fix.** I migrated the API to Cloudflare Workers, which solved the core problem. No cold starts because Cloudflare's edge network keeps workers warm. Requests route to the nearest edge location. Scaling is automatic. Response times are consistently 120-180ms regardless of usage patterns.

The migration meant refactoring the Flask API for Cloudflare Workers' runtime, but the user experience improvement was worth it. Users in Lahore, Karachi, and Islamabad now get sub-200ms response times consistently.

The lesson I took away: for ML APIs behind interactive apps, consistent latency matters more than minimum latency. A system that's always 150ms beats one that's sometimes 80ms and sometimes 35 seconds.

### Frontend Bundle Size Reduction

The initial React bundle was 850KB gzipped, which meant slow page loads on mobile connections.

**Code splitting by route:**

```typescript
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const MapView = lazy(() => import('./pages/MapView'))
const Analytics = lazy(() => import('./pages/Analytics'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  )
}
```

**Chart library optimization** with dynamic imports for Recharts components:

```typescript
const LineChart = lazy(() =>
  import('recharts').then(mod => ({ default: mod.LineChart }))
)
```

Together these brought the initial bundle down to 320KB gzipped, a 62% reduction. First Contentful Paint dropped from 3.8s to 1.4s on 3G connections.

## Key Insights from Development

### Domain Knowledge Made the Biggest Difference

My initial model ignored monsoon seasonality and treated all months equally. The predictions were technically fine but practically useless. They missed the dramatic July-August groundwater recharge from summer rains entirely.

I spent time reading hydrology papers and Pakistan Meteorological Department reports, which made clear how much this matters: summer monsoon recharge (June-September), winter dry season depletion (November-March), agricultural irrigation cycles, and regional climate variations all drive groundwater patterns in ways the model needs to know about.

Incorporating this domain knowledge through seasonal features improved R² by 0.18. That's more than any algorithm swap gave me.

### Data Quality Over Model Complexity

I spent weeks trying advanced architectures: LSTM networks, attention mechanisms, transformer-based models. The improvements were marginal (R² went from 0.89 to 0.91) while training time increased 20x and interpretability dropped.

Meanwhile, cleaning data (removing outliers from sensor malfunctions, handling missing values properly, validating district boundary alignments) yielded bigger gains with the simpler model.

Sophisticated models can't fix noisy data. I wish I'd spent those weeks on data cleaning and feature engineering instead.

### Uncertainty Quantification Builds Trust

Early versions reported predictions as point estimates: "District X will have -12.3 cm groundwater in 6 months." That level of precision was misleading.

Adding confidence intervals changed how people received the results: "District X will have -12.3 cm ± 2.1 cm (95% CI)." Policymakers already know that environmental predictions are uncertain. Showing that uncertainty honestly made them trust the tool more, not less.

```python
# Generate prediction intervals using quantile regression
from sklearn.ensemble import GradientBoostingRegressor

models = {
    'lower': GradientBoostingRegressor(loss='quantile', alpha=0.05),
    'median': GradientBoostingRegressor(loss='quantile', alpha=0.50),
    'upper': GradientBoostingRegressor(loss='quantile', alpha=0.95)
}

for name, model in models.items():
    model.fit(X_train, y_train)
    predictions[name] = model.predict(X_test)
```

### Real-World ML is Iterative

The final model is version 17. Versions 1-3 were about learning the problem domain and data characteristics. Versions 4-8 were feature engineering experiments. Versions 9-12 compared architectures and hyperparameters. Versions 13-15 optimized for production deployment and inference speed. Version 16 addressed edge cases found during user testing. Version 17 is the current production model with ongoing monitoring.

None of this was a linear path from problem to solution. It was loops of experimentation, failure analysis, and refinement.

## What WaterTrace Delivers Today

The production system is live at [watertrace.vercel.app](https://watertrace.vercel.app).

It provides district-level groundwater monitoring with interactive visualizations for all 145 districts showing 22-year historical trends. ML-powered 6-month forecasts come with confidence intervals. Color-coded district maps show regional patterns and stress zones. Statistical dashboards surface key metrics like total depletion, depletion rates, and district rankings. There's a RESTful API for researchers and policy tools, and export capabilities for GIS software and further analysis.

The data tells a concerning story. National groundwater loss from 2002-2017 totals 13.71 cm, with an average depletion rate of 0.81 cm/year. Over 15 districts are in critical stress. Quetta shows -15.3 cm depletion, the worst in Pakistan. The Punjab agricultural belt is under severe water stress.

But there are some encouraging signs too. Some northern districts have stabilized recently. Parts of Sindh show a slowdown in depletion. And data-driven policies are beginning to influence how resources get allocated.

## Future ML Enhancements

Several improvements are on my list as I continue my AI Engineering studies.

**Deep learning for time-series** with LSTM and Transformer architectures could capture complex temporal dependencies that gradient boosting misses. Initial LSTM experiments look promising for multi-step forecasting. **Multi-modal data fusion** would integrate climate data (temperature, rainfall, evapotranspiration), socioeconomic indicators (population density, agricultural activity), and infrastructure data (tube wells, canal systems) for more complete predictions.

**Anomaly detection** using autoencoders and isolation forests would enable early warning for sudden groundwater crises. **Causal inference** methods (DoWhy, EconML) could move beyond correlation to understand what actually drives depletion: is agricultural expansion the cause, or are both responding to climate patterns?

**Reinforcement learning for policy optimization** could simulate interventions (canal projects, agricultural restrictions, tube well regulations) and recommend policy combinations that balance multiple objectives. **Enhanced explainability** through LIME and counterfactual explanations would help policymakers understand not just what the model predicts but what interventions might change the outcome. And **real-time GRACE-FO integration** would automate data ingestion from the ongoing GRACE Follow-On mission for continuous monitoring.

## What I Took Away from Building This

**ML is a tool, not a solution.** WaterTrace provides data, but solving Pakistan's water crisis requires policy action, infrastructure investment, and behavioral change. The technology enables better decisions; it doesn't make them.

**Geospatial AI requires mixed skills.** This project needed ML fundamentals, geospatial analysis, domain knowledge about hydrology, and software engineering. No single discipline was enough on its own.

**Start simple.** Linear regression with good features outperformed complex architectures with poor features. I only added complexity when simpler approaches failed and I understood why.

**Open data matters.** This project exists because NASA makes GRACE and GLDAS data freely available. That access is easy to take for granted.

**Listen to users early.** My initial versions focused on technical metrics (R², RMSE). User feedback redirected me toward uncertainty quantification, interpretability, and actionable insights. The metrics I cared about weren't the ones that mattered to the people using it.

## Project Links

- **Live Platform**: [watertrace.vercel.app](https://watertrace.vercel.app)
- **Source Code**: [GitHub Repository](https://github.com/TayyabManan/WaterTrace)
- **Project Details**: [WaterTrace Project Page](/projects/watertrace)

For technical questions about the ML pipeline or geospatial data processing, feel free to [reach out](/contact).