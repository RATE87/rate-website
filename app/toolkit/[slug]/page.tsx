import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PillBadge } from '@/components/ui/PillBadge'
import { GradientButton } from '@/components/ui/GradientButton'
import { PillarResourceList } from '@/components/ui/PillarResourceList'
import { PortableTextRenderer } from '@/components/ui/PortableTextRenderer'
import { TOOLKIT_COMING_SOON } from '@/lib/launch'
import { getResourceBySlug, getResources, getResourcesByPillar, getToolkitSlugs } from '@/lib/sanity/queries'
import { pillarMeta, pillarOrder, resourceTypeLabels } from '@/lib/site'
import type { PillarSlug } from '@/lib/sanity/types'

type ToolkitSlugPageProps = {
  params: Promise<{ slug: string }>
}

const adhdSections = [
  {
    title: 'Time Management',
    description:
      'Resources for time blindness, planning ahead and making deadlines feel more visible and manageable.',
    resourceSlugs: [
      'time-blindness-reset-routine',
      'low-pressure-weekly-planner',
      'how-to-run-an-admin-hour',
      'priority-filter-for-overloaded-days',
    ],
  },
  {
    title: 'Focus & Distraction',
    description:
      'Low-friction supports for getting started, reducing friction and making focused work easier to return to.',
    resourceSlugs: [
      'task-starting-when-your-brain-says-no',
      'focus-friendly-desk-checklist',
      'body-doubling-starter-guide',
    ],
  },
  {
    title: 'Habit Building & Routine',
    description:
      'Gentle systems for repeatable routines, transitions and building momentum without rigid perfectionism.',
    resourceSlugs: ['transition-script-for-leaving-the-house', 'dopamine-menu-builder'],
  },
  {
    title: 'Emotional Regulation & Overwhelm',
    description:
      'Support for emotional spirals, overwhelm and the kind of stuckness that makes practical steps harder to reach.',
    resourceSlugs: ['emotional-reset-prompt-sheet'],
  },
] as const

const adhdHubSections = [
  {
    title: 'Children',
    description: 'Support routes, practical guidance and day-to-day ADHD help for children and the adults around them.',
    items: [
      {
        title: 'Diagnosis',
        description: 'Understanding referral routes, evidence and what to ask for next.',
        href: '/toolkit/adhd-children-diagnosis',
      },
      {
        title: 'Symptom Management',
        description: 'Planning tools, focus support, routines and practical ADHD management resources.',
        href: '/toolkit/adhd-children-symptom-management',
      },
      {
        title: 'Useful Contacts',
        description: 'School-facing support routes, family help and practical contacts to know about.',
        href: '/toolkit/adhd-children-useful-contacts',
      },
    ],
  },
  {
    title: 'Adults',
    description: 'Diagnosis support, everyday management tools and useful next-step resources for adult ADHD.',
    items: [
      {
        title: 'Diagnosis',
        description: 'A calmer starting point for understanding adult diagnosis and referral routes.',
        href: '/toolkit/adhd-adults-diagnosis',
      },
      {
        title: 'Symptom Management',
        description: 'The current ADHD resource library gathered into one practical support page.',
        href: '/toolkit/adhd-adults-symptom-management',
      },
      {
        title: 'Useful Contacts',
        description: 'Support routes, workplace-facing help and useful contacts for adults.',
        href: '/toolkit/adhd-adults-useful-contacts',
      },
    ],
  },
] as const

const adhdManagementResourceSlugs = [
  'task-starting-when-your-brain-says-no',
  'body-doubling-starter-guide',
  'time-blindness-reset-routine',
  'low-pressure-weekly-planner',
  'dopamine-menu-builder',
  'transition-script-for-leaving-the-house',
  'priority-filter-for-overloaded-days',
  'focus-friendly-desk-checklist',
  'emotional-reset-prompt-sheet',
  'how-to-run-an-admin-hour',
] as const

const adhdChildrenDiagnosisSubpages = [
  {
    title: 'Diagnosis Tools',
    description: 'Practical tools and prompts for preparing for the diagnosis process.',
    href: '/toolkit/adhd-children-diagnosis-tools',
  },
  {
    title: 'Symptom Definitions',
    description: 'Plain-language help for understanding how ADHD symptoms can present in children.',
    href: '/toolkit/adhd-children-symptom-definitions',
  },
  {
    title: 'Evidence Tracking',
    description: 'Guidance on what examples to record and how to keep useful observations together.',
    href: '/toolkit/adhd-children-evidence-tracking',
  },
  {
    title: 'Next Steps',
    description: 'A calmer overview of what to do after concerns have been raised or first conversations have started.',
    href: '/toolkit/adhd-children-next-steps',
  },
] as const

