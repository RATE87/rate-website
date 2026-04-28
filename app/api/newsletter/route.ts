import { NextResponse } from 'next/server'

function requireBeehiivEnv() {
  const apiKey = process.env.BEEHIIV_API_KEY
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID

  if (!apiKey) {
    throw new Error('Missing BEEHIIV_API_KEY. Add it before using the newsletter route.')
  }

  if (!publicationId) {
    throw new Error('Missing BEEHIIV_PUBLICATION_ID. Add it before using the newsletter route.')
  }

  return { apiKey, publicationId }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string }
    const email = body.email?.trim()

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const { apiKey, publicationId } = requireBeehiivEnv()

    const response = await fetch(`https://api.beehiiv.com/v2/publications/${publicationId}/bulk_subscriptions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptions: [
          {
            email,
            reactivate_existing: true,
            send_welcome_email: true,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: errorText || 'Beehiiv request failed.' }, { status: response.status })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected newsletter error.' },
      { status: 500 }
    )
  }
}
