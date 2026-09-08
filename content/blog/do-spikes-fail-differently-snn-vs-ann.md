---
slug: "do-spikes-fail-differently-snn-vs-ann"
title: "Do Spikes Fail Differently? A Matched SNN vs ANN Reliability Study"
seoTitle: "SNN vs ANN Reliability on DVS128Gesture"
description: "A spiking neural network and its ReLU twin, identical in everything but the neuron, compared on an event-camera gesture dataset: accuracy, calibration, four corruptions, a timing control, and paper energy. Spiking costs 3.5 points and buys honest confidence under noise, a calibration tie, and 19x on paper. With a live demo you can break yourself."
date: "2026-09-03"
author: "Tayyab Manan"
category: "Machine Learning"
tags: ["Machine Learning", "Spiking Neural Networks", "Neuromorphic Computing", "Event Cameras", "Calibration", "Robustness", "PyTorch", "SpikingJelly", "Modal"]
image: "/projects/do-spikes-fail-differently.webp"
readTime: "14 min read"
faqs:
  - question: "What is a spiking neural network?"
    answer: "A network whose neurons fire brief pulses instead of passing a number forward every step. Each leaky integrate-and-fire neuron collects input over time, fires when its membrane crosses a threshold, and leaks between inputs. Most neurons are silent most of the time, which is where the energy claims come from."
  - question: "How did the SNN and ANN stay comparable?"
    answer: "Everything was held constant except the neuron model: the same convolutional architecture, parameter count, event-camera frames, MSE loss, optimizer, schedule, batch size, seed, and 64 epochs. Each spiking neuron was replaced by a ReLU and nothing else changed."
  - question: "What did the spiking network lose and gain?"
    answer: "In this matched pair it lost 3.5 accuracy points on the clean test set and about two points when the frames were shuffled in time. It tied on calibration, led by up to 28 points under sensor noise while its confidence tracked its accuracy, and cost 18.7x less on the standard energy accounting."
  - question: "Why not use softmax for the confidence?"
    answer: "Both models were trained with MSE against one-hot targets, so their outputs are rates between 0 and about 1.3, not logits. Softmax on that range squashes every confidence toward 1/11 and makes both models look badly underconfident. Confidence here is the top output divided by the sum of outputs."
  - question: "Is the 18.7x energy saving real?"
    answer: "Only on paper. It uses the standard accounting in the SNN literature: a multiply-accumulate costs 4.6 pJ, an accumulate 0.9 pJ, and a spiking layer only pays when a spike arrives. On a GPU both models draw similar power. The saving needs event-driven hardware, and the study says so wherever the number appears."
howTo:
  name: "How to run a matched SNN vs ANN reliability study"
  description: "The procedure behind the study: build a spiking network and a ReLU twin that differ in nothing but the neuron, train both identically, then measure calibration, robustness, timing sensitivity, and paper energy with confidence intervals on everything."
  steps:
    - name: "Build the twin"
      text: "Take a working spiking architecture and replace every leaky integrate-and-fire neuron with a ReLU. Keep the layers, the parameter count, the data pipeline, and the readout, so the neuron is the only variable."
    - name: "Train both identically"
      text: "Same loss, optimizer, schedule, batch size, epochs, and seed. Checkpoint every epoch so a crash resumes instead of restarting."
    - name: "Map outputs to confidence honestly"
      text: "For MSE-trained rate outputs, use the normalized top score, not softmax. Check the row sums before choosing a mapping."
    - name: "Put a confidence interval on everything"
      text: "With a few hundred test samples, bootstrap every metric and use paired tests for differences between the two models on the same samples."
    - name: "Corrupt the inputs, both models identically"
      text: "Seed each corruption so both networks see byte-identical damaged inputs. Include a control the ordinary network is provably invariant to, so the harness checks itself."
    - name: "Account for energy with the bookkeeping shown"
      text: "Measure spike density at the input of each layer, after any pooling, and bill spiking layers per accumulate. State that it is an accounting model, not a measurement."
---

Take a convolutional network that works. Replace every spiking neuron in it with an ordinary ReLU and change nothing else. What do you lose, and what do you get back?

I spent August answering that on one dataset, for a semester project that doubles as a miniature of my master's thesis. Most papers on spiking neural networks answer with two numbers: accuracy and an energy estimate. I wanted the reliability picture instead. Does the spiking model know when it is wrong? Does it break the same way as the ordinary one when the input is damaged? Does it use the timing that event cameras are supposed to provide? Accuracy answers none of that.

