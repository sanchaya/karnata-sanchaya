-- Anonymous counts of clicks on links to partner sites (docs/visitor-stats.md). Only a day, a partner and the page the link was on:
-- no visitor id, no IP address, no user agent.
CREATE TABLE IF NOT EXISTS outbound_clicks (
  day DATE NOT NULL,
  target VARCHAR(40) NOT NULL,
  source_view VARCHAR(40) NOT NULL,
  clicks INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (day, target, source_view)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
