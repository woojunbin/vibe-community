-- 모범 사례 데모 앱: Alice의 "카페 주문 앱"
-- 3개 페이지: 스플래시 → 메뉴 → 주문완료
-- 블록 연결: 스플래시.navigate → 메뉴.onLoad, 메뉴.navigate → 주문완료.onLoad

-- Alice의 기존 화면 업데이트 (로그인 화면 → 스플래시)
UPDATE screens SET
  name = '스플래시',
  components = '[
    {
      "id": "splash-title",
      "type": "text",
      "name": "앱타이틀",
      "position": {"x": 87, "y": 200},
      "size": {"width": 200, "height": 40},
      "style": {"fontSize": "28", "fontWeight": "bold", "color": "#1e293b"},
      "props": {"content": "☕ 카페 오더"},
      "blocks": [
        {
          "id": "blk-splash-load",
          "componentId": "splash-title",
          "trigger": {"type": "onLoad"},
          "target": "_self",
          "action": "fadeIn",
          "params": {"duration": 500},
          "order": 0,
          "enabled": true
        }
      ]
    },
    {
      "id": "splash-subtitle",
      "type": "text",
      "name": "서브타이틀",
      "position": {"x": 77, "y": 260},
      "size": {"width": 220, "height": 24},
      "style": {"fontSize": "14", "color": "#94a3b8"},
      "props": {"content": "오늘도 맛있는 하루 되세요"},
      "blocks": []
    },
    {
      "id": "splash-btn",
      "type": "button",
      "name": "시작버튼",
      "position": {"x": 87, "y": 500},
      "size": {"width": 200, "height": 50},
      "style": {"backgroundColor": "#7c3aed", "color": "#ffffff", "borderRadius": "25", "fontSize": "16"},
      "props": {"label": "메뉴 보기"},
      "blocks": [
        {
          "id": "blk-splash-nav",
          "componentId": "splash-btn",
          "trigger": {"type": "onPress", "source": "시작버튼"},
          "target": "_self",
          "action": "navigate",
          "params": {"screen": "메뉴"},
          "order": 0,
          "enabled": true
        }
      ]
    }
  ]',
  background_color = '#faf5ff',
  canvas_width = 375,
  canvas_height = 812
WHERE id = '11111111-aaaa-aaaa-aaaa-111111111111';

