'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { PillBadge } from '@/components/ui/PillBadge'
import { pillarMeta, pillarOrder } from '@/lib/site'
import type { Resource } from '@/lib/sanity/types'

export function ToolkitOverviewClient({ resources }: { resources: Resource[] }) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()

  const filteredResources = useMemo(() => {
    if (!normalizedQuery) return resources
    return resources.filter((resource) =>
      `${resource.title} ${resource.description}`.toLowerCase().includes(normalizedQuery)
    )
  }, [normalizedQuery, resources])

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-glow">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search ADHD, Autism, Burnout, Workplace, EHCP..."
          className="w-full rounded-full border border-slate-200 px-5 py-4 text-sm outline-none ring-0"
          aria-label="Search toolkit resources"
        />
      </div>

      {normalizedQuery ? (
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-glow">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Search results</h2>
            <PillBadge tone="purple">{filteredResources.length} matches</PillBadge>
          </div>
          {filteredResources.length ? (
            <div className="mt-5 grid gap-4">
              {filteredResources.map((resource) => (
                <article key={resource._id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <PillBadge tone={resource.pillar === 'autism' ? 'teal' : resource.pillar === 'burnout' ? 'amber' : resource.pillar === 'workplace' ? 'pink' : resource.pillar === 'ehcp' ? 'violet' : 'purple'}>
                      {pillarMeta[resource.pillar].title}
                    </PillBadge>
                  </div>
                  <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900">{resource.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{resource.description}</p>
                  <Link href={`/toolkit/${resource.slug}`} className="mt-4 inline-flex text-sm font-extrabold text-rate-purple">
                    Open resource
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-slate-600">No resources match that search yet.</p>
          )}
        </section>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        {pillarOrder.map((pillar) => {
          const meta = pillarMeta[pillar]
          const count = resources.filter((resource) => resource.pillar === pillar).length
          return (
            <article
              key={pillar}
              className={`rounded-[30px] border border-slate-200 bg-white p-6 shadow-glow ${
                pillar === 'ehcp' ? 'md:col-span-2' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-4 text-3xl">{meta.icon}</div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">{meta.title}</h2>
                </div>
                <PillBadge tone={pillar === 'autism' ? 'teal' : pillar === 'burnout' ? 'amber' : pillar === 'workplace' ? 'pink' : pillar === 'ehcp' ? 'violet' : 'purple'}>
                  {count} resources
                </PillBadge>
              </div>
              <p className="mt-4 max-w-prose text-sm leading-7 text-slate-600">{meta.description}</p>
              <Link href={`/toolkit/${pillar}`} className="mt-5 inline-flex text-sm font-extrabold text-rate-purple">
                Explore →
              </Link>
            </article>
          )
        })}
      </div>
    </div>
  )
}
