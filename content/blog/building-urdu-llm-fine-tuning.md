---
slug: "building-urdu-llm-fine-tuning"
title: "Building an Urdu LLM: From Data Curation to Deployment"
description: "A technical deep-dive into fine-tuning Qwen 2.5 7B for Urdu across three versions: curating a bilingual Urdu/Roman-Urdu corpus, QLoRA training on a rented H100, diagnosing and fixing catastrophic forgetting, building a blinded multi-judge evaluation harness (including a free Claude-Code-CLI judge), fixing the regressions a data change caused, RAG-aware retraining that fixed retrieval's structural failure without turning it into a blanket win, and shipping a live demo on Gradio + Modal."
date: "2026-06-28"
author: "Tayyab Manan"
category: "Machine Learning"
tags: ["Machine Learning", "LLM Fine-Tuning", "QLoRA", "Low-Resource NLP", "LLM-as-Judge", "RAG", "Synthetic Data", "Modal", "MLOps"]
image: "/projects/urdu-llm-fine-tuning.webp"
readTime: "20 min read"
---

# Building an Urdu LLM: From Data Curation to Deployment

This post is the technical deep-dive behind the [Urdu LLM Fine-Tuning](/projects/urdu-llm-fine-tuning) project. I'll walk through the full pipeline across three versions: curating a bilingual Urdu corpus, QLoRA training, a multi-judge evaluation harness, a RAG layer that failed and the retraining that fixed it, and a live demo that works. It was my first end-to-end fine-tuning project, built in public for about $60, and a lot of what I learned came from getting things wrong on a public timeline. Three versions in, the current model wins about 79.5% of blind comparisons against the base.

## The Problem: Urdu Is Demographically Huge, Computationally Tiny

Urdu has roughly 230 million speakers, which puts it among the most spoken languages on the planet. In machine learning it's still treated as low-resource. The issue isn't a shortage of Urdu text. It's a shortage of Urdu text in the clean, instruction-tuned form modern chat models train on, plus a near-total absence of open models specialized for it. General base models will produce Urdu, but they tend to wobble: they slip into English on anything slightly unusual, and one popular 7B base slips into *Chinese* when you push it.

There's a second problem that English-first models ignore: most Pakistanis don't type in Urdu script. They type **Roman Urdu** (Urdu spelled phonetically in the Latin alphabet, "aap kaise ho?") and they code-switch into English constantly ("mujhe Python decorators samjhao"). A model that only handles formal Urdu script is technically multilingual and practically useless for how people actually write.

So the target wasn't "a model that knows Urdu." It was "a model that handles the three registers a real Pakistani user moves between": Urdu script, Roman Urdu, and Urdu/English code-mixing.

## The Base Model and the Plan

I picked Qwen 2.5 7B Instruct as the base. It already had a usable Urdu prior, an Apache-2.0 license, and it runs in 4-bit on modest hardware. The plan was QLoRA (fine-tune a small set of low-rank adapters on top of a frozen, quantized base) because at this budget and scale, full fine-tuning would have been expensive overkill. QLoRA trains a fraction of a percent of the weights and ships as a tiny adapter you bolt onto the base.

The whole project is a data-centric loop: download → clean → format → train → evaluate → diagnose → fix the data → retrain. The interesting decisions live in the data, not the optimizer.

## The Data: Four Sources, Two Scripts

The training corpus draws from four sources, deliberately covering both Urdu script and Roman Urdu:

| Source | Role | Script |
|--------|------|--------|
| ~51k-pair Urdu instruction dataset | Backbone of the corpus | Urdu |
| Cohere Aya (Urdu subset) | Human-written quality anchor | Urdu |
| Existing Roman-Urdu Q&A set | Roman coverage | Roman |
| My own LLM transliterations | Roman coverage at scale | Roman |

After cleaning and formatting, the v2 corpus was 63,322 examples. (Version 3 later grew this with synthetic data; more on that below.)

### Cleaning

The cleaning stage is intentionally model-agnostic. It removes exact duplicates (the single biggest cut), rows with too low an Urdu-character ratio, and over-length examples. Crucially, cleaning is kept *separate* from formatting. Cleaning is about data quality and doesn't care which model you're targeting; formatting applies the model's chat template and is specific to Qwen. If I switch base models later, I re-run the format step, not the clean step. Keeping that boundary clean meant I never had to re-clean the corpus when I iterated on the training format.

### Roman Urdu, the Right Way

