'use client';

import type { Screen, AppComponent } from '@/types/project';
import type { ComponentState } from '@/lib/preview/block-runtime';

interface PreviewFrameProps {
  screen: Screen;
  componentStates: Map<string, ComponentState>;
  onTrigger: (componentId: string, triggerType: string) => void;
}

export function PreviewFrame({ screen, componentStates, onTrigger }: PreviewFrameProps) {
  const w = screen.canvasSize?.width ?? 375;
  const h = screen.canvasSize?.height ?? 812;

  return (
    <div
      className="relative overflow-hidden rounded-[2rem] border-[3px] border-gray-800 shadow-2xl"
      style={{ width: w, height: h, backgroundColor: screen.backgroundColor || '#FAFAFA' }}
    >
      {screen.components.map(comp => (
        <PreviewComponent
          key={comp.id}
          component={comp}
          state={componentStates.get(comp.id)}
          onTrigger={onTrigger}
        />
      ))}
    </div>
  );
}

function PreviewComponent({
  component: comp,
  state,
  onTrigger,
}: {
  component: AppComponent;
  state?: ComponentState;
  onTrigger: (componentId: string, triggerType: string) => void;
}) {
  if (state && !state.visible) return null;

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: comp.position.x,
    top: comp.position.y,
    width: comp.size.width,
    height: comp.size.height,
    ...(comp.style as React.CSSProperties),
    ...(state?.styleOverrides ?? {}),
  };

  // 애니메이션
  if (state?.animating) {
    baseStyle.animation = `${state.animating} 0.5s ease`;
  }

  const textContent = state?.textOverride ?? comp.props.content ?? comp.props.label ?? comp.name;

  const handleClick = () => {
    onTrigger(comp.id, 'onPress');
  };

  switch (comp.type) {
    case 'button':
      return (
        <button
          style={{
            ...baseStyle,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            fontWeight: 600,
            fontSize: 13,
          }}
          onClick={handleClick}
        >
          {state?.textOverride ?? comp.props.label ?? comp.name}
        </button>
      );

    case 'text':
      return (
        <div style={baseStyle} onClick={handleClick}>
          {textContent}
        </div>
      );

    case 'input':
      return (
        <input
          type={comp.props.inputType || 'text'}
          placeholder={comp.props.placeholder}
          value={state?.valueOverride ?? ''}
          onChange={(e) => {
            if (state) state.valueOverride = e.target.value;
            onTrigger(comp.id, 'onChange');
          }}
          style={{
            ...baseStyle,
            padding: '0 12px',
            outline: 'none',
          }}
        />
      );

    case 'image':
      return (
        <img
          src={state?.srcOverride ?? comp.props.src}
          alt={comp.name}
          style={{ ...baseStyle, objectFit: comp.props.objectFit || 'cover' }}
          onClick={handleClick}
        />
      );

    case 'container':
      return (
        <div style={baseStyle} onClick={handleClick} />
      );

    case 'icon':
      return (
        <div style={{ ...baseStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleClick}>
          {comp.props.iconName || '★'}
        </div>
      );

    case 'list':
      return (
        <div style={baseStyle}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: comp.props.itemHeight || 50,
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 12,
              fontSize: 13,
              color: '#6b7280',
            }}>
              항목 {i}
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div style={baseStyle} onClick={handleClick}>
          {comp.name}
        </div>
      );
  }
}
