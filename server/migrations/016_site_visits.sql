-- Private, cookie-free visit counts. Visitors are an HMAC of a random browser id (no IP, no user agent, no account link).
CREATE TABLE IF NOT EXISTS site_visitors (
  visitor_hash CHAR(32) PRIMARY KEY,
  first_seen DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  last_seen DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  sessions INT UNSIGNED NOT NULL DEFAULT 0,
  views INT UNSIGNED NOT NULL DEFAULT 0,
  KEY idx_site_visitors_first_seen (first_seen)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_visitor_days (
  day DATE NOT NULL,
  visitor_hash CHAR(32) NOT NULL,
  views INT UNSIGNED NOT NULL DEFAULT 0,
  sessions INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (day, visitor_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
