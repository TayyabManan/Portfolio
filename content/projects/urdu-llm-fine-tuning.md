---
slug: "urdu-llm-fine-tuning"
title: "Urdu LLM Fine-Tuning"
subtitle: "QLoRA-Tuned Qwen 2.5 7B for Urdu, Roman Urdu & Code-Mixed Chat"
description: "A Qwen 2.5 7B Instruct model fine-tuned with QLoRA to speak natural Urdu: Urdu script, Roman Urdu, and Urdu/English code-mixing. The current version reaches a 79.5% pairwise win rate over the base model across two independent LLM judges on a 100-prompt evaluation set, recovers every regression its predecessor introduced, and adds RAG-aware training that makes retrieval safe on factual queries. Validated with a multi-judge harness (including a free Claude-Code-CLI judge) and shipped as a live Gradio + Modal demo. A first end-to-end fine-tune, built in public for about $60."
category: "Machine Learning & MLOps"
techStack: ["Python", "PyTorch", "Unsloth", "QLoRA / PEFT", "Hugging Face", "Modal", "Gradio", "Haystack", "Qdrant", "rank-bm25"]
image: "/projects/urdu-llm-fine-tuning.webp"
demoUrl: "https://huggingface.co/spaces/TayyabManan/urdu-llm-chat"
githubUrl: "https://github.com/TayyabManan/Urdu-LLM"
featured: true
date: "2026-06-28"
---

# Urdu LLM Fine-Tuning

## Overview
Urdu has around 230 million speakers, which makes it one of the most widely spoken languages on earth. In machine learning it is still treated as low-resource: there is plenty of Urdu text in the world, but very little of it exists in the clean, instruction-tuned form modern chat models learn from, and almost no open models are specialized for it. The base models that *do* speak Urdu tend to drift into English the moment a prompt gets slightly unusual. One popular 7B base drifts into Chinese.

There is a second wrinkle that English-first models miss entirely. Most Pakistanis don't type in Urdu script at all. They type *Roman Urdu* (Urdu written phonetically in the Latin alphabet, "aap kaise ho?") and freely mix in English ("mujhe Python decorators samjhao"). A model that only handles formal Urdu script is solving the wrong problem.

This project fine-tunes Qwen 2.5 7B Instruct to handle all three: Urdu script, Roman Urdu, and Urdu/English code-mixing. It was my first end-to-end fine-tuning project, built in public across three versions with regular updates. The whole thing (data generation, training, multi-judge evaluation, a live demo, and a RAG layer that took two attempts to get right) came to about $60 of an $80 budget ceiling. The current model (v3) wins 79.5% of head-to-head comparisons against the base model, judged blind by two independent LLMs, and recovered every regression its predecessor introduced.

**[Read the full technical deep-dive →](/blog/building-urdu-llm-fine-tuning)**

## Key Features
- **Bilingual, code-mixed Urdu**: One model that handles Urdu script, Roman Urdu (Latin-script Urdu, how most Pakistanis actually type), and Urdu/English code-switching, not just formal Urdu.
- **79.5% win rate over the base model**: Pairwise preference across two independent LLM judges on a 100-prompt, hand-curated Urdu evaluation set, up from v2's 66%, with all three of v2's regressions recovered.
- **A tiny, cheap adapter**: QLoRA produces a 154 MB LoRA adapter that trains only 0.82% of the model's parameters and peaks at 8.56 GB of VRAM on an 80 GB H100. Fine-tuning a 7B model turned out to be far lighter than the hardware suggests.
- **A multi-judge evaluation harness**: Blinded pairwise judging with position-bias randomization, run across Claude, GPT, and Gemini families, plus a $0 Claude-Code-CLI judge wired in as a Haystack component.
- **Recovered catastrophic forgetting**: Code-mixed task win rate went from 0% (v1) to 80% (v2) by changing the *data*, not the hyperparameters.
- **RAG-aware, and honest about it**: v3 trains on retrieval-format triples, which eliminated the base model's Chinese-fallback failure (45/100 answers → 0) and makes grounding safe for factual queries, a targeted tool rather than a blanket win.
- **Verifiable synthetic data**: v3's reasoning and summarization data let Python own every checkable answer (the arithmetic, the sentence counts), and a 200-row human spot-check caught two systemic generator bugs before training.
- **A live demo on real infrastructure**: A free Gradio Space frontend proxying to a Modal H100 backend, with script-aware Nastaliq/Latin rendering that detects each paragraph's script live.
- **Built in public, on a budget**: The full pipeline, evaluation scripts, and roadmap are shipped openly, under Apache 2.0.

