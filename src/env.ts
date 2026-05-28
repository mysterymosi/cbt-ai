function requireEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export const env = {
  get NEXT_PUBLIC_SUPABASE_URL() {
    return requireEnv("NEXT_PUBLIC_SUPABASE_URL")
  },
  get NEXT_PUBLIC_SUPABASE_ANON_KEY() {
    return requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  },
  get SUPABASE_SERVICE_ROLE_KEY() {
    return requireEnv("SUPABASE_SERVICE_ROLE_KEY")
  },
  get ALOC_ACCESS_TOKEN() {
    return requireEnv("ALOC_ACCESS_TOKEN")
  },
  get ALOC_SYNC_SECRET() {
    return process.env.ALOC_SYNC_SECRET
  },
  get GOOGLE_GENERATIVE_AI_API_KEY() {
    return process.env.GOOGLE_GENERATIVE_AI_API_KEY
  },
  get TUTOR_DAILY_MESSAGE_LIMIT() {
    return Number(process.env.TUTOR_DAILY_MESSAGE_LIMIT ?? 30)
  },
}