The naive way to make Roman Urdu is a deterministic character map from Urdu script to Latin. It produces robotic, vowel-dropped text that no human would type. Real Roman Urdu is full of conventional, slightly inconsistent spellings (*bohat*, *kya*, *hai*) and it leaves English words in English.

So instead of mapping characters, I prompted a cheap model (GPT-4o-mini) to *rewrite* Urdu as "how a Pakistani would type it on WhatsApp": keep the meaning, change only the script, preserve natural spellings, leave English alone. Low temperature for consistency, batched and resumable, budget-gated. The two transliteration batches were sampled to be disjoint, so I wasn't paying to regenerate the same examples. Total data-generation cost across all synthetic sets came to a little over a dollar in API charges.

### Synthetic Code-Mixed Data

The most targeted data I generated was code-mixed: synthetic Q&A written to sound like how Pakistani developers actually talk in a group chat, natural switching between Urdu and English, across roughly 280 technical topics (Python, web, data structures, databases, DevOps, ML, security, freelancing). I'll explain *why* this set mattered so much in the training section. The short version: it's the data that fixed a regression I caused myself.

### Formatting

Everything lands as Alpaca-style JSONL (`{instruction, input, output}`), and the Qwen chat template is applied at *training* time rather than baked into the data. Roman Urdu ended up roughly 15% of the corpus, which is what makes the model usable for people who never type in Urdu script.

## Training: QLoRA on a Rented H100

Training ran on a single Modal H100. The configuration:

- **Method:** QLoRA: 4-bit base weights (NF4, via Unsloth defaults) with LoRA adapters
- **LoRA:** rank 16, alpha 32, applied to all attention and MLP projection modules
- **Trainable params:** ~40M out of ~4.9B, about 0.82% of the model
- **Optimization:** effective batch size 16 (per-device 2 × grad-accum 8), learning rate 2e-4 on a cosine schedule, 3% warmup, AdamW 8-bit
- **Sequence length:** 2048 tokens during training, extended to 4096 for inference
- **Hardware:** one NVIDIA H100 80GB, ~$3.50/hr on Modal
- **Result:** final train loss 0.3699, a 154 MB adapter, peak VRAM of just 8.56 GB

That last number is worth pausing on. A 7B model fine-tuned with QLoRA peaked at 8.56 GB on an 80 GB card. Fine-tuning at this scale fits comfortably on hardware most people can rent for a few dollars, or even own. The barrier is lower than the "7B" label suggests.

### The v1 Mistake: Catastrophic Forgetting

The first version was trained for 3 epochs, almost entirely on Urdu-*script* data. It got better at Urdu and noticeably worse at anything involving code. On my evaluation set, v1 won 0% of code-mixed prompts and 10% of "explain this code in Urdu" prompts. The model had specialized so hard on one distribution that it forgot a capability the base model already had.

That's catastrophic forgetting, and watching it happen on my own model was far more convincing than reading about it. Two diagnoses came out of v1:

1. **No code data** in the mix, so coding ability decayed.
2. **Only a sliver of Roman Urdu**, so the most common real-world register was underrepresented.

There was also an overfitting lesson hiding in the loss curves. Eval loss bottomed out at epoch 2 and then plateaued while train loss kept dropping. The third epoch was memorization, not learning.

### The v2 Fix

The fix was upstream, in the data, not in the learning rate. For v2 I added the synthetic code-mixed examples and a second batch of Roman-Urdu transliterations, and I dropped to 2 epochs.

The payoff was the most satisfying result in the project:

- Code-mixed: 0% → 80%
- Code explanation in Urdu: 10% → 60%
- Creative writing: up to 91%

The two categories v1 lost outright became two of v2's biggest wins, and I didn't touch a single hyperparameter to get there. At this scale, the data mix *is* the model.

### Two Engineering Lessons

Two gotchas cost me time and are worth flagging:

- **`save_total_limit` can delete your best checkpoint.** With `load_best_model_at_end=True`, if the checkpoint cap evicts the best checkpoint before training ends, there's nothing to load back. v1 hit this exactly. v2 raised the limit.
- **Always make training resumable.** Rented GPUs time out. My first long run hit a wall-clock timeout and resumed from a checkpoint instead of restarting from zero. Total training came to roughly five hours of H100 time across one timeout-and-resume. Wrapping logging and volume commits in a `try/finally` meant even a crash persisted the training log.

## Evaluation: Measuring "Better" Without a Benchmark

