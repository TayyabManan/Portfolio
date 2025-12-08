---
slug: "face-expression-detection"
title: "Face Expression Detection"
subtitle: "Deep Learning Emotion Recognition in Group Photos"
description: "A deep learning web application that detects and classifies facial expressions in images. Built with PyTorch and Flask, featuring a ResNet-18 model trained on the RAF-DB dataset achieving 80% accuracy."
category: "Computer Vision"
techStack: ["Python", "PyTorch", "Flask", "MTCNN", "OpenCV", "ResNet-18", "Docker", "Hugging Face"]
image: "/projects/face-expression-detection.webp"
demoUrl: "https://huggingface.co/spaces/TayyabManan/face-expression-detection"
githubUrl: "https://github.com/TayyabManan/Face-Expression-Detection"
featured: true
date: "2025-12-08"
---

# Face Expression Detection in Group Photos

## Overview
A deep learning web application that detects and classifies facial expressions in images. Built with PyTorch and Flask, featuring a ResNet-18 model trained on the RAF-DB dataset achieving **80% accuracy**.

**[Read the full technical deep-dive →](/blog/building-face-expression-detection)**

## Features
- **7 Emotion Classes**: Surprise, Fear, Disgust, Happiness, Sadness, Anger, Neutral
- **Multi-face Detection**: Detects and analyzes multiple faces in a single image
- **MTCNN Face Detection**: High-accuracy face detection with Haar Cascade fallback
- **Real-time Visualization**: Annotated images with bounding boxes and emotion labels
- **Confidence Scores**: Probability distribution across all emotion classes
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on desktop and mobile

## What We Did

### Face Detection Pipeline
We implemented a two-stage approach using MTCNN as the primary face detector with Haar Cascade as fallback. MTCNN provides high-accuracy detection for multiple faces in group photos, while Haar Cascade ensures robustness when MTCNN fails.

### Model Training
We used transfer learning with ResNet-18 pretrained on ImageNet and fine-tuned it on the RAF-DB (Real-world Affective Faces Database) dataset containing 15,339 images across 7 emotion classes. The custom classification head uses batch normalization and dropout for regularization.

### Handling Class Imbalance
RAF-DB has significant class imbalance (Happiness: 39%, Fear: 2.3%). We addressed this through focal loss, class weights, and weighted sampling to improve performance on minority classes like Fear and Disgust.

### Web Application
Built a Flask web application with a clean UI supporting image upload, real-time emotion detection, and annotated output with bounding boxes and confidence scores. Deployed on Hugging Face Spaces using Docker.

## Tech Stack
- **Model**: ResNet-18 (transfer learning from ImageNet)
- **Face Detection**: MTCNN + Haar Cascade fallback
- **Backend**: Flask + Gunicorn
- **Frontend**: Vanilla JS with CSS animations
- **Dataset**: RAF-DB (Real-world Affective Faces Database)
- **Deployment**: Docker on Hugging Face Spaces

## Model Performance

- **Accuracy**: 80%
- **Dataset**: RAF-DB
- **Architecture**: ResNet-18
- **Input Size**: 100x100

### Per-Class Performance

- **Happiness**: Highest accuracy
- **Neutral**: High accuracy
- **Surprise**: Good accuracy
- **Sadness**: Moderate accuracy
- **Anger**: Moderate accuracy
- **Fear**: Lower accuracy (limited samples)
- **Disgust**: Lower accuracy (limited samples)

## Authors
- **Muhammad Tayyab**
- **Syed Measum**
- **Mustafa Rahim**

## Acknowledgments
- RAF-DB Dataset for training data
- facenet-pytorch for MTCNN implementation
- PyTorch for the deep learning framework
