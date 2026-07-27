export const KANNADA_TRANSLATION_CHECKS = [
  'sourceMatch',
  'semanticFidelity',
  'namesAndDates',
  'historicalTerminology',
  'lineCompleteness',
]

const cleanBoolean = value => value === true

export function normalizeTranslationAssessment(value = {}) {
  return {
    languageCode: value.languageCode === 'kn' ? 'kn' : '',
    reviewScope: value.reviewScope === 'kannada-translation' ? 'kannada-translation' : '',
    sourceMatch: cleanBoolean(value.sourceMatch),
    semanticFidelity: cleanBoolean(value.semanticFidelity),
    namesAndDates: cleanBoolean(value.namesAndDates),
    historicalTerminology: cleanBoolean(value.historicalTerminology),
    lineCompleteness: cleanBoolean(value.lineCompleteness),
    reviewerAttestation: cleanBoolean(value.reviewerAttestation),
  }
}

export function translationProposalIssues(contribution) {
  if (contribution?.action !== 'translation') return []
  const record = contribution.record || {}
  const sections = record.translation?.sections
  const issues = []
  if (!Array.isArray(sections) || sections.length === 0) {
    issues.push('Translation proposals require at least one labelled source section.')
    return issues
  }
  sections.forEach((section, index) => {
    if (!section?.label || !Array.isArray(section.en) || !Array.isArray(section.kn) || section.en.length === 0 || section.kn.length === 0) {
      issues.push(`Translation section ${index + 1} requires a label and non-empty English and Kannada line arrays.`)
    } else if (section.en.length !== section.kn.length) {
      issues.push(`Translation section ${index + 1} must align English and Kannada lines one-to-one.`)
    }
  })
  if (record.translation?.languageReviews?.kn !== 'draft-needs-epigraphist-review') {
    issues.push('A submitted Kannada translation must remain marked draft-needs-epigraphist-review until approval.')
  }
  return issues
}

export function translationApprovalIssues({ decision, contribution, assessment }) {
  if (decision !== 'approve' || contribution?.action !== 'translation') return []
  const normalized = normalizeTranslationAssessment(assessment)
  const issues = []
  if (normalized.languageCode !== 'kn' || normalized.reviewScope !== 'kannada-translation') {
    issues.push('Kannada translation approval must explicitly identify the Kannada review scope.')
  }
  KANNADA_TRANSLATION_CHECKS.forEach(check => {
    if (!normalized[check]) issues.push(`Kannada translation approval requires the ${check} check.`)
  })
  if (!normalized.reviewerAttestation) issues.push('The reviewer attestation is required for Kannada translation approval.')
  return issues
}