For a low-resource language, evaluation is harder than training. There's no off-the-shelf Urdu instruction-following benchmark to point at, so I built the harness, and I tried to make it skeptical of its own results, because the easiest thing in the world is to convince yourself your model improved.

### The Eval Set

100 prompts I hand-wrote across 8 categories, spot-validated by another native Urdu speaker. The distribution is intentionally realistic rather than uniform:

| Category | Prompts |
|----------|---------|
| Question answering | 21 |
| Reasoning | 16 |
| Translation (UR↔EN) | 15 |
| Summarization | 11 |
| Grammar correction | 11 |
| Creative writing | 11 |
| Code explanation | 10 |
| Code-mixed | 5 |

By script, it splits 70 Urdu-script / 25 Roman Urdu / 5 code-mixed, roughly the mix a real user would produce.

### Blinded Pairwise Judging

The metric is pairwise win rate against the base model. For each prompt, base and fine-tuned models generate with identical decoding parameters (temperature 0.7, top-p 0.9, max 512 tokens). If the fine-tune wins, it's the weights talking, not a temperature trick. The two responses are then A/B-shuffled per item and handed to an LLM judge with an explicit instruction: a confident-but-wrong answer loses to one that admits uncertainty.

### Multiple Judges, Reported as Median and Range

A single judge gives a clean number you shouldn't trust. I ran three independent model families and reported the median plus the spread:

| Judge | Win rate vs base |
|--------|------|
| Claude Desktop (Opus 4.7) | 67.0% |
| GPT 5.3 Thinking | 66.0% |
| Gemini 3.1 Pro | 48.0% |
| **Median (3 judges)** | **66.0%** |

That 48–67% spread is information. The judges agree on translation and creative quality and disagree most on code and reasoning. Reporting only the friendliest judge would have been dishonest; the median (66%) with the range attached is the honest headline. For comparison, v1 (scored by a single judge) came in at 51.5% and missed the 60% target I'd set.

Here's the full per-category picture for v2, and it includes the regressions, because hiding them would defeat the point:

| Category | Win rate | Direction |
|----------|----------|-----------|
| Creative writing | 91% | strong gain |
| Code-mixed | 80% | strong gain (v1 was 0%) |
| Translation | 80% | strong gain |
| Question answering | 71% | gain |
| Code explanation | 60% | gain (v1 was 10%) |
| Summarization | 46% | **regression** (v1 was 73%) |
| Reasoning | 31% | **regression** (v1 was 44%) |
| Grammar correction | 36% | **regression** (v1 was 40%) |

The same data changes that fixed code and creative quality cost me summarization, reasoning, and grammar. Those three are the next version's work-list, not something to bury.

### A Free Judge via the Claude Code CLI

I wired in a fourth, automated judge by wrapping the Claude Code CLI (`claude -p --output-format json`) as a custom Haystack component that calls it as a subprocess. No API key, billed against a Max subscription, $0 marginal cost, and I could re-run the entire 100-prompt evaluation on demand. It scored 65%, but I excluded it from the median: it agreed with Claude Desktop 79% of the time, so it was redundant rather than an independent check. The cross-model judges are the real stress test.

### Position Bias Is Real

The most useful methodological finding came from comparing my automated judging against earlier manual passes on the *same outputs*. The automated judges scored 8 to 14 percentage points higher. The cause was almost entirely position bias: my manual passes had a fixed base-first ordering, while the automated runs randomized A/B per item. If you don't randomize position, you're partly measuring the judge's left/right preference, not the model. Randomize, and use more than one judge.

One caveat I keep attached to the 66%: pairwise preference is not correctness. A 66% win rate means people prefer the fine-tune in blind comparisons. It does not mean 66% of its answers are factually true. Many wins are fluency and style. Preference is the right tool for "better than base" and the wrong tool for "trustworthy."

## The RAG Experiment That Didn't Work

The plan had a fourth stage: a retrieval layer over Urdu Wikipedia, so the model could ground factual answers in real text instead of hallucinating. The architecture was reasonable: hybrid retrieval (dense embeddings plus a BM25 sparse sidecar, fused), then a cross-encoder reranker to pick the top few chunks, with the fine-tuned model generating an answer from them.

It didn't beat the plain fine-tune. Against v2 with no retrieval, the RAG version lost the majority of head-to-head comparisons.

The *why* is the most valuable thing the experiment produced, and it's a real architectural lesson:

