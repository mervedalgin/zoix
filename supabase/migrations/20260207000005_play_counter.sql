-- Global play counter table
CREATE TABLE IF NOT EXISTS play_counter (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  total_plays BIGINT NOT NULL DEFAULT 0
);

-- Insert initial row
INSERT INTO play_counter (id, total_plays) VALUES (1, 0) ON CONFLICT DO NOTHING;

-- RLS: everyone can read
ALTER TABLE play_counter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Play counter readable by all"
  ON play_counter FOR SELECT USING (true);

-- Atomic increment function (SECURITY DEFINER bypasses RLS for update)
CREATE OR REPLACE FUNCTION increment_play_count()
RETURNS BIGINT AS $$
DECLARE
  new_count BIGINT;
BEGIN
  UPDATE play_counter SET total_plays = total_plays + 1 WHERE id = 1
  RETURNING total_plays INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
