'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { GradientButton } from '@/components/ui/GradientButton'
import { GradientText } from '@/components/ui/GradientText'
import { cx } from '@/lib/site'

const navItems = [
  { href: '/toolkit', label: 'Toolkit' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
]

export function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const scheduleReturn = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        setIsVisible(true)
      }, 3000)
    }

    const onScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - lastScrollY.current

      if (Math.abs(delta) > 8) {
        if (delta > 0 && currentY > 96) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
        lastScrollY.current = currentY
      }

      scheduleReturn()
    }

    scheduleReturn()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [])

  return (
    <header
      className={cx(
        'sticky top-4 z-50 mx-auto w-full max-w-7xl px-4 transition-transform duration-300',
        isVisible ? 'translate-y-0' : '-translate-y-[140%]'
      )}
    >
      <div className="rounded-[28px] border border-white/10 bg-navy-800/95 px-5 py-4 text-white shadow-glow backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-[0.18em]">
            <span className="relative h-14 w-14 overflow-visible">
              <Image
                src="/rate-logo.png"
                alt="RATE logo"
                fill
                className="translate-y-[3px] scale-[2.15] object-contain"
              />
            </span>
            <span className="inline-flex translate-y-[1px]">
              <GradientText>RATE</GradientText>
            </span>
          </Link>
          <button
            type="button"
            className="inline-flex h-11 items-center rounded-full border border-white/10 px-4 font-semibold md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="main-nav"
          >
            Menu
          </button>
          <nav id="main-nav" className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  'text-sm font-semibold text-white/80 transition hover:text-white',
                  pathname === item.href && 'text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
            <GradientButton href="/community">Join Community</GradientButton>
          </nav>
        </div>
        <nav
          className={cx(
            'grid overflow-hidden transition-[grid-template-rows,margin-top] duration-200 md:hidden',
            open ? 'mt-4 grid-rows-[1fr]' : 'grid-rows-[0fr]'
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    'rounded-2xl px-3 py-2 text-sm font-semibold text-white/80',
                    pathname === item.href && 'bg-white/10 text-white'
                  )}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <GradientButton href="/community" className="w-full justify-center">
                Join Community
              </GradientButton>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
