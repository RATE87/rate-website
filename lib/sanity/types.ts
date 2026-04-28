export type PillarSlug = 'adhd' | 'autism' | 'burnout' | 'workplace' | 'ehcp'

export type ResourceType = 'tool' | 'guide' | 'template' | 'printable'

export type ResourceSource = {
  title: string
  url: string
}

export type PortableTextBlock = {
  _key?: string
  _type: string
  children?: { _key?: string; _type?: string; text?: string; marks?: string[] }[]
  style?: string
  markDefs?: { _key: string; _type: string; href?: string }[]
}

export type Resource = {
  _id: string
  title: string
  slug: string
  pillar: PillarSlug
  type: ResourceType
  description: string
  body: PortableTextBlock[]
  readTime: string
  downloadUrl?: string
  sources?: ResourceSource[]
}

export type Creator = {
  _id: string
  handle: string
  description: string
  followerCount: number
  platform: string
  avatarUrl: string
}

export type Event = {
  _id: string
  title: string
  date: string
  time: string
  location: string
  joinUrl: string
}

export type AffiliateProduct = {
  _id: string
  name: string
  tag: string
  icon: string
  affiliateUrl: string
}
