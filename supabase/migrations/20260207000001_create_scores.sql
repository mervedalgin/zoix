CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL,
  username TEXT NOT NULL,
  score BIGINT NOT NULL,
  lines_cleared INTEGER NOT NULL,
  level_reached INTEGER NOT NULL,
  lives_remaining INTEGER DEFAULT 0,
  power_ups_used INTEGER DEFAULT 0,
  game_duration_seconds INTEGER,
  device TEXT DEFAULT 'desktop',
  played_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_scores_score ON scores(score DESC);
CREATE INDEX idx_scores_played_at ON scores(played_at DESC);
CREATE INDEX idx_scores_player ON scores(player_id);
CREATE INDEX idx_scores_daily ON scores(played_at, score DESC);

-- Views
CREATE VIEW leaderboard_alltime AS
  SELECT id, username, score, level_reached, lines_cleared, played_at
  FROM scores
  ORDER BY score DESC
  LIMIT 50;

CREATE VIEW leaderboard_daily AS
  SELECT id, username, score, level_reached, lines_cleared, played_at
  FROM scores
  WHERE played_at > now() - INTERVAL '24 hours'
  ORDER BY score DESC
  LIMIT 50;

CREATE VIEW leaderboard_weekly AS
  SELECT id, username, score, level_reached, lines_cleared, played_at
  FROM scores
  WHERE played_at > now() - INTERVAL '7 days'
  ORDER BY score DESC
  LIMIT 50;
