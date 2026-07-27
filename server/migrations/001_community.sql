CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(80) PRIMARY KEY,
  applied_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(160) NOT NULL,
  display_name_kn VARCHAR(160) NULL,
  preferred_locale ENUM('kn','en') NOT NULL DEFAULT 'kn',
  profession VARCHAR(80) NOT NULL,
  profession_details VARCHAR(255) NULL,
  affiliation_type ENUM('none','school','college','university','research-institute','museum','government','nonprofit','other') NOT NULL DEFAULT 'none',
  institution_name VARCHAR(255) NULL,
  institution_url VARCHAR(500) NULL,
  public_bio TEXT NULL,
  account_status ENUM('pending','approved','rejected','suspended') NOT NULL DEFAULT 'pending',
  verified_badge TINYINT(1) NOT NULL DEFAULT 0,
  terms_accepted_at DATETIME(3) NOT NULL,
  privacy_accepted_at DATETIME(3) NOT NULL,
  approved_by CHAR(36) NULL,
  approved_at DATETIME(3) NULL,
  rejection_reason VARCHAR(500) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_status (account_status),
  CONSTRAINT fk_users_approved_by FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_roles (
  user_id CHAR(36) NOT NULL,
  role ENUM('contributor','reviewer','verification-officer','administrator') NOT NULL,
  appointed_by CHAR(36) NULL,
  appointed_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (user_id, role),
  CONSTRAINT fk_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_roles_appointed_by FOREIGN KEY (appointed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
  token_hash CHAR(64) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  expires_at DATETIME(3) NOT NULL,
  last_seen_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  ip_hash CHAR(64) NULL,
  user_agent_hash CHAR(64) NULL,
  KEY idx_sessions_user (user_id),
  KEY idx_sessions_expiry (expires_at),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS verification_requests (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  institution_name VARCHAR(255) NOT NULL,
  institutional_identifier VARCHAR(120) NULL,
  document_storage_key VARCHAR(255) NOT NULL,
  document_mime VARCHAR(100) NOT NULL,
  document_sha256 CHAR(64) NOT NULL,
  document_size INT UNSIGNED NOT NULL,
  status ENUM('pending','approved','rejected','expired') NOT NULL DEFAULT 'pending',
  review_note VARCHAR(1000) NULL,
  reviewed_by CHAR(36) NULL,
  reviewed_at DATETIME(3) NULL,
  delete_after DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_verification_user (user_id),
  KEY idx_verification_status (status),
  CONSTRAINT fk_verification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_verification_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contributions (
  id CHAR(36) PRIMARY KEY,
  contributor_id CHAR(36) NOT NULL,
  action ENUM('create','update','correction','citation','translation') NOT NULL,
  record_type VARCHAR(80) NOT NULL,
  target_record_id VARCHAR(160) NULL,
  title VARCHAR(255) NOT NULL,
  rationale TEXT NOT NULL,
  proposed_record_json LONGTEXT NOT NULL,
  citations_json LONGTEXT NOT NULL,
  status ENUM('draft','submitted','changes-requested','approved','rejected','withdrawn') NOT NULL DEFAULT 'draft',
  version INT UNSIGNED NOT NULL DEFAULT 1,
  submitted_at DATETIME(3) NULL,
  decided_at DATETIME(3) NULL,
  approved_snapshot_id CHAR(36) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  KEY idx_contributions_contributor (contributor_id),
  KEY idx_contributions_status (status, submitted_at),
  KEY idx_contributions_target (record_type, target_record_id),
  CONSTRAINT chk_contribution_record_json CHECK (JSON_VALID(proposed_record_json)),
  CONSTRAINT chk_contribution_citations_json CHECK (JSON_VALID(citations_json)),
  CONSTRAINT fk_contributions_user FOREIGN KEY (contributor_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contribution_reviews (
  id CHAR(36) PRIMARY KEY,
  contribution_id CHAR(36) NOT NULL,
  reviewer_id CHAR(36) NOT NULL,
  contribution_version INT UNSIGNED NOT NULL,
  decision ENUM('approve','request-changes','reject') NOT NULL,
  public_comment TEXT NOT NULL,
  private_note TEXT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_reviews_contribution (contribution_id),
  KEY idx_reviews_reviewer (reviewer_id),
  UNIQUE KEY uq_review_version_reviewer (contribution_id, contribution_version, reviewer_id),
  CONSTRAINT fk_reviews_contribution FOREIGN KEY (contribution_id) REFERENCES contributions(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS karma_ledger (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  contribution_id CHAR(36) NULL,
  review_id CHAR(36) NULL,
  points SMALLINT NOT NULL,
  reason ENUM('approved-contribution','citation-quality','approved-review','verification-service','manual-adjustment','reversal') NOT NULL,
  note VARCHAR(500) NOT NULL,
  created_by CHAR(36) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_karma_user (user_id, created_at),
  UNIQUE KEY uq_karma_contribution_reason (user_id, contribution_id, reason),
  UNIQUE KEY uq_karma_review_reason (user_id, review_id, reason),
  CONSTRAINT fk_karma_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_karma_contribution FOREIGN KEY (contribution_id) REFERENCES contributions(id) ON DELETE RESTRICT,
  CONSTRAINT fk_karma_review FOREIGN KEY (review_id) REFERENCES contribution_reviews(id) ON DELETE RESTRICT,
  CONSTRAINT fk_karma_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS certificates (
  id CHAR(36) PRIMARY KEY,
  verification_code CHAR(32) NOT NULL,
  user_id CHAR(36) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_kn VARCHAR(255) NOT NULL,
  period_from DATE NOT NULL,
  period_to DATE NOT NULL,
  contribution_points INT NOT NULL DEFAULT 0,
  reviewer_points INT NOT NULL DEFAULT 0,
  statement_en TEXT NOT NULL,
  statement_kn TEXT NOT NULL,
  issued_by CHAR(36) NOT NULL,
  issued_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  revoked_at DATETIME(3) NULL,
  revocation_reason VARCHAR(500) NULL,
  UNIQUE KEY uq_certificate_code (verification_code),
  KEY idx_certificates_user (user_id),
  CONSTRAINT fk_certificates_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_certificates_issuer FOREIGN KEY (issued_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS published_snapshots (
  id CHAR(36) PRIMARY KEY,
  schema_version VARCHAR(40) NOT NULL,
  content_sha256 CHAR(64) NOT NULL,
  export_path VARCHAR(500) NOT NULL,
  contribution_count INT UNSIGNED NOT NULL,
  published_by CHAR(36) NOT NULL,
  published_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_snapshot_sha (content_sha256),
  CONSTRAINT fk_snapshots_publisher FOREIGN KEY (published_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_log (
  id CHAR(36) PRIMARY KEY,
  actor_user_id CHAR(36) NULL,
  action VARCHAR(120) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id VARCHAR(160) NULL,
  metadata_json LONGTEXT NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_audit_entity (entity_type, entity_id),
  KEY idx_audit_actor (actor_user_id, created_at),
  CONSTRAINT chk_audit_metadata_json CHECK (JSON_VALID(metadata_json)),
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