The short version. In this matched pair, spiking is a trade, not a downgrade. It costs 3.5 accuracy points and about two points of timing sensitivity. It buys an exact tie on calibration, a large advantage under sensor noise with confidence that tracks its accuracy while the ordinary network's does not, and an energy saving of 18.7x that is real on paper and imaginary on a GPU. You can [break both models yourself](/demo/spikes) in the live demo before reading any of this.

![what the camera sees · one test recording per gesture, all 16 frames · orange = brightness up, blue = brightness down](/projects/screens/do-spikes-fail-differently-gestures.gif)

## Why not just report accuracy

An event camera does not take pictures. Each pixel fires an event when the brightness in front of it changes, so a still scene is invisible and a moving hand is a cloud of dots with a lot of speckle. Spiking networks are the natural fit for this kind of sensor on paper: sparse input, sparse neurons, time built into both.

The papers I read while preparing the thesis mostly compare a spiking model against a conventional one on accuracy, then estimate energy. That leaves out the questions anyone deploying one of these things would ask first. If the sensor gets noisy, which model degrades gracefully? When a model is wrong, does it say so, or does it stay confident? A system that acts on confidence needs the second answer more than it needs one more accuracy point.

So the study is reliability first. Accuracy is in there, but as one row of a table rather than the headline.

## The matched pair

The design is one controlled experiment with one variable. Everything else is held fixed: architecture, parameter count, data pipeline, loss, optimizer, learning-rate schedule, batch size, seed, number of epochs, and the 16 input frames per sample. If the two models behave differently, the neuron did it.