> This model was trained on direct question→answer pairs only. The retrieval endpoint prepends a block of context the model never saw during training, so that input is out of distribution. The same fine-tune that makes Qwen fluent in Urdu is the fine-tune that makes it unable to use retrieved context. It treats the prepended chunks as noise and follows its trained instinct to answer directly.

You can't bolt RAG onto a model that wasn't trained for it. On factual questions, retrieval surfaced the right answer but the model often ignored it; on non-factual tasks (summarize this, fix this grammar), the chunks were pure distraction. Consider a question like "which is the largest province by area?": the plain fine-tune answers confidently and sometimes wrongly, and even when the correct answer is sitting in a retrieved chunk, the model frequently talks past it.

There was also a tempting shortcut that failed worse: use the *base* model (which handles prepended context better) with retrieval, skipping the fine-tune. But the base model, fed Urdu context, falls back to its pretraining and leaks Chinese, on 45 of 100 answers. So neither side wins cleanly: the fine-tune has the Urdu fluency but can't use context; the base can use context but loses the Urdu. That's the catch-22 at 7B.

The fix is upstream: add `(query, context, grounded-answer)` triples to the training mix, formatted exactly the way the retriever serves them, including deliberately noisy examples where the right answer *isn't* in the context, so the model learns to ignore irrelevant chunks instead of forcing them into the answer. That's what version 3 does, and the result was more honest than the headline I'd hoped for.

(One small process win from this stage: before paying to re-index the whole corpus on a hunch that my embeddings were mismatched, I ran a ten-cent diagnostic that compared stored vectors against freshly-encoded ones. They were identical. The ten-cent check saved a multi-dollar reindex. Diagnose before you spend.)

## Version 3: Fixing the Regressions and Making RAG Real

v2 left two debts. Three categories had regressed (summarization, reasoning, grammar), and the RAG layer couldn't use the context it was handed. v3 paid both down with the same lever that fixed catastrophic forgetting: better data, not a new optimizer. I generated about 5,700 new synthetic examples for around $0.63 and folded them into the existing corpus.

### The New Data, and Letting Python Own the Answer

The theme of the v3 data is *not trusting the language model with anything a program can verify*:

