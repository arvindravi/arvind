import fs from 'fs'
import path from 'path'

export async function useLocalFiles({
  path: file,
  fetch,
}: {
  path: string
  fetch: () => Promise<unknown>
}) {
  const dir = './src/data/local'
  const fullPath = `${dir}/${file}.json`
  try {
    const localData = fs.readFileSync(fullPath, 'utf8')
    if (localData) return JSON.parse(localData)
    throw new Error('empty')
  } catch {
    const data = await fetch()
    try {
      fs.mkdirSync(path.dirname(fullPath), { recursive: true })
      fs.writeFileSync(fullPath, JSON.stringify(data, null, 4), 'utf8')
    } catch (writeErr) {
      // Filesystem may be read-only (e.g. serverless) — fall back to in-memory result.
      console.warn(
        `[useLocalFiles] could not persist ${fullPath}:`,
        (writeErr as Error).message
      )
    }
    return data
  }
}
