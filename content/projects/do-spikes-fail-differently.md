---
slug: "do-spikes-fail-differently"
title: "Do Spikes Fail Differently?"
subtitle: "A spiking network and its ReLU twin, identical in everything but the neuron, compared for reliability on an event-camera gesture dataset"
description: "A spiking neural network and its ReLU twin, matched in architecture, parameter count, data, seed, and training, compared on DVS128Gesture for accuracy, calibration, robustness under four corruptions, temporal sensitivity, and paper energy. Spiking gives up 3.5 accuracy points and buys a calibration tie, up to +28 points under sensor noise with confidence that tracks its accuracy, and an 18.7x saving on the standard energy accounting. Single seed, n=288, bootstrap CIs on everything, and a live demo."
category: "Neuromorphic Computing"
metric: "+28 pts under noise"
metricChart: "crossing"
techStack: ["Python", "PyTorch", "SpikingJelly", "NumPy", "Modal", "FastAPI", "Next.js"]
image: "/projects/do-spikes-fail-differently.webp"
demoUrl: "/demo/spikes"
githubUrl: "https://github.com/TayyabManan/do-spikes-fail-differently"
featured: true
date: "2026-09-03"
---

## Overview
Take a convolutional network that works, replace every spiking neuron with a ReLU, and change nothing else. What do you lose, and what do you get back? That question is the whole project. Most comparisons between spiking and conventional networks report accuracy and an energy estimate. I wanted the reliability picture: whether the spiking model knows when it is wrong, whether it breaks the same way under damaged input, and whether it uses the timing that event cameras provide.

The design is one controlled experiment with one variable. The two models share architecture, parameter count, the same 16-frame event-camera inputs, loss, optimizer, schedule, batch size, seed, and epochs. Each leaky integrate-and-fire neuron in the spiking network becomes a ReLU in the twin. If they behave differently, the neuron did it.

In this matched pair, spiking is a trade, not a downgrade. It costs 3.5 accuracy points and about two points of timing sensitivity. It buys an exact tie on calibration, a large accuracy advantage under sensor noise with confidence that tracks accuracy while the twin's does not, and an 18.7x energy saving that is real on paper and imaginary on a GPU. This is a semester project and a miniature of my master's thesis, which points the same harness at spiking event-language models.

**[Read the full write-up →](/blog/do-spikes-fail-differently-snn-vs-ann)**

![accuracy and calibration under four corruptions · 288 test samples · bars = bootstrap 95% CI · the noise column is the headline](/projects/screens/do-spikes-fail-differently.webp)