const adhdAdultsDiagnosisSubpages = [
  {
    title: 'Diagnosis Tools',
    description: 'Practical tools and prompts for preparing for the diagnosis process.',
    href: '/toolkit/adhd-adults-diagnosis-tools',
  },
  {
    title: 'Symptom Definitions',
    description: 'Plain-language help for understanding how ADHD symptoms can present in adult life.',
    href: '/toolkit/adhd-adults-symptom-definitions',
  },
  {
    title: 'Evidence Tracking',
    description: 'Guidance on what examples to record and how to keep useful observations together.',
    href: '/toolkit/adhd-adults-evidence-tracking',
  },
  {
    title: 'Next Steps',
    description: 'A calmer overview of what to do after concerns have been raised or first conversations have started.',
    href: '/toolkit/adhd-adults-next-steps',
  },
] as const

const adhdChildrenUsefulContactsSubpages = [
  {
    title: 'Websites',
    description: 'Trusted online starting points for ADHD guidance, information and support routes.',
    href: '/toolkit/adhd-children-useful-websites',
  },
  {
    title: 'Contact Details',
    description: 'Useful support routes and contact points to keep in one place.',
    href: '/toolkit/adhd-children-contact-details',
  },
  {
    title: 'Documents',
    description: 'The key written information and records that are often worth keeping together.',
    href: '/toolkit/adhd-children-useful-documents',
  },
] as const

const adhdAdultsUsefulContactsSubpages = [
  {
    title: 'Websites',
    description: 'Trusted online starting points for ADHD guidance, information and support routes.',
    href: '/toolkit/adhd-adults-useful-websites',
  },
  {
    title: 'Contact Details',
    description: 'Useful support routes and contact points to keep in one place.',
    href: '/toolkit/adhd-adults-contact-details',
  },
  {
    title: 'Documents',
    description: 'The key written information and records that are often worth keeping together.',
    href: '/toolkit/adhd-adults-useful-documents',
  },
] as const

const autismHubSections = [
  {
    title: 'Children',
    description: 'Support routes, practical guidance and day-to-day autism help for children and the adults around them.',
    items: [
      { title: 'Diagnosis', description: 'Understanding referral routes, evidence and what to ask for next.', href: '/toolkit/autism-children-diagnosis' },
      { title: 'Symptom Management', description: 'Sensory tools, communication support, recovery planning and practical autism resources.', href: '/toolkit/autism-children-symptom-management' },
      { title: 'Useful Contacts', description: 'School-facing support routes, family help and practical contacts to know about.', href: '/toolkit/autism-children-useful-contacts' },
    ],
  },
  {
    title: 'Adults',
    description: 'Diagnosis support, everyday management tools and useful next-step resources for autistic adults.',
    items: [
      { title: 'Diagnosis', description: 'A calmer starting point for understanding adult diagnosis and referral routes.', href: '/toolkit/autism-adults-diagnosis' },
      { title: 'Symptom Management', description: 'The current autism resource library gathered into one practical support page.', href: '/toolkit/autism-adults-symptom-management' },
      { title: 'Useful Contacts', description: 'Support routes, workplace-facing help and useful contacts for adults.', href: '/toolkit/autism-adults-useful-contacts' },
    ],
  },
] as const

const autismManagementResourceSlugs = [
  'sensory-reset-menu',
  'shutdown-support-plan',
  'communication-script-builder',
  'recovery-day-checklist',
  'unmasking-boundaries-guide',
  'social-recovery-planner',
  'daily-needs-profile',
  'overload-trigger-map',
  'appointment-preparation-checklist',
  'household-script-pack',
] as const

const autismChildrenDiagnosisSubpages = [
  { title: 'Diagnosis Tools', description: 'Practical tools and prompts for preparing for the diagnosis process.', href: '/toolkit/autism-children-diagnosis-tools' },
  { title: 'Symptom Definitions', description: 'Plain-language help for understanding how autism can present in children.', href: '/toolkit/autism-children-symptom-definitions' },
  { title: 'Evidence Tracking', description: 'Guidance on what examples to record and how to keep useful observations together.', href: '/toolkit/autism-children-evidence-tracking' },
  { title: 'Next Steps', description: 'A calmer overview of what to do after concerns have been raised or first conversations have started.', href: '/toolkit/autism-children-next-steps' },
] as const

