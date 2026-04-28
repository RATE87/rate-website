import { sanityClient, isSanityConfigured } from '@/lib/sanity/client'
import type {
  AffiliateProduct,
  Creator,
  Event,
  PillarSlug,
  Resource,
  ResourceSource,
  ResourceType,
} from '@/lib/sanity/types'

const adhdSources: ResourceSource[] = [
  { title: 'NHS: ADHD in adults', url: 'https://www.nhs.uk/conditions/adhd-adults/' },
  { title: 'NHS: Stress', url: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/' },
]

const autismSources: ResourceSource[] = [
  { title: 'NHS: Signs of autism in adults', url: 'https://www.nhs.uk/conditions/autism/signs/adults/' },
  { title: 'NHS Autism Central: Sensory differences', url: 'https://www.autismcentral.nhs.uk/guidance/sensory-differences' },
  { title: 'National Autistic Society: Understanding autistic burnout', url: 'https://www.autism.org.uk/advice-and-guidance/professional-practice/autistic-burnout' },
]

const burnoutSources: ResourceSource[] = [
  { title: 'NHS: Stress', url: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/' },
  { title: 'NHS Every Mind Matters: Work-related stress', url: 'https://www.nhs.uk/every-mind-matters/lifes-challenges/work-related-stress/' },
  { title: 'National Autistic Society: Understanding autistic burnout', url: 'https://www.autism.org.uk/advice-and-guidance/professional-practice/autistic-burnout' },
]

const burnoutToolkitSources: ResourceSource[] = [
  { title: 'CHADD', url: 'https://chadd.org/' },
  { title: 'ADDitude Magazine', url: 'https://www.additudemag.com/' },
  { title: 'American Academy of Family Physicians', url: 'https://www.aafp.org/' },
  { title: 'Therapist Aid', url: 'https://www.therapistaid.com/' },
  { title: 'Choosing Therapy', url: 'https://www.choosingtherapy.com/' },
  { title: 'Child Mind Institute', url: 'https://childmind.org/' },
  { title: 'Healthline', url: 'https://www.healthline.com/' },
]

const workplaceSources: ResourceSource[] = [
  { title: 'ACAS: What reasonable adjustments are', url: 'https://www.acas.org.uk/reasonable-adjustments' },
  { title: 'ACAS: Adjustments for neurodiversity', url: 'https://www.acas.org.uk/reasonable-adjustments/adjustments-for-neurodiversity' },
  { title: 'ACAS: Asking for reasonable adjustments', url: 'https://www.acas.org.uk/reasonable-adjustments/asking-for-reasonable-adjustments' },
]

const ehcpSources: ResourceSource[] = [
  { title: 'GOV.UK: SEND code of practice: 0 to 25 years', url: 'https://www.gov.uk/government/publications/send-code-of-practice-0-to-25' },
  { title: 'GOV.UK: Education, health and care plans: England 2025', url: 'https://www.gov.uk/government/statistics/education-health-and-care-plans-england-2025' },
]

function defaultSources(pillar: PillarSlug): ResourceSource[] {
  switch (pillar) {
    case 'adhd':
      return adhdSources
    case 'autism':
      return autismSources
    case 'burnout':
      return burnoutSources
    case 'workplace':
      return workplaceSources
    case 'ehcp':
      return ehcpSources
  }
}

function makeResource(
  pillar: PillarSlug,
  slug: string,
  title: string,
  type: ResourceType,
  description: string,
  readTime: string,
  bodyText: string[],
  downloadUrl?: string,
  sources?: ResourceSource[]
): Resource {
  return {
    _id: `resource-${slug}`,
    title,
    slug,
    pillar,
    type,
    description,
    readTime,
    body: bodyText.map((text) => ({
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text }],
    })),
    downloadUrl,
    sources: sources ?? defaultSources(pillar),
  }
}