- **Grammar pairs.** GPT-4o-mini *corrupts* a trusted, human-written Urdu sentence with one labelled error. The gold answer is the original trusted sentence, never a model rewrite. That way the model's own imperfect Urdu can't poison the grammar target.
- **Summarization.** The prompt asks for an exact sentence count, and I verify the count in Python (retry once, else discard).
- **Reasoning.** Python owns *all* the arithmetic. It generates the numbers and the answer, and the model only narrates the steps in Urdu. I then check that the computed digits actually appear in the output. The model never does math.
- **RAG triples.** Grounded on real Urdu Wikipedia chunks, formatted *byte-for-byte* like the retrieval endpoint serves them. Three kinds: a single gold chunk, a gold chunk plus two distractors, and "noise" (three unrelated chunks where the right move is to say the context doesn't help).

A quick detour on knowing when *not* to build something: while assembling this data I read FAIR's "Agentic Self-Instruct" paper, which has an agent generate, test, and refine training data in a loop. Good idea, but it's built for reinforcement learning with verifiable rewards, and I'm doing plain supervised fine-tuning; I'd also already done its core moves a cheaper way (grounding, deterministic checks, a human review gate). So I wrote down *why* I was skipping it and moved on. Reading a paper and deciding it doesn't fit is also engineering.

### The Spot-Check That Earned Its Keep

Before spending money on training, I reviewed 200 of the generated examples by hand. Two systemic bugs turned up that my automated self-tests had completely missed:

1. **One reasoning template was 100% broken.** The "sum of three ages" problems rendered the scenario but dropped the actual question, *"Ayesha is 33, Tariq is 5 older, Imran is 2 younger."* and then nothing. My validator only checked that the right digits appeared, not that a question existed, so it waved every one of them through.
2. **The RAG "noise" answers were confidently wrong.** For the noise examples, the gold answer said "not in the context, but generally…" and then asserted a fact from GPT-4o-mini's own knowledge. Unverified. Across all 282 noise rows, about 18% asserted something wrong or unverifiable, concentrated alarmingly in religious questions (Urdu Wikipedia is religion-heavy, so the noise questions skewed that way, so the model confabulated exactly where a wrong confident answer does the most harm).

I fixed both at the generator level. Python now owns the *question* the same way it owns the arithmetic, and the noise answers just decline instead of fabricating. Then I regenerated the affected slices and verified them clean: zero missing questions, zero confabulations. The lesson I keep relearning: a deterministic check beats an LLM judge for the things it can actually check, and a human still beats both for the things neither can.

### Training v3

68,997 examples (the 63k from v2 plus the ~5,700 new ones), same QLoRA recipe, two epochs, with the sequence length bumped to 4096 so the RAG context fits without truncation. Final train loss 0.5738, about $5–6 of H100 time.

### Results: The Regressions Recovered

I judged v3 with Claude and GPT-5.3 (Gemini's free tier caps at 20 requests a day, too few for a 100-prompt set, so it sat this one out). Against the base model, v3 wins 79.5% overall, up from v2's 66%, and all three regressions recovered:

| Category | v2 vs base | v3 vs base |
|----------|-----------|-----------|
| Creative writing | 91% | 100% |
| Translation | 80% | 97% |
| Summarization | 46% | **82%** |
| Grammar correction | 36% | **82%** |
| Question answering | 71% | 79% |
| Code explanation | 60% | 75% |
| Code-mixed | 80% | 70% |
| Reasoning | 31% | **53%** |
| **Overall vs base** | **66%** | **79.5%** |

On its own, that's the result I wanted. But there's an honest caveat, and it's the kind that a "v3 > v2" headline would hide: judged head-to-head, **v3 only wins 43% of direct matchups against v2.** It clearly wins summarization, grammar, and code-mixed, but *loses* translation, code-explanation, reasoning, and qa. Pouring in RAG, grammar, and summarization data traded away strength elsewhere. There is no free lunch in the data mix. v3 is better at the things I targeted and worse at some things I didn't, and that's worth saying out loud.

### RAG, The Honest Result

This is where I was most wrong, and the correction is the most useful thing in v3.

The structural fix worked completely. **0 of 100 RAG answers leaked Chinese**, where v2's base-plus-RAG leaked on 45 of 100. And on the questions that actually need a fact, RAG *corrects* the model: asked for Pakistan's largest province by area, plain v3 says "Punjab" (wrong), and RAG says "Balochistan, 347,190 km²" straight out of the retrieved article.

But when I judged RAG-v3 against plain v3 across all 100 prompts, **RAG won only 15.5%**, basically the same as v2's 17%. My hypothesis that RAG-aware training would flip retrieval into a net win was just wrong, and here's why: 79 of the 100 eval prompts are creative writing, grammar, reasoning, translation, and code, where retrieved Wikipedia context is pure noise. RAG *should* lose those. Even on factual QA it only won 31%, because plain v3 often already knows the answer and phrases it more cleanly than a context-stitched response, and a preference judge rewards "fluent and right" over "grounded but clunky."

So RAG didn't become a blanket upgrade. What it became is *safe*, a deployable grounding tool you can point a factual query at without it collapsing into Chinese word-salad. v2 never had that. That's a smaller, truer claim than the one I started with, and I'll take a true small claim over an oversold big one.

## Deployment: A 7B Model on Free Infrastructure

The demo had to be free to host and good enough to show. A 7B model can't run on the free Hugging Face Spaces CPU tier: you're looking at tens of seconds per token, effectively unusable. So I split the stack:

- **Backend:** a Modal app serves the fine-tuned model behind a `/generate` endpoint (and a `/rag` endpoint for grounded queries) on an H100 that scales to zero (so it costs nothing when idle) and stays warm for five minutes after a call (so a demo session stays snappy). The adapter loads once per warm container.
- **Frontend:** a lightweight Gradio Space that's a thin proxy: it reads the Modal URL from a secret and POSTs to it. Free to host on Spaces, pay-per-second to run on Modal.

Two details made the demo feel finished rather than broken:

**Cold-start UX.** The first request after idle has to cold-start the Modal container, which can take a minute or two. A blank output box for two minutes reads as "broken." So the frontend handler is a generator: it yields an immediate acknowledgment ("sending request, warm calls return in a few seconds, cold start may take a few minutes") before the real answer, so the wait feels intentional.

**Script-aware rendering.** Urdu needs the Nastaliq script, rendered right-to-left, with a taller line-height than Latin text, and a single reply can mix both scripts in different paragraphs. Line-height and direction are per-element, so a blanket Urdu font breaks any English in the output. The fix is a small bit of JavaScript: a MutationObserver watches the streamed output, counts the dominant Unicode script per block, and sets the language and direction attributes per paragraph. Urdu paragraphs render as RTL Nastaliq, English ones as LTR sans-serif, in the same response.

## Design Decisions Summary

| Decision | Chosen | Alternative | Why |
|----------|--------|-------------|-----|
| Base model | Qwen 2.5 7B Instruct | Smaller 0.5–1.5B / Llama | Usable Urdu prior, Apache-2.0, runs in 4-bit |
| Fine-tune method | QLoRA (Unsloth) | Full fine-tuning | 0.82% of params, 154 MB adapter, ~$5–15/run |
| Roman Urdu generation | LLM "WhatsApp" rewrite | Character mapping | Natural spellings, not robotic transliteration |
| Epochs | 2 | 3 | Eval loss bottomed at epoch 2; epoch 3 overfit |
| Forgetting fix | Add code/Roman data | Tune hyperparameters | Data-centric; took code-mixed 0% → 80% |
| Regression fix (v3) | Add grammar/summ/reasoning data | Accept the trade-off | Recovered all three; summ 46% → 82%, grammar 36% → 82% |
| Verifiable data | Let Python own the answer | Trust the generator | Deterministic checks caught two systemic bugs |
| Evaluation | Median across cross-model judges | Single judge | Exposes the spread, controls position bias |
| Serving | Gradio Space + Modal H100 | Model on Spaces CPU | 7B is unusable on the free CPU tier |
| RAG | RAG-aware retraining (v3) | Bolt onto v2 | Retrieval must be in the training distribution; fixed the structural failure |

## What I Learned

**Catastrophic forgetting is real, and it's a data problem.** Specializing on Urdu script alone silently erased the base model's coding ability. I didn't fix it by tuning the optimizer; I fixed it by putting code and code-mixed examples back into the data. For specialization on a strong base model, the data mix is the highest-leverage knob there is.

**Data mixes rebalance; they don't strictly improve.** v3 beat the base 79.5% and recovered every regression, but head-to-head it only beat v2 43% of the time. The grammar, summarization, and RAG data I poured in traded away some translation and reasoning. There's no free lunch in the mix, and it's worth knowing before you tell anyone "v3 > v2."

**Single-judge evaluation will lie to you, mostly through position bias.** The first numbers I trusted came from one judge with fixed ordering and didn't survive a cross-model, position-randomized re-run. Now I report a median and a range across multiple model families, and I randomize A/B on every comparison. The 8–14 point gap I measured between biased and unbiased judging is the whole reason.

**The cheap, boring quality gates catch the expensive bugs.** A Python digit-check and a human reading 200 rows found two systemic failures, a 100%-broken reasoning template and a batch of confabulated RAG answers, that a clean-looking automated test suite waved straight through. Spend the ten cents on the diagnostic; read the two hundred rows.

**You can't bolt RAG onto a model that wasn't trained for it, and training for it fixes the breakage, not the win rate.** v2's retrieval stack was fine; the model was the bottleneck, treating prepended context as out-of-distribution noise. v3 put retrieval-format triples in the training data and the structural failure vanished, Chinese leakage went 45/100 → 0. But RAG still only won 15.5% of comparisons, because most prompts don't need a looked-up fact. Training for RAG makes it *safe*, not universally better. Measuring it on a blanket eval buries the signal under all the prompts that never needed retrieval.

**A 7B QLoRA fine-tune is lighter than its name.** Peaking at 8.56 GB of VRAM and shipping as a 154 MB adapter, this kind of work is accessible to anyone with a few dollars of GPU time. The infrastructure story (Modal for training and serving, a free Spaces frontend, Claude Code as a zero-cost judge) kept the whole project, three model versions and two RAG attempts, under $60.

Most of all: keeping the failures in the writeup, with the numbers attached, is the part I'd defend hardest. The overfit epoch, the forgetting, the RAG layer that lost and then only half-won: those are the parts that taught me something, and they're the parts a clean success story would have hidden. A negative result you instrumented well, like knowing *exactly why* RAG wins only 15.5%, is still a result.

## Links

- [Live Demo](https://huggingface.co/spaces/TayyabManan/urdu-llm-chat)
- [Model on Hugging Face](https://huggingface.co/TayyabManan/qwen2.5-7b-urdu-v3)
- [Source Code](https://github.com/TayyabManan/Urdu-LLM)
- [Project Page](/projects/urdu-llm-fine-tuning)
