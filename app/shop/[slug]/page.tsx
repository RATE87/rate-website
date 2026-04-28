import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { GradientButton } from '@/components/ui/GradientButton'
import { PillBadge } from '@/components/ui/PillBadge'
import { fallbackProducts, formatPrice, getProduct, getProductSlugs } from '@/lib/shopify'

type ShopDetailProps = {
  params: Promise<{ slug: string }>
}

async function loadProduct(slug: string) {
  try {
    return await getProduct(slug)
  } catch {
    return fallbackProducts.find((product) => product.slug === slug) ?? null
  }
}

export async function generateStaticParams() {
  try {
    const slugs = await getProductSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch {
    return fallbackProducts.map((product) => ({ slug: product.slug }))
  }
}

export async function generateMetadata({ params }: ShopDetailProps): Promise<Metadata> {
  const { slug } = await params
  const product = await loadProduct(slug)

  if (!product) return { title: 'Product not found' }

  return {
    title: product.title,
    description: product.description,
  }
}

export default async function ShopProductPage({ params }: ShopDetailProps) {
  const { slug } = await params
  const product = await loadProduct(slug)

  if (!product) notFound()

  const defaultVariant = product.variants.find((variant) => variant.is_available) ?? product.variants[0]
  const defaultImage = product.images.find((image) => image.is_default) ?? product.images[0]
  const buyUrl = product.buyUrl

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-glow">
          <div className="relative aspect-square overflow-hidden rounded-[26px] bg-slate-100">
            {defaultImage ? <Image src={defaultImage.src} alt={defaultImage.alt || product.title} fill className="object-cover" /> : null}
          </div>
          {product.images.length > 1 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {product.images.slice(0, 3).map((image) => (
                <div key={image.src} className="relative aspect-square overflow-hidden rounded-[20px] bg-slate-100">
                  <Image src={image.src} alt={image.alt || product.title} fill className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-glow">
          <PillBadge tone="purple">{product.tags[0] ?? 'RATE Product'}</PillBadge>
          <h1 className="mt-5 text-5xl font-black tracking-[-0.05em] text-slate-900">{product.title}</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">{product.description}</p>
          <div className="mt-6 text-3xl font-black tracking-tight text-slate-900">
            {defaultVariant ? formatPrice(defaultVariant.price) : 'TBC'}
          </div>

          <div className="mt-8">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.18em] text-rate-purple">Options</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.variants.map((variant) => (
                <span
                  key={variant.id}
                  className={`rounded-full border px-4 py-2 text-sm font-bold ${
                    variant.is_available ? 'border-slate-200 bg-white text-slate-700' : 'border-slate-200 bg-slate-100 text-slate-400'
                  }`}
                >
                  {variant.title}
                </span>
              ))}
            </div>
          </div>

          <GradientButton href={buyUrl} className="mt-8">
            Buy on Shopify
          </GradientButton>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            RATE does not run its own cart or payment flow. Checkout happens on Shopify&apos;s hosted storefront.
          </p>
        </div>
      </div>
    </main>
  )
}