const fallbackResources: Resource[] = [
  makeResource(
    'adhd',
    'adhd-children-diagnosis',
    'ADHD Diagnosis for Children',
    'guide',
    'A starter page for an understanding of what ADHD looks like, the diagnosis routes you need to take, what evidence helps and what to ask for next.',
    '6 min',
    [
      'This page is designed as a practical starting point for families who are trying to understand what ADHD can look like, which diagnosis routes may be available and what evidence is often helpful to gather early.',
      'Use it as a calmer overview before moving into the more detailed diagnosis tools, symptom definitions, evidence tracking and next steps sections.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-children-diagnosis-tools',
    'ADHD Diagnosis Tools for Children',
    'guide',
    'A practical set of prompts and guidance points to help families prepare for the diagnosis process.',
    '5 min',
    [
      'This section focuses on the kinds of practical tools that can make the diagnosis journey easier to understand and prepare for.',
      'Use it to think about what questions to ask, what examples to gather and how to keep information in one place.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-children-symptom-definitions',
    'ADHD Symptom Definitions for Children',
    'guide',
    'A plain-language overview of common ADHD symptom patterns and how they may show up day to day.',
    '5 min',
    [
      'This section is designed to make symptom language clearer and easier to recognise in real life.',
      'It can help families describe what they are seeing more confidently when speaking to schools or professionals.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-children-evidence-tracking',
    'ADHD Evidence Tracking for Children',
    'guide',
    'A starter guide for recording useful examples, patterns and observations that may support referrals or assessments.',
    '5 min',
    [
      'This section is about gathering evidence in a calmer and more useful way.',
      'It helps turn everyday observations into examples that are easier to explain and refer back to later.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-children-next-steps',
    'ADHD Next Steps for Children',
    'guide',
    'A practical next-step guide for what to do after concerns have been noticed or once the first conversations have started.',
    '5 min',
    [
      'This section helps families think about what comes next after the first signs, first meetings or first referrals.',
      'Use it as a practical bridge between understanding the issue and taking the next useful action.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-children-symptom-management',
    'ADHD Symptom Management for Children',
    'guide',
    'A practical hub of ADHD support tools, planning resources and regulation aids for day-to-day symptom management.',
    '8 min',
    [
      'This page brings together the current ADHD management resources in one place so people can move straight into the practical support.',
      'The tools below cover planning, focus, emotional regulation, momentum and everyday friction points.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-children-useful-contacts',
    'Useful Contacts for Children with ADHD',
    'guide',
    'Key support routes, school-facing contacts and starting points for families trying to find practical help.',
    '5 min',
    [
      'This page is a practical contacts overview for families who need a clearer sense of where support might come from and which services are worth speaking to first.',
      'Use it alongside the diagnosis and symptom management pages rather than as a replacement for professional advice.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-children-useful-websites',
    'Useful ADHD Websites for Children',
    'guide',
    'A starting-point list of websites that can help families find ADHD guidance, support and practical next steps.',
    '5 min',
    [
      'This section is intended to gather useful websites in one place so families can spend less time searching from scratch.',
      'Use it as a practical starting point for trusted online guidance and further reading.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-children-contact-details',
    'Useful ADHD Contact Details for Children',
    'guide',
    'A practical overview of the kinds of services and support routes families may want to keep close to hand.',
    '5 min',
    [
      'This section is designed to help families think about which contact routes may be useful during different stages of support.',
      'Use it as a calmer reference point while working through diagnosis, school support or everyday management.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-children-useful-documents',
    'Useful ADHD Documents for Children',
    'guide',
    'A practical overview of the documents, notes and written evidence that can be useful to keep together.',
    '5 min',
    [
      'This section focuses on the kinds of paperwork and written records that often become helpful during support conversations.',
      'Use it to think about what is worth keeping, updating and taking into meetings.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-adults-diagnosis',
    'ADHD Diagnosis for Adults',
    'guide',
    'A starter page for an understanding of what ADHD looks like, the diagnosis routes you need to take, what evidence helps and what to ask for next.',
    '6 min',
    [
      'This page is designed as a practical starting point for adults who are trying to understand what ADHD can look like, which diagnosis routes may be available and what evidence is often helpful to gather early.',
      'Use it as a calmer overview before moving into the more detailed diagnosis tools, symptom definitions, evidence tracking and next steps sections.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-adults-diagnosis-tools',
    'ADHD Diagnosis Tools for Adults',
    'guide',
    'A practical set of prompts and guidance points to help adults prepare for the diagnosis process.',
    '5 min',
    [
      'This section focuses on the kinds of practical tools that can make the diagnosis journey easier to understand and prepare for.',
      'Use it to think about what questions to ask, what examples to gather and how to keep information in one place.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-adults-symptom-definitions',
    'ADHD Symptom Definitions for Adults',
    'guide',
    'A plain-language overview of common ADHD symptom patterns and how they may show up in adult life.',
    '5 min',
    [
      'This section is designed to make symptom language clearer and easier to recognise in real life.',
      'It can help adults describe what they are experiencing more confidently when speaking to services or employers.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-adults-evidence-tracking',
    'ADHD Evidence Tracking for Adults',
    'guide',
    'A starter guide for recording useful examples, patterns and observations that may support referrals or assessments.',
    '5 min',
    [
      'This section is about gathering evidence in a calmer and more useful way.',
      'It helps turn everyday observations into examples that are easier to explain and refer back to later.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-adults-next-steps',
    'ADHD Next Steps for Adults',
    'guide',
    'A practical next-step guide for what to do after concerns have been noticed or once the first conversations have started.',
    '5 min',
    [
      'This section helps adults think about what comes next after the first signs, first conversations or first referrals.',
      'Use it as a practical bridge between understanding the issue and taking the next useful action.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-adults-symptom-management',
    'ADHD Symptom Management for Adults',
    'guide',
    'A practical hub of ADHD support tools, planning resources and regulation aids for everyday adult life.',
    '8 min',
    [
      'This page brings together the current ADHD management resources in one place so people can move straight into the practical support.',
      'The tools below cover planning, focus, emotional regulation, momentum and everyday friction points.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-adults-useful-contacts',
    'Useful Contacts for Adults with ADHD',
    'guide',
    'Key support routes, workplace-facing contacts and practical starting points for adults looking for help.',
    '5 min',
    [
      'This page is designed to gather the most useful early support routes in one place so people can spend less time searching from scratch.',
      'Use it as a practical contact list alongside the diagnosis and symptom management resources.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-adults-useful-websites',
    'Useful ADHD Websites for Adults',
    'guide',
    'A starting-point list of websites that can help adults find ADHD guidance, support and practical next steps.',
    '5 min',
    [
      'This section is intended to gather useful websites in one place so adults can spend less time searching from scratch.',
      'Use it as a practical starting point for trusted online guidance and further reading.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-adults-contact-details',
    'Useful ADHD Contact Details for Adults',
    'guide',
    'A practical overview of the kinds of services and support routes adults may want to keep close to hand.',
    '5 min',
    [
      'This section is designed to help adults think about which contact routes may be useful during different stages of support.',
      'Use it as a calmer reference point while working through diagnosis, workplace support or everyday management.',
    ]
  ),
  makeResource(
    'adhd',
    'adhd-adults-useful-documents',
    'Useful ADHD Documents for Adults',
    'guide',
    'A practical overview of the documents, notes and written evidence that can be useful to keep together.',
    '5 min',
    [
      'This section focuses on the kinds of paperwork and written records that often become helpful during support conversations.',
      'Use it to think about what is worth keeping, updating and taking into appointments or work discussions.',
    ]
  ),
  makeResource('adhd', 'task-starting-when-your-brain-says-no', 'Task Starting When Your Brain Says No', 'guide', 'A no-jargon guide for lowering the activation energy needed to begin.', '6 min', ['Start tiny. Reduce the first step until it feels almost too small to fail.', 'Pick one visible action, one timer, and one reward. Keep the setup lighter than the task itself.']),
  makeResource('adhd', 'body-doubling-starter-guide', 'Body Doubling Starter Guide', 'tool', 'A quick guide to using presence, accountability and low-pressure co-working to get moving.', '5 min', ['Body doubling works best when the setup is simple, predictable and free from shame.', 'Agree the task, set a short check-in point and keep the social energy low enough that focus can stay intact.']),
  makeResource('adhd', 'time-blindness-reset-routine', 'Time Blindness Reset Routine', 'template', 'A simple routine for getting your bearings again when time has run away from you.', '4 min', ['Use a reset sequence: what time is it, what matters next, what can be dropped and what needs support.', 'The goal is not to catch up perfectly. The goal is to re-enter the day with less panic.']),
  makeResource('adhd', 'low-pressure-weekly-planner', 'Low Pressure Weekly Planner', 'printable', 'A printable planner that prioritises energy, anchors and realistic capacity over perfection.', '3 min', ['Plan around anchors first: appointments, meals, rest and one or two priorities that actually matter.'], 'https://example.com/adhd-week-planner.pdf'),
  makeResource('adhd', 'dopamine-menu-builder', 'Dopamine Menu Builder', 'tool', 'A menu of low, medium and high-effort dopamine supports for flat days.', '4 min', ['A dopamine menu helps you stop relying on memory when your brain is already underpowered.']),
  makeResource('adhd', 'transition-script-for-leaving-the-house', 'Transition Script for Leaving the House', 'template', 'A simple repeatable script for reducing chaos around transitions and getting out of the door.', '5 min', ['Build the same order every time: body, bag, basics, buffer, and exit. Repetition saves energy.']),
  makeResource('adhd', 'priority-filter-for-overloaded-days', 'Priority Filter for Overloaded Days', 'guide', 'A way to sort urgent, important and emotionally loud tasks when everything feels equally demanding.', '6 min', ['Not every loud task is important and not every important task needs to happen today.']),
  makeResource('adhd', 'focus-friendly-desk-checklist', 'Focus-Friendly Desk Checklist', 'printable', 'A printable checklist for creating a desk setup with fewer distractions and less friction.', '3 min', ['Remove visual clutter, pre-place tools and make the first action on your desk obvious.'], 'https://example.com/focus-friendly-desk-checklist.pdf'),
  makeResource('adhd', 'emotional-reset-prompt-sheet', 'Emotional Reset Prompt Sheet', 'tool', 'A prompt sheet for recognising overwhelm before it turns into shutdown or spiralling.', '4 min', ['Ask: what happened, what story am I telling myself, what support would make this smaller right now?']),
  makeResource('adhd', 'how-to-run-an-admin-hour', 'How to Run an Admin Hour', 'guide', 'A short routine for tackling life admin without letting it swallow the whole day.', '5 min', ['Batch the small tasks, cap the time and stop before decision fatigue turns one hour into four.']),

  makeResource(
    'autism',
    'autism-children-diagnosis',
    'Autism Diagnosis for Children',
    'guide',
    'A starter page for an understanding of what autism can look like, the diagnosis routes you may need to take, what evidence helps and what to ask for next.',
    '6 min',
    [
      'This page is designed as a practical starting point for families who are trying to understand what autism can look like, which diagnosis routes may be available and what evidence is often helpful to gather early.',
      'Use it as a calmer overview before moving into the more detailed diagnosis tools, symptom definitions, evidence tracking and next steps sections.',
    ]
  ),
  makeResource('autism', 'autism-children-diagnosis-tools', 'Autism Diagnosis Tools for Children', 'guide', 'A practical set of prompts and guidance points to help families prepare for the diagnosis process.', '5 min', ['This section focuses on the kinds of practical tools that can make the diagnosis journey easier to understand and prepare for.', 'Use it to think about what questions to ask, what examples to gather and how to keep information in one place.']),
  makeResource('autism', 'autism-children-symptom-definitions', 'Autism Symptom Definitions for Children', 'guide', 'A plain-language overview of common autism presentation patterns and how they may show up day to day.', '5 min', ['This section is designed to make common autism wording clearer and easier to recognise in real life.', 'It can help families describe what they are seeing more confidently when speaking to schools or professionals.']),
  makeResource('autism', 'autism-children-evidence-tracking', 'Autism Evidence Tracking for Children', 'guide', 'A starter guide for recording useful examples, patterns and observations that may support referrals or assessments.', '5 min', ['This section is about gathering evidence in a calmer and more useful way.', 'It helps turn everyday observations into examples that are easier to explain and refer back to later.']),
  makeResource('autism', 'autism-children-next-steps', 'Autism Next Steps for Children', 'guide', 'A practical next-step guide for what to do after concerns have been noticed or once the first conversations have started.', '5 min', ['This section helps families think about what comes next after the first signs, first meetings or first referrals.', 'Use it as a practical bridge between understanding the issue and taking the next useful action.']),
  makeResource('autism', 'autism-children-symptom-management', 'Autism Symptom Management for Children', 'guide', 'A practical hub of autism support tools, sensory resources and communication aids for day-to-day life.', '8 min', ['This page brings together the current autism management resources in one place so people can move straight into the practical support.', 'The tools below cover sensory support, communication, recovery and daily needs.']),
  makeResource('autism', 'autism-children-useful-contacts', 'Useful Contacts for Children with Autism', 'guide', 'Key support routes, school-facing contacts and practical starting points for families trying to find help.', '5 min', ['This page is a practical contacts overview for families who need a clearer sense of where support might come from and which services are worth speaking to first.', 'Use it alongside the diagnosis and symptom management pages rather than as a replacement for professional advice.']),
  makeResource('autism', 'autism-children-useful-websites', 'Useful Autism Websites for Children', 'guide', 'A starting-point list of websites that can help families find autism guidance, support and practical next steps.', '5 min', ['This section is intended to gather useful websites in one place so families can spend less time searching from scratch.', 'Use it as a practical starting point for trusted online guidance and further reading.']),
  makeResource('autism', 'autism-children-contact-details', 'Useful Autism Contact Details for Children', 'guide', 'A practical overview of the kinds of services and support routes families may want to keep close to hand.', '5 min', ['This section is designed to help families think about which contact routes may be useful during different stages of support.', 'Use it as a calmer reference point while working through diagnosis, school support or everyday management.']),
  makeResource('autism', 'autism-children-useful-documents', 'Useful Autism Documents for Children', 'guide', 'A practical overview of the documents, notes and written evidence that can be useful to keep together.', '5 min', ['This section focuses on the kinds of paperwork and written records that often become helpful during support conversations.', 'Use it to think about what is worth keeping, updating and taking into meetings.']),
  makeResource('autism', 'autism-adults-diagnosis', 'Autism Diagnosis for Adults', 'guide', 'A starter page for an understanding of what autism can look like, the diagnosis routes you may need to take, what evidence helps and what to ask for next.', '6 min', ['This page is designed as a practical starting point for adults who are trying to understand what autism can look like, which diagnosis routes may be available and what evidence is often helpful to gather early.', 'Use it as a calmer overview before moving into the more detailed diagnosis tools, symptom definitions, evidence tracking and next steps sections.']),
  makeResource('autism', 'autism-adults-diagnosis-tools', 'Autism Diagnosis Tools for Adults', 'guide', 'A practical set of prompts and guidance points to help adults prepare for the diagnosis process.', '5 min', ['This section focuses on the kinds of practical tools that can make the diagnosis journey easier to understand and prepare for.', 'Use it to think about what questions to ask, what examples to gather and how to keep information in one place.']),
  makeResource('autism', 'autism-adults-symptom-definitions', 'Autism Symptom Definitions for Adults', 'guide', 'A plain-language overview of common autism presentation patterns and how they may show up in adult life.', '5 min', ['This section is designed to make common autism wording clearer and easier to recognise in real life.', 'It can help adults describe what they are experiencing more confidently when speaking to services or employers.']),
  makeResource('autism', 'autism-adults-evidence-tracking', 'Autism Evidence Tracking for Adults', 'guide', 'A starter guide for recording useful examples, patterns and observations that may support referrals or assessments.', '5 min', ['This section is about gathering evidence in a calmer and more useful way.', 'It helps turn everyday observations into examples that are easier to explain and refer back to later.']),
  makeResource('autism', 'autism-adults-next-steps', 'Autism Next Steps for Adults', 'guide', 'A practical next-step guide for what to do after concerns have been noticed or once the first conversations have started.', '5 min', ['This section helps adults think about what comes next after the first signs, first conversations or first referrals.', 'Use it as a practical bridge between understanding the issue and taking the next useful action.']),
  makeResource('autism', 'autism-adults-symptom-management', 'Autism Symptom Management for Adults', 'guide', 'A practical hub of autism support tools, sensory resources and communication aids for everyday adult life.', '8 min', ['This page brings together the current autism management resources in one place so people can move straight into the practical support.', 'The tools below cover sensory support, communication, recovery and daily needs.']),
  makeResource('autism', 'autism-adults-useful-contacts', 'Useful Contacts for Adults with Autism', 'guide', 'Key support routes, workplace-facing contacts and practical starting points for adults looking for help.', '5 min', ['This page is designed to gather the most useful early support routes in one place so people can spend less time searching from scratch.', 'Use it as a practical contact list alongside the diagnosis and symptom management resources.']),
  makeResource('autism', 'autism-adults-useful-websites', 'Useful Autism Websites for Adults', 'guide', 'A starting-point list of websites that can help adults find autism guidance, support and practical next steps.', '5 min', ['This section is intended to gather useful websites in one place so adults can spend less time searching from scratch.', 'Use it as a practical starting point for trusted online guidance and further reading.']),
  makeResource('autism', 'autism-adults-contact-details', 'Useful Autism Contact Details for Adults', 'guide', 'A practical overview of the kinds of services and support routes adults may want to keep close to hand.', '5 min', ['This section is designed to help adults think about which contact routes may be useful during different stages of support.', 'Use it as a calmer reference point while working through diagnosis, workplace support or everyday management.']),
  makeResource('autism', 'autism-adults-useful-documents', 'Useful Autism Documents for Adults', 'guide', 'A practical overview of the documents, notes and written evidence that can be useful to keep together.', '5 min', ['This section focuses on the kinds of paperwork and written records that often become helpful during support conversations.', 'Use it to think about what is worth keeping, updating and taking into appointments or work discussions.']),
  makeResource('autism', 'sensory-reset-menu', 'Sensory Reset Menu', 'tool', 'A menu of low-demand options for reducing overload without adding more thinking.', '4 min', ['Think in categories: light, sound, touch, pressure, movement and communication.', 'A reset menu works best when it is already written down before overwhelm hits.']),
  makeResource('autism', 'shutdown-support-plan', 'Shutdown Support Plan', 'template', 'A calm structure for spotting shutdown signs early and reducing demands safely.', '6 min', ['List early warning signs, what helps, what makes things worse and what other people need to know.', 'Keep language practical. In shutdown, less explaining is usually better than more.']),
  makeResource('autism', 'communication-script-builder', 'Communication Script Builder', 'guide', 'A structured way to create scripts for appointments, work conversations and difficult moments.', '5 min', ['A good script gives you a beginning, a key point and an exit line so you are not improvising under pressure.']),
  makeResource('autism', 'recovery-day-checklist', 'Recovery Day Checklist', 'printable', 'A printable for low-demand days when your system needs less input, less pressure and more recovery.', '3 min', ['Reduce decisions. Pre-choose food, clothing, communication options and one gentle task at most.'], 'https://example.com/autism-recovery-day-checklist.pdf'),
  makeResource('autism', 'unmasking-boundaries-guide', 'Unmasking Boundaries Guide', 'guide', 'A guide to reducing masking in ways that feel safer and more sustainable.', '7 min', ['Unmasking is not a performance goal. It is a process of becoming less split between survival and self.']),
  makeResource('autism', 'social-recovery-planner', 'Social Recovery Planner', 'tool', 'A planning tool for building in recovery time before and after social demands.', '4 min', ['Social energy often needs preparation and decompression. Put both in the plan, not just the event.']),
  makeResource('autism', 'daily-needs-profile', 'Daily Needs Profile', 'template', 'A one-page profile of sensory, communication, food, movement and rest needs.', '5 min', ['A needs profile makes it easier to explain what supports you without rewriting yourself every time.']),
  makeResource('autism', 'overload-trigger-map', 'Overload Trigger Map', 'tool', 'A map for noticing what combinations of stress, sensory load and demand tip you into overload.', '4 min', ['Most overload is cumulative. Mapping patterns helps you spot the stack before it topples.']),
  makeResource('autism', 'appointment-preparation-checklist', 'Appointment Preparation Checklist', 'printable', 'A printable checklist for reducing stress around appointments, travel, waiting rooms and questions.', '3 min', ['Prepare the route, the sensory supports, the questions and the exit plan.'], 'https://example.com/autism-appointment-checklist.pdf'),
  makeResource('autism', 'household-script-pack', 'Household Script Pack', 'template', 'Useful scripts for requests, boundaries and low-energy communication at home.', '5 min', ['Scripts at home can reduce friction without turning every conversation into a negotiation.']),

  makeResource('burnout', 'burnout-recognizing-burnout', 'Recognizing Burnout (Early Warning Signs)', 'guide', 'Help users spot burnout before total shutdown, especially where SEN caregiving and ADHD make symptoms sneak up fast.', '8 min', ['Burnout Symptom Checklist: Rate physical signs such as exhaustion and sleep issues, emotional signs such as irritability, guilt or numbness and ADHD-specific changes such as worse executive dysfunction or rejection sensitivity spikes.', 'Energy Audit Worksheet: Track what drained you today versus what gave you even a tiny spark so the pattern becomes easier to notice before things escalate.', 'Self-Assessment Quiz: Use 10 yes or no questions tailored to SEN parents and caregivers, including prompts such as whether taking ten minutes for yourself creates guilt.', 'Comparison Chart: Compare normal parenting stress with SEN caregiver burnout so the differences feel clearer and easier to name.', 'These are starting points. Pair them with professional guidance where possible.'], undefined, burnoutToolkitSources),
  makeResource('burnout', 'burnout-shutdown-rescue', 'Immediate Relief: Shutdown Rescue & Nervous System Reset', 'guide', 'For acute burnout moments when everything feels impossible.', '8 min', ['5-Minute Rescue Plan: A simple sequence for meltdown or shutdown moments using breathing, one sensory tool, delegating one task and texting a safe person.', 'Sensory Reset Menu: A personalised list of quick regulation supports such as noise-cancelling headphones, weighted pressure or cold water on wrists.', 'Micro-Break Calendar: A set of 5 to 15 minute recharge ideas that can fit around caregiving, including playlist walks and bathroom breathing.', 'Grounding Script: A simple body scan or a name three things you can see, hear and feel script inspired by nervous system regulation approaches.', 'These are starting points. Pair them with professional guidance where possible.'], undefined, burnoutToolkitSources),
  makeResource('burnout', 'burnout-daily-self-care', 'Daily Self-Care That Actually Works for Busy SEN Parents', 'guide', 'Reclaim tiny pockets of time without guilt by focusing on sustainable rather than perfect self-care.', '8 min', ['Recharge Planner: A weekly template for blocking three non-negotiable moments for sleep, food, movement or any other basic regulation support.', 'Drains vs Fills Worksheet: List caregiving tasks, what they cost and where a quick swap could reduce pressure, such as batching admin instead of doing it every day.', 'Low-Demand Day Builder: A one-page prompt set for reducing demands on yourself and your child to interrupt boom and bust cycles.', 'Joy Micro-Moments Tracker: Log one small pleasurable thing each day to help rebuild dopamine and remind your brain that relief still exists.', 'These are starting points. Pair them with professional guidance where possible.'], undefined, burnoutToolkitSources),
  makeResource('burnout', 'burnout-boundaries-delegating', 'Setting Boundaries & Delegating Without Guilt', 'guide', 'Learn to say no and share the load before burnout deepens.', '8 min', ['Boundary Scripts: Fill-in-the-blank phrases for family, school or medical settings, including examples like saying you can only handle one appointment this week.', 'Delegation Checklist: A prompt list for what can be handed off plus space to note respite care, family, community or paid support options.', 'Priority Matrix: An ADHD-friendly urgent versus important grid covering caregiving needs and your own needs side by side.', 'Realistic Expectations Reframe: A one-page exercise for letting go of super-parent myths and replacing them with something more survivable.', 'These are starting points. Pair them with professional guidance where possible.'], undefined, burnoutToolkitSources),
  makeResource('burnout', 'burnout-support-village', 'Building Your Support Village', 'guide', 'Reduce isolation by building support around people who actually get it.', '8 min', ['Build Your Village Contact Sheet: A fillable template for local and national support routes, parent groups, respite options and communities that understand SEN and ADHD realities.', 'How to Ask for Help Scripts and Email Templates: Ready-made wording for grandparents, partners, teachers and other support people.', 'Support Group Finder: A quick guide to virtual and local SEN and ADHD parent meetups in the UK and beyond.', 'Peer Story Cards: Short you are not alone style examples from other parents and caregivers to reduce shame and isolation.', 'These are starting points. Pair them with professional guidance where possible.'], undefined, burnoutToolkitSources),
  makeResource('burnout', 'burnout-long-term-recovery', 'Long-Term Recovery & Prevention', 'guide', 'Move from surviving to thriving with longer-range recovery and maintenance tools.', '8 min', ['Recovery Phases Roadmap: A simple visual from acute burnout into rebuilding and then maintenance, with milestones that are easier to recognise.', 'Monthly Progress Tracker: Rate energy, mood and wins each month so progress stays visible enough to matter.', 'When to Seek Professional Help Flowchart: A clear guide to red flags, escalation points and finding support such as therapist directories or caregiver-focused help.', 'Maintenance Routine Builder: A quarterly reset checklist covering boundaries, support network reviews and what needs updating before another crash cycle builds.', 'These are starting points. Pair them with professional guidance where possible.'], undefined, burnoutToolkitSources),

  makeResource('workplace', 'reasonable-adjustments-request-template', 'Reasonable Adjustments Request Template', 'template', 'A copy-and-edit template for requesting workplace adjustments without starting from scratch.', '7 min', ['The strongest requests connect the adjustment directly to how you work best.', 'Keep your request concrete: what you need, why it helps and what outcome it supports.']),
  makeResource('workplace', 'disclosure-decision-guide', 'Disclosure Decision Guide', 'guide', 'Questions to help decide if, when and how to disclose neurodivergence at work.', '6 min', ['Disclosure is not morally required. It is a strategic choice that should be led by safety, need and context.']),
  makeResource('workplace', 'meeting-script-for-manager-conversations', 'Meeting Script for Manager Conversations', 'tool', 'A practical conversation outline for difficult meetings about support, workload and capacity.', '5 min', ['Use a three-part structure: what is happening, what support would help and what good working looks like.']),
  makeResource('workplace', 'workplace-adjustment-ideas-checklist', 'Workplace Adjustment Ideas Checklist', 'printable', 'A printable list of common adjustments across focus, meetings, communication and sensory needs.', '4 min', ['This checklist helps people ask for support with more specificity and less guesswork.'], 'https://example.com/workplace-adjustment-checklist.pdf'),
  makeResource('workplace', 'meeting-agenda-template-for-clarity', 'Meeting Agenda Template for Clarity', 'template', 'A template for clearer meetings with expectations, timings and outcomes written down in advance.', '4 min', ['A clearer agenda helps reduce ambiguity, processing load and the stress of hidden expectations.']),
  makeResource('workplace', 'email-script-pack', 'Email Script Pack', 'tool', 'A set of adaptable email scripts for boundaries, adjustments, delays and follow-ups.', '5 min', ['Script packs save energy because you do not have to invent the tone, structure and wording from nothing.']),
  makeResource('workplace', 'workload-pressure-map', 'Workload Pressure Map', 'tool', 'A map for spotting which parts of your workload are genuinely heavy versus unpredictably draining.', '4 min', ['Sometimes the hardest tasks are not the biggest ones, but the least defined ones.']),
  makeResource('workplace', 'return-to-work-conversation-guide', 'Return to Work Conversation Guide', 'guide', 'A guide for returning after sickness, burnout, or leave with clearer boundaries and expectations.', '6 min', ['A return plan should include what is realistic now, not what used to be possible before the dip in capacity.']),
  makeResource('workplace', 'priority-reset-sheet-for-busy-weeks', 'Priority Reset Sheet for Busy Weeks', 'printable', 'A printable sheet for identifying the week’s true priorities when everything feels urgent.', '3 min', ['When priorities are visible, it becomes easier to push back on unnecessary urgency.'], 'https://example.com/workplace-priority-reset-sheet.pdf'),
  makeResource('workplace', 'sensory-office-survival-guide', 'Sensory Office Survival Guide', 'guide', 'A guide to navigating lighting, noise, interruptions and energy loss in office settings.', '6 min', ['Even small sensory protections can change how much usable energy you still have by the end of a workday.']),

  makeResource('ehcp', 'ehcp-meeting-checklist', 'EHCP Meeting Checklist', 'printable', 'A prompt sheet for meetings, evidence gathering and next-step tracking.', '8 min', ['Use this as a calm external memory when meetings feel fast or overwhelming.', 'Bring your examples, your questions and a clear record of what has and has not been working.'], 'https://example.com/ehcp-checklist.pdf'),
  makeResource('ehcp', 'ehcp-evidence-pack-guide', 'EHCP Evidence Pack Guide', 'guide', 'A guide to gathering school, home and professional evidence in a way that is easier to organise.', '7 min', ['Evidence is easier to manage when grouped into needs, impact, support tried and what still is not working.']),
  makeResource('ehcp', 'parent-script-for-school-meetings', 'Parent Script for School Meetings', 'template', 'A structured script to help parents stay clear and focused during education meetings.', '5 min', ['Scripts can make it easier to hold onto your main points when meetings become fast, emotional, or hard to track.']),
  makeResource('ehcp', 'send-support-map', 'SEND Support Map', 'tool', 'A simple tool for tracking who is involved, what they are responsible for and what needs following up.', '4 min', ['When too many people are involved, a one-page support map can stop everything living in your head.']),
  makeResource('ehcp', 'ehcp-timeline-planner', 'EHCP Timeline Planner', 'tool', 'A timeline tool for keeping track of requests, deadlines, meetings and follow-ups.', '4 min', ['Timelines help when the process feels long, fragmented and full of moving parts.']),
  makeResource('ehcp', 'school-meeting-questions-sheet', 'School Meeting Questions Sheet', 'printable', 'A printable list of useful questions for school meetings, reviews and support planning.', '3 min', ['Questions are easier to ask when they are already written down before the meeting starts.'], 'https://example.com/school-meeting-questions-sheet.pdf'),
  makeResource('ehcp', 'annual-review-preparation-guide', 'Annual Review Preparation Guide', 'guide', 'A guide to preparing for annual reviews with evidence, examples and clearer goals.', '6 min', ['Go in knowing what support is helping, what is missing and what outcomes actually matter day to day.']),
  makeResource('ehcp', 'home-observations-record', 'Home Observations Record', 'template', 'A template for recording what you are seeing at home in a way that supports evidence gathering.', '4 min', ['Home observations often show patterns that are missed elsewhere. Writing them down makes them easier to use.']),
  makeResource('ehcp', 'useful-send-language-guide', 'Useful SEND Language Guide', 'guide', 'A guide to common SEND and EHCP terms in plainer language.', '5 min', ['Understanding the language does not fix the system, but it does make it easier to navigate with more confidence.']),
  makeResource('ehcp', 'ehcp-next-steps-tracker', 'Next Steps Tracker', 'printable', 'A printable tracker for who agreed to what, by when and what still needs chasing.', '3 min', ['When meetings end, this tracker helps stop the useful actions from dissolving into vagueness.'], 'https://example.com/ehcp-next-steps-tracker.pdf'),
]

const fallbackCreators: Creator[] = [
  {
    _id: 'creator-one',
    handle: '@ratewithmegs',
    description: 'ADHD creator sharing practical routines, humour and lived experience.',
    followerCount: 42000,
    platform: 'TikTok',
    avatarUrl: 'https://placehold.co/160x160/6c63ff/ffffff?text=M',
  },
  {
    _id: 'creator-two',
    handle: '@quietsensoryclub',
    description: 'Autistic creator focused on sensory design, communication and burnout recovery.',
    followerCount: 18500,
    platform: 'Instagram',
    avatarUrl: 'https://placehold.co/160x160/43c6a0/ffffff?text=Q',
  },
]

const fallbackEvents: Event[] = [
  {
    _id: 'event-discord-drop-in',
    title: 'Discord Drop-In: Body Doubling Hour',
    date: '2026-04-24T18:00:00.000Z',
    time: '7pm BST',
    location: 'Discord',
    joinUrl: 'https://discord.gg/rate',
  },
  {
    _id: 'event-live-q-and-a',
    title: 'Live Q&A: Burnout Without Shame',
    date: '2026-04-29T18:00:00.000Z',
    time: '7pm BST',
    location: 'YouTube Live',
    joinUrl: 'https://youtube.com/@rate',
  },
]

const fallbackAffiliateProducts: AffiliateProduct[] = [
  {
    _id: 'affiliate-timer',
    name: 'Visual Desk Timer',
    tag: 'Sensory tool · Community approved',
    icon: '⏱️',
    affiliateUrl: 'https://example.com/visual-timer',
  },
  {
    _id: 'affiliate-loop',
    name: 'Noise-Lowering Earplugs',
    tag: 'Regulation support · Everyday carry',
    icon: '🎧',
    affiliateUrl: 'https://example.com/earplugs',
  },
]

const resourceQuery = `*[_type == "resource"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  pillar,
  type,
  description,
  body,
  readTime,
  downloadUrl,
  sources
}`

export async function getResources(): Promise<Resource[]> {
  if (!isSanityConfigured()) return fallbackResources

  try {
    return await sanityClient.fetch<Resource[]>(resourceQuery)
  } catch {
    return fallbackResources
  }
}

export async function getResourcesByPillar(pillar: PillarSlug): Promise<Resource[]> {
  const resources = await getResources()
  return resources.filter((resource) => resource.pillar === pillar)
}

export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  const resources = await getResources()
  return resources.find((resource) => resource.slug === slug) ?? null
}

export async function getCreators(): Promise<Creator[]> {
  if (!isSanityConfigured()) return fallbackCreators

  try {
    return await sanityClient.fetch<Creator[]>(
      `*[_type == "creator"] | order(followerCount desc) { _id, handle, description, followerCount, platform, avatarUrl }`
    )
  } catch {
    return fallbackCreators
  }
}

export async function getEvents(): Promise<Event[]> {
  if (!isSanityConfigured()) return fallbackEvents

  try {
    return await sanityClient.fetch<Event[]>(
      `*[_type == "event"] | order(date asc) { _id, title, date, time, location, joinUrl }`
    )
  } catch {
    return fallbackEvents
  }
}

export async function getAffiliateProducts(): Promise<AffiliateProduct[]> {
  if (!isSanityConfigured()) return fallbackAffiliateProducts

  try {
    return await sanityClient.fetch<AffiliateProduct[]>(
      `*[_type == "affiliateProduct"] | order(_createdAt desc) { _id, name, tag, icon, affiliateUrl }`
    )
  } catch {
    return fallbackAffiliateProducts
  }
}

export async function getToolkitSlugs(): Promise<string[]> {
  const resources = await getResources()
  return resources.map((resource) => resource.slug)
}
