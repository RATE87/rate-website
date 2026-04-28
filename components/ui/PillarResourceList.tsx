'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { PillBadge } from '@/components/ui/PillBadge'
import { resourceTypeLabels } from '@/lib/site'
import type { Resource, ResourceType } from '@/lib/sanity/types'

const filters = ['all', 'tool', 'guide', 'template', 'printable'] as const
const perPage = 10

type ResourceSection = {
  title: string
  description: string
  resourceSlugs: string[]
}

export function PillarResourceList({
  resources,
  sections,
}: {
  resources: Resource[]
  sections?: ResourceSection[]
}) {
  const [filter, setFilter] = useState<(typeof filters)[number]>('all')
  const [page, setPage] = useState(1)

  const filteredResources = useMemo(() => {
    return filter === 'all' ? resources : resources.filter((resource) => resource.type === filter)
  }, [filter, resources])

  const totalPages = Math.max(1, Math.ceil(filteredResources.length / perPage))
  const currentResources = filteredResources.slice((page - 1) * perPage, page * perPage)

  const groupedResources = useMemo(() => {
    if (!sections?.length) return []

    return sections
      .map((section) => ({
        ...section,
        resources: filteredResources.filter((resource) => section.resourceSlugs.includes(resource.slug)),
      }))
      .filter((section) => section.resources.length > 0)
  }, [filteredResources, sections])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {filters.map((value) => (
          <button
            key={value}
            type="button"
            className={`rounded-full border px-4 py-2 text-sm font-bold ${
              filter === value ? 'border-rate-purple bg-rate-purple text-white' : 'border-slate-200 bg-white text-slate-700'
            }`}
            onClick={() => {
              setFilter(value)
              setPage(1)
            }}
          >
            {value === 'all' ? 'All' : resourceTypeLabels[value as ResourceType]}
          </button>
        ))}
      </div>

      {sections?.length ? (
        <div className="space-y-8">
          {groupedResources.map((section) => (
            <section key={section.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-glow">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-black tracking-tight text-slate-900">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{section.description}</p>
              </div>
              <div className="mt-6 space-y-4">
                {section.resources.map((resource) => (
                  <article key={resource._id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <PillBadge tone="purple">{resourceTypeLabels[resource.type]}</PillBadge>
                    </div>
                    <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900">{resource.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{resource.description}</p>
                    <Link href={`/toolkit/${resource.slug}`} className="mt-4 inline-flex text-sm font-extrabold text-rate-purple">
                      Open resource →
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ))}

          {!groupedResources.length ? (
            <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-600">
              No resources match that filter yet.
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {currentResources.map((resource) => (
              <article key={resource._id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-glow">
                <div className="flex flex-wrap items-center gap-3">
                  <PillBadge tone="purple">{resourceTypeLabels[resource.type]}</PillBadge>
                </div>
                <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900">{resource.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{resource.description}</p>
                <Link href={`/toolkit/${resource.slug}`} className="mt-4 inline-flex text-sm font-extrabold text-rate-purple">
                  Open resource →
                </Link>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 rounded-[24px] border border-slate-200 bg-white px-5 py-4">
            <span className="text-sm font-semibold text-slate-600">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={page === 1}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                disabled={page === totalPages}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