The data is [DVS128Gesture](https://ibm.ent.box.com/s/3hiq58ww1pbbjrinh367ykfdf60xsfm8), IBM's event-camera dataset of 11 hand and arm gestures ([Amir et al., CVPR 2017](https://openaccess.thecvf.com/content_cvpr_2017/html/Amir_A_Low_Power_CVPR_2017_paper.html)), with 288 test samples. Events are binned into 16 frames per sample with [SpikingJelly](https://github.com/fangwei123456/spikingjelly)'s loader, and both models see those exact frames. Nothing is collapsed or re-encoded for one model and not the other. I mention this because the closest precedent I found, a neuromorphic drone paper from FOI, collapsed events to a single frame for its conventional model. That is a fair engineering choice and an unfair comparison.

The spiking network is SpikingJelly's standard DVSGesture net: five blocks of 3x3 convolution, batch norm, a leaky integrate-and-fire neuron, and max pooling, then two fully connected layers with spiking neurons and a 10-way voting layer onto 11 classes. A leaky integrate-and-fire neuron, LIF for short, adds up its input over time, fires a spike when the total crosses a threshold, resets, and leaks toward zero in between. The prediction is the firing rate of each output averaged over the 16 steps. Training goes through an arctan surrogate gradient, because a spike has no derivative.

The twin is the same net with every LIF replaced by a ReLU:

```python
def block(cin, cout, act):
    return [
        Conv2d(cin, cout, 3, padding=1, bias=False),
        BatchNorm2d(cout),
        act(),
        MaxPool2d(2, 2),
    ]

snn_act = lambda: LIFNode(surrogate_function=ATan(), detach_reset=True)
ann_act = nn.ReLU
```

The twin has no state, so the 16 frames fold into the batch dimension. Each frame gets its own output, the outputs go through the same voting layer, and the 16 votes are averaged. Same parameter count to the last weight. The only thing removed is membrane state carrying information from one frame to the next.

One confound survived. SpikingJelly's dropout freezes one mask across all 16 steps of a sample, while the twin's ordinary dropout draws a new mask per frame. It only matters during training and it is probably minor, but the pair is not perfectly matched there, and I would rather write that down than pretend otherwise.

## Training on Modal

Both models trained on an A10G on [Modal](https://modal.com/) with the same recipe: MSE loss against one-hot targets, Adam at 1e-3, a cosine schedule, batch size 16, 64 epochs, seed 0. Checkpoints go to a persistent volume after every epoch, so a crash or a closed laptop resumes from where it left off instead of starting over.

![training curves · identical schedule, seed 0, 64 epochs · dashed = train, solid = test](/projects/screens/do-spikes-fail-differently-training.webp)

The twin converges faster and both saturate the training set by the end. The spiking model ends at 93.06% test accuracy, the twin at 96.53%. Two things about that gap later, because the interesting part is not the gap.

## Confidence is not softmax

This is the trap I nearly fell into, so it gets its own section.

The natural move is to softmax the outputs and call the top value the confidence. But these models were trained with MSE against one-hot targets. Their outputs are rates in roughly [0, 1.3], not logits, and their rows already sum to roughly 1. Softmax on that range squashes everything toward 1/11 and manufactures underconfidence that is not there. Run these outputs through softmax and both models look catastrophically unsure of themselves. They are not. The mapping is.

Confidence in this study is the normalized score of the predicted class:

```python
def confidences(out):
    s = out.sum(1, keepdims=True)
    s[s == 0] = 1e-9
    p = out / s
    return p.max(1), out.argmax(1)
```

The lesson generalizes. Before you pick a confidence mapping, look at what the training loss made the outputs mean.

## A confidence interval on everything

The test set has 288 samples. One accuracy point is about three of them. A point estimate on its own is close to meaningless at that size, so every number in this post carries a bootstrap 95% interval (5,000 resamples, 3,000 on the corruption grid), and every comparison between the two models is paired, on the same samples. The study's house rule: no interval, not reportable.

## Results

### Accuracy: the twin wins, by ten samples

Spiking 93.06% [89.9, 95.8]. Twin 96.53% [94.4, 98.6].

The intervals overlap, which is exactly why the paired test matters. On the same 288 samples, the twin is right on 13 that the spiking model misses, and the spiking model is right on 3 that the twin misses. McNemar's exact test gives p = 0.021, and the paired gap is +3.5 points [+1.0, +6.3]. So the gap is real. It is also ten test samples. Both statements deserve equal weight.

### Calibration: a tie, and both models are shy

Expected calibration error, 15 bins: spiking 0.040 [0.033, 0.075], twin 0.039 [0.031, 0.062]. The paired difference has an interval of [-0.031, +0.017], which includes zero. Spiking has no measurable calibration cost on clean data.

![reliability diagrams · both models · ece 0.040 vs 0.039 · bin counts at the bar base](/projects/screens/do-spikes-fail-differently-reliability.webp)

The surprise is the direction. Both models saturate the training set, and both come out about three points underconfident on test. I expected two overparameterized networks to be cocky. My best explanation is that MSE-trained rates passed through a voting layer rarely saturate at 1.0, so the top score sits a little below the model's actual hit rate. I did not expect either of them to come out humble.

### Corruption: one crossover, and it is the headline

Four corruptions at four severities each, applied to the frame tensors with fixed seeds so both models see byte-identical damaged inputs.

![accuracy and calibration under four corruptions · n=288 · bars = bootstrap 95% CI · top row accuracy, bottom row ece](/projects/screens/do-spikes-fail-differently.webp)

Noise is Poisson background events sprinkled over every frame, the event-camera version of hot pixels. The curves cross almost immediately. The spiking model leads by +4.5 points [+0.7, +8.3] at the mildest setting and by up to +28.1 points [+22.6, +33.7] in the middle of the range. All four severities are significant.

Accuracy is half of the result. The other half is what confidence does. As the noise grows, the twin's mean confidence stays high while its accuracy falls, up to 34 points of overconfidence. The spiking model's confidence tracks its accuracy the whole way, staying within 4 points. The twin fails and reports success. The spiking model degrades and says so. For anything that acts on a confidence score, the second failure mode is the one you want.

Why would spiking help here? My working hypothesis is the leak. A LIF neuron is a low-pass filter over time. A background event pushes the membrane briefly and leaks away. A gesture is correlated across frames and integrates. The twin averages per-frame outputs and has no such filter, so noise walks straight through. I want to be clear that this is a hypothesis. This experiment does not isolate the mechanism. A sweep with correlated versus uncorrelated noise would, and it is on the list.

Drop deletes each event with probability p, a failing sensor. No crossover. The twin keeps its lead at every severity. At p = 0.8 both models land near 40% accuracy (spiking 36.8%, twin 42.4%, chance is 9.1%) while sitting at roughly 80% confidence. Both are about 40 points overconfident. So honest confidence under noise is not a general property of spiking. Starve both models of events and both fail confidently.

Occlusion blanks a random square in every frame. The twin stays ahead throughout. Nothing surprising.

Temporal shuffle permutes the 16 frames within windows, and this one is a designed control rather than a corruption. The twin averages over time, so it is invariant to frame order by construction. The data confirms it exactly: 96.53% at every severity, confidence frozen. That flatness doubles as a correctness check on the whole harness, which is a nice property for a control to have. Any degradation is therefore pure spiking-side temporal processing. The spiking model loses 2.1 points [0.7, 3.8] at full shuffle. It does use temporal order, and temporal order is worth about two points on this task. Not more. The FOI group reached a similar shape-over-timing conclusion on their drone data by a different route.

### Energy: 18.7x on paper, with the accounting shown

The standard accounting across the SNN literature: a multiply-accumulate costs 4.6 pJ, an accumulate 0.9 pJ ([Horowitz, ISSCC 2014](https://doi.org/10.1109/ISSCC.2014.6757323), 45 nm). The twin's layers pay full MACs on every input. A spiking layer only pays an accumulate when an input spike arrives, so its bill is MACs x 16 steps x input spike density x 0.9 pJ. The first conv layer sees analog frames, not spikes, so I bill it at full MAC cost for both models. That choice is conservative against the spiking model and it dominates: conv1 is 84% of its total.

Spiking 3.30 mJ per sample. Twin 61.90 mJ. Ratio 18.7x. Weighted over every neuron and timestep, 98.1% of neuron-timesteps carry no spike. The spiking layers alone, with conv1 excluded on both sides, cost 0.52 mJ against 59.1 mJ, about 113x.

One honest detail, because it changed the numbers. My first version measured spike density at each LIF's output and reported 20.6x. But the map a conv layer actually reads is the one after max pooling, and max-pooling binary spikes is an OR over a 2x2 window. The pooled map is denser than the rate behind it. Fixing that raised the spiking model's bill by 10% and cut the per-layer claim roughly in half, from about 260x to 113x. The headline barely moved, because conv1 dominates either way. It still shows how sensitive these accounting exercises are to bookkeeping. Treat every published SNN energy ratio, including this one, accordingly.

And the caveat that belongs in bold, stated plainly: this is an accounting model, not a measurement. On the GPU both models draw similar watts. The saving exists only on event-driven hardware. It appears next to the number everywhere I show it, including the demo.

## What this does not show

Single seed. Every number is one training run per model. The paired tests protect against sample noise, not seed noise. Seeds 1 and 2 are the obvious next spend, about $15 of compute.

Two hundred and eighty-eight test samples. The intervals are honest about it, and they are wide.

The noise-robustness mechanism is a hypothesis, not a demonstrated cause.

The energy table is an accounting model with stated prices.

The dropout confound in the matched pair, described above.

And one process note. The corruption run was reseeded once. An early version seeded with Python's `hash()`, which is randomized per process. The paired comparisons in that run were valid, and the reproducible rerun agrees with it on every conclusion, but the exact archived numbers cannot be regenerated. I kept both output files.

## The live demo

The numbers above are about 288 samples at once. I wanted a way to feel the noise result on one recording, so the study ships with a [live demo](/demo/spikes). Pick a gesture, choose a kind of damage and how much, and the page sends the damaged frames through both models on a small CPU container on Modal that wakes on demand and goes back to sleep. It shows what each model answered, how sure it was, how that certainty built up frame by frame, and the paper energy of that one run, with the whole-test-set curves underneath so the single sample can be read against the population.

The demo bank is 33 test recordings, three per gesture, chosen where both models are right on the undamaged input. That way every disagreement you can produce is caused by the damage you added.

Building it turned up a small illustration of the thesis. The demo runs on CPU and the published numbers came from a GPU. The twin's outputs match the GPU run to four decimal places. The spiking model's predictions all match, but its confidences drift by up to 0.1 on some samples. Floating-point rounding differs slightly between the two, and a rounding difference that would change nothing in a ReLU network is enough to flip a spike near threshold, which flips the spikes that depended on it. Continuous outputs absorb small perturbations. Spikes propagate them. The page says so in a footnote.

## What's next

Seeds 1 and 2 first, because nothing here is publishable on one seed. Then the correlated-versus-uncorrelated noise sweep that would test the leak hypothesis directly. Temperature scaling on both models is cheap and would show whether the calibration tie survives post-hoc calibration.

The thesis points the same harness at spiking event-language models, where the test split is about the same size, so the bootstrap discipline transfers as is. Everything in this study was built so that the models can be swapped out and the questions stay the same.

## What I took away

Hold everything constant, then believe the difference. The matched pair is the whole reason any of these numbers mean anything. The moment I let one side have a different input pipeline or a different readout, the comparison would have been about that instead.

A control that has to come out flat is worth more than another corruption. The shuffle test told me two things at once: how much timing is worth, and that the harness was not lying.

Look at what the loss made the outputs mean before you choose a confidence mapping. Softmax would have turned a clean calibration tie into a false story about two nervous models.

Bookkeeping moves energy ratios more than architecture does. A pooling detail cut a per-layer claim in half. I now read every SNN energy number with the question "measured where?" in mind.

Keep the failures in. The reseeding bug, the pooling mistake, the dropout confound. The clean version of this post would be shorter and less useful.

## Links

- [Live demo](/demo/spikes)
- [Project page](/projects/do-spikes-fail-differently)
- Source code: on GitHub once the repository is public
