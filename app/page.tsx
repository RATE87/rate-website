import Image from 'next/image'
import { GradientButton } from '@/components/ui/GradientButton'
import { GradientText } from '@/components/ui/GradientText'
import { NewsletterForm } from '@/components/ui/NewsletterForm'
import { PillBadge } from '@/components/ui/PillBadge'
import { fallbackProducts, formatPrice, getProducts } from '@/lib/shopify'
import { getResources } from '@/lib/sanity/queries'
import { pillarMeta } from '@/lib/site'

async function loadHomepageProducts() {
  try {
    return await getProducts()
  } catch {
    return fallbackProducts
  }
}

const pillarCards = [
  {
    label: 'SHOP',
    title: 'Shop',
    tone: 'amber' as const,
    text: 'Print-on-demand apparel designed to feel bold, wearable and part of the mission. Collectables that will help fund action and supplements that will encourage healthy living.',
    href: '/shop',
  },
  {
    label: 'TOOLKIT',
    title: 'Toolkit',
    tone: 'purple' as const,
    text: 'Free resources across ADHD, Autism, Burnout Recovery, Workplace and EHCP with no paywalls.',
    href: '/toolkit',
  },
  {
    label: 'COMMUNITY',
    title: 'Community',
    tone: 'pink' as const,
    text: 'Examples of our impact, social media accounts that influence in the right way and a community you can talk to in Discord.',
    href: '/community',
  },
]

const heroHighlights = [
  {
    icon: '📘',
    title: 'EHCP',
    description: 'Tools and guidance on how to get the support needed in school. Meeting preperation guides, example questions, details of support available and more...',
    offsetClass: 'translate-y-[2px]',
  },
  {
    icon: '🫶',
    title: 'Community',
    description: 'Putting the funds generated into the hands that need it. Donations to local charities, community events, awareness and management sessions and more...',
    offsetClass: 'translate-y-[4px]',
  },
  {
    icon: pillarMeta.burnout.icon,
    title: pillarMeta.burnout.title,
    description: 'Help and guidance for those impacted by SEND, coping mechanisms, local support networks and useful contacts.',
    offsetClass: 'translate-y-[2px]',
  },
] as const

