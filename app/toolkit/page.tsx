import type { Metadata } from 'next'
import { ToolkitOverviewClient } from '@/components/ui/ToolkitOverviewClient'
import { GradientButton } from '@/components/ui/GradientButton'
import { TOOLKIT_COMING_SOON } from '@/lib/launch'
import { getResources } from '@/lib/sanity/queries'

export const metadata: Metadata = {
  title: 'Toolkit',
  description: 'Free resources across ADHD, Autism, Burnout Recovery, Workplace and EHCP.',
}

export default async function ToolkitPage() {
  const resources = await getResources()

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="relative overflow-hidden rounded-[40px]">
        <div
          className={`space-y-10 transition ${TOOLKIT_COMING_SOON ? 'pointer-events-none select-none grayscale opacity-50 blur-[1px]' : ''}`}
          aria-hidden={TOOLKIT_COMING_SOON}
        >
          <section className="rounded-[36px] bg-rate-gradient p-8 text-center text-white shadow-glow lg:p-10">
            <h1 className="text-5xl font-black tracking-[-0.05em] md:text-6xl">The RATE Toolkit</h1>
            <p className="mt-4 text-lg leading-8 text-white/80">Free Resources Easy to Use Built for You</p>
            <div className="mt-6 flex justify-center">
              <GradientButton href="/community" variant="dark">
                Join the wider community
              </GradientButton>
            </div>
          </section>

          <section className="py-10">
            <ToolkitOverviewClient resources={resources} />
          </section>
        </div>

        {TOOLKIT_COMING_SOON ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
            <div className="max-w-2xl rounded-[32px] bg-navy-800/82 px-8 py-10 text-white shadow-glow backdrop-blur">
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-white/78">Coming Soon</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">The toolkit is being finished behind the scenes</h2>
              <p className="mt-4 text-base leading-8 text-white/82">
                RATE&apos;s free toolkit will launch once the first set of resources is fully ready. For now, join the
                community and keep close to the updates.
              </p>
              <div className="mt-6 flex justify-center">
                <GradientButton href="/community">Join Community</GradientButton>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