## Technical Architecture
The project is a data-centric loop: download → clean → format → QLoRA train → multi-judge evaluate → diagnose → improve the data → retrain. The interesting work happens in the data, not the optimizer.

**Data pipeline.** Four sources feed the training mix: a ~51k-pair Urdu instruction dataset as the backbone, a small slice of human-written Aya Urdu as a quality anchor, an existing Roman-Urdu set, and my own Roman-Urdu transliterations. A model-agnostic cleaning stage removes duplicates, low-Urdu-ratio rows, and over-length examples, then a deliberately *separate* model-specific formatting stage emits Alpaca-style JSONL (`{instruction, input, output}`). The Qwen chat template is applied at training time, not at data-prep time, so the same cleaned corpus can target a different base model later by re-running only the format step. Version 3 layered on ~5,700 synthetic examples (grammar-correction pairs, sentence-count-verified summaries, arithmetic-checked reasoning, and RAG triples), each produced with deterministic checks and a 200-row human spot-check before it was allowed into training.

**Training.** QLoRA via Unsloth on a single Modal H100: 4-bit base weights with LoRA adapters (r=16, alpha=32) on all attention and MLP projection modules, an effective batch size of 16, learning rate 2e-4 on a cosine schedule, AdamW 8-bit. Two epochs (a third overfits). The sequence length was raised to 4096 for v3 so retrieved context fits without truncation. Training is fully checkpointed and resumable, which mattered when the first run hit a timeout and had to resume mid-training rather than start over.

**Evaluation.** A 100-prompt, hand-curated Urdu eval set across 8 task categories, scored by blinded pairwise judging. Base and fine-tuned outputs are generated with identical decoding parameters, then A/B-randomized per item and handed to multiple LLM judges. The judging is driven by a Haystack pipeline with custom generators, including one that shells out to the Claude Code CLI. A contamination guard rejects any generated training example that collides with the eval set, so improving the model never quietly means training on the test.

**Serving.** A 7B model can't run on the free Spaces CPU tier, so serving is split: a Modal app exposes the fine-tuned model behind a `/generate` endpoint (and a `/rag` endpoint backed by hybrid dense + BM25 retrieval and a cross-encoder reranker) on an H100 that scales to zero, and a lightweight Gradio Space acts as the public frontend, posting to that endpoint.

