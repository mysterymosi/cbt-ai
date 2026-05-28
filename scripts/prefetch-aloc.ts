import { loadEnvConfig } from "@next/env"

loadEnvConfig(process.cwd())

async function main() {
  const { syncUtmeQuestions } = await import("@/components/questions")
  const results = await syncUtmeQuestions()
  console.table(results)

  const failed = results.filter((result) => result.error)
  if (failed.length) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
