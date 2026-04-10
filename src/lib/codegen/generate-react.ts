import type { Screen, AppComponent } from '@/types/project';
import type { Block } from '@/types/action-block';

export interface GeneratedFile {
  path: string;
  content: string;
}

interface CodegenConnection {
  sourceBlockId: string;
  targetScreenId: string;
  targetScreenName: string;
}

/** 화면 이름 → 컴포넌트 이름 (PascalCase) */
function toComponentName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9가-힣\s]/g, '')
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('') || 'Screen';
}

function toStyleKey(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
}

/** 컴포넌트 → JSX 생성 */
function genComponentJsx(comp: AppComponent, indent: string): string {
  const styleKey = toStyleKey(comp.name);
  switch (comp.type) {
    case 'button':
      return `${indent}<TouchableOpacity style={styles.${styleKey}} onPress={() => handle_${styleKey}()}>\n${indent}  <Text style={styles.${styleKey}_text}>${comp.props.label || comp.name}</Text>\n${indent}</TouchableOpacity>`;
    case 'text':
      return `${indent}<Text style={styles.${styleKey}}>${comp.props.content || comp.name}</Text>`;
    case 'input':
      return `${indent}<TextInput\n${indent}  style={styles.${styleKey}}\n${indent}  placeholder="${comp.props.placeholder || ''}"\n${indent}  value={state.${styleKey}}\n${indent}  onChangeText={(text) => setState(s => ({...s, ${styleKey}: text}))}\n${indent}/>`;
    case 'image':
      return `${indent}<Image source={{uri: '${comp.props.src || 'https://via.placeholder.com/150'}'}} style={styles.${styleKey}} />`;
    case 'container':
      return `${indent}<View style={styles.${styleKey}} />`;
    case 'icon':
      return `${indent}<Text style={styles.${styleKey}}>${comp.props.iconName || '★'}</Text>`;
    case 'list':
      return `${indent}<FlatList\n${indent}  data={[{id:'1',text:'항목 1'},{id:'2',text:'항목 2'},{id:'3',text:'항목 3'}]}\n${indent}  renderItem={({item}) => <Text style={{padding:12}}>{item.text}</Text>}\n${indent}  keyExtractor={item => item.id}\n${indent}  style={styles.${styleKey}}\n${indent}/>`;
    default:
      return `${indent}<View style={styles.${styleKey}}><Text>${comp.name}</Text></View>`;
  }
}

/** 블록 → 이벤트 핸들러 코드 생성 */
function genBlockHandler(comp: AppComponent, connections: CodegenConnection[], screens: Screen[]): string {
  const styleKey = toStyleKey(comp.name);
  const pressBlocks = comp.blocks.filter(b => b.trigger.type === 'onPress' && b.enabled);
  if (pressBlocks.length === 0) return `  const handle_${styleKey} = () => {};`;

  const lines: string[] = [];
  for (const block of pressBlocks) {
    switch (block.action) {
      case 'navigate': {
        const conn = connections.find(c => c.sourceBlockId === block.id);
        const targetName = conn?.targetScreenName || (block.params.screen as string) || 'Home';
        lines.push(`    navigation.navigate('${toComponentName(targetName)}');`);
        break;
      }
      case 'goBack':
        lines.push(`    navigation.goBack();`);
        break;
      case 'show':
      case 'hide':
      case 'toggle':
        lines.push(`    // ${block.action}: ${block.target}`);
        lines.push(`    setState(s => ({...s, ${toStyleKey(block.target)}_visible: ${block.action === 'show' ? 'true' : block.action === 'hide' ? 'false' : `!s.${toStyleKey(block.target)}_visible`}}));`);
        break;
      case 'setText':
        lines.push(`    setState(s => ({...s, ${toStyleKey(block.target)}_text: '${block.params.text || ''}'}));`);
        break;
      case 'openLink':
        lines.push(`    Linking.openURL('${block.params.url || ''}');`);
        break;
      default:
        lines.push(`    // ${block.action} (${block.target})`);
    }
  }

  return `  const handle_${styleKey} = () => {\n${lines.join('\n')}\n  };`;
}

