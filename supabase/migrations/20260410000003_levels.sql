-- 레벨 정의
CREATE TABLE level_definitions (
  level INT PRIMARY KEY,
  required_xp INT NOT NULL,
  title TEXT,
  unlocked_components TEXT[] DEFAULT '{}'
);

INSERT INTO level_definitions (level, required_xp, title, unlocked_components) VALUES
  (1, 0,    '시작하는 빌더', ARRAY['button','text','input']),
  (2, 50,   '관심있는 빌더', ARRAY['image','icon']),
  (3, 150,  '성장하는 빌더', ARRAY['container']),
  (4, 350,  '실력있는 빌더', ARRAY['list']),
  (5, 600,  '경험많은 빌더', ARRAY['video']),
  (6, 1000, '숙련된 빌더',   ARRAY['table']),
  (7, 1500, '마스터 빌더',   ARRAY[]::TEXT[]);

-- XP 활동 로그
CREATE TABLE xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  xp_amount INT NOT NULL,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_xp_events_user ON xp_events(user_id, created_at DESC);

ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "xp_select" ON xp_events FOR SELECT USING (user_id = auth.uid());

-- XP 부여 함수 (원자적)
CREATE OR REPLACE FUNCTION grant_xp(
  p_user_id UUID, p_event_type TEXT, p_xp INT, p_ref_id UUID DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_new_xp INT;
  v_old_level INT;
  v_new_level INT;
BEGIN
  INSERT INTO xp_events (user_id, event_type, xp_amount, reference_id)
  VALUES (p_user_id, p_event_type, p_xp, p_ref_id);

  UPDATE profiles SET xp = xp + p_xp, updated_at = now()
  WHERE id = p_user_id RETURNING xp INTO v_new_xp;

  SELECT level INTO v_old_level FROM profiles WHERE id = p_user_id;

  SELECT COALESCE(MAX(level), 1) INTO v_new_level
  FROM level_definitions WHERE required_xp <= v_new_xp;

  IF v_new_level > v_old_level THEN
    UPDATE profiles SET level = v_new_level WHERE id = p_user_id;
  END IF;

  RETURN jsonb_build_object(
    'new_xp', v_new_xp,
    'old_level', v_old_level,
    'new_level', v_new_level,
    'leveled_up', v_new_level > v_old_level
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
