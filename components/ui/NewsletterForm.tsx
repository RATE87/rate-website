'use client'

import { useState, useTransition } from 'react'
import { GradientButton } from '@/components/ui/GradientButton'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  return (
    <form
      className="flex w-full flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault()
        setMessage(null)

        startTransition(async () => {
          const response = await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          })

          if (response.ok) {
            setMessage('You are on the list.')
            setEmail('')
            return
          }

          const data = (await response.json().catch(() => null)) as { error?: string } | null
          setMessage(data?.error ?? 'Something went wrong. Please try again.')
        })
      }}
    >
      <div className="flex-1">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className="min-h-12 w-full rounded-full border border-slate-200 px-5 py-3 text-sm outline-none focus:border-rate-purple"
          aria-label="Email address"
        />
        {message ? <p className="mt-3 text-sm font-semibold text-slate-600">{message}</p> : null}
      </div>
      <GradientButton type="submit" disabled={isPending} className="sm:self-start">
        {isPending ? 'Subscribing...' : 'Subscribe'}
      </GradientButton>
    </form>
  )
}
