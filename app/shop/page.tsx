import type { Metadata } from 'next'
import { ShopCatalog } from '@/components/ui/ShopCatalog'
import { GradientButton } from '@/components/ui/GradientButton'
import { PillBadge } from '@/components/ui/PillBadge'
import { fallbackProducts, getProducts } from '@/lib/shopify'
import { getAffiliateProducts } from '@/lib/sanity/queries'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Mission-led apparel, collectables, supplements and affiliate picks from RATE.',
}

async function loadProducts() {
  try {
    return await getProducts()
  } catch {
    return fallbackProducts
  }
}

export default async function ShopPage() {
  const [products, affiliateProducts] = await Promise.all([loadProducts(), getAffiliateProducts()])

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <section className="rounded-[36px] bg-rate-gradient p-8 text-white shadow-glow lg:p-10">
        <PillBadge tone="dark">Shop</PillBadge>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.05em] md:text-6xl">Wear the mission. Fund the ecosystem.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-white/80">
          Products are pulled live from Shopify so RATE can show what is actually available while keeping checkout
          simple and direct.
        </p>
      </section>

      <section className="py-10">
        <ShopCatalog products={products} />
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-glow md:p-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-rate-purple">Affiliate Picks</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Community-approved extras.</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {affiliateProducts.map((product) => (
            <article key={product._id} className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
              <div className="mb-3 text-3xl">{product.icon}</div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">{product.name}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{product.tag}</p>
              <GradientButton href={product.affiliateUrl} variant="ghost" className="mt-4">
                View pick
              </GradientButton>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
