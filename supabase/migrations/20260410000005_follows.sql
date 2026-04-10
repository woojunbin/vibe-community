-- 팔로우 관계
CREATE TABLE follows (
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "follows_select" ON follows FOR SELECT USING (true);
CREATE POLICY "follows_insert" ON follows FOR INSERT WITH CHECK (follower_id = auth.uid());
CREATE POLICY "follows_delete" ON follows FOR DELETE USING (follower_id = auth.uid());

-- profiles에 팔로워/팔로잉 카운트 추가
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS follower_count INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS following_count INT DEFAULT 0;

-- 팔로우 시 카운트 동기화 + XP
CREATE OR REPLACE FUNCTION handle_follow_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
  UPDATE profiles SET follower_count = follower_count + 1 WHERE id = NEW.following_id;
  -- 팔로우 받은 유저에게 XP 부여
  PERFORM grant_xp(NEW.following_id, 'receive_follow', 10, NEW.follower_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_follow_insert
  AFTER INSERT ON follows
  FOR EACH ROW EXECUTE FUNCTION handle_follow_insert();

CREATE OR REPLACE FUNCTION handle_follow_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET following_count = GREATEST(following_count - 1, 0) WHERE id = OLD.follower_id;
  UPDATE profiles SET follower_count = GREATEST(follower_count - 1, 0) WHERE id = OLD.following_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_follow_delete
  AFTER DELETE ON follows
  FOR EACH ROW EXECUTE FUNCTION handle_follow_delete();

-- 레벨 칭호 업데이트 (잠금 해제 → 순수 칭호/뱃지)
UPDATE level_definitions SET title = '새싹 빌더' WHERE level = 1;
UPDATE level_definitions SET title = '호기심 빌더' WHERE level = 2;
UPDATE level_definitions SET title = '성장 빌더' WHERE level = 3;
UPDATE level_definitions SET title = '실력 빌더' WHERE level = 4;
UPDATE level_definitions SET title = '베테랑 빌더' WHERE level = 5;
UPDATE level_definitions SET title = '엘리트 빌더' WHERE level = 6;
UPDATE level_definitions SET title = '마스터 빌더' WHERE level = 7;