## Model Performance
The headline metric is pairwise win rate against the base Qwen 2.5 7B Instruct, on the 100-prompt eval set, judged blind. The current model (v3) wins **79.5% overall**, judged by two independent LLM families (Claude and GPT-5.3; Gemini's free tier capped out at 20 requests a day and sat this round out). That is up from v2's 66% median across three judges, and every category moved in the right direction:

| Category | v2 vs base | v3 vs base |
|----------|-----------|-----------|
| Creative writing | 91% | 100% |
| Translation (UR↔EN) | 80% | 97% |
| Summarization | 46% | **82%** |
| Grammar correction | 36% | **82%** |
| Question Answering | 71% | 79% |
| Code explanation in Urdu | 60% | 75% |
| Code-mixed (Urdu/English) | 80% | 70% |
| Reasoning | 31% | **53%** |
| **Overall vs base** | **66%** | **79.5%** |

All three of v2's regressions recovered: summarization 46% → 82%, grammar 36% → 82%, and reasoning 31% → 53% (recovered, but still the weakest category and the next thing to work on).

Two honest caveats I keep attached to this number. First, judged head-to-head against *v2* rather than the base, v3 wins only 43% of matchups: it's a rebalance, not a strict upgrade, trading some translation and reasoning for large gains in summarization and grammar. There is no free lunch in the data mix. Second, a pairwise win is *preference*, not *correctness*. It does not mean 79.5% of answers are factually right. Many wins are fluency and style. Pairwise preference is the right tool for "is the fine-tune better than the base," and the wrong tool for "is the fine-tune trustworthy."

## How the Model Was Evaluated
For a low-resource language, evaluation is harder than training. There's no standard Urdu instruction-following benchmark to point at, so I built the harness myself and tried to make it skeptical of its own results.

- **A hand-curated set, not a scraped one.** 100 prompts across 8 categories (QA, summarization, translation, grammar, reasoning, creative, code explanation, code-mixed), written by me and spot-validated by another native Urdu speaker. The split is intentionally realistic: 70 Urdu-script, 25 Roman Urdu, 5 code-mixed.
- **Decoding parity.** Base and fine-tuned models generate with identical decoding parameters. If the fine-tune wins, it's the weights talking, not a temperature trick.
- **Blinded, position-randomized judging.** Each comparison is A/B-shuffled per item before it reaches a judge, with an explicit rule that a confident-but-wrong answer loses to one that admits uncertainty. This matters more than it sounds: I later measured that automated judges scored 8–14 percentage points higher than my earlier manual passes on the *same* outputs, almost entirely because the manual passes had a fixed base-first ordering and the automated ones randomized position. Position bias is real, and the only defense is to randomize and to use more than one judge.
- **Multiple model families, reported as median plus range.** For v2, Claude, GPT, and Gemini bracketed a real spread (66% median, 48–67% range), disagreeing most on code and reasoning and agreeing on translation and creative. For v3, Gemini's free tier capped out, so the two cross-model judges (Claude and GPT-5.3) carried the scoring. Reporting the spread is more honest than cherry-picking the friendliest judge.
- **A free judge via the Claude Code CLI.** I wrapped `claude -p --output-format json` as a Haystack component, calling it as a subprocess on a Max subscription with no API key. It cost nothing and let me re-judge the full set on demand.

## The Catastrophic-Forgetting Fix
The most instructive moment in the whole project was a failure.

Version 1 was trained almost entirely on Urdu-*script* instruction data. It got better at Urdu, and noticeably worse at anything involving code. On the eval set, it won 0% of code-mixed prompts and 10% of "explain this code in Urdu" prompts. The fine-tune had specialized so hard on one distribution that it forgot a capability the base model already had. That's catastrophic forgetting, and seeing it happen on my own model was more convincing than reading about it.

The fix was upstream, in the data, not in the learning rate. For v2 I added two things to the mix:

- **~1,700 synthetic code-mixed examples** generated to sound like how Pakistani developers actually talk on WhatsApp and Discord: natural code-switching between Urdu and English, across ~280 technical topics.
- **~5,000 Roman-Urdu examples**, transliterated from existing Urdu data.

The result: code-mixed went 0% → 80%, code explanation went 10% → 60%, and creative writing climbed to 91%. The two categories v1 lost outright became two of v2's biggest wins, and Roman Urdu grew to about 14.7% of the corpus, which is what makes the model usable for people who never type in Urdu script. None of this required touching the optimizer. The lesson I'll carry forward is that at this scale, the data mix is the model.

## Design Decisions
- **Data-centric iteration over hyperparameter tuning.** Every gain from v1 to v2 to v3 came from changing the data (adding code, adding Roman Urdu, adding verifiable grammar/summarization/reasoning and RAG triples), not from sweeping hyperparameters. For a specialization task on a strong base model, the data is the highest-leverage knob.
- **QLoRA over full fine-tuning.** Training 0.82% of the parameters into a 154 MB adapter, peaking at 8.56 GB of VRAM, costs ~$5–15 per run on a rented H100. Full fine-tuning was never necessary at this scale or budget, and the adapter ships as a tiny artifact anyone can apply to the base.
- **LLM transliteration over character mapping for Roman Urdu.** Instead of a deterministic Urdu→Latin character map (which produces robotic, vowel-dropping text), I prompted a cheap model to rewrite Urdu as "WhatsApp Urdu": keeping natural spellings (*bohat, kya, hai*) and leaving English words in English. The goal was Roman Urdu that a real person would type, not a transliteration scheme.
- **Two epochs, not three.** v1's third epoch overfit: eval loss bottomed at epoch 2 while train loss kept dropping. v2 and v3 stopped at two.
- **Letting a program own every verifiable answer.** v3's reasoning and summarization data are generated with Python owning the arithmetic and the sentence counts, so the model only narrates, never computes. Deterministic checks plus a 200-row human spot-check caught two systemic generator bugs before they reached training.
- **Median across cross-model judges, not one.** A single judge gave a clean-looking score that didn't survive contact with other model families. The spread between judges is information, and hiding it would be dishonest.
- **A split frontend/backend for the demo.** A 7B model is unusable on the free Spaces CPU tier (tens of seconds per token), so the Space is a thin proxy to a Modal H100 that scales to zero: free to host, pay-per-second to run.
- **Training for RAG instead of bolting it on.** v2's retrieval layer lost to the plain fine-tune because the model had never seen prepended context. v3 put retrieval-format triples in the training data; the structural failure vanished (Chinese fallback 45/100 → 0), though retrieval stays a targeted tool for factual queries rather than a blanket win.

## What I Learned

### Fine-Tuning Engineering
- **`save_total_limit` is a quiet trap.** With `load_best_model_at_end=True`, a small `save_total_limit` can delete the best checkpoint before training ends, and then there's nothing to load back. v1 hit exactly this. Raise the limit or save the best checkpoint separately.
- **Catastrophic forgetting is real and data-fixable.** Specializing on one distribution silently erased the base model's coding ability. Re-introducing code and code-mixed data restored it without giving back the Urdu gains.
- **Data mixes rebalance; they don't strictly improve.** v3 beat the base 79.5% and fixed every regression, but head-to-head it only beat v2 43% of the time. The grammar, summarization, and RAG data I poured in traded away some translation and reasoning. Worth knowing before you say "v3 > v2."
- **A 7B QLoRA tune is shockingly light.** Peaking at 8.56 GB on an 80 GB card means this kind of fine-tuning fits on hardware most people already have access to. The barrier to specializing open models is lower than it looks.
- **Make every run resumable.** Rented GPUs time out and OOM. My first run timed out and resumed from a checkpoint instead of restarting. Wrapping logging and volume commits in a `try/finally` meant even a crash persisted the training log.

### Evaluation
- **Single-judge evaluation is noisy.** The first numbers I trusted were from one model and turned out to be wrong once I cross-checked. Now I report a median and a range across multiple model families.
- **Automated judges score higher than manual ones, because of position bias.** The same outputs scored 8–14 points higher when judged with randomized A/B ordering. If you don't randomize position, you're measuring the judge's left/right preference, not the model.
- **The cheap, boring gates catch the expensive bugs.** A Python digit-check and a human reading 200 rows found two systemic failures (a 100%-broken reasoning template and a batch of confabulated RAG answers) that a clean-looking automated test suite waved straight through.
- **Claude Code makes a capable, free judge.** A CLI subprocess wrapped as a Haystack component let me re-run the full evaluation at zero marginal cost.
- **Preference is not correctness.** A win rate tells you which model people prefer in a blind comparison. It does not tell you the answer is true. I keep that caveat attached to the headline.

### Deployment
- **Hosting a 7B model for free means splitting the stack.** The free Spaces tier can serve a Gradio UI but not the model; pairing it with a Modal GPU backend keeps the demo free to host and cheap to run.
- **Cold starts need UI feedback.** The frontend yields an immediate acknowledgment before the real response, so a 30-second cold start feels intentional instead of broken.
- **Urdu rendering is its own problem.** Urdu needs the Nastaliq script, right-to-left, with a taller line-height than Latin, and a single reply can mix both. The demo detects each paragraph's dominant script in the browser and sets direction and font per block, so mixed Urdu/English output reads correctly.

## Future Improvements
The two biggest items on the last version's work-list are now done: v3 recovered the summarization, grammar, and reasoning regressions, and it made RAG structurally sound (the base model's Chinese fallback on Urdu retrieval context went from 45/100 to 0). That reframes what's next.

- **Beat v2 outright, not just the base.** v3 is a rebalance (43% head-to-head against v2), and reasoning (53%) is still the soft spot. The goal is targeted reasoning data that doesn't give back the summarization and grammar gains.
- **Make retrieval win where it should.** RAG is safe now but only wins 15.5% of the full blind eval, because ~79 of the 100 prompts are creative/grammar/reasoning tasks where retrieved context is noise. On factual questions it corrects the model (largest province by area: the plain fine-tune says "Punjab", RAG says "Balochistan, 347,190 km²"). The next step is routing retrieval to factual queries and measuring it on a factual-only slice instead of a blanket set.
- **Go on-device.** Distill or fine-tune a smaller 0.5–1.5B variant that can run on a phone via llama.cpp or MLX, so an Urdu assistant works without a network round-trip.

This was a first fine-tune, and a lot of it was learning by getting things wrong in public: overfitting, forgetting, a RAG layer that didn't pan out on the first try and only half-won on the second. Keeping those failures in the writeup, with the numbers attached, is the part I'd defend hardest. A negative result you instrumented well (knowing *exactly why* RAG wins only 15.5%) is still a result.
