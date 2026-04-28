import type { ReactNode } from 'react'
import { cx } from '@/lib/site'

type PillBadgeProps = {
  children: ReactNode
  tone?: 'default' | 'purple' | 'pink' | 'teal' | 'amber' | 'violet' | 'dark'
}

const toneClasses: Record<NonNullable<PillBadgeProps['tone']>, string> = {
  default: 'border-slate-200 bg-white text-slate-700',
  purple: 'border-rate-purple/20 bg-rate-purple/10 text-rate-purple',
  pink: 'border-rate-pink/20 bg-rate-pink/10 text-rate-pink',
  teal: 'border-rate-teal/20 bg-rate-teal/10 text-rate-teal',
  amber: 'border-rate-amber/20 bg-rate-amber/10 text-rate-amber',
  violet: 'border-rate-violet/20 bg-rate-violet/15 text-rate-violet',
  dark: 'border-white/10 bg-white/10 text-white',
}

export function PillBadge({ children, tone = 'default' }: PillBadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold',
        toneClasses[tone]
      )}
    >
      {children}
    </span>
  )
}
