import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms',
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-glow">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Terms</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
        These terms explain how the RATE website, store links, toolkit content and community links should be used.
        </p>
        <div className="mt-8 space-y-6 text-sm leading-7 text-slate-600">
          <section>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Website use</h2>
            <p className="mt-2">
              By using this website, you agree to use it lawfully and in a way that does not damage, interrupt, or misuse the platform or its content.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Products and checkout</h2>
            <p className="mt-2">
        RATE does not run its own checkout. Product purchases are completed through Shopify or other linked third-party providers and their checkout, shipping and refund terms may also apply.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Toolkit content</h2>
            <p className="mt-2">
              Toolkit resources are provided for general information and support only. They are not legal, medical, or financial advice and should not replace professional guidance where needed.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Community and external links</h2>
            <p className="mt-2">
        Community spaces and social links may lead to third-party platforms such as Discord, Instagram, TikTok and YouTube. Use of those services is also subject to their own platform rules and terms.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Affiliate links</h2>
            <p className="mt-2">
              Some product links may be affiliate links. If you buy through them, RATE may receive a commission at no extra cost to you.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Changes and contact</h2>
            <p className="mt-2">
              RATE may update these terms as the platform grows. For questions about these terms or issues with products or services, use the contact page.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
