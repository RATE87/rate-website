'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Product } from '@/lib/shopify'
import { formatPrice } from '@/lib/shopify'
import { PillBadge } from '@/components/ui/PillBadge'

type ShopCatalogProps = {
  products: Product[]
}

const filters = ['All', 'Apparel', 'Collectables', 'Supplements', 'Affiliate Picks'] as const

export function ShopCatalog({ products }: ShopCatalogProps) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('All')

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'All') return products
    if (activeFilter === 'Affiliate Picks') return []
    return products.filter((product) =>
      product.tags.some((tag) => tag.toLowerCase().includes(activeFilter.toLowerCase().replace('collectables', 'collectable')))
    )
  }, [activeFilter, products])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`rounded-full border px-4 py-2 text-sm font-bold ${
              activeFilter === filter
                ? 'border-rate-purple bg-rate-purple text-white'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => {
          const defaultImage = product.images.find((image) => image.is_default) ?? product.images[0]
          const defaultVariant = product.variants.find((variant) => variant.is_available) ?? product.variants[0]

          return (
            <article key={product.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-glow">
              <div className="relative mb-4 aspect-square overflow-hidden rounded-[24px] bg-slate-100">
                {defaultImage ? (
                  <Image src={defaultImage.src} alt={product.title} fill className="object-cover" />
                ) : (
                  <div className="h-full w-full bg-rate-gradient" />
                )}
              </div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <PillBadge tone="purple">{product.tags[0] ?? 'RATE'}</PillBadge>
                <span className="text-sm font-bold text-slate-600">
                  {defaultVariant ? formatPrice(defaultVariant.price) : 'TBC'}
                </span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">{product.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{product.description}</p>
              <Link href={`/shop/${product.slug}`} className="mt-5 inline-flex text-sm font-extrabold text-rate-purple">
                View
              </Link>
            </article>
          )
        })}
      </div>
    </div>
  )
}
