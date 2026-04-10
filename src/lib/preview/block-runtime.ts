import type { Screen, AppComponent } from '@/types/project';
import type { Block, ActionType } from '@/types/action-block';

export interface ComponentState {
  visible: boolean;
  textOverride?: string;
  valueOverride?: string;
  srcOverride?: string;
  styleOverrides: Record<string, string>;
  animating?: string; // CSS animation name
}

export interface RuntimeState {
  currentScreenId: string;
  screenHistory: string[];
  componentStates: Map<string, ComponentState>;
  globalState: Map<string, unknown>;
  modalScreenId?: string;
}

export class BlockRuntime {
  screens: Screen[];
  connections: { sourceBlockId: string; targetScreenId: string; targetBlockId?: string }[];
  state: RuntimeState;
  private onChange: () => void;

  constructor(
    screens: Screen[],
    connections: { sourceBlockId: string; targetScreenId: string; targetBlockId?: string }[],
    initialScreenId: string,
    onChange: () => void,
  ) {
    this.screens = screens;
    this.connections = connections;
    this.onChange = onChange;
    this.state = {
      currentScreenId: initialScreenId,
      screenHistory: [initialScreenId],
      componentStates: new Map(),
      globalState: new Map(),
    };
    this.initComponentStates();
  }

  private initComponentStates() {
    for (const screen of this.screens) {
      for (const comp of screen.components) {
        this.state.componentStates.set(comp.id, {
          visible: true,
          styleOverrides: {},
        });
      }
    }
  }

  private getCompState(compId: string): ComponentState {
    if (!this.state.componentStates.has(compId)) {
      this.state.componentStates.set(compId, { visible: true, styleOverrides: {} });
    }
    return this.state.componentStates.get(compId)!;
  }

  private findComponentByName(name: string, screenId?: string): AppComponent | undefined {
    const screen = this.screens.find(s => s.id === (screenId || this.state.currentScreenId));
    return screen?.components.find(c => c.name === name);
  }

  /** 컴포넌트의 특정 트리거에 해당하는 블록 실행 */
  async trigger(componentId: string, triggerType: string) {
    const screen = this.screens.find(s => s.id === this.state.currentScreenId);
    if (!screen) return;

    const comp = screen.components.find(c => c.id === componentId);
    if (!comp) return;

    const matchingBlocks = comp.blocks
      .filter(b => b.enabled && b.trigger.type === triggerType)
      .sort((a, b) => a.order - b.order);

    for (const block of matchingBlocks) {
      await this.executeBlock(block);
    }
    this.onChange();
  }

  /** 화면 진입 시 onLoad 블록 실행 */
  async triggerScreenLoad() {
    const screen = this.screens.find(s => s.id === this.state.currentScreenId);
    if (!screen) return;

    for (const comp of screen.components) {
      const loadBlocks = comp.blocks.filter(b => b.enabled && b.trigger.type === 'onLoad');
      for (const block of loadBlocks) {
        await this.executeBlock(block);
      }
    }
    this.onChange();
  }

