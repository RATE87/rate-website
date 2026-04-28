import type { PillarSlug, ResourceType } from '@/lib/sanity/types'

export const pillarMeta: Record<
  PillarSlug,
  { title: string; accent: string; description: string; icon: string }
> = {
  adhd: {
    title: 'ADHD',
    accent: 'bg-rate-purple',
    description: 'Executive function, emotional regulation, momentum and planning support.',
    icon: '⚡',
  },
  autism: {
    title: 'Autism',
    accent: 'bg-rate-teal',
    description: 'Sensory support, communication tools and unmasking-aware guidance.',
    icon: '🫶',
  },
  burnout: {
    title: 'Burnout Recovery',
    accent: 'bg-rate-amber',
    description: 'Burnout warning signs, shutdown rescue and longer-term recovery support.',
    icon: '🌤️',
  },
  workplace: {
    title: 'Workplace',
    accent: 'bg-rate-pink',
    description: 'Adjustments, scripts, templates and practical self-advocacy resources.',
    icon: '💼',
  },
  ehcp: {
    title: 'EHCP & Education',
    accent: 'bg-rate-violet',
    description: 'Meeting support, SEND navigation and printable tools for families.',
    icon: '📘',
  },
}

export const pillarOrder = ['adhd', 'autism', 'burnout', 'workplace', 'ehcp'] as const

export const resourceTypeLabels: Record<ResourceType, string> = {
  tool: 'Tools',
  guide: 'Guides',
  template: 'Templates',
  printable: 'Printable',
}

export function formatFollowerCount(value: number) {
  return new Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

export function formatLongDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}
