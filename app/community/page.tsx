import type { Metadata } from 'next'
import Script from 'next/script'
import { GradientButton } from '@/components/ui/GradientButton'
import { PillBadge } from '@/components/ui/PillBadge'
import { getEvents } from '@/lib/sanity/queries'
import { formatLongDate } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Community',
  description: 'Discord, RATE social channels and events from RATE.',
}

const discordInviteUrl = 'https://discord.gg/kmnatQPW'

export default async function CommunityPage() {
  const events = await getEvents()

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
      <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />

      <section className="rounded-[36px] bg-hero-gradient p-8 text-white shadow-glow lg:p-10">
        <PillBadge tone="dark">Community</PillBadge>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.05em] md:text-6xl">Somewhere to Feel at Home</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-white/80">
          Building an online community that will help drive real change and make a difference to others&apos; lives.
        </p>
      </section>

      <section className="grid gap-6 py-10 md:grid-cols-2">
        <article className="relative flex h-full flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 shadow-glow">
          <div className="pointer-events-none select-none grayscale opacity-45 blur-[1px]" aria-hidden="true">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-rate-purple">Discord</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900">RATE Community Hub</h2>
            <div className="mt-6 space-y-3 rounded-[24px] bg-slate-50 p-5">
              <div className="flex items-center justify-between rounded-[18px] bg-white px-4 py-3">
                <span className="font-bold text-slate-900"># introductions</span>
                <span className="text-sm text-slate-500">New</span>
              </div>
              <div className="flex items-center justify-between rounded-[18px] bg-white px-4 py-3">
                <span className="font-bold text-slate-900"># body-doubling</span>
                <span className="text-sm text-slate-500">Live</span>
              </div>
              <div className="flex items-center justify-between rounded-[18px] bg-white px-4 py-3">
                <span className="font-bold text-slate-900"># sensory-support</span>
                <span className="text-sm text-slate-500">Calm</span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Discord invite is now connected to your live server link. If you enable the Discord server widget later, we
              can swap this preview block for a live community panel.
            </p>
            <div className="mt-auto pt-5">
              <GradientButton href={discordInviteUrl} className="self-start">
                Join the server
              </GradientButton>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <div className="max-w-md rounded-[28px] bg-navy-800/84 px-7 py-8 text-white shadow-glow backdrop-blur">
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-white/78">Coming Soon</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight">Discord access is opening soon</h2>
              <p className="mt-4 text-sm leading-7 text-white/82">
                The server is being prepared behind the scenes. Join the wider community updates while Discord gets ready.
              </p>
            </div>
          </div>
        </article>

        <article className="flex h-full flex-col rounded-[30px] border border-slate-200 bg-white p-6 shadow-glow">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-rate-purple">Latest from RATE</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Facebook</h2>
          <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-4 rounded-[18px] bg-white p-4">
              <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-rate-gradient text-lg font-black text-white">
                F
              </div>
              <div>
                <p className="text-lg font-black text-slate-900">Rough Around The Edges</p>
                <p className="text-sm font-semibold text-slate-500">Facebook</p>
              </div>
            </div>
            <div className="mt-4 rounded-[18px] bg-white p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rate-purple">Latest post</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Live Facebook page connected. Open the page below to view the latest full post without the cramped
                embedded scroll area.
              </p>
            </div>
          </div>
          <GradientButton href="https://www.facebook.com/profile.php?id=61550687766545" variant="ghost" className="mt-4 self-start">
            Open Facebook
          </GradientButton>
        </article>

        <article className="flex h-full flex-col rounded-[30px] border border-slate-200 bg-white p-6 shadow-glow">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-rate-purple">Latest from RATE</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">X</h2>
          <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 p-3">
            <a
              className="twitter-timeline"
              data-height="560"
              data-theme="light"
              data-chrome="nofooter noborders"
              data-tweet-limit="2"
              data-dnt="true"
              href="https://x.com/_R_A_TE"
            >
              Posts by @_R_A_TE
            </a>
          </div>
          <GradientButton href="https://x.com/_R_A_TE" variant="ghost" className="mt-4 self-start">
            Open X
          </GradientButton>
        </article>

        <article className="flex h-full flex-col rounded-[30px] border border-slate-200 bg-white p-6 shadow-glow">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-rate-purple">Latest from RATE</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">TikTok</h2>
          <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-4 rounded-[18px] bg-white p-4">
              <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-rate-teal text-lg font-black text-white">
                T
              </div>
              <div>
                <p className="text-lg font-black text-slate-900">@rougharoundtheedg</p>
                <p className="text-sm font-semibold text-slate-500">TikTok</p>
              </div>
            </div>
            <div className="mt-4 rounded-[18px] bg-white p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rate-purple">Latest video</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Live TikTok profile connected. Open the page below to view the latest video in full without the embedded
                profile scroll frame.
              </p>
            </div>
          </div>
          <GradientButton href="https://www.tiktok.com/@rougharoundtheedg" variant="ghost" className="mt-4 self-start">
            Open TikTok
          </GradientButton>
        </article>
      </section>

      <section className="py-10">
        <div className="mb-6">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-rate-purple">Upcoming Events</p>
          <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Drop-ins, live sessions and useful hangs.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => (
            <article
              key={event._id}
              className="grid gap-5 rounded-[30px] border border-slate-200 bg-white p-6 shadow-glow md:grid-cols-[120px_1fr]"
            >
              <div className="rounded-[24px] bg-navy-800 p-5 text-white">
                <div className="text-sm font-extrabold uppercase tracking-[0.18em] text-white/60">Date</div>
                <div className="mt-4 text-2xl font-black tracking-tight">{formatLongDate(event.date)}</div>
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900">{event.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {event.time} · {event.location}
                </p>
                <GradientButton href={event.joinUrl} variant="ghost" className="mt-4">
                  Join / Notify
                </GradientButton>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