-- Alice의 2번째 화면 → 메뉴
UPDATE screens SET
  name = '메뉴',
  components = '[
    {
      "id": "menu-header",
      "type": "text",
      "name": "메뉴헤더",
      "position": {"x": 20, "y": 40},
      "size": {"width": 200, "height": 32},
      "style": {"fontSize": "22", "fontWeight": "bold", "color": "#1e293b"},
      "props": {"content": "메뉴"},
      "blocks": [
        {
          "id": "blk-menu-load",
          "componentId": "menu-header",
          "trigger": {"type": "onLoad"},
          "target": "_self",
          "action": "pulse",
          "params": {"duration": 400},
          "order": 0,
          "enabled": true
        }
      ]
    },
    {
      "id": "menu-americano",
      "type": "container",
      "name": "아메리카노",
      "position": {"x": 20, "y": 90},
      "size": {"width": 335, "height": 70},
      "style": {"backgroundColor": "#f8fafc", "borderRadius": "12", "borderWidth": "1", "borderColor": "#e2e8f0"},
      "props": {},
      "blocks": []
    },
    {
      "id": "menu-latte",
      "type": "container",
      "name": "카페라떼",
      "position": {"x": 20, "y": 170},
      "size": {"width": 335, "height": 70},
      "style": {"backgroundColor": "#f8fafc", "borderRadius": "12", "borderWidth": "1", "borderColor": "#e2e8f0"},
      "props": {},
      "blocks": []
    },
    {
      "id": "menu-mocha",
      "type": "container",
      "name": "카페모카",
      "position": {"x": 20, "y": 250},
      "size": {"width": 335, "height": 70},
      "style": {"backgroundColor": "#f8fafc", "borderRadius": "12", "borderWidth": "1", "borderColor": "#e2e8f0"},
      "props": {},
      "blocks": []
    },
    {
      "id": "menu-americano-txt",
      "type": "text",
      "name": "아메리카노텍스트",
      "position": {"x": 35, "y": 100},
      "size": {"width": 200, "height": 20},
      "style": {"fontSize": "15", "fontWeight": "600"},
      "props": {"content": "아메리카노 ₩4,500"},
      "blocks": []
    },
    {
      "id": "menu-latte-txt",
      "type": "text",
      "name": "라떼텍스트",
      "position": {"x": 35, "y": 180},
      "size": {"width": 200, "height": 20},
      "style": {"fontSize": "15", "fontWeight": "600"},
      "props": {"content": "카페라떼 ₩5,000"},
      "blocks": []
    },
    {
      "id": "menu-mocha-txt",
      "type": "text",
      "name": "모카텍스트",
      "position": {"x": 35, "y": 260},
      "size": {"width": 200, "height": 20},
      "style": {"fontSize": "15", "fontWeight": "600"},
      "props": {"content": "카페모카 ₩5,500"},
      "blocks": []
    },
    {
      "id": "menu-counter-label",
      "type": "text",
      "name": "수량라벨",
      "position": {"x": 20, "y": 370},
      "size": {"width": 100, "height": 20},
      "style": {"fontSize": "13", "color": "#64748b"},
      "props": {"content": "수량"},
      "blocks": []
    },
    {
      "id": "menu-counter",
      "type": "text",
      "name": "수량값",
      "position": {"x": 160, "y": 360},
      "size": {"width": 60, "height": 36},
      "style": {"fontSize": "20", "fontWeight": "bold", "color": "#7c3aed"},
      "props": {"content": "1"},
      "blocks": []
    },
    {
      "id": "menu-plus",
      "type": "button",
      "name": "플러스",
      "position": {"x": 230, "y": 360},
      "size": {"width": 40, "height": 36},
      "style": {"backgroundColor": "#7c3aed", "color": "#ffffff", "borderRadius": "8", "fontSize": "18"},
      "props": {"label": "+"},
      "blocks": [
        {
          "id": "blk-plus",
          "componentId": "menu-plus",
          "trigger": {"type": "onPress", "source": "플러스"},
          "target": "수량값",
          "action": "increment",
          "params": {"amount": 1},
          "order": 0,
          "enabled": true
        }
      ]
    },
    {
      "id": "menu-minus",
      "type": "button",
      "name": "마이너스",
      "position": {"x": 120, "y": 360},
      "size": {"width": 40, "height": 36},
      "style": {"backgroundColor": "#e2e8f0", "color": "#475569", "borderRadius": "8", "fontSize": "18"},
      "props": {"label": "-"},
      "blocks": [
        {
          "id": "blk-minus",
          "componentId": "menu-minus",
          "trigger": {"type": "onPress", "source": "마이너스"},
          "target": "수량값",
          "action": "decrement",
          "params": {"amount": 1},
          "order": 0,
          "enabled": true
        }
      ]
    },
    {
      "id": "menu-order-btn",
      "type": "button",
      "name": "주문하기",
      "position": {"x": 37, "y": 440},
      "size": {"width": 300, "height": 52},
      "style": {"backgroundColor": "#7c3aed", "color": "#ffffff", "borderRadius": "14", "fontSize": "16", "fontWeight": "bold"},
      "props": {"label": "주문하기"},
      "blocks": [
        {
          "id": "blk-order-bounce",
          "componentId": "menu-order-btn",
          "trigger": {"type": "onPress", "source": "주문하기"},
          "target": "_self",
          "action": "bounce",
          "params": {"duration": 300},
          "order": 0,
          "enabled": true
        },
        {
          "id": "blk-order-nav",
          "componentId": "menu-order-btn",
          "trigger": {"type": "onPress", "source": "주문하기"},
          "target": "_self",
          "action": "navigate",
          "params": {"screen": "주문완료"},
          "order": 1,
          "enabled": true
        }
      ]
    },
    {
      "id": "menu-back",
      "type": "button",
      "name": "뒤로",
      "position": {"x": 20, "y": 520},
      "size": {"width": 80, "height": 36},
      "style": {"backgroundColor": "transparent", "color": "#7c3aed", "fontSize": "13"},
      "props": {"label": "← 뒤로"},
      "blocks": [
        {
          "id": "blk-back",
          "componentId": "menu-back",
          "trigger": {"type": "onPress", "source": "뒤로"},
          "target": "_self",
          "action": "goBack",
          "params": {},
          "order": 0,
          "enabled": true
        }
      ]
    }
  ]',
  background_color = '#ffffff',
  canvas_width = 375,
  canvas_height = 812
