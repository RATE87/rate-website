export type Product = {
  id: string
  slug: string
  title: string
  description: string
  images: { src: string; alt: string; is_default: boolean }[]
  variants: { id: string; title: string; price: number; is_available: boolean }[]
  tags: string[]
  buyUrl: string
}

type ShopifyProductNode = {
  id: string
  handle: string
  title: string
  description: string
  productType?: string | null
  tags?: string[] | null
  onlineStoreUrl?: string | null
  collections?: { nodes?: { title?: string | null }[] | null } | null
  images?: { nodes?: { url?: string | null; altText?: string | null }[] | null } | null
  variants?: {
    nodes?: {
      id: string
      title: string
      availableForSale?: boolean | null
      price?: { amount?: string | null } | null
    }[] | null
  } | null
}

const SHOPIFY_API_VERSION = '2025-10'

export const fallbackProducts: Product[] = [
  {
    id: 'fallback-oversized-tee',
    slug: 'rate-oversized-tee',
    title: 'RATE Oversized Tee',
    description: 'A heavyweight statement tee designed for soft structure and bold identity.',
    images: [{ src: 'https://placehold.co/900x900/6c63ff/ffffff?text=RATE+Tee', alt: 'RATE Oversized Tee', is_default: true }],
    variants: [
      { id: '101', title: 'M', price: 2800, is_available: true },
      { id: '102', title: 'L', price: 2800, is_available: true },
      { id: '103', title: 'XL', price: 2800, is_available: true },
    ],
    tags: ['Apparel'],
    buyUrl: '/shop/rate-oversized-tee',
  },
  {
    id: 'fallback-hoodie',
    slug: 'soft-signal-hoodie',
    title: 'Soft Signal Hoodie',
    description: 'A navy hoodie with RATE gradient detailing and a roomy, sensory-friendly fit.',
    images: [{ src: 'https://placehold.co/900x900/302b63/ffffff?text=RATE+Hoodie', alt: 'Soft Signal Hoodie', is_default: true }],
    variants: [
      { id: '201', title: 'M', price: 4600, is_available: true },
      { id: '202', title: 'L', price: 4600, is_available: true },
    ],
    tags: ['Apparel'],
    buyUrl: '/shop/soft-signal-hoodie',
  },
  {
    id: 'fallback-stickers',
    slug: 'desk-reset-sticker-pack',
    title: 'Desk Reset Sticker Pack',
    description: 'A collectable sticker set built around humour, regulation and gentle prompts.',
    images: [{ src: 'https://placehold.co/900x900/ff6584/ffffff?text=RATE+Stickers', alt: 'Desk Reset Sticker Pack', is_default: true }],
    variants: [{ id: '301', title: 'Default', price: 1200, is_available: true }],
    tags: ['Collectables'],
    buyUrl: '/shop/desk-reset-sticker-pack',
  },
]

function requireShopifyEnv() {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  const domain = process.env.SHOPIFY_STORE_DOMAIN

  if (!token) {
    throw new Error('Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN. Add it to your environment before calling Shopify.')
  }

  if (!domain) {
    throw new Error('Missing SHOPIFY_STORE_DOMAIN. Add it to your environment before calling Shopify.')
  }

  return { token, domain }
}

