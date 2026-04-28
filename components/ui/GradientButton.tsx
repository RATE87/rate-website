import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '@/lib/site'

type BaseProps = {
  children: ReactNode
  className?: string
  variant?: 'gradient' | 'ghost' | 'dark'
}

type LinkProps = BaseProps & {
  href: string
  type?: never
} & Omit<React.ComponentProps<typeof Link>, 'href' | 'className' | 'children'>

type ButtonProps = BaseProps & {
  href?: never
} & ButtonHTMLAttributes<HTMLButtonElement>

const baseClassName =
  'inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-extrabold transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rate-purple'

const variantClassName = {
  gradient: 'bg-rate-gradient text-white shadow-glow',
  ghost: 'border border-slate-300 bg-white text-slate-900',
  dark: 'border border-white/10 bg-white/10 text-white',
}

export function GradientButton(props: LinkProps | ButtonProps) {
  const className = cx(baseClassName, variantClassName[props.variant ?? 'gradient'], props.className)

  if ('href' in props && props.href) {
    const { href, children, variant, className: _className, ...rest } = props
    return (
      <Link href={href} className={className} {...rest}>
        {children}
      </Link>
    )
  }

  const buttonProps = props as ButtonProps
  const { children, variant, className: _className, ...rest } = buttonProps
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  )
}