/** 단일 화면 코드 생성 */
function generateScreenCode(screen: Screen, connections: CodegenConnection[], allScreens: Screen[]): string {
  const compName = toComponentName(screen.name);
  const hasNav = screen.components.some(c => c.blocks.some(b => ['navigate', 'goBack'].includes(b.action)));
  const hasInput = screen.components.some(c => c.type === 'input');
  const hasList = screen.components.some(c => c.type === 'list');
  const hasImage = screen.components.some(c => c.type === 'image');
  const hasLink = screen.components.some(c => c.blocks.some(b => b.action === 'openLink'));

  const imports = [
    `import React${hasInput ? ', { useState }' : ''} from 'react';`,
    `import { View, Text, StyleSheet, TouchableOpacity${hasInput ? ', TextInput' : ''}${hasList ? ', FlatList' : ''}${hasImage ? ', Image' : ''}${hasLink ? ', Linking' : ''} } from 'react-native';`,
  ];
  if (hasNav) imports.push(`import { useNavigation } from '@react-navigation/native';`);

  // State 초기화
  const stateInit: string[] = [];
  if (hasInput) {
    for (const c of screen.components.filter(c => c.type === 'input')) {
      stateInit.push(`${toStyleKey(c.name)}: ''`);
    }
  }

  // 핸들러
  const handlers = screen.components
    .filter(c => c.type === 'button' || c.blocks.some(b => b.trigger.type === 'onPress'))
    .map(c => genBlockHandler(c, connections, allScreens))
    .join('\n\n');

  // JSX
  const jsx = screen.components
    .map(c => genComponentJsx(c, '      '))
    .join('\n');

  // StyleSheet
  const styles: string[] = [`    container: { flex: 1, backgroundColor: '${screen.backgroundColor || '#FAFAFA'}' },`];
  for (const c of screen.components) {
    const key = toStyleKey(c.name);
    const s = c.style as Record<string, string>;
    const styleObj: string[] = [
      `position: 'absolute'`,
      `left: ${c.position.x}`,
      `top: ${c.position.y}`,
      `width: ${c.size.width}`,
      `height: ${c.size.height}`,
    ];
    if (s.backgroundColor) styleObj.push(`backgroundColor: '${s.backgroundColor}'`);
    if (s.color) styleObj.push(`color: '${s.color}'`);
    if (s.fontSize) styleObj.push(`fontSize: ${s.fontSize}`);
    if (s.fontWeight) styleObj.push(`fontWeight: '${s.fontWeight}'`);
    if (s.borderRadius) styleObj.push(`borderRadius: ${s.borderRadius}`);
    if (s.borderWidth) styleObj.push(`borderWidth: ${s.borderWidth}`);
    if (s.borderColor) styleObj.push(`borderColor: '${s.borderColor}'`);

    styles.push(`    ${key}: { ${styleObj.join(', ')} },`);
    if (c.type === 'button') {
      styles.push(`    ${key}_text: { color: '${s.color || '#ffffff'}', fontSize: 13, fontWeight: '600', textAlign: 'center' },`);
    }
  }

  return `${imports.join('\n')}

export function ${compName}Screen() {
${hasNav ? '  const navigation = useNavigation();' : ''}
${hasInput || stateInit.length > 0 ? `  const [state, setState] = useState({${stateInit.join(', ')}});` : ''}

${handlers}

  return (
    <View style={styles.container}>
${jsx}
    </View>
  );
}

const styles = StyleSheet.create({
${styles.join('\n')}
});
`;
}

/** 전체 앱 코드 생성 */
export function generateFullApp(
  screens: Screen[],
  connections: CodegenConnection[],
): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  // 각 화면별 파일
  for (const screen of screens) {
    const screenConns = connections.filter(c => {
      // 이 화면의 컴포넌트에 속한 블록의 연결만
      return screen.components.some(comp =>
        comp.blocks.some(b => b.id === c.sourceBlockId)
      );
    });
    const code = generateScreenCode(screen, screenConns, screens);
    files.push({
      path: `screens/${toComponentName(screen.name)}Screen.tsx`,
      content: code,
    });
  }

  // App.tsx (네비게이션 설정)
  const screenImports = screens.map(s =>
    `import { ${toComponentName(s.name)}Screen } from './screens/${toComponentName(s.name)}Screen';`
  ).join('\n');

  const stackScreens = screens.map(s =>
    `        <Stack.Screen name="${toComponentName(s.name)}" component={${toComponentName(s.name)}Screen} options={{ title: '${s.name}' }} />`
  ).join('\n');

  const firstScreen = screens[0] ? toComponentName(screens[0].name) : 'Home';

  files.push({
    path: 'App.tsx',
    content: `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
${screenImports}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="${firstScreen}">
${stackScreens}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
`,
  });

  // package.json
  files.push({
    path: 'package.json',
    content: JSON.stringify({
      name: 'vibe-app',
      version: '1.0.0',
      main: 'App.tsx',
      scripts: { start: 'expo start', android: 'expo start --android', ios: 'expo start --ios' },
      dependencies: {
        'expo': '~52.0.0',
        'react': '18.3.1',
        'react-native': '0.76.3',
        '@react-navigation/native': '^7.0.0',
        '@react-navigation/native-stack': '^7.0.0',
        'react-native-screens': '~4.4.0',
        'react-native-safe-area-context': '~5.0.0',
      },
    }, null, 2),
  });

  // app.json
  files.push({
    path: 'app.json',
    content: JSON.stringify({
      expo: {
        name: 'Vibe App',
        slug: 'vibe-app',
        version: '1.0.0',
        platforms: ['ios', 'android'],
      },
    }, null, 2),
  });

  return files;
}