const autismAdultsDiagnosisSubpages = [
  { title: 'Diagnosis Tools', description: 'Practical tools and prompts for preparing for the diagnosis process.', href: '/toolkit/autism-adults-diagnosis-tools' },
  { title: 'Symptom Definitions', description: 'Plain-language help for understanding how autism can present in adult life.', href: '/toolkit/autism-adults-symptom-definitions' },
  { title: 'Evidence Tracking', description: 'Guidance on what examples to record and how to keep useful observations together.', href: '/toolkit/autism-adults-evidence-tracking' },
  { title: 'Next Steps', description: 'A calmer overview of what to do after concerns have been raised or first conversations have started.', href: '/toolkit/autism-adults-next-steps' },
] as const

const autismChildrenUsefulContactsSubpages = [
  { title: 'Websites', description: 'Trusted online starting points for autism guidance, information and support routes.', href: '/toolkit/autism-children-useful-websites' },
  { title: 'Contact Details', description: 'Useful support routes and contact points to keep in one place.', href: '/toolkit/autism-children-contact-details' },
  { title: 'Documents', description: 'The key written information and records that are often worth keeping together.', href: '/toolkit/autism-children-useful-documents' },
] as const

const autismAdultsUsefulContactsSubpages = [
  { title: 'Websites', description: 'Trusted online starting points for autism guidance, information and support routes.', href: '/toolkit/autism-adults-useful-websites' },
  { title: 'Contact Details', description: 'Useful support routes and contact points to keep in one place.', href: '/toolkit/autism-adults-contact-details' },
  { title: 'Documents', description: 'The key written information and records that are often worth keeping together.', href: '/toolkit/autism-adults-useful-documents' },
] as const

const autismSections = [
  {
    title: 'Sensory Support',
    description:
      'Resources for reducing overload, planning sensory needs and making daily life feel more manageable.',
    resourceSlugs: [
      'sensory-reset-menu',
      'recovery-day-checklist',
      'overload-trigger-map',
      'appointment-preparation-checklist',
    ],
  },
  {
    title: 'Communication',
    description:
      'Tools and scripts for appointments, conversations and clearer communication when pressure is high.',
    resourceSlugs: ['communication-script-builder', 'household-script-pack'],
  },
  {
    title: 'Unmasking & Recovery',
    description:
      'Support for reducing masking, building recovery time and understanding what daily life actually asks of you.',
    resourceSlugs: ['unmasking-boundaries-guide', 'social-recovery-planner', 'daily-needs-profile'],
  },
  {
    title: 'Shutdown & Overload',
    description:
      'Practical guides for spotting shutdown early, reducing demands and supporting yourself more safely.',
    resourceSlugs: ['shutdown-support-plan'],
  },
] as const

const burnoutSections = [
  {
    title: 'Recognizing Burnout (Early Warning Signs)',
    description: 'Help users spot it before total shutdown, especially where SEN caregiving and ADHD overlap.',
    resourceSlugs: ['burnout-recognizing-burnout'],
  },
  {
    title: 'Immediate Relief: Shutdown Rescue & Nervous System Reset',
    description: 'For acute burnout moments when everything feels impossible.',
    resourceSlugs: ['burnout-shutdown-rescue'],
  },
  {
    title: 'Daily Self-Care That Actually Works for Busy SEN Parents',
    description: 'Reclaim tiny pockets of time without guilt by focusing on sustainable rather than perfect self-care.',
    resourceSlugs: ['burnout-daily-self-care'],
  },
  {
    title: 'Setting Boundaries & Delegating Without Guilt',
    description: 'Learn to say no and share the load before burnout deepens.',
    resourceSlugs: ['burnout-boundaries-delegating'],
  },
  {
    title: 'Building Your Support Village',
    description: 'Reduce isolation by building support around people who actually get it.',
    resourceSlugs: ['burnout-support-village'],
  },
  {
    title: 'Long-Term Recovery & Prevention',
    description: 'Move from surviving to thriving with longer-range recovery and maintenance tools.',
    resourceSlugs: ['burnout-long-term-recovery'],
  },
] as const

