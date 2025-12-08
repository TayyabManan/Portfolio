---
slug: "building-face-expression-detection"
title: "Face Expression Detection: Tackling Class Imbalance with Ensemble Learning and Cloud GPUs"
description: "Technical deep-dive into building a facial expression recognition system for group photos. From handling severe class imbalance to cloud GPU training on Modal.com, deploying on Hugging Face Spaces."
date: "2025-12-08"
author: "Tayyab Manan"
category: "Computer Vision"
tags: ["Computer Vision", "Deep Learning", "PyTorch", "Transfer Learning", "MTCNN", "Flask", "Hugging Face", "Modal.com"]
image: "/projects/face-expression-detection.webp"
readTime: "15 min read"
---

# Face Expression Detection: Tackling Class Imbalance with Ensemble Learning and Cloud GPUs

Facial expression recognition is one of those problems that sounds simple until you actually try to solve it. Humans effortlessly read emotions from faces—we do it thousands of times daily without conscious thought. Teaching a machine to do the same? That's where things get interesting.

I built a **Face Expression Detection** system that identifies 7 emotions in group photos: Surprise, Fear, Disgust, Happiness, Sadness, Anger, and Neutral. The final model achieves **80% accuracy** on the RAF-DB dataset, deployed as an interactive web application on Hugging Face Spaces.

But the journey from initial baseline to production deployment taught me more about practical machine learning than any textbook could.

## The Problem: Emotions in the Wild

Most emotion recognition research focuses on controlled datasets—perfect lighting, frontal faces, exaggerated expressions. Real-world group photos are messier: varied angles, occlusions, subtle expressions, and faces of all sizes.

The questions driving this project:
- Can we reliably detect multiple faces in group photos?
- How do we handle the severe class imbalance in emotion datasets?
- What's the right balance between model complexity and practical accuracy?

This was a course project for Machine Learning for Engineering Design, but I wanted to push beyond academic exercises into production-ready deployment.

## Technical Architecture

The system uses a two-stage pipeline that separates face detection from emotion classification—a design choice that proved crucial for handling group photos.

### Stage 1: Face Detection with MTCNN

MTCNN (Multi-task Cascaded Convolutional Networks) handles face detection. It's a three-stage cascade that progressively refines face proposals:

1. **P-Net**: Generates candidate windows at multiple scales
2. **R-Net**: Refines candidates and rejects false positives
3. **O-Net**: Final refinement with facial landmark localization

```python
from facenet_pytorch import MTCNN

mtcnn = MTCNN(
    image_size=160,
    margin=0,
    min_face_size=20,
    thresholds=[0.6, 0.7, 0.7],
    factor=0.709,
    post_process=False,
    device=DEVICE,
    keep_all=True  # Detect all faces, not just the largest
)
```

I added Haar Cascade as a fallback detector. When MTCNN fails to find faces (which happens with unusual angles or extreme lighting), Haar Cascade often succeeds:

```python
def detect_faces(image):
    if MTCNN_AVAILABLE and mtcnn is not None:
        faces = detect_faces_mtcnn(image)
        if len(faces) == 0:
            faces = detect_faces_haar(image)  # Fallback
        return faces
    else:
        return detect_faces_haar(image)
```

This redundancy improved detection rate from ~80% to ~95% on my test images.

### Stage 2: Emotion Classification with ResNet-18

For emotion classification, I used transfer learning with ResNet-18 pretrained on ImageNet. The architecture:

```python
class EmotionResNet(nn.Module):
    def __init__(self, num_classes=7, dropout_rate=0.5, pretrained=True):
        super(EmotionResNet, self).__init__()

        # Load pretrained ResNet-18
        weights = models.ResNet18_Weights.IMAGENET1K_V1 if pretrained else None
        self.backbone = models.resnet18(weights=weights)

        # Get features from backbone
        num_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Identity()

        # Custom classification head
        self.classifier = nn.Sequential(
            nn.Linear(num_features, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(inplace=True),
            nn.Dropout(dropout_rate),
            nn.Linear(512, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(inplace=True),
            nn.Dropout(dropout_rate),
            nn.Linear(256, num_classes)
        )
```

