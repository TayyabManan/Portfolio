---
slug: "urdu-llm-fine-tuning"
title: "Urdu LLM Fine-Tuning"
subtitle: "QLoRA-Tuned Qwen 2.5 7B for Urdu, Roman Urdu & Code-Mixed Chat"
description: "A Qwen 2.5 7B Instruct model fine-tuned with QLoRA to speak natural Urdu: Urdu script, Roman Urdu, and Urdu/English code-mixing. Reaches a 66% median pairwise win rate over the base model across three independent LLM judges on a 100-prompt evaluation set, validated with a multi-judge harness (including a free Claude-Code-CLI judge) and shipped as a live Gradio + Modal demo. A first end-to-end fine-tune, built in public for under $50."
category: "Machine Learning & MLOps"
techStack: ["Python", "PyTorch", "Unsloth", "QLoRA / PEFT", "Hugging Face", "Modal", "Gradio", "Haystack", "Qdrant"]
image: "/projects/urdu-llm-fine-tuning.webp"
demoUrl: "https://huggingface.co/spaces/TayyabManan/urdu-llm-chat"
githubUrl: "https://github.com/TayyabManan/Urdu-LLM"
featured: true
date: "2026-06-07"
---

# Urdu LLM Fine-Tuning

## Overview
Urdu has around 230 million speakers, which makes it one of the most widely spoken languages on earth. In machine learning it is still treated as low-resource: there is plenty of Urdu text in the world, but very little of it exists in the clean, instruction-tuned form modern chat models learn from, and almost no open models are specialized for it. The base models that *do* speak Urdu tend to drift into English the moment a prompt gets slightly unusual. One popular 7B base drifts into Chinese.

There is a second wrinkle that English-first models miss entirely. Most Pakistanis don't type in Urdu script at all. They type *Roman Urdu* (Urdu written phonetically in the Latin alphabet, "aap kaise ho?") and freely mix in English ("mujhe Python decorators samjhao"). A model that only handles formal Urdu script is solving the wrong problem.

This project fine-tunes Qwen 2.5 7B Instruct to handle all three: Urdu script, Roman Urdu, and Urdu/English code-mixing. It was my first end-to-end fine-tuning project, built in public over a 30-day window with weekly updates. The whole thing (data generation, training, multi-judge evaluation, a live demo, and a RAG prototype) came to about $50 of an $80 budget ceiling. The final model wins 66% of head-to-head comparisons against the base model, judged by three independent LLMs.

**[Read the full technical deep-dive →](/blog/building-urdu-llm-fine-tuning)**

## Key Features
- **Bilingual, code-mixed Urdu**: One model that handles Urdu script, Roman Urdu (Latin-script Urdu, how most Pakistanis actually type), and Urdu/English code-switching, not just formal Urdu.
- **66% median win rate over the base model**: Pairwise preference across three independent LLM judges (range 48–67%) on a 100-prompt, hand-curated Urdu evaluation set.
- **A tiny, cheap adapter**: QLoRA produces a 154 MB LoRA adapter that trains only 0.82% of the model's parameters and peaks at 8.56 GB of VRAM on an 80 GB H100. Fine-tuning a 7B model turned out to be far lighter than the hardware suggests.
- **A multi-judge evaluation harness**: Blinded pairwise judging with position-bias randomization, run across Claude, GPT, and Gemini, plus a $0 Claude-Code-CLI judge wired in as a Haystack component.
- **Recovered catastrophic forgetting**: Code-mixed task win rate went from 0% (v1) to 80% (v2) by changing the *data*, not the hyperparameters.
- **A live demo on real infrastructure**: A free Gradio Space frontend proxying to a Modal H100 backend, with script-aware Nastaliq/Latin rendering that detects each paragraph's script live.
- **Built in public, on a budget**: The full pipeline, evaluation scripts, and roadmap are shipped openly, under Apache 2.0.

