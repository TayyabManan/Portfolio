import type { SpikesKind } from '@/lib/spikes-demo-data'

/**
 * Wire types for the demo backend (D:\Projects\SNNs\scripts\step9_demo_api.py,
 * reached through /api/spikes). Snake_case fields are the backend's own names,
 * kept verbatim so the two sides can be diffed by eye.
 */
export interface SpikesModelResult {
  /** raw rate outputs per class, averaged over T (not probabilities) */
  scores: number[]
  pred: number
  /** normalized confidence: max / sum of the raw outputs, never softmax */
  conf: number
  correct: boolean
  /** cumulative readout after t steps, [T][11] */
  per_step: number[][]
  step_pred: number[]
  step_conf: number[]
  /** accounting-model energy for this sample, mJ (Horowitz 2014 pJ costs) */
  energy_mj: number
  ms: number
  /** SNN only */
  lif_rates?: number[]
  pool_density?: number[]
  silent_fraction?: number
}

export interface SpikesRunResult {
  sample: number
  test_id: number
  label: number
  label_name: string
  kind: SpikesKind
  level: number
  severity: number | null
  seed: number
  T: number
  frames: { shape: number[]; dtype: 'uint8'; max: number; b64: string }
  snn: SpikesModelResult
  ann: SpikesModelResult
}

export interface SpikesRunRequest {
  sample: number
  kind: SpikesKind
  level: number
  seed: number
}

export const FRAME_SIDE = 64

/** base64 -> the [T, 2, 64, 64] uint8 block (channel 0 = OFF, 1 = ON events). */
export function decodeFrames(b64: string): Uint8Array {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}
