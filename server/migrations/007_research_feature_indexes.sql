CREATE TABLE IF NOT EXISTS research_record_index (
  record_id VARCHAR(220) PRIMARY KEY,
  collection_name VARCHAR(80) NOT NULL,
  record_type VARCHAR(120) NULL,
  title_en VARCHAR(500) NOT NULL,
  title_kn VARCHAR(500) NULL,
  date_from SMALLINT NULL,
  date_to SMALLINT NULL,
  date_precision VARCHAR(40) NULL,
  review_status VARCHAR(40) NOT NULL DEFAULT 'needs-review',
  country_code CHAR(2) NULL,
  outside_karnataka TINYINT(1) NOT NULL DEFAULT 0,
  schema_version VARCHAR(40) NOT NULL,
  payload_json LONGTEXT NOT NULL,
  indexed_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_research_collection (collection_name, record_type),
  KEY idx_research_date (date_from, date_to),
  KEY idx_research_review (review_status),
  KEY idx_research_geography (outside_karnataka, country_code),
  CONSTRAINT chk_research_record_payload_json CHECK (JSON_VALID(payload_json))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS research_entity_links (
  source_record_id VARCHAR(220) NOT NULL,
  source_collection VARCHAR(80) NOT NULL,
  link_type VARCHAR(80) NOT NULL,
  target_record_id VARCHAR(220) NOT NULL,
  target_collection VARCHAR(80) NULL,
  review_status VARCHAR(40) NOT NULL DEFAULT 'needs-review',
  citation_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  indexed_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (source_record_id, link_type, target_record_id),
  KEY idx_research_links_target (target_record_id, target_collection),
  KEY idx_research_links_type (link_type, review_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS research_evidence_gates (
  record_id VARCHAR(220) NOT NULL,
  collection_name VARCHAR(80) NOT NULL,
  gate_key VARCHAR(120) NOT NULL,
  gate_status VARCHAR(80) NOT NULL,
  source_id VARCHAR(220) NULL,
  locator VARCHAR(500) NULL,
  indexed_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (record_id, gate_key),
  KEY idx_research_gate_status (gate_status),
  KEY idx_research_gate_source (source_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