The custom classification head with BatchNorm and Dropout was crucial. Initial experiments with just a single linear layer achieved only 75% accuracy; the deeper head with regularization pushed this to 80%.

## The Dataset: RAF-DB and Its Challenges

RAF-DB (Real-world Affective Faces Database) contains 15,339 images across 7 emotion classes. It's one of the more realistic emotion datasets, with images collected from the internet rather than posed in labs.

But here's the problem—severe class imbalance:

- **Happiness**: 39% of samples (dominant class)
- **Neutral**: 22%
- **Sadness**: 16%
- **Surprise**: 11%
- **Anger**: 5%
- **Disgust**: 5%
- **Fear**: 2.3% (severely underrepresented)

This imbalance would dominate the training process. A naive model could achieve 39% accuracy by predicting "Happiness" for everything.

You might be wondering: why not just use a different, more balanced dataset? We tried. We identified a better balanced dataset and contacted the researcher who maintained it, requesting access via email. We never received a response. After waiting and following up, we decided to move forward with RAF-DB and tackle the imbalance problem head-on through algorithmic solutions rather than waiting indefinitely for data access.

## Initial Baseline: 82.14% Accuracy

My starting point was a standard ResNet-18 with vanilla cross-entropy loss:

- **Happiness**: 90.9% (dominant class, easy)
- **Surprise**: 84.8% (good)
- **Neutral**: 82.6% (good)
- **Sadness**: 77.8% (acceptable)
- **Anger**: 69.1% (below average)
- **Fear**: 51.4% (critical failure)
- **Disgust**: 50.0% (critical failure)

Overall accuracy looked respectable at 82.14%, but the per-class breakdown revealed the real story: the model essentially gave up on Fear and Disgust. With only 2.3% of training data, Fear was barely better than random guessing.

This is the hidden danger of aggregate metrics—they mask catastrophic failures on minority classes.

## Fighting Class Imbalance

### Attempt 1: Focal Loss

Focal Loss down-weights easy examples to focus training on hard cases. The idea: if the model confidently predicts Happiness correctly, reduce that loss contribution. If it struggles with Fear, amplify that signal.

```python
class FocalLoss(nn.Module):
    def __init__(self, gamma=2.0, alpha=None):
        super(FocalLoss, self).__init__()
        self.gamma = gamma
        self.alpha = alpha

    def forward(self, inputs, targets):
        ce_loss = F.cross_entropy(inputs, targets, reduction='none')
        pt = torch.exp(-ce_loss)
        focal_loss = ((1 - pt) ** self.gamma) * ce_loss
        return focal_loss.mean()
```

**Results with Focal Loss:**
- Overall accuracy: 64.24% (dropped significantly!)
- Fear: 59.5% (+8% improvement!)
- Disgust: 70.6% (+20% improvement!)
- Happiness: 59.5% (dropped from 90.9%)

Focal Loss worked exactly as intended for minority classes but devastated majority class performance. The model overcorrected.

### Attempt 2: Class Weights

Instead of modifying the loss function, I tried weighting classes by inverse frequency:

```python
def get_class_weights(labels):
    class_counts = np.bincount(labels)
    total = len(labels)
    weights = total / (len(class_counts) * class_counts)
    return torch.FloatTensor(weights)
```

This helped but wasn't enough alone.

### Attempt 3: Weighted Sampling

Rather than seeing the same imbalanced distribution every epoch, weighted sampling ensures each batch has roughly equal representation:

```python
def get_weighted_sampler(labels):
    class_counts = np.bincount(labels)
    weights = 1.0 / class_counts[labels]
    sampler = WeightedRandomSampler(weights, len(weights))
    return sampler
```

### The Winning Combination

The final training configuration combined multiple techniques:

```python
# Training configuration
epochs = 100
batch_size = 64
learning_rate = 1e-4
weight_decay = 5e-3
dropout = 0.6
label_smoothing = 0.15
focal_loss_gamma = 3.0
early_stopping_patience = 25
```

Key insights:
- **High dropout (0.6)** prevented overfitting to majority classes
- **Label smoothing (0.15)** reduced overconfidence, helping minority classes
- **Early stopping** prevented the model from memorizing the imbalanced distribution
- **Weighted sampler** ensured balanced batches

## Cloud Training with Modal.com

