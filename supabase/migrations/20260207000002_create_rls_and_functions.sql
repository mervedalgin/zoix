-- RLS
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skorlar herkese açık"
  ON scores FOR SELECT USING (true);

CREATE POLICY "Anonim kullanıcı skor ekler"
  ON scores FOR INSERT
  WITH CHECK (auth.uid() = player_id);

-- RPC: Submit score
CREATE OR REPLACE FUNCTION submit_score(
  p_player_id UUID,
  p_username TEXT,
  p_score BIGINT,
  p_lines INTEGER,
  p_level INTEGER,
  p_lives INTEGER,
  p_powerups INTEGER,
  p_duration INTEGER,
  p_device TEXT
) RETURNS JSON AS $$
DECLARE
  new_id UUID;
  player_rank BIGINT;
  player_best BIGINT;
BEGIN
  INSERT INTO scores (player_id, username, score, lines_cleared, level_reached,
                      lives_remaining, power_ups_used, game_duration_seconds, device)
  VALUES (p_player_id, p_username, p_score, p_lines, p_level,
          p_lives, p_powerups, p_duration, p_device)
  RETURNING id INTO new_id;

  SELECT MAX(s.score) INTO player_best
  FROM scores s WHERE s.player_id = p_player_id;

  SELECT COUNT(*) + 1 INTO player_rank
  FROM (
    SELECT DISTINCT ON (player_id) score
    FROM scores ORDER BY player_id, score DESC
  ) best WHERE best.score > p_score;

  RETURN json_build_object(
    'score_id', new_id,
    'rank', player_rank,
    'best_score', player_best
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable realtime for scores table
ALTER PUBLICATION supabase_realtime ADD TABLE scores;