export default async function HomePage() {
  const [products, resources] = await Promise.all([loadHomepageProducts(), getResources()])
  const featuredProducts = products.slice(0, 3)
  const featuredResources = ['adhd', 'autism', 'burnout', 'workplace', 'ehcp']
    .map((pillar) => resources.find((resource) => resource.pillar === pillar))
    .filter((resource): resource is NonNullable<typeof resource> => Boolean(resource))

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-10">
        <div className="grid gap-8 overflow-hidden rounded-[40px] bg-hero-gradient p-8 text-white shadow-glow lg:grid-cols-[1.08fr_0.92fr] lg:p-12">
          <div className="space-y-6">
            <PillBadge tone="dark">Neurodiversity Impact Platform</PillBadge>
            <h1 className="max-w-4xl text-5xl font-black tracking-[-0.06em] md:text-7xl">
              Building the <GradientText>ecosystem</GradientText> that fits the <GradientText>piece</GradientText> not the
              puzzle
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-white/78">
              RATE is on a mission to put the power back into the community
            </p>
            <div className="flex flex-wrap gap-3">
              <GradientButton href="/toolkit">Explore the Toolkit</GradientButton>
              <GradientButton href="/shop" variant="dark">
                Shop RATE
              </GradientButton>
            </div>
          </div>
          <div className="grid gap-4">
            {heroHighlights.map((item) => (
              <article key={item.title} className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                <div className="mb-3 flex items-center gap-3">
                  <div className="text-3xl">{item.icon}</div>
                  <h2 className={`${item.offsetClass} text-2xl font-black tracking-tight`}>{item.title}</h2>
                </div>
                <p className="mt-2 text-sm leading-7 text-white/74">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {pillarCards.map((pillar) => (
            <article
              key={pillar.title}
              className="group flex h-full flex-col rounded-[30px] border border-slate-200 bg-white p-6 shadow-glow transition duration-200 hover:-translate-y-1"
            >
              <div className="mb-5 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
                <div
                  className={`relative h-32 ${
                    pillar.tone === 'amber'
                      ? 'bg-[linear-gradient(145deg,rgba(247,151,30,0.22),rgba(255,101,132,0.12),rgba(255,255,255,1))]'
                      : pillar.tone === 'pink'
                        ? 'bg-[linear-gradient(145deg,rgba(255,101,132,0.22),rgba(124,114,255,0.12),rgba(255,255,255,1))]'
                        : 'bg-[linear-gradient(145deg,rgba(124,114,255,0.24),rgba(67,198,160,0.12),rgba(255,255,255,1))]'
                  }`}
                >
                  <div className="absolute inset-x-5 bottom-5 inline-flex rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-black tracking-[0.22em] text-slate-600 backdrop-blur">
                    {pillar.label}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <PillBadge tone={pillar.tone}>{pillar.title}</PillBadge>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.text}</p>
              <div className="mt-auto pt-5">
                <GradientButton href={pillar.href} variant="ghost">
                  Explore
                </GradientButton>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-rate-purple">Featured Products</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Bold pieces with a mission attached</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              <span className="lg:whitespace-nowrap">
                The shop is not an add-on. It helps fund the wider ecosystem while giving the brand a visible, wearable identity.
              </span>
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.map((product) => {
            const image = product.images.find((item) => item.is_default) ?? product.images[0]
            const variant = product.variants.find((item) => item.is_available) ?? product.variants[0]

            return (
              <article key={product.id} className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-glow">
                <div className="relative mb-5 aspect-square overflow-hidden rounded-[24px] bg-[linear-gradient(145deg,rgba(108,99,255,0.12),rgba(255,101,132,0.08),rgba(67,198,160,0.12))]">
                  {image ? <Image src={image.src} alt={product.title} fill className="object-cover" /> : null}
                </div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900">{product.title}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600">{variant ? formatPrice(variant.price) : 'TBC'}</span>
                  <GradientButton href={`/shop/${product.slug}`} variant="ghost">
                    View
                  </GradientButton>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-rate-purple">From the Toolkit</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Free Resources Easy to Use Built for You</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              <span className="xl:whitespace-nowrap">
                Built to reduce overwhelm, save energy and make the next step clearer whether someone is newly diagnosed or years in.
              </span>
            </p>
          </div>
          <GradientButton href="/toolkit" variant="ghost">
            Browse all resources
          </GradientButton>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-6">
          {featuredResources.map((resource, index) => (
            <article
              key={resource._id}
              className={`flex h-full flex-col rounded-[30px] border border-slate-200 bg-white p-6 shadow-glow md:col-span-1 xl:col-span-2 ${
                index === 3 ? 'xl:col-start-2' : index === 4 ? 'xl:col-start-4' : ''
              }`}
            >
              <PillBadge tone={resource.pillar === 'autism' ? 'teal' : resource.pillar === 'burnout' ? 'amber' : resource.pillar === 'workplace' ? 'pink' : resource.pillar === 'ehcp' ? 'violet' : 'purple'}>
                {pillarMeta[resource.pillar].title}
              </PillBadge>
              <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900">{resource.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{resource.description}</p>
              <GradientButton href="/toolkit" variant="ghost" className="mt-auto self-center">
                Open resource
              </GradientButton>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 rounded-[36px] bg-hero-gradient p-8 text-white shadow-glow lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
          <div className="space-y-5">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-white/76">Community</p>
            <h2 className="text-4xl font-black tracking-tight">You&apos;re not alone in this</h2>
            <p className="max-w-xl text-base leading-8 text-white/76">
              RATE is building a place where tools, humour, identity and practical support can sit side by side
              without people having to keep translating themselves to fit in.
            </p>
            <GradientButton href="/community">Join the Community</GradientButton>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { stat: '15-20%', label: 'of people in the UK are Neurodivergent' },
              { stat: '100%', label: 'Free toolkit access' },
              { stat: 'Access', label: 'Somewhere you can get the help you need' },
            ].map((item) => (
              <article
                key={item.stat}
                className="flex min-h-[210px] flex-col items-center justify-center rounded-[26px] border border-white/10 bg-white/10 px-6 py-6 text-center"
              >
                <div className={`max-w-[12ch] text-3xl font-black tracking-tight ${item.stat === '100%' ? '-translate-y-[4px]' : ''}`}>
                  {item.stat}
                </div>
                <p className={`mt-3 max-w-[16ch] text-sm leading-6 text-white/72 ${item.stat === '100%' ? '-translate-y-[4px]' : ''}`}>
                  {item.label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-[34px] border border-slate-200 bg-white p-6 shadow-glow md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-rate-purple">Newsletter</p>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Stay close to the launch</h2>
              <p className="mt-3 max-w-prose text-sm leading-7 text-slate-600">
                Get updates on toolkit drops, product releases and the next steps at RATE.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  )
}