WHERE id = '22222222-aaaa-aaaa-aaaa-222222222222';

-- Bob의 첫 화면 → 주문완료
UPDATE screens SET
  name = '주문완료',
  owner_id = 'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa',
  components = '[
    {
      "id": "done-check",
      "type": "text",
      "name": "체크마크",
      "position": {"x": 137, "y": 200},
      "size": {"width": 100, "height": 80},
      "style": {"fontSize": "60"},
      "props": {"content": "✅"},
      "blocks": [
        {
          "id": "blk-done-load",
          "componentId": "done-check",
          "trigger": {"type": "onLoad"},
          "target": "_self",
          "action": "bounce",
          "params": {"duration": 600},
          "order": 0,
          "enabled": true
        }
      ]
    },
    {
      "id": "done-title",
      "type": "text",
      "name": "완료타이틀",
      "position": {"x": 77, "y": 300},
      "size": {"width": 220, "height": 36},
      "style": {"fontSize": "22", "fontWeight": "bold", "color": "#1e293b"},
      "props": {"content": "주문 완료!"},
      "blocks": []
    },
    {
      "id": "done-desc",
      "type": "text",
      "name": "완료설명",
      "position": {"x": 57, "y": 350},
      "size": {"width": 260, "height": 40},
      "style": {"fontSize": "14", "color": "#64748b"},
      "props": {"content": "곧 준비됩니다. 잠시만 기다려주세요."},
      "blocks": []
    },
    {
      "id": "done-home",
      "type": "button",
      "name": "홈으로",
      "position": {"x": 87, "y": 450},
      "size": {"width": 200, "height": 50},
      "style": {"backgroundColor": "#7c3aed", "color": "#ffffff", "borderRadius": "25", "fontSize": "16"},
      "props": {"label": "홈으로"},
      "blocks": [
        {
          "id": "blk-home-nav",
          "componentId": "done-home",
          "trigger": {"type": "onPress", "source": "홈으로"},
          "target": "_self",
          "action": "navigate",
          "params": {"screen": "스플래시"},
          "order": 0,
          "enabled": true
        }
      ]
    }
  ]',
  background_color = '#f0fdf4',
  canvas_width = 375,
  canvas_height = 812
WHERE id = '33333333-bbbb-bbbb-bbbb-333333333333';

-- 블록-블록 연결 생성
-- 스플래시.시작버튼.navigate → 메뉴.메뉴헤더.onLoad
INSERT INTO connections (source_screen_id, target_screen_id, created_by, edge_type, source_block_id, target_block_id)
VALUES (
  '11111111-aaaa-aaaa-aaaa-111111111111',
  '22222222-aaaa-aaaa-aaaa-222222222222',
  'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa',
  'solid',
  'blk-splash-nav',
  'blk-menu-load'
) ON CONFLICT DO NOTHING;

-- 메뉴.주문하기.navigate → 주문완료.체크마크.onLoad
INSERT INTO connections (source_screen_id, target_screen_id, created_by, edge_type, source_block_id, target_block_id)
VALUES (
  '22222222-aaaa-aaaa-aaaa-222222222222',
  '33333333-bbbb-bbbb-bbbb-333333333333',
  'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa',
  'solid',
  'blk-order-nav',
  'blk-done-load'
) ON CONFLICT DO NOTHING;

-- 주문완료.홈으로.navigate → 스플래시.앱타이틀.onLoad
INSERT INTO connections (source_screen_id, target_screen_id, created_by, edge_type, source_block_id, target_block_id)
VALUES (
  '33333333-bbbb-bbbb-bbbb-333333333333',
  '11111111-aaaa-aaaa-aaaa-111111111111',
  'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa',
  'solid',
  'blk-home-nav',
  'blk-splash-load'
) ON CONFLICT DO NOTHING;
