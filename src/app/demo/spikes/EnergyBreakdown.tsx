import type { SpikesModelResult } from './types'

/**
 * The energy bookkeeping for the run on screen, layer by layer, computed in
 * the browser from the same constants and measured spike densities the
 * backend uses (step7_energy.py). Multiplies per frame are fixed by the
 * architecture; the spiking column moves with how busy each layer's input
 * was for this recording. Shown inside the "how the energy figure is
 * calculated" disclosure so the totals on the cards can be checked.
 */

const T = 16
const E_MAC = 4.6e-12 // joules per multiply-accumulate, Horowitz 2014, 45 nm
const E_AC = 0.9e-12 // joules per accumulate

const LAYERS: { name: string; macs: number }[] = [
  { name: 'conv1', macs: 2 * 128 * 9 * 128 * 128 },
  { name: 'conv2', macs: 128 * 128 * 9 * 64 * 64 },
  { name: 'conv3', macs: 128 * 128 * 9 * 32 * 32 },
  { name: 'conv4', macs: 128 * 128 * 9 * 16 * 16 },
  { name: 'conv5', macs: 128 * 128 * 9 * 8 * 8 },
  { name: 'fc1', macs: 2048 * 512 },
  { name: 'fc2', macs: 512 * 110 },
]

function uJ(joules: number) {
  const v = joules * 1e6
  return v >= 100 ? v.toFixed(0) : v.toFixed(1)
}

export default function EnergyBreakdown({ snn }: { snn: SpikesModelResult }) {
  const pool = snn.pool_density
  const lif = snn.lif_rates
  if (!pool || !lif || pool.length < 5 || lif.length < 7) return null

  // Input activity per layer: conv1 reads analog frames; conv2 to conv5 and
  // fc1 read the spike map after the preceding max-pool; fc2 reads the sixth
  // LIF layer directly.
  const inputs: (number | null)[] = [null, pool[0], pool[1], pool[2], pool[3], pool[4], lif[5]]
  const rows = LAYERS.map((layer, i) => {
    const r = inputs[i]
    const ann = layer.macs * T * E_MAC
    const spiking = r === null ? ann : layer.macs * T * r * E_AC
    return { ...layer, r, ann, spiking }
  })
  const snnTotal = rows.reduce((a, b) => a + b.spiking, 0)
  const annTotal = rows.reduce((a, b) => a + b.ann, 0)

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[26rem] font-mono text-[11px] tabular-nums text-[var(--text-secondary)]">
        <caption className="sr-only">Energy bookkeeping per layer for this run</caption>
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            <th scope="col" className="py-1.5 pr-3 font-medium">layer</th>
            <th scope="col" className="py-1.5 pr-3 text-right font-medium">multiplies / frame</th>
            <th scope="col" className="py-1.5 pr-3 text-right font-medium">input activity</th>
            <th scope="col" className="py-1.5 pr-3 text-right font-medium">spiking µJ</th>
            <th scope="col" className="py-1.5 text-right font-medium">ordinary µJ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t border-[var(--border)]">
              <th scope="row" className="py-1.5 pr-3 text-left font-normal text-[var(--text)]">{row.name}</th>
              <td className="py-1.5 pr-3 text-right">{row.macs.toLocaleString('en-US')}</td>
              <td className="py-1.5 pr-3 text-right">{row.r === null ? 'analog, full price' : `${(row.r * 100).toFixed(1)}% spiked`}</td>
              <td className="py-1.5 pr-3 text-right">{uJ(row.spiking)}</td>
              <td className="py-1.5 text-right">{uJ(row.ann)}</td>
            </tr>
          ))}
          <tr className="border-t border-[var(--border-hover)] text-[var(--text)]">
            <th scope="row" className="py-1.5 pr-3 text-left font-medium">total</th>
            <td className="py-1.5 pr-3" />
            <td className="py-1.5 pr-3 text-right text-[var(--text-secondary)]">
              {`${(annTotal / snnTotal).toFixed(1)}x apart`}
            </td>
            <td className="py-1.5 pr-3 text-right font-medium">{(snnTotal * 1e3).toFixed(2)} mJ</td>
            <td className="py-1.5 text-right font-medium">{(annTotal * 1e3).toFixed(2)} mJ</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
