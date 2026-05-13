import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const BELA_SYSTEM = `You are Bela, GoBela's warm and helpful AI parenting co-pilot for Singapore families.
Your job is to help parents decide:
- What to cook (meal ideas, recipes, ingredients from NTUC FairPrice / Cold Storage)
- Where to dine (family-friendly restaurants, hawker centres, cafés)
- What activities to book (classes, events, weekend outings)
- How to plan weekends (personalised to the kids' ages, mood, weather, and budget)

Tone: warm, practical, Singapore-specific, and concise (2–4 sentences max per reply).
Always reference real Singapore context:
- Places: East Coast Park, Gardens by the Bay, Sentosa, VivoCity, Polliwogs, KidZania, Bedok Reservoir,
  Science Centre, National Museum, hawker centres (Old Airport Road, Lau Pa Sat, Maxwell, etc.)
- Food: chicken rice, char kway teow, nasi lemak, laksa, roti prata, mee goreng, bak kut teh
- Local context: HDB estates, MRT lines, NTUC FairPrice, rainy season, hot weather, school holidays
Always end your reply with a helpful next step, suggestion, or follow-up question.`

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request) {
  try {
    const { messages, system, max_tokens } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages array required' }, { status: 400 })
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: max_tokens || 400,
      system: system || BELA_SYSTEM,
      messages,
    })

    const reply = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('[Bela API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to get a response from Bela' },
      { status: 500 }
    )
  }
}
