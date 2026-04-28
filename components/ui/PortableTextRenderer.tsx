import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@/lib/sanity/types'

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="mt-10 text-3xl font-black tracking-tight text-slate-900">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 text-2xl font-black tracking-tight text-slate-900">{children}</h3>,
    normal: ({ children }) => <p className="mt-5 text-base leading-8 text-slate-700">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-6 text-slate-700">{children}</ul>,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} className="font-semibold text-rate-purple underline underline-offset-4">
        {children}
      </a>
    ),
  },
}

export function PortableTextRenderer({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />
}
