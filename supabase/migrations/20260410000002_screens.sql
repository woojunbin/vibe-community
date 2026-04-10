-- 페이지 (핵심 컨텐츠)
CREATE TABLE screens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '새 화면',
  components JSONB NOT NULL DEFAULT '[]',
  canvas_width INT DEFAULT 375,
  canvas_height INT DEFAULT 812,
  background_color TEXT DEFAULT '#FAFAFA',
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  thumbnail_url TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  connection_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_screens_owner ON screens(owner_id);
CREATE INDEX idx_screens_published ON screens(is_published, published_at DESC);
CREATE INDEX idx_screens_tags ON screens USING GIN(tags);

ALTER TABLE screens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "screens_select" ON screens FOR SELECT
  USING (is_published = true OR owner_id = auth.uid());
CREATE POLICY "screens_insert" ON screens FOR INSERT
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "screens_update" ON screens FOR UPDATE
  USING (owner_id = auth.uid());
CREATE POLICY "screens_delete" ON screens FOR DELETE
  USING (owner_id = auth.uid());

-- 페이지 간 연결
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_screen_id UUID NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  target_screen_id UUID NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT,
  edge_type TEXT DEFAULT 'solid' CHECK (edge_type IN ('solid', 'dashed')),
  source_component_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_screen_id, target_screen_id, source_component_id)
);

CREATE INDEX idx_connections_source ON connections(source_screen_id);
CREATE INDEX idx_connections_target ON connections(target_screen_id);

ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "connections_select" ON connections FOR SELECT USING (true);
CREATE POLICY "connections_insert" ON connections FOR INSERT
  WITH CHECK (created_by = auth.uid());
CREATE POLICY "connections_delete" ON connections FOR DELETE
  USING (created_by = auth.uid());