## What it measured
- Accuracy on the 288-sample test set, with a paired McNemar test between the two models on the same samples.
- Calibration: expected calibration error and reliability diagrams, with confidence mapped from the MSE-trained rate outputs rather than softmax.
- Robustness under four event-camera corruptions at four severities each: background noise, event drop, occlusion, and a temporal shuffle, applied identically to both models.
- Temporal sensitivity, through the shuffle test, which the twin is provably invariant to by construction. Anything that changes is the spiking model using the order of events.
- Energy on the standard accounting ([Horowitz 2014](https://doi.org/10.1109/ISSCC.2014.6757323) costs), per layer, with spike density measured where the next layer actually reads it.
- A [live demo](/demo/spikes) that runs both models on a damaged test recording of your choice, on CPU, on Modal.

## Setup
Data is [DVS128Gesture](https://ibm.ent.box.com/s/3hiq58ww1pbbjrinh367ykfdf60xsfm8), IBM's event-camera dataset of 11 hand and arm gestures ([Amir et al., CVPR 2017](https://openaccess.thecvf.com/content_cvpr_2017/html/Amir_A_Low_Power_CVPR_2017_paper.html)), binned into 16 frames per sample with [SpikingJelly](https://github.com/fangwei123456/spikingjelly)'s loader. Both models see the exact same frames; nothing is collapsed or re-encoded for one side.

The spiking network is SpikingJelly's standard DVSGesture net: five blocks of 3x3 convolution, batch norm, LIF neuron, and max pooling, then two fully connected spiking layers and a 10-way voting layer onto 11 classes. Arctan surrogate gradient, multi-step mode, and a rate readout averaged over the 16 steps. The twin is the same net with each LIF swapped for a ReLU. It is stateless, so the 16 frames fold into the batch, per-frame outputs go through the same voting layer, and the 16 votes are averaged. Identical parameter count.

Both trained on an A10G on [Modal](https://modal.com/) with MSE loss against one-hot targets, Adam at 1e-3, a cosine schedule, batch 16, 64 epochs, seed 0, and a checkpoint on every epoch so a crash resumes instead of restarting. Every number below carries a bootstrap 95% interval (5,000 resamples, 3,000 on the corruption grid). With 288 test samples, one accuracy point is about three samples, so a point estimate alone is not reportable.

## Results

| Axis | Result |
|------|--------|
| Accuracy | Spiking 93.1% [89.9, 95.8] vs twin 96.5% [94.4, 98.6]. Paired gap +3.5 points [+1.0, +6.3], McNemar p = 0.021. Real, and also ten test samples. |
| Calibration (clean) | ECE 0.040 vs 0.039. Paired difference CI [-0.031, +0.017] includes zero. No measurable calibration cost. Both models about three points underconfident. |
| Noise | Curves cross at the mildest setting. Spiking leads by up to +28.1 points [+22.6, +33.7]. The twin's confidence stays high while its accuracy falls, up to 34 points overconfident; the spiking model's confidence stays within 4 points of its accuracy. |
| Event drop | The twin keeps its lead. At the extreme both are near 40% accuracy against 9% chance while about 80% confident. Both fail confidently. |
| Occlusion | The twin keeps its lead throughout. |
| Temporal shuffle | Twin flat at 96.5% at every severity, as it must be. Spiking loses 2.1 points [0.7, 3.8] at full shuffle. It uses timing, worth about two points. |
| Energy (accounting) | Spiking 3.30 mJ per sample vs twin 61.90 mJ, 18.7x. 98.1% of neuron-timesteps silent. The first layer sees analog frames and is billed at full cost for both. |

## The noise result
Noise adds Poisson background events to every frame, the event-camera version of hot pixels. Accuracy is half of what happens. As the noise grows, the twin keeps reporting high confidence while its answers get worse. The spiking model's confidence falls with its accuracy. One fails and reports success; the other degrades and says so. For any system that acts on a confidence score, the second failure mode is the one you want.

My working hypothesis is the leak. A LIF neuron is a low-pass filter over time: an isolated background event pushes the membrane and leaks away, while a gesture is correlated across frames and integrates. The twin averages per-frame outputs and has no such filter. This is a hypothesis, not a demonstrated cause. The experiment does not isolate the mechanism, and a correlated-versus-uncorrelated noise sweep is the next thing to run.

The result is also not a general property of spiking. Starve both models of events with the drop corruption and both fail confidently.

## Energy, with the bookkeeping shown
A multiply-accumulate is billed at 4.6 pJ and an accumulate at 0.9 pJ. The twin's layers pay full MACs on every input. A spiking layer pays an accumulate only when an input spike arrives, so its bill is MACs x 16 steps x input spike density x 0.9 pJ. The first conv layer sees analog frames rather than spikes, so it is billed at full MAC cost for both models. That choice is conservative and it dominates: conv1 is 84% of the spiking model's 3.30 mJ.

An earlier version measured spike density at each neuron's output and reported 20.6x. But a conv layer reads the map after max pooling, and pooling binary spikes is an OR over a 2x2 window, so the pooled map is denser. Fixing that raised the spiking bill by 10% and roughly halved the per-layer claim. The headline barely moved. The sensitivity did not go unnoticed.

The caveat, plainly: this is an accounting model, not a measurement. On a GPU both models draw similar power. The saving exists only on event-driven hardware.

## Design decisions
- One variable. Everything the two models could share, they share. Any difference in the input pipeline or the readout would have made the comparison about that instead.
- Confidence from normalized rates, never softmax. MSE-trained outputs are rates in roughly [0, 1.3], not logits. Softmax on that range squashes every confidence toward 1/11 and invents underconfidence that is not there.
- A confidence interval on every number and a paired test on every comparison. At n=288 that is the difference between a finding and a coincidence.
- A control that has to come out flat. The temporal shuffle cannot affect the twin, so its flat curve checks the whole harness while isolating the spiking model's use of timing.
- Seeded corruptions with fixed offsets, so both models see byte-identical damaged inputs and reruns reproduce. An early version used Python's per-process `hash()` for seeds; its conclusions held on the reproducible rerun, but the exact numbers could not be regenerated, so both output files are kept.
- Energy billed where the layer reads its input, after pooling, with the first layer charged at full cost against the spiking model.
- The demo runs the real checkpoints on a CPU container that sleeps when idle, behind a keyed proxy, so the study's numbers and the interactive version come from the same weights and the same corruption code.

## What I learned

### Experimental design
- The matched pair is the result. Ten samples of accuracy gap is a real, small difference that only means something because nothing else differs.
- A designed control earns its place. The shuffle test measured how much timing is worth and verified the harness in one run.
- Bookkeeping choices move energy ratios more than architecture does. A pooling detail halved a per-layer claim. Read every published SNN energy number asking where the density was measured.

### Reliability
- Two overparameterized networks came out slightly underconfident, not cocky. MSE-trained rates through a voting layer rarely saturate at 1.0.
- Honest confidence under noise is a property of this pair under this corruption, not of spiking in general. Under event loss both models fail confidently.
- Spikes propagate small perturbations. The demo runs on CPU; the twin matches the GPU run to four decimals while the spiking model's confidences drift by up to 0.1, because a rounding difference near threshold flips a spike and everything downstream of it.

### Engineering
- Per-epoch checkpoints on a persistent volume mean a crash resumes instead of restarting.
- The demo backend restores from a memory snapshot and scales to zero, so a study-grade model can sit behind a public page for a few dollars a month.

## What's next
- Seeds 1 and 2. Everything here is single seed, and nothing is publishable that way. About $15 of compute.
- The correlated-versus-uncorrelated noise sweep that tests the leak hypothesis directly.
- Temperature scaling on both models, to see whether the calibration tie survives post-hoc calibration.
- The thesis: the same harness pointed at spiking event-language models, where the test split is about the same size and the bootstrap discipline transfers as is.

Caveats, stated once more because they belong on the page: single seed, n=288, energy is an accounting model, and the noise mechanism is a hypothesis.