Without a local GPU, I turned to Modal.com for cloud training. Modal's pay-per-use model with A100 GPUs made experimentation affordable.

### Setting Up Modal Training

```python
import modal

app = modal.App("emotion-training")
volume = modal.Volume.from_name("emotion-data")

@app.function(
    gpu="A100",
    volumes={"/data": volume},
    timeout=3600
)
def train_model(model_type="resnet", use_focal_loss=False):
    # Training code here
    pass
```

### Training Runs and Results

- **Run 1**: EfficientNet-B2 + Focal Loss → 64.24% (26 min)
- **Run 2**: EfficientNet-B2 + Standard Loss → 73.92% (24 min)
- **Run 3**: ResNet-18 + Standard Loss → 78.59% (18 min)
- **Ensemble**: All three weighted → 78.91%

Interesting finding: simpler ResNet-18 outperformed larger EfficientNet-B2. Sometimes the best model is the smaller one that generalizes better.

### Ensemble Strategy

Simple averaging of the three models actually performed worse (72.33%) than the best individual model. The weaker Focal Loss model dragged down the average.

Solution: weighted ensemble based on individual model accuracy:

```python
def ensemble_predict(models, weights, image):
    predictions = []
    for model, weight in zip(models, weights):
        pred = model.predict(image)
        predictions.append(pred * weight)
    return sum(predictions) / sum(weights)
```

**Final Ensemble Results:**

- **Surprise**: 90.9% → 85.7% (-5.2%)
- **Fear**: 56.8% → 58.1% (+1.3%)
- **Disgust**: 43.8% → 67.5% (+23.7%)
- **Happiness**: 75.2% → 80.5% (+5.3%)
- **Sadness**: 76.8% → 84.1% (+7.3%)
- **Anger**: 79.6% → 79.6% (no change)
- **Neutral**: 74.7% → 74.0% (-0.7%)

The ensemble's biggest win was Disgust: +23.7% improvement. This validated the ensemble approach—different models make different mistakes.

## Challenges and Solutions

### Challenge 1: First Epoch Slowness on GPU

**Problem**: First epoch took 5-7 minutes on A100, which seemed wrong for such a small dataset.

**Cause**: CUDA kernel JIT compilation, cuDNN autotuning, and data loader warmup all happen on the first epoch.

**Solution**: This is expected behavior. Subsequent epochs ran in 30-60 seconds. The system needed time to optimize for the specific GPU architecture.

### Challenge 2: Fear vs Surprise Confusion

**Problem**: The model frequently confused Fear with Surprise. Both involve wide eyes, raised eyebrows, and open mouths.

**Analysis**: Looking at misclassified examples, even humans struggle to distinguish extreme surprise from fear without context. The facial muscle movements are remarkably similar.

**Partial Solution**: Focal Loss helped by forcing the model to pay more attention to subtle differences. But this remains the hardest classification boundary.

### Challenge 3: Group Photo Accuracy Drop

**Problem**: The same person showed different predictions in individual photos vs group photos.

- **Individual photo**: Large face → Neutral (89% confidence)
- **Group photo**: Small face → Happiness (45% confidence)

**Cause**: Smaller faces in group photos lose detail when resized to 100x100 input. Critical expression features get blurred away.

**Mitigation**:
- Lowered MTCNN thresholds to catch smaller faces
- Increased margin padding around detected faces
- Added Test-Time Augmentation for more stable predictions

### Challenge 4: Model Overwriting

**Problem**: Second training run overwrote the first model (both saved as `best_model.pth`).

**Solution**: Updated naming convention to include configuration:
```
best_efficientnet_b2_focal_model.pth
best_efficientnet_b2_standard_model.pth
best_resnet_standard_model.pth
```

Obvious in hindsight, but cost me a training run to learn.

## Building the Web Application

### Flask Backend

The Flask application handles image upload, face detection, and emotion prediction:

```python
@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['image']
    image = Image.open(file.stream).convert('RGB')

    # Detect faces
    faces = detect_faces(image)

    results = []
    for (x, y, w, h) in faces:
        # Extract face with margin
        face_region = extract_face(image, x, y, w, h, margin=0.1)

        # Predict emotion
        emotion, confidence, probabilities = predict_emotion(face_region)

        results.append({
            'bbox': [x, y, w, h],
            'emotion': emotion,
            'confidence': confidence,
            'probabilities': probabilities
        })

    return jsonify({'results': results})
```

