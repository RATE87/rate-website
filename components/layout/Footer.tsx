import Image from 'next/image'
import Link from 'next/link'
import { GradientText } from '@/components/ui/GradientText'

export function Footer() {
  return (
    <footer className="mt-16 bg-navy-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xl font-black tracking-[0.18em]">
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
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/74">
            Building the ecosystem that fits the piece not the puzzle.
          </p>
        </div>
        <div className="grid gap-3 text-sm font-semibold text-white/74 sm:grid-cols-2">
          <Link href="/toolkit">Toolkit</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/community">Join Community</Link>
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
