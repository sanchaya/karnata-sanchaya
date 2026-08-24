ALTER TABLE evidence_assignments
  ADD COLUMN reviewer VARCHAR(255) NULL AFTER assignee,
  ADD COLUMN review_note TEXT NULL AFTER due_date;

CREATE TABLE IF NOT EXISTS evidence_assignment_history (
  id CHAR(36) PRIMARY KEY,
  task_id VARCHAR(240) NOT NULL,
  status ENUM('todo','in-progress','awaiting-review','blocked','complete') NOT NULL,
  assignee VARCHAR(255) NULL,
  reviewer VARCHAR(255) NULL,
  due_date DATE NULL,
  review_note TEXT NULL,
  updated_by CHAR(36) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_evidence_assignment_history_task FOREIGN KEY (task_id) REFERENCES evidence_assignments(task_id) ON DELETE CASCADE,
  CONSTRAINT fk_evidence_assignment_history_user FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE RESTRICT,
  KEY idx_evidence_assignment_history_task (task_id, created_at),
  KEY idx_evidence_assignment_history_status (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