## Technical Architecture
The project is a data-centric loop: download → clean → format → QLoRA train → multi-judge evaluate → diagnose → improve the data → retrain. The interesting work happens in the data, not the optimizer.

**Data pipeline.** Four sources feed the training mix: a ~51k-pair Urdu instruction dataset as the backbone, a small slice of human-written Aya Urdu as a quality anchor, an existing Roman-Urdu set, and my own Roman-Urdu transliterations. A model-agnostic cleaning stage removes duplicates, low-Urdu-ratio rows, and over-length examples, then a deliberately *separate* model-specific formatting stage emits Alpaca-style JSONL (`{instruction, input, output}`). The Qwen chat template is applied at training time, not at data-prep time, so the same cleaned corpus can target a different base model later by re-running only the format step.

**Training.** QLoRA via Unsloth on a single Modal H100: 4-bit base weights with LoRA adapters (r=16, alpha=32) on all attention and MLP projection modules, an effective batch size of 16, learning rate 2e-4 on a cosine schedule, AdamW 8-bit. Training is fully checkpointed and resumable, which mattered when the first run hit a timeout and had to resume mid-training rather than start over.

**Evaluation.** A 100-prompt, hand-curated Urdu eval set across 8 task categories, scored by blinded pairwise judging. Base and fine-tuned outputs are generated with identical decoding parameters, then A/B-randomized per item and handed to multiple LLM judges. The judging is driven by a Haystack pipeline with custom generators, including one that shells out to the Claude Code CLI.

**Serving.** A 7B model can't run on the free Spaces CPU tier, so serving is split: a Modal app exposes the fine-tuned model behind a `/generate` endpoint on an H100 that scales to zero, and a lightweight Gradio Space acts as the public frontend, posting to that endpoint.

## Model Performance
The headline metric is pairwise win rate against the base Qwen 2.5 7B Instruct, on the 100-prompt eval set, judged blind.

| Judge | Win rate vs base |
|--------|------|
| Claude Desktop (Opus 4.7) | 67.0% |
| GPT 5.3 Thinking | 66.0% |
| Gemini 3.1 Pro | 48.0% |
| **Median (3 judges)** | **66.0%** |

A fourth automated judge, the Claude Code CLI subprocess, scored 65.0%, but I excluded it from the median because of 79% same-model agreement with Claude Desktop. The cross-model judges (GPT and Gemini) are the meaningful stress test, and they bracket a real spread: a single judge would have reported a deceptively clean number.

### Per-category, median across 3 judges

| Category | Win rate | Note |
|----------|----------|------|
| Creative writing | 91% | strong gain |
| Code-mixed (Urdu/English) | 80% | v1 was 0% |
| Translation (UR↔EN) | 80% | |
| Question Answering | 71% | |
| Code explanation in Urdu | 60% | v1 was 10% |
| Summarization | 46% | regressed from v1's 73% |
| Reasoning | 31% | regressed from 44% |
| Grammar correction | 36% | regressed from 40% |

The first version (a 3-epoch run, judged by a single model) scored 51.5% overall and missed the 60% target. The jump to 66% came from two data changes between v1 and v2, and those same changes introduced the three regressions at the bottom of the table. Those regressions are the next version's work-list, not something I'm going to paper over.

One honest caveat I keep attached to this number: a 66% pairwise win is *preference*, not *correctness*. It does not mean 66% of answers are factually right. Many wins are fluency and style. Pairwise preference is the right tool for "is the fine-tune better than the base," and the wrong tool for "is the fine-tune trustworthy."

## How the Model Was Evaluated
For a low-resource language, evaluation is harder than training. There's no standard Urdu instruction-following benchmark to point at, so I built the harness myself and tried to make it skeptical of its own results.

