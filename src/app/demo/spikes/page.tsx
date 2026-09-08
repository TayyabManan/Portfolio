import { Metadata } from 'next'
import SpikesDemo from './SpikesDemo'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Do Spikes Fail Differently? Live demo',
  description:
    'Corrupt an event-camera gesture and watch a spiking neural network and its ReLU twin answer the same input, live. Noise, event drop, occlusion, and time shuffle, with confidence and paper energy for each model.',
  keywords: [
    'spiking neural network demo',
    'SNN vs ANN',
    'DVS128Gesture',
    'event camera',
    'neuromorphic computing',
    'calibration under corruption',
    'SpikingJelly',
    'Tayyab Manan',
  ],
  openGraph: {
    title: 'Do Spikes Fail Differently? Live demo | Tayyab Manan',
    description:
      'Corrupt an event-camera gesture and watch a spiking network and its ReLU twin answer the same input, live.',
    url: 'https://tayyabmanan.com/demo/spikes',
    type: 'website',
    images: [
      {
        url: '/projects/do-spikes-fail-differently.webp',
        width: 1600,
        height: 900,
        alt: 'Do Spikes Fail Differently? A spiking network and its ReLU twin, matched in everything but the neuron.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Do Spikes Fail Differently? Live demo',
    description:
      'Corrupt an event-camera gesture and watch a spiking network and its ReLU twin answer the same input, live.',
    images: ['/projects/do-spikes-fail-differently.webp'],
    creator: '@tayyabmanan',
  },
  alternates: {
    canonical: 'https://tayyabmanan.com/demo/spikes',
  },
}

export default function SpikesDemoPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tayyabmanan.com' },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://tayyabmanan.com/projects' },
      { '@type': 'ListItem', position: 3, name: 'Do Spikes Fail Differently? Live demo', item: 'https://tayyabmanan.com/demo/spikes' },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd]) }}
      />
      <SpikesDemo />
    </>
  )
}
