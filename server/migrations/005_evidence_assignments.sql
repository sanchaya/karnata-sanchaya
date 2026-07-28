CREATE TABLE IF NOT EXISTS evidence_assignments (
  task_id VARCHAR(240) PRIMARY KEY,
  status ENUM('todo','in-progress','awaiting-review','blocked','complete') NOT NULL DEFAULT 'todo',
  assignee VARCHAR(255) NULL,
  due_date DATE NULL,
  updated_by CHAR(36) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_evidence_assignment_user FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE RESTRICT,
  KEY idx_evidence_assignment_status (status, updated_at),
  KEY idx_evidence_assignment_due (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
