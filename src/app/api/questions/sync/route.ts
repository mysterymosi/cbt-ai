import { NextResponse } from "next/server"
import { syncQuestionsSchema, syncUtmeQuestions } from "@/components/questions"
import { env } from "@/env"

export async function POST(request: Request) {
  const syncSecret = env.ALOC_SYNC_SECRET

  if (syncSecret && request.headers.get("x-sync-secret") !== syncSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const parsed = syncQuestionsSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid sync payload" }, { status: 400 })
  }

  const results = await syncUtmeQuestions(parsed.data.subjects, parsed.data.count)
  const failed = results.filter((result) => result.error)

  return NextResponse.json(
    { results },
    { status: failed.length ? 207 : 200 }
  )
}
