import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy',
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-glow">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Privacy</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
        Privacy policy placeholder. Final data-processing details for newsletter subscriptions, analytics and third-party integrations will live here.
        </p>
      </div>
    </main>
  )
}
