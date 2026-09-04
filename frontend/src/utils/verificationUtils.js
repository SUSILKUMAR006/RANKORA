export function normalizeVerificationType(value) {
  const type = String(value || 'none').toLowerCase().replace(/[-_]/g, ' ')
  if (type.includes('photo') && type.includes('note')) return 'photo_note'
  if (type.includes('photo')) return 'photo'
  if (type.includes('manual')) return 'manual'
  return 'none'
}

export function verificationLabel(value) {
  const type = normalizeVerificationType(value)
  return { none: 'NONE', photo: 'PHOTO REQUIRED', photo_note: 'PHOTO + NOTE REQUIRED', manual: 'MANUAL CONFIRMATION' }[type]
}

export function getStoredVerifications() {
  try {
    const stored = JSON.parse(localStorage.getItem('rankora_verifications'))
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

export function saveVerificationMetadata(quest, { fileName, note }) {
  const metadata = { id: `verification-${Date.now()}`, questId: quest.id, status: 'pending', submittedAt: new Date().toISOString(), note, fileName }
  localStorage.setItem('rankora_verifications', JSON.stringify([...getStoredVerifications().filter((item) => item.questId !== quest.id), metadata]))
  return metadata
}