const workplaceSections = [
  {
    title: 'Adjustments & Support',
    description:
      'Templates and checklists for asking for adjustments and making support requests feel more concrete.',
    resourceSlugs: [
      'reasonable-adjustments-request-template',
      'workplace-adjustment-ideas-checklist',
      'meeting-script-for-manager-conversations',
      'meeting-agenda-template-for-clarity',
      'email-script-pack',
    ],
  },
  {
    title: 'Disclosure & Boundaries',
    description:
      'Guides for deciding whether to disclose, how to return to work and how to protect capacity at work.',
    resourceSlugs: ['disclosure-decision-guide', 'return-to-work-conversation-guide'],
  },
  {
    title: 'Workload & Sensory Support',
    description:
      'Tools for identifying pressure points, resetting priorities and reducing sensory drain in work settings.',
    resourceSlugs: [
      'workload-pressure-map',
      'priority-reset-sheet-for-busy-weeks',
      'sensory-office-survival-guide',
    ],
  },
] as const

const ehcpSections = [
  {
    title: 'Meetings & Preparation',
    description:
      'Prompt sheets, scripts and preparation guides to make meetings easier to follow and easier to use well.',
    resourceSlugs: [
      'ehcp-meeting-checklist',
      'parent-script-for-school-meetings',
      'school-meeting-questions-sheet',
      'annual-review-preparation-guide',
    ],
  },
  {
    title: 'Evidence & Records',
    description:
      'Resources for gathering evidence, recording observations and keeping useful information in one place.',
    resourceSlugs: ['ehcp-evidence-pack-guide', 'home-observations-record'],
  },
  {
    title: 'Tracking & Next Steps',
    description:
      'Tools for following timelines, tracking responsibilities and making sure next steps do not get lost.',
    resourceSlugs: ['send-support-map', 'ehcp-timeline-planner', 'ehcp-next-steps-tracker'],
  },
  {
    title: 'Understanding the System',
    description:
      'Plain-language help for understanding SEND wording and navigating the EHCP process with more confidence.',
    resourceSlugs: ['useful-send-language-guide'],
  },
] as const

const pillarSections = {
  adhd: adhdSections,
  autism: autismSections,
  burnout: burnoutSections,
  workplace: workplaceSections,
  ehcp: ehcpSections,
} as const

function isPillarSlug(slug: string): slug is PillarSlug {
  return pillarOrder.includes(slug as PillarSlug)
}

export async function generateStaticParams() {
  const resourceSlugs = await getToolkitSlugs()
  return [...pillarOrder, ...resourceSlugs].map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ToolkitSlugPageProps): Promise<Metadata> {
  const { slug } = await params

  if (isPillarSlug(slug)) {
    return {
      title: pillarMeta[slug].title,
      description: pillarMeta[slug].description,
    }
  }

  const resource = await getResourceBySlug(slug)
  if (!resource) return { title: 'Toolkit resource not found' }

  return {
    title: resource.title,
    description: resource.description,
  }
}