- **A hand-curated set, not a scraped one.** 100 prompts across 8 categories (QA, summarization, translation, grammar, reasoning, creative, code explanation, code-mixed), written by me and spot-validated by another native Urdu speaker. The split is intentionally realistic: 70 Urdu-script, 25 Roman Urdu, 5 code-mixed.
- **Decoding parity.** Base and fine-tuned models generate with identical decoding parameters. If the fine-tune wins, it's the weights talking, not a temperature trick.
- **Blinded, position-randomized judging.** Each comparison is A/B-shuffled per item before it reaches a judge, with an explicit rule that a confident-but-wrong answer loses to one that admits uncertainty. This matters more than it sounds: I later measured that automated judges scored 8–14 percentage points higher than my earlier manual passes on the *same* outputs, almost entirely because the manual passes had a fixed base-first ordering and the automated ones randomized position. Position bias is real, and the only defense is to randomize and to use more than one judge.
- **Three model families, reported as median plus range.** Claude, GPT, and Gemini disagree most on code and reasoning tasks and agree on translation and creative. Reporting the median (66%) and the range (48–67%) is more honest than cherry-picking the friendliest judge.
- **A free judge via the Claude Code CLI.** I wrapped `claude -p --output-format json` as a Haystack component, calling it as a subprocess on a Max subscription with no API key. It cost nothing and let me re-judge the full set on demand.

## The Catastrophic-Forgetting Fix
The most instructive moment in the whole project was a failure.

Version 1 was trained almost entirely on Urdu-*script* instruction data. It got better at Urdu, and noticeably worse at anything involving code. On the eval set, it won 0% of code-mixed prompts and 10% of "explain this code in Urdu" prompts. The fine-tune had specialized so hard on one distribution that it forgot a capability the base model already had. That's catastrophic forgetting, and seeing it happen on my own model was more convincing than reading about it.

The fix was upstream, in the data, not in the learning rate. For v2 I added two things to the mix:

- **~1,700 synthetic code-mixed examples** generated to sound like how Pakistani developers actually talk on WhatsApp and Discord: natural code-switching between Urdu and English, across ~280 technical topics.
- **~5,000 Roman-Urdu examples**, transliterated from existing Urdu data.

The result: code-mixed went 0% → 80%, code explanation went 10% → 60%, and creative writing climbed to 91%. The two categories v1 lost outright became two of v2's biggest wins, and Roman Urdu grew to about 14.7% of the corpus, which is what makes the model usable for people who never type in Urdu script. None of this required touching the optimizer. The lesson I'll carry forward is that at this scale, the data mix is the model.

## Design Decisions
- **Data-centric iteration over hyperparameter tuning.** Every gain from v1 to v2 came from changing the data (adding code, adding Roman Urdu), not from sweeping hyperparameters. For a specialization task on a strong base model, the data is the highest-leverage knob.
- **QLoRA over full fine-tuning.** Training 0.82% of the parameters into a 154 MB adapter, peaking at 8.56 GB of VRAM, costs ~$10–15 per run on a rented H100. Full fine-tuning was never necessary at this scale or budget, and the adapter ships as a tiny artifact anyone can apply to the base.
- **LLM transliteration over character mapping for Roman Urdu.** Instead of a deterministic Urdu→Latin character map (which produces robotic, vowel-dropping text), I prompted a cheap model to rewrite Urdu as "WhatsApp Urdu": keeping natural spellings (*bohat, kya, hai*) and leaving English words in English. The goal was Roman Urdu that a real person would type, not a transliteration scheme.
- **Two epochs, not three.** v1's third epoch overfit: eval loss bottomed at epoch 2 while train loss kept dropping. v2 stopped at two.
- **Median across three cross-model judges, not one.** A single judge gave a clean-looking score that didn't survive contact with other model families. The 18-point spread between judges is information, and hiding it would be dishonest.
- **A split frontend/backend for the demo.** A 7B model is unusable on the free Spaces CPU tier (tens of seconds per token), so the Space is a thin proxy to a Modal H100 that scales to zero: free to host, pay-per-second to run.
- **Shipping RAG as a deferred problem, not a fake win.** A retrieval layer over Urdu Wikipedia didn't beat the plain fine-tune, so it stayed out of the release. More on why below.