### Visualization with Bounding Boxes

Drawing results required careful attention to readability:

```python
EMOTION_COLORS = {
    "Surprise": (0, 255, 255),    # Cyan
    "Fear": (180, 0, 180),        # Purple
    "Disgust": (0, 180, 0),       # Green
    "Happiness": (255, 220, 0),   # Yellow
    "Sadness": (0, 100, 255),     # Blue
    "Anger": (255, 0, 0),         # Red
    "Neutral": (128, 128, 128)    # Gray
}
```

Color choices matter: I picked colors that are distinguishable even for colorblind users, with sufficient contrast against both light and dark backgrounds.

### Deployment on Hugging Face Spaces

Hugging Face Spaces with Docker provided straightforward deployment:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements-docker.txt .
RUN pip install --no-cache-dir -r requirements-docker.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

The Docker setup ensures consistent environments between development and production—no more "works on my machine" issues.

## Real-World Testing Results

Testing on unseen images revealed both strengths and weaknesses:

### What Works Well
- **Happiness detection**: Consistent and accurate, high confidence
- **Neutral detection**: Reliable with 68%+ confidence
- **Surprise detection**: Good accuracy when not confused with Fear
- **Multi-face detection**: MTCNN handles various angles and sizes

### What Needs Improvement
- **Fear vs Surprise confusion**: Fundamental challenge
- **Low confidence scores**: Many predictions in 40-60% range
- **Small face accuracy**: Group photos still challenging
- **Anger overdetection**: Intense expressions often misclassified as anger

## Lessons Learned

### 1. Class Imbalance is the Real Problem

Initial focus on model architecture was misguided. The 82% to 80% accuracy drop happened because I started measuring what actually matters: per-class performance. The "worse" model is actually better—it doesn't ignore minority classes.

### 2. Aggregate Metrics Lie

82.14% accuracy sounds great. 51.4% accuracy on Fear sounds terrible. They're the same model. Always look at per-class metrics for imbalanced problems.

### 3. Focal Loss is a Double-Edged Sword

Focal Loss dramatically improved minority class performance but hurt majority classes. The solution isn't choosing one approach—it's ensembling models with different loss functions to leverage both strengths.

### 4. Architecture Matters Less Than You Think

ResNet-18 (11M parameters) outperformed EfficientNet-B2 (9M parameters) on this task. More complex isn't always better. The simpler model generalized better to the test set.

### 5. Cloud GPUs Change Everything

Modal.com made experimentation affordable. Total training cost: ~$3.50 for all experiments. Without cloud GPUs, this project would have taken weeks instead of days.

### 6. Save Models with Descriptive Names

Lost a 26-minute training run to file overwriting. Now I use: `{model}_{dataset}_{loss}_{date}.pth`

## What I Would Do Differently

1. **Start with class weights**, add Focal Loss only if needed
2. **Train more diverse architectures** from the beginning for ensemble
3. **Use stratified cross-validation** for more robust evaluation
4. **Implement early stopping** from day one to save training time
5. **Add attention mechanisms** to focus on discriminative facial regions

## Future Improvements

- **Vision Transformers**: ViT architectures might capture global face structure better
- **Face alignment**: Preprocessing to normalize face orientation
- **Attention mechanisms**: Focus on mouth vs eyes depending on emotion
- **Confidence calibration**: Post-processing for more reliable probability estimates
- **Larger balanced datasets**: Training on combined datasets to reduce imbalance

## Project Links

- **Live Demo**: [Hugging Face Space](https://huggingface.co/spaces/TayyabManan/face-expression-detection)
- **Source Code**: [GitHub Repository](https://github.com/TayyabManan/Face-Expression-Detection)
- **Project Details**: [Face Expression Detection Project](/projects/face-expression-detection)

## Acknowledgments

This project was completed as part of the Machine Learning for Engineering Design course. Thanks to my collaborators Syed Measum and Mustafa Rahim, the RAF-DB dataset creators, and the facenet-pytorch library maintainers.

For questions about the implementation or collaboration opportunities, feel free to [reach out](/contact).
