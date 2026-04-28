import type { ReactNode } from 'react'

export function GradientText({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block px-[0.04em] pb-[0.06em] bg-rate-gradient bg-clip-text text-transparent">
      {children}
    </span>
  )
}
