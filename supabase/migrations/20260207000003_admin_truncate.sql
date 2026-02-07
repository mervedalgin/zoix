-- Admin function to truncate scores (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION admin_truncate_scores()
RETURNS void AS $$
BEGIN
  DELETE FROM scores;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
