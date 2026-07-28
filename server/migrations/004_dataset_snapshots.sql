CREATE TABLE IF NOT EXISTS dataset_snapshots (
  id CHAR(36) PRIMARY KEY,
  schema_version VARCHAR(40) NOT NULL,
  revision INT UNSIGNED NOT NULL,
  content_sha256 CHAR(64) NOT NULL,
  dataset_json LONGTEXT NOT NULL,
  updated_by CHAR(36) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_dataset_revision (revision),
  KEY idx_dataset_created (created_at),
  CONSTRAINT chk_dataset_json CHECK (JSON_VALID(dataset_json)),
  CONSTRAINT fk_dataset_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