  private async executeBlock(block: Block) {
    const action = block.action;
    const params = block.params;
    const targetComp = block.target === '_self'
      ? this.findComponentByName(block.target)
      : this.findComponentByName(block.target);

    const targetId = targetComp?.id || block.target;

    switch (action as ActionType) {
      // Navigation
      case 'navigate': {
        const conn = this.connections.find(c => c.sourceBlockId === block.id);
        const targetScreenId = conn?.targetScreenId || (params.screen as string);
        if (targetScreenId) {
          this.state.screenHistory.push(this.state.currentScreenId);
          this.state.currentScreenId = targetScreenId;
          await this.triggerScreenLoad();
        }
        break;
      }
      case 'goBack': {
        if (this.state.screenHistory.length > 1) {
          this.state.screenHistory.pop();
          this.state.currentScreenId = this.state.screenHistory[this.state.screenHistory.length - 1];
          await this.triggerScreenLoad();
        }
        break;
      }
      case 'openModal': {
        const conn = this.connections.find(c => c.sourceBlockId === block.id);
        this.state.modalScreenId = conn?.targetScreenId || (params.screen as string);
        break;
      }
      case 'closeModal': {
        this.state.modalScreenId = undefined;
        break;
      }
      case 'openLink': {
        // 프리뷰에서는 alert로 표시
        break;
      }

      // Visibility
      case 'show': {
        const cs = this.getCompState(targetId);
        cs.visible = true;
        break;
      }
      case 'hide': {
        const cs = this.getCompState(targetId);
        cs.visible = false;
        break;
      }
      case 'toggle': {
        const cs = this.getCompState(targetId);
        cs.visible = !cs.visible;
        break;
      }
      case 'fadeIn': {
        const cs = this.getCompState(targetId);
        cs.visible = true;
        cs.animating = 'fadeIn';
        setTimeout(() => { cs.animating = undefined; this.onChange(); }, 300);
        break;
      }
      case 'fadeOut': {
        const cs = this.getCompState(targetId);
        cs.animating = 'fadeOut';
        setTimeout(() => { cs.visible = false; cs.animating = undefined; this.onChange(); }, 300);
        break;
      }

      // Content
      case 'setText': {
        const cs = this.getCompState(targetId);
        cs.textOverride = params.text as string;
        break;
      }
      case 'setImage': {
        const cs = this.getCompState(targetId);
        cs.srcOverride = params.src as string;
        break;
      }
      case 'setValue': {
        const cs = this.getCompState(targetId);
        cs.valueOverride = String(params.value ?? '');
        break;
      }
      case 'clear': {
        const cs = this.getCompState(targetId);
        cs.textOverride = '';
        cs.valueOverride = '';
        break;
      }

      // Style
      case 'changeColor': {
        const cs = this.getCompState(targetId);
        cs.styleOverrides.color = params.color as string;
        break;
      }
      case 'changeBgColor': {
        const cs = this.getCompState(targetId);
        cs.styleOverrides.backgroundColor = params.color as string;
        break;
      }
      case 'changeOpacity': {
        const cs = this.getCompState(targetId);
        cs.styleOverrides.opacity = String(params.opacity ?? 1);
        break;
      }
      case 'changeFontSize': {
        const cs = this.getCompState(targetId);
        cs.styleOverrides.fontSize = `${params.size}px`;
        break;
      }

      // Data
      case 'setState': {
        this.state.globalState.set(params.key as string, params.value);
        break;
      }
      case 'getState': {
        const val = this.state.globalState.get(params.key as string);
        if (val !== undefined) {
          const cs = this.getCompState(targetId);
          cs.textOverride = String(val);
        }
        break;
      }
      case 'increment': {
        const cs = this.getCompState(targetId);
        const curr = parseInt(cs.valueOverride || '0', 10);
        cs.valueOverride = String(curr + (params.amount as number || 1));
        break;
      }
      case 'decrement': {
        const cs = this.getCompState(targetId);
        const curr = parseInt(cs.valueOverride || '0', 10);
        cs.valueOverride = String(curr - (params.amount as number || 1));
        break;
      }

      // Animation
      case 'bounce':
      case 'shake':
      case 'pulse':
      case 'spin': {
        const cs = this.getCompState(targetId);
        cs.animating = action;
        const duration = (params.duration as number) || 500;
        setTimeout(() => { cs.animating = undefined; this.onChange(); }, duration);
        break;
      }

      // Timer
      case 'delay': {
        await new Promise(r => setTimeout(r, (params.ms as number) || 1000));
        break;
      }

      default:
        break;
    }
  }

  getCurrentScreen(): Screen | undefined {
    return this.screens.find(s => s.id === this.state.currentScreenId);
  }

  getModalScreen(): Screen | undefined {
    if (!this.state.modalScreenId) return undefined;
    return this.screens.find(s => s.id === this.state.modalScreenId);
  }
}
