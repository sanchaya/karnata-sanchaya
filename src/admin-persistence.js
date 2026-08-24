const clone = value => JSON.parse(JSON.stringify(value))

/**
 * Build the complete dataset sent by the admin editor.
 * Existing stable IDs are immutable because they are referenced by other records.
 */
export function prepareDatasetSave({ data, collection, selectedId = '', draft, updatedAt }) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { error: 'A complete dataset is required.' }
  if (!Array.isArray(data[collection])) return { error: `Collection “${collection}” is not available in this dataset.` }
  if (!draft || typeof draft !== 'object' || Array.isArray(draft)) return { error: 'A complete record is required.' }

  const saved = clone({ ...draft, review: { ...(draft.review || {}), updatedAt } })
  if (!saved.id) return { error: 'A stable ID is required before saving.' }
  if (selectedId && saved.id !== selectedId) {
    return { error: `Stable ID “${selectedId}” cannot be changed to “${saved.id}”. Create a new record instead so references remain intact.` }
  }

  const records = data[collection].slice()
  const index = records.findIndex(record => record.id === (selectedId || saved.id))
  if (selectedId && index < 0) return { error: `The selected record “${selectedId}” is no longer present. Reload the server revision before saving.` }
  if (!selectedId && index >= 0) return { error: `Stable ID “${saved.id}” is already used in this collection.` }
  if (index >= 0) records[index] = saved
  else records.push(saved)

  return { next: { ...data, [collection]: records }, saved }
}

export function formatValidationIssues(issues, limit = 5) {
  return issues.slice(0, limit).map(issue => {
    const location = [issue.collection, issue.id, issue.path].filter(Boolean).join('.')
    return `${location}: ${issue.message}`
  }).join(' · ')
}
