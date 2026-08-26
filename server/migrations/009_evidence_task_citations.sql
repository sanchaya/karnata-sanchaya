CREATE TABLE IF NOT EXISTS evidence_task_citations (
  id CHAR(36) PRIMARY KEY,
  task_id VARCHAR(240) NOT NULL,
  url VARCHAR(1000) NOT NULL,
  title VARCHAR(255) NULL,
  locator VARCHAR(500) NULL,
  added_by CHAR(36) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_evidence_task_citation_user FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE RESTRICT,
  KEY idx_evidence_task_citation_task (task_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
