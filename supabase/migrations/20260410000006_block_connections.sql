-- 블록-블록 연결 지원
-- connections 테이블에 소스/타겟 블록 ID 추가
ALTER TABLE connections ADD COLUMN IF NOT EXISTS source_block_id TEXT;
ALTER TABLE connections ADD COLUMN IF NOT EXISTS target_block_id TEXT;

-- 기존 유니크 제약 교체 (source_component_id → source_block_id)
ALTER TABLE connections DROP CONSTRAINT IF EXISTS connections_source_screen_id_target_screen_id_source_compon_key;
ALTER TABLE connections ADD CONSTRAINT connections_block_unique
  UNIQUE(source_screen_id, target_screen_id, source_block_id);
