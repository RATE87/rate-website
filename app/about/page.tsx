import type { Metadata } from 'next'
import { GradientText } from '@/components/ui/GradientText'
import { PillBadge } from '@/components/ui/PillBadge'

export const metadata: Metadata = {
  title: 'About',
  description: 'The founder story, mission, values and long-term vision behind RATE.',
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <section className="grid gap-8 rounded-[36px] bg-white p-8 shadow-glow lg:grid-cols-[1fr_0.9fr] lg:p-10">
        <div>
          <PillBadge tone="purple">About RATE</PillBadge>
          <h1 className="mt-5 text-5xl font-black tracking-[-0.05em] text-slate-900 md:text-6xl">
            Founded to Fill the <GradientText>Void</GradientText>, Left by a <GradientText>Broken</GradientText>{' '}
            System
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
            The support systems in place and the perception of what it means to be neurodiverse do not align with the
            reality lived by most. Approximately 15–20% of the UK population is neurodivergent, over 13 million people
            navigating work, education, relationships and daily life without adequate tools, community or professional
            support.
          </p>
        </div>
        <div className="rounded-[30px] bg-hero-gradient p-6 text-white">
          <h2 className="text-3xl font-black tracking-tight">How We Will Make a Difference</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              'Fundraising',
              'Donations',
              'Awareness & Management Sessions',
              'Full library of self help resources',
              'Physical support',
            ].map((item, index) => (
              <span
                key={item}
                className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-extrabold ${
                  index === 0
                    ? 'border-white/15 bg-white/12 text-white'
                    : index === 1
                      ? 'border-white/15 bg-white/12 text-white'
                      : index === 2
                        ? 'border-white/15 bg-white/12 text-white'
                        : index === 3
                          ? 'border-white/15 bg-white/12 text-white'
                          : 'border-white/15 bg-white/12 text-white'
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 py-10 md:grid-cols-2 xl:grid-cols-6">
          {[
            {
              title: 'Identity First',
              tone: 'purple',
              text: 'The voice should feel affirming and real, not clinical, corporate or designed for everyone except the people it is about.',
            },
            {
              title: 'Practical Over Performative',
              tone: 'teal',
              text: 'RATE should make life easier in tangible ways with tools, wording and structure people can actually use when capacity is low.',
            },
            {
              title: 'Long Term Vision',
              tone: 'amber',
              text: 'From a digital movement to physical change. We want to open community centres and eventually offer specialised education.',
            },
          ].map((value) => (
            <article
              key={value.title}
              className={`rounded-[30px] border p-6 shadow-glow md:col-span-1 ${
                value.title === 'Identity First'
                  ? 'xl:col-span-2 xl:col-start-1'
                  : value.title === 'Practical Over Performative'
                    ? 'xl:col-span-2 xl:col-start-3'
                    : 'xl:col-span-2 xl:col-start-5 min-h-[220px]'
              } ${
                value.tone === 'purple'
                  ? 'border-rate-purple/20 bg-rate-purple/10'
                  : value.tone === 'teal'
                    ? 'border-rate-teal/20 bg-rate-teal/10'
                    : value.tone === 'amber'
                      ? 'border-rate-amber/20 bg-rate-amber/10'
                      : 'border-rate-pink/20 bg-rate-pink/10'
              }`}
            >
              <h2 className="text-3xl font-black tracking-tight text-slate-900">{value.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{value.text}</p>
            </article>
          ))}
      </section>

      <section className="rounded-[34px] border border-slate-200 bg-slate-50 p-6 md:p-8">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-rate-purple">Roadmap</p>
        <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr]">
          {[
            { step: 'Digital movement', tone: 'purple' },
            { step: 'Fully available one stop toolkit', tone: 'pink' },
            { step: 'Community programmes', tone: 'teal' },
            { step: 'Community centres', tone: 'amber' },
            { step: 'Specialist education', tone: 'violet' },
          ].map((item, index, array) => (
            <div key={item.step} className="contents">
              <article
                className={`rounded-[24px] border p-5 ${
                  item.tone === 'purple'
                    ? 'border-rate-purple/20 bg-rate-purple/10'
                    : item.tone === 'pink'
                      ? 'border-rate-pink/20 bg-rate-pink/10'
                      : item.tone === 'teal'
                        ? 'border-rate-teal/20 bg-rate-teal/10'
                        : item.tone === 'amber'
                          ? 'border-rate-amber/20 bg-rate-amber/10'
                          : 'border-rate-violet/20 bg-rate-violet/15'
                }`}
              >
                <div className="text-sm font-extrabold uppercase tracking-[0.18em] text-slate-700">Phase {index + 1}</div>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">{item.step}</h2>
              </article>
              {index < array.length - 1 ? (
                <div className="hidden items-center justify-center text-3xl font-black text-rate-purple xl:flex">→</div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
