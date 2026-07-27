import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeTranslationAssessment, translationApprovalIssues, translationProposalIssues } from '../server/review-policy.js'

const proposal = {
  action: 'translation',
  record: {
    translation: {
      languageReviews: { en: 'source-published', kn: 'draft-needs-epigraphist-review' },
      sections: [{ label: 'lines 1–2', en: ['One', 'Two'], kn: ['ಒಂದು', 'ಎರಡು'] }],
    },
  },
}

test('Kannada translation proposals require aligned bilingual lines', () => {
  assert.deepEqual(translationProposalIssues(proposal), [])
  assert.match(translationProposalIssues({ ...proposal, record: { translation: { ...proposal.record.translation, sections: [{ label: 'lines', en: ['One'], kn: [] }] } } })[0], /non-empty/)
})

test('translation approval requires every scholarly check and attestation', () => {
  const incomplete = normalizeTranslationAssessment({ languageCode: 'kn', reviewScope: 'kannada-translation', sourceMatch: true })
  assert.ok(translationApprovalIssues({ decision: 'approve', contribution: proposal, assessment: incomplete }).length > 0)
  const complete = Object.fromEntries(['sourceMatch','semanticFidelity','namesAndDates','historicalTerminology','lineCompleteness','reviewerAttestation'].map(key => [key, true]))
  assert.deepEqual(translationApprovalIssues({ decision: 'approve', contribution: proposal, assessment: { ...complete, languageCode: 'kn', reviewScope: 'kannada-translation' } }), [])
})

test('non-translation reviews keep the existing decision path', () => {
  assert.deepEqual(translationApprovalIssues({ decision: 'approve', contribution: { action: 'correction' }, assessment: {} }), [])
})