function normalizeDomain(domain: string) {
  return domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const { token, domain } = requireShopifyEnv()
  const response = await fetch(`https://${normalizeDomain(domain)}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`Shopify request failed with ${response.status}`)
  }

  const json = (await response.json()) as { data?: T; errors?: { message: string }[] }

  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join(', '))
  }

  if (!json.data) {
    throw new Error('Shopify returned no data.')
  }

  return json.data
}

function normalizeProductType(productType?: string | null) {
  const value = (productType ?? '').toLowerCase()

  if (value.includes('hoodie') || value.includes('shirt') || value.includes('tee') || value.includes('apparel')) {
    return 'Apparel'
  }

  if (value.includes('bottle')) {
    return 'Collectables'
  }

  if (value.includes('supplement')) {
    return 'Supplements'
  }

  return ''
}

function normalizeTitleOrHandle(value: string) {
  const lower = value.toLowerCase()

  if (lower.includes('hoodie') || lower.includes('shirt') || lower.includes('tee') || lower.includes('apparel')) {
    return 'Apparel'
  }

  if (lower.includes('bottle') || lower.includes('bear') || lower.includes('teddy') || lower.includes('collectable')) {
    return 'Collectables'
  }

  if (lower.includes('supplement')) {
    return 'Supplements'
  }

  return ''
}

function normalizeCollectionTitle(title?: string | null) {
  const value = (title ?? '').toLowerCase()

  if (!value) return ''
  if (value.includes('hoodie') || value.includes('apparel') || value.includes('clothing')) return 'Apparel'
  if (value.includes('bottle') || value.includes('teddy') || value.includes('collectable') || value.includes('gift'))
    return 'Collectables'
  if (value.includes('supplement')) return 'Supplements'
  return title ?? ''
}

function dedupeTags(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

function normalizeProduct(node: ShopifyProductNode, domain: string): Product {
  const collectionTags = (node.collections?.nodes ?? []).map((collection) => normalizeCollectionTitle(collection.title))
  const tags = dedupeTags([
    normalizeProductType(node.productType),
    normalizeTitleOrHandle(node.title),
    normalizeTitleOrHandle(node.handle),
    ...collectionTags,
    ...(node.tags ?? []).map((tag) => normalizeCollectionTitle(tag)),
  ])
  const images = (node.images?.nodes ?? []).map((image, index) => ({
    src: image.url ?? '',
    alt: image.altText ?? node.title,
    is_default: index === 0,
  }))
  const variants = (node.variants?.nodes ?? []).map((variant) => ({
    id: variant.id,
    title: variant.title,
    price: Math.round(Number(variant.price?.amount ?? 0) * 100),
    is_available: Boolean(variant.availableForSale),
  }))

  return {
    id: node.id,
    slug: node.handle,
    title: node.title,
    description: node.description || 'RATE product available through the live Shopify store.',
    images,
    variants,
    tags: tags.length ? tags : ['RATE'],
    buyUrl: node.onlineStoreUrl ?? `https://${normalizeDomain(domain)}/products/${node.handle}`,
  }
}

const productsQuery = `
  query Products($first: Int!) {
    products(first: $first, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        handle
        title
        description
        productType
        tags
        onlineStoreUrl
        collections(first: 10) {
          nodes {
            title
          }
        }
        images(first: 8) {
          nodes {
            url
            altText
          }
        }
        variants(first: 20) {
          nodes {
            id
            title
            availableForSale
            price {
              amount
            }
          }
        }
      }
    }
  }
`

const productQuery = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      productType
      tags
      onlineStoreUrl
      collections(first: 10) {
        nodes {
          title
        }
      }
      images(first: 8) {
        nodes {
          url
          altText
        }
      }
      variants(first: 20) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
          }
        }
      }
    }
  }
`

export async function getProducts(): Promise<Product[]> {
  const { domain } = requireShopifyEnv()
  const data = await shopifyFetch<{ products: { nodes: ShopifyProductNode[] } }>(productsQuery, { first: 24 })
  return data.products.nodes.map((node) => normalizeProduct(node, domain))
}

export async function getProduct(slug: string): Promise<Product | null> {
  const { domain } = requireShopifyEnv()
  const data = await shopifyFetch<{ product: ShopifyProductNode | null }>(productQuery, { handle: slug })
  return data.product ? normalizeProduct(data.product, domain) : null
}

export async function getProductSlugs(): Promise<string[]> {
  const products = await getProducts()
  return products.map((product) => product.slug)
}

export function formatPrice(pence: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: pence % 100 === 0 ? 0 : 2,
  }).format(pence / 100)
}
