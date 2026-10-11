CREATE TABLE IF NOT EXISTS community_notifications (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  kind ENUM('account','review','campaign','import','system') NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_kn VARCHAR(255) NOT NULL,
  message_en TEXT NOT NULL,
  message_kn TEXT NOT NULL,
  entity_type VARCHAR(80) NULL,
  entity_id VARCHAR(191) NULL,
  read_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_community_notifications_user (user_id, read_at, created_at),
  CONSTRAINT fk_community_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS research_campaigns (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(120) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_kn VARCHAR(255) NOT NULL,
  description_en TEXT NOT NULL,
  description_kn TEXT NOT NULL,
  scope_json LONGTEXT NOT NULL,
  status ENUM('draft','active','closed','archived') NOT NULL DEFAULT 'draft',
  due_date DATE NULL,
  created_by CHAR(36) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_research_campaign_slug (slug),
  KEY idx_research_campaign_status (status, due_date),
  CONSTRAINT chk_research_campaign_scope_json CHECK (JSON_VALID(scope_json)),
  CONSTRAINT fk_research_campaign_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS research_campaign_members (
  campaign_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  member_role ENUM('participant','coordinator') NOT NULL DEFAULT 'participant',
  joined_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (campaign_id, user_id),
  CONSTRAINT fk_campaign_member_campaign FOREIGN KEY (campaign_id) REFERENCES research_campaigns(id) ON DELETE CASCADE,
  CONSTRAINT fk_campaign_member_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE contributions
  ADD COLUMN campaign_id CHAR(36) NULL AFTER contributor_id,
  ADD KEY idx_contributions_campaign (campaign_id, status),
  ADD CONSTRAINT fk_contributions_campaign FOREIGN KEY (campaign_id) REFERENCES research_campaigns(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS research_import_batches (
  id CHAR(36) PRIMARY KEY,
  submitted_by CHAR(36) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  import_format ENUM('csv','kml') NOT NULL,
  record_type VARCHAR(80) NOT NULL,
  row_count INT UNSIGNED NOT NULL,
  payload_json LONGTEXT NOT NULL,
  status ENUM('staged','submitted','changes-requested','approved','rejected') NOT NULL DEFAULT 'staged',
  reviewer_note TEXT NULL,
  reviewed_by CHAR(36) NULL,
  reviewed_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  KEY idx_research_import_submitter (submitted_by, created_at),
  KEY idx_research_import_review (status, created_at),
  CONSTRAINT chk_research_import_payload_json CHECK (JSON_VALID(payload_json)),
  CONSTRAINT fk_research_import_submitter FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_research_import_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
