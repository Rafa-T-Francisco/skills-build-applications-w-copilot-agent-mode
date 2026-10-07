const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export function getCollection(responseData) {
  if (Array.isArray(responseData)) return responseData
  if (!responseData || typeof responseData !== 'object') return []

  const candidates = [responseData.results, responseData.items, responseData.data]
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate
    if (candidate && typeof candidate === 'object') {
      if (Array.isArray(candidate.results)) return candidate.results
      if (Array.isArray(candidate.items)) return candidate.items
    }
  }

  return []
}

export function getDisplayValue(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'object') {
    if ('name' in value) return value.name
    if ('username' in value) return value.username
    if ('_id' in value) return value._id
    return JSON.stringify(value)
  }
  return String(value)
}
