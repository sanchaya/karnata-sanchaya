ALTER TABLE contribution_reviews
  ADD COLUMN IF NOT EXISTS language_code VARCHAR(12) NULL AFTER decision,
  ADD COLUMN IF NOT EXISTS review_scope VARCHAR(80) NULL AFTER language_code,
  ADD COLUMN IF NOT EXISTS assessment_json LONGTEXT NULL AFTER private_note;

ALTER TABLE contribution_reviews
  ADD CONSTRAINT chk_review_assessment_json CHECK (assessment_json IS NULL OR JSON_VALID(assessment_json));
