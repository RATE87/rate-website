import type { Metadata } from 'next'
import { GradientButton } from '@/components/ui/GradientButton'

export const metadata: Metadata = {
  title: 'Contact',
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-glow">
        <h1 className="text-5xl font-black tracking-[-0.05em] text-slate-900">Contact RATE</h1>
        <p className="mt-4 max-w-prose text-base leading-8 text-slate-600">
          Reach out if you need more information about RATE, need help with a product or service, or want to report an issue.
        </p>
        <div className="mt-6 rounded-[24px] bg-slate-50 p-5 text-sm leading-7 text-slate-600">
          Use this form for order questions, product issues, general site help, or questions about the toolkit and community.
        </div>
        <form className="mt-8 grid gap-4">
          <input className="rounded-[20px] border border-slate-200 px-5 py-4" placeholder="Your name" />
          <input className="rounded-[20px] border border-slate-200 px-5 py-4" type="email" placeholder="Email address" />
          <input className="rounded-[20px] border border-slate-200 px-5 py-4" placeholder="What do you need help with?" />
          <textarea className="min-h-40 rounded-[20px] border border-slate-200 px-5 py-4" placeholder="Tell us what happened or what information you need" />
          <GradientButton type="submit">Send enquiry</GradientButton>
        </form>
      </div>
    </main>
  )
}
