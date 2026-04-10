-- 좋아요
CREATE TABLE likes (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  screen_id UUID NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, screen_id)
);

CREATE INDEX idx_likes_screen ON likes(screen_id);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "likes_select" ON likes FOR SELECT USING (true);
CREATE POLICY "likes_insert" ON likes FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "likes_delete" ON likes FOR DELETE USING (user_id = auth.uid());

-- 좋아요 시 카운트 동기화 + XP 트리거
CREATE OR REPLACE FUNCTION handle_like_insert()
RETURNS TRIGGER AS $$
DECLARE
  v_owner_id UUID;
BEGIN
  UPDATE screens SET like_count = like_count + 1 WHERE id = NEW.screen_id;
  SELECT owner_id INTO v_owner_id FROM screens WHERE id = NEW.screen_id;
  IF v_owner_id IS NOT NULL AND v_owner_id != NEW.user_id THEN
    PERFORM grant_xp(v_owner_id, 'receive_like', 5, NEW.screen_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_like_insert
  AFTER INSERT ON likes
  FOR EACH ROW EXECUTE FUNCTION handle_like_insert();

CREATE OR REPLACE FUNCTION handle_like_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE screens SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.screen_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_like_delete
  AFTER DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION handle_like_delete();