export default async function ToolkitSlugPage({ params }: ToolkitSlugPageProps) {
  const { slug } = await params

  if (TOOLKIT_COMING_SOON) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <section className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-white p-8 shadow-glow md:p-10">
          <div className="pointer-events-none select-none grayscale opacity-35 blur-[1px]" aria-hidden="true">
            <div className="rounded-[28px] bg-slate-100 p-8">
              <div className="h-5 w-40 rounded-full bg-slate-200" />
              <div className="mt-6 h-14 w-3/4 rounded-[20px] bg-slate-200" />
              <div className="mt-6 space-y-3">
                <div className="h-4 w-full rounded-full bg-slate-200" />
                <div className="h-4 w-11/12 rounded-full bg-slate-200" />
                <div className="h-4 w-3/4 rounded-full bg-slate-200" />
              </div>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-[24px] bg-slate-100 p-6">
                  <div className="h-4 w-24 rounded-full bg-slate-200" />
                  <div className="mt-4 h-8 w-2/3 rounded-[16px] bg-slate-200" />
                  <div className="mt-4 space-y-3">
                    <div className="h-4 w-full rounded-full bg-slate-200" />
                    <div className="h-4 w-4/5 rounded-full bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <div className="max-w-2xl rounded-[32px] bg-navy-800/84 px-8 py-10 text-white shadow-glow backdrop-blur">
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-white/78">Coming Soon</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">This toolkit section is not live yet</h1>
              <p className="mt-4 text-base leading-8 text-white/82">
                The toolkit will open once the first release is ready. Until then, the content is being kept offline
                while the rest of the site goes live.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <GradientButton href="/toolkit">Back to Toolkit</GradientButton>
                <GradientButton href="/community" variant="dark">
                  Join Community
                </GradientButton>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (isPillarSlug(slug)) {
    const resources = await getResourcesByPillar(slug)
    const meta = pillarMeta[slug]

    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="rounded-[36px] bg-white p-8 shadow-glow">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-4xl">
              <div className="mb-4 text-4xl">{meta.icon}</div>
              <h1 className="text-5xl font-black tracking-[-0.05em] text-slate-900">{meta.title}</h1>
              <p className="mt-4 text-base leading-8 text-slate-600">{meta.description}</p>
              {slug === 'adhd' ? (
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  This section is broken into practical areas so people can find help faster, whether they are trying to
                  manage time, start tasks, build routines or reduce overwhelm.
                </p>
              ) : slug === 'autism' ? (
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  This section is organised around sensory support, communication, recovery and overload so people can
                  find the kind of help they need more quickly.
                </p>
              ) : slug === 'burnout' ? (
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  This section moves from early warning signs into immediate relief, daily self-care, boundaries,
                  community support and longer-term recovery so the next step feels clearer when capacity is already
                  low.
                </p>
              ) : slug === 'workplace' ? (
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  This section is arranged around adjustments, communication, disclosure and workload so people can find
                  practical support for real work situations faster.
                </p>
              ) : slug === 'ehcp' ? (
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  This section is broken down into meetings, evidence, tracking and understanding the system so families
                  can find practical guidance for each part of the process.
                </p>
              ) : null}
            </div>
            <div className={`h-20 w-20 rounded-[28px] ${meta.accent}`} />
          </div>
        </section>

        <section className="py-10">
          {slug === 'adhd' ? (
            <div className="space-y-8">
              {adhdHubSections.map((group) => (
                <section key={group.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-glow">
                  <div className="max-w-3xl">
                    <h2 className="text-4xl font-black tracking-tight text-slate-900">{group.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{group.description}</p>
                  </div>
                  <div className="mt-6 grid gap-5 md:grid-cols-3">
                    {group.items.map((item) => (
                      <article key={item.href} className="flex h-full flex-col rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                        <PillBadge tone="purple">{item.title}</PillBadge>
                        <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900">{item.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                        <GradientButton href={item.href} variant="ghost" className="mt-auto self-start">
                          Open resource
                        </GradientButton>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : slug === 'autism' ? (
            <div className="space-y-8">
              {autismHubSections.map((group) => (
                <section key={group.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-glow">
                  <div className="max-w-3xl">
                    <h2 className="text-4xl font-black tracking-tight text-slate-900">{group.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{group.description}</p>
                  </div>
                  <div className="mt-6 grid gap-5 md:grid-cols-3">
                    {group.items.map((item) => (
                      <article key={item.href} className="flex h-full flex-col rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                        <PillBadge tone="teal">{item.title}</PillBadge>
                        <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900">{item.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                        <GradientButton href={item.href} variant="ghost" className="mt-auto self-start">
                          Open resource
                        </GradientButton>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <PillarResourceList resources={resources} sections={[...pillarSections[slug]]} />
          )}
        </section>
      </main>
    )
  }

  const resource = await getResourceBySlug(slug)
  if (!resource) notFound()

  const allResources = await getResources()
  const managementResources = allResources.filter((item) => adhdManagementResourceSlugs.includes(item.slug as (typeof adhdManagementResourceSlugs)[number]))
  const autismManagementResources = allResources.filter((item) => autismManagementResourceSlugs.includes(item.slug as (typeof autismManagementResourceSlugs)[number]))
  const isAdhdSymptomManagementPage =
    slug === 'adhd-children-symptom-management' || slug === 'adhd-adults-symptom-management'
  const isAutismSymptomManagementPage =
    slug === 'autism-children-symptom-management' || slug === 'autism-adults-symptom-management'
  const isAdhdChildrenDiagnosisPage = slug === 'adhd-children-diagnosis'
  const isAdhdAdultsDiagnosisPage = slug === 'adhd-adults-diagnosis'
  const isAdhdChildrenUsefulContactsPage = slug === 'adhd-children-useful-contacts'
  const isAdhdAdultsUsefulContactsPage = slug === 'adhd-adults-useful-contacts'
  const isAutismChildrenDiagnosisPage = slug === 'autism-children-diagnosis'
  const isAutismAdultsDiagnosisPage = slug === 'autism-adults-diagnosis'
  const isAutismChildrenUsefulContactsPage = slug === 'autism-children-useful-contacts'
  const isAutismAdultsUsefulContactsPage = slug === 'autism-adults-useful-contacts'

  const relatedResources = allResources
    .filter((item) => item.pillar === resource.pillar && item.slug !== resource.slug)
    .slice(0, 3)

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <article className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-glow md:p-10">
        <div className="flex flex-wrap gap-3">
          <PillBadge tone={resource.pillar === 'autism' ? 'teal' : resource.pillar === 'burnout' ? 'amber' : resource.pillar === 'workplace' ? 'pink' : resource.pillar === 'ehcp' ? 'violet' : 'purple'}>
            {pillarMeta[resource.pillar].title}
          </PillBadge>
          {!isAdhdChildrenDiagnosisPage && !isAdhdAdultsDiagnosisPage && !isAdhdChildrenUsefulContactsPage && !isAdhdAdultsUsefulContactsPage && !isAutismChildrenDiagnosisPage && !isAutismAdultsDiagnosisPage && !isAutismChildrenUsefulContactsPage && !isAutismAdultsUsefulContactsPage ? <PillBadge>{resourceTypeLabels[resource.type]}</PillBadge> : null}
          {!isAdhdChildrenDiagnosisPage && !isAdhdAdultsDiagnosisPage && !isAdhdChildrenUsefulContactsPage && !isAdhdAdultsUsefulContactsPage && !isAutismChildrenDiagnosisPage && !isAutismAdultsDiagnosisPage && !isAutismChildrenUsefulContactsPage && !isAutismAdultsUsefulContactsPage ? <PillBadge>{resource.readTime}</PillBadge> : null}
        </div>
        <h1 className="mt-6 text-5xl font-black tracking-[-0.05em] text-slate-900">{resource.title}</h1>
        <p className="mt-5 max-w-prose text-base leading-8 text-slate-600">{resource.description}</p>

        <div className="prose prose-slate mt-8 max-w-none">
          <PortableTextRenderer value={resource.body} />
        </div>

        {isAdhdSymptomManagementPage ? (
          <section className="mt-10 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Symptom Management Resources</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              This section brings together the current ADHD management tools in one place, including planning, focus,
              routines, emotional regulation and everyday practical support.
            </p>
            <div className="mt-6 space-y-4">
              {managementResources.map((item) => (
                <article key={item._id} className="rounded-[22px] border border-slate-200 bg-white p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <PillBadge tone="purple">{resourceTypeLabels[item.type]}</PillBadge>
                    <PillBadge>{item.readTime}</PillBadge>
                  </div>
                  <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  <GradientButton href={`/toolkit/${item.slug}`} variant="ghost" className="mt-4">
                    Open resource
                  </GradientButton>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {isAutismSymptomManagementPage ? (
          <section className="mt-10 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Symptom Management Resources</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              This section brings together the current autism management tools in one place, including sensory support,
              communication, recovery planning and everyday practical support.
            </p>
            <div className="mt-6 space-y-4">
              {autismManagementResources.map((item) => (
                <article key={item._id} className="rounded-[22px] border border-slate-200 bg-white p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <PillBadge tone="teal">{resourceTypeLabels[item.type]}</PillBadge>
                    <PillBadge>{item.readTime}</PillBadge>
                  </div>
                  <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  <GradientButton href={`/toolkit/${item.slug}`} variant="ghost" className="mt-4">
                    Open resource
                  </GradientButton>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {isAdhdChildrenDiagnosisPage ? (
          <section className="mt-10 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Explore This Section</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {adhdChildrenDiagnosisSubpages.map((item) => (
                <article key={item.href} className="flex h-full flex-col rounded-[22px] border border-slate-200 bg-white p-5">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  <GradientButton href={item.href} variant="ghost" className="mt-auto self-start">
                    Open resource
                  </GradientButton>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {isAutismChildrenDiagnosisPage ? (
          <section className="mt-10 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Explore This Section</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {autismChildrenDiagnosisSubpages.map((item) => (
                <article key={item.href} className="flex h-full flex-col rounded-[22px] border border-slate-200 bg-white p-5">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  <GradientButton href={item.href} variant="ghost" className="mt-auto self-start">
                    Open resource
                  </GradientButton>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {isAdhdAdultsDiagnosisPage ? (
          <section className="mt-10 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Explore This Section</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {adhdAdultsDiagnosisSubpages.map((item) => (
                <article key={item.href} className="flex h-full flex-col rounded-[22px] border border-slate-200 bg-white p-5">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  <GradientButton href={item.href} variant="ghost" className="mt-auto self-start">
                    Open resource
                  </GradientButton>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {isAutismAdultsDiagnosisPage ? (
          <section className="mt-10 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Explore This Section</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {autismAdultsDiagnosisSubpages.map((item) => (
                <article key={item.href} className="flex h-full flex-col rounded-[22px] border border-slate-200 bg-white p-5">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  <GradientButton href={item.href} variant="ghost" className="mt-auto self-start">
                    Open resource
                  </GradientButton>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {isAdhdChildrenUsefulContactsPage ? (
          <section className="mt-10 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Explore This Section</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {adhdChildrenUsefulContactsSubpages.map((item) => (
                <article key={item.href} className="flex h-full flex-col rounded-[22px] border border-slate-200 bg-white p-5">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  <GradientButton href={item.href} variant="ghost" className="mt-auto self-start">
                    Open resource
                  </GradientButton>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {isAutismChildrenUsefulContactsPage ? (
          <section className="mt-10 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Explore This Section</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {autismChildrenUsefulContactsSubpages.map((item) => (
                <article key={item.href} className="flex h-full flex-col rounded-[22px] border border-slate-200 bg-white p-5">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  <GradientButton href={item.href} variant="ghost" className="mt-auto self-start">
                    Open resource
                  </GradientButton>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {isAdhdAdultsUsefulContactsPage ? (
          <section className="mt-10 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Explore This Section</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {adhdAdultsUsefulContactsSubpages.map((item) => (
                <article key={item.href} className="flex h-full flex-col rounded-[22px] border border-slate-200 bg-white p-5">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  <GradientButton href={item.href} variant="ghost" className="mt-auto self-start">
                    Open resource
                  </GradientButton>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {isAutismAdultsUsefulContactsPage ? (
          <section className="mt-10 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Explore This Section</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {autismAdultsUsefulContactsSubpages.map((item) => (
                <article key={item.href} className="flex h-full flex-col rounded-[22px] border border-slate-200 bg-white p-5">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  <GradientButton href={item.href} variant="ghost" className="mt-auto self-start">
                    Open resource
                  </GradientButton>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {resource.sources?.length && !isAdhdChildrenDiagnosisPage && !isAdhdAdultsDiagnosisPage && !isAdhdChildrenUsefulContactsPage && !isAdhdAdultsUsefulContactsPage && !isAutismChildrenDiagnosisPage && !isAutismAdultsDiagnosisPage && !isAutismChildrenUsefulContactsPage && !isAutismAdultsUsefulContactsPage ? (
          <section className="mt-10 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">References</h2>
            <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              {resource.sources.map((source, index) => (
                <li key={`${source.url}-${index}`}>
                  <span className="font-semibold text-slate-900">{index + 1}.</span>{' '}
                  <a href={source.url} className="font-semibold text-rate-purple underline underline-offset-4">
                    {source.title}
                  </a>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {resource.downloadUrl ? (
          <GradientButton href={resource.downloadUrl} className="mt-8">
            Download resource
          </GradientButton>
        ) : null}
      </article>

      <section className="mt-8 rounded-[30px] border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Support RATE</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          If this helped, the shop is one of the ways we keep building free resources and community support.
        </p>
        <GradientButton href="/shop" variant="ghost" className="mt-4">
          Shop the store
        </GradientButton>
      </section>

      <section className="mt-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Related resources</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {relatedResources.map((item) => (
            <article key={item._id} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-glow">
              <h3 className="text-2xl font-black tracking-tight text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              <GradientButton href={`/toolkit/${item.slug}`} variant="ghost" className="mt-4">
                Open
              </GradientButton>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