## What I Learned

### Fine-Tuning Engineering
- **`save_total_limit` is a quiet trap.** With `load_best_model_at_end=True`, a small `save_total_limit` can delete the best checkpoint before training ends, and then there's nothing to load back. v1 hit exactly this. Raise the limit or save the best checkpoint separately.
- **Catastrophic forgetting is real and data-fixable.** Specializing on one distribution silently erased the base model's coding ability. Re-introducing code and code-mixed data restored it without giving back the Urdu gains.
- **A 7B QLoRA tune is shockingly light.** Peaking at 8.56 GB on an 80 GB card means this kind of fine-tuning fits on hardware most people already have access to. The barrier to specializing open models is lower than it looks.
- **Make every run resumable.** Rented GPUs time out and OOM. My first run timed out and resumed from a checkpoint instead of restarting. Wrapping logging and volume commits in a `try/finally` meant even a crash persisted the training log.

### Evaluation
- **Single-judge evaluation is noisy.** The first numbers I trusted were from one model and turned out to be wrong once I cross-checked. Now I report a median and a range across at least three model families.
- **Automated judges score higher than manual ones, because of position bias.** The same outputs scored 8–14 points higher when judged with randomized A/B ordering. If you don't randomize position, you're measuring the judge's left/right preference, not the model.
- **Claude Code makes a capable, free judge.** A CLI subprocess wrapped as a Haystack component let me re-run the full evaluation at zero marginal cost.
- **Preference is not correctness.** A win rate tells you which model people prefer in a blind comparison. It does not tell you the answer is true. I keep that caveat attached to the headline.

### Deployment
- **Hosting a 7B model for free means splitting the stack.** The free Spaces tier can serve a Gradio UI but not the model; pairing it with a Modal GPU backend keeps the demo free to host and cheap to run.
- **Cold starts need UI feedback.** The frontend yields an immediate acknowledgment before the real response, so a 30-second cold start feels intentional instead of broken.
- **Urdu rendering is its own problem.** Urdu needs the Nastaliq script, right-to-left, with a taller line-height than Latin, and a single reply can mix both. The demo detects each paragraph's dominant script in the browser and sets direction and font per block, so mixed Urdu/English output reads correctly.

## Future Improvements
The clearest next step is RAG that actually works. A retrieval layer over ~310k Urdu Wikipedia chunks (hybrid dense + sparse retrieval, reranked) didn't beat the plain fine-tune, and the reason is the most useful thing the experiment produced. This model was trained on direct question→answer pairs only. The retrieval endpoint prepends context the model never saw during training, so it's out of distribution: the fine-tune that makes Qwen fluent in Urdu is the same fine-tune that makes it unable to use retrieved context. You can't bolt RAG onto a model that wasn't trained for it. The fix is upstream. The next version adds `(query, context, grounded-answer)` triples to the training mix, in the exact format the retriever serves, including deliberately noisy examples that teach the model to ignore irrelevant context.

Beyond that:
- **Recover the regressions.** Targeted data for the three categories v2 lost ground on (length-constrained summaries, arithmetic-checked reasoning steps, and grammar-correction pairs), without giving back the code and creative gains.
- **Guard against contamination.** A contamination check is already built to reject any generated training example that collides with the evaluation set, so improving the model can't quietly mean training on the test.
- **Go on-device.** Distill or fine-tune a smaller 0.5–1.5B variant that can run on a phone via llama.cpp or MLX, so an Urdu assistant works without a network round-trip.

This was a first fine-tune, and a lot of it was learning by getting things wrong in public: overfitting, forgetting, a RAG layer that didn't pan out. Keeping those failures in the writeup, with the numbers attached, is the part I'd defend hardest.
