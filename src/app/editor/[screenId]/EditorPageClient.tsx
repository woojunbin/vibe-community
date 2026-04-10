'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe, GlobeLock, Play, Pencil } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { PageEditor } from '@/components/editor/PageEditor';
import { PreviewFrame } from '@/components/preview/PreviewFrame';
import { usePreview } from '@/lib/preview/use-preview';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import type { Screen, AppComponent } from '@/types/project';
import type { Connection } from '@/types/community';

export function EditorPageClient({ screenId }: { screenId: string }) {
  const router = useRouter();
  const loadScreen = useEditorStore((s) => s.loadScreen);
  const screen = useEditorStore((s) => s.screen);
  const isDirty = useEditorStore((s) => s.isDirty);
  const markClean = useEditorStore((s) => s.markClean);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [allScreens, setAllScreens] = useState<Screen[]>([]);
  const [blockConnections, setBlockConnections] = useState<{ sourceBlockId: string; targetScreenId: string; targetBlockId?: string }[]>([]);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: row, error } = await supabase
        .from('screens')
        .select('*')
        .eq('id', screenId)
        .single();
      if (error || !row) { router.push('/editor'); return; }

      const editorScreen: Screen = {
        id: row.id,
        name: row.name,
        components: (row.components ?? []) as AppComponent[],
        canvasSize: { width: row.canvas_width, height: row.canvas_height },
        backgroundColor: row.background_color,
      };
      loadScreen(editorScreen);
      setPublished(row.is_published);

      // 연결된 화면들 + 블록 연결 정보 로드 (프리뷰용)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: myScreens } = await supabase
          .from('screens')
          .select('*')
          .eq('owner_id', user.id);
        if (myScreens) {
          setAllScreens(myScreens.map(s => ({
            id: s.id,
            name: s.name,
            components: (s.components ?? []) as AppComponent[],
            canvasSize: { width: s.canvas_width, height: s.canvas_height },
            backgroundColor: s.background_color,
          })));
        }

        const { data: conns } = await supabase
          .from('connections')
          .select('*');
        if (conns) {
          setBlockConnections(
            (conns as Connection[])
              .filter(c => c.source_block_id)
              .map(c => ({
                sourceBlockId: c.source_block_id!,
                targetScreenId: c.target_screen_id,
                targetBlockId: c.target_block_id ?? undefined,
              }))
          );
        }
      }

      setLoaded(true);
    }
    load();
  }, [screenId, loadScreen, router]);

  // 자동 저장
  useEffect(() => {
    if (!isDirty || !screen) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const supabase = createClient();
      await supabase
        .from('screens')
        .update({
          name: screen.name,
          components: screen.components as unknown as Record<string, unknown>[],
          canvas_width: screen.canvasSize?.width ?? 375,
          canvas_height: screen.canvasSize?.height ?? 812,
          background_color: screen.backgroundColor ?? '#FAFAFA',
          updated_at: new Date().toISOString(),
        })
        .eq('id', screenId);
      markClean();
    }, 1500);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [isDirty, screen, screenId, markClean]);

  const handleTogglePublish = useCallback(async () => {
    setPublishing(true);
    const supabase = createClient();
    const newPublished = !published;
    await supabase
      .from('screens')
      .update({
        is_published: newPublished,
        published_at: newPublished ? new Date().toISOString() : null,
      })
      .eq('id', screenId);
    setPublished(newPublished);
    setPublishing(false);
  }, [published, screenId]);

  // 프리뷰 모드일 때 최신 screen 상태 반영
  const previewScreens = isPreview && screen
    ? allScreens.map(s => s.id === screenId ? screen : s)
    : allScreens;

  const preview = usePreview(previewScreens, blockConnections, screenId);

  if (!loaded) return <div className="h-screen flex items-center justify-center text-gray-400">로딩 중...</div>;

  return (
    <div className="h-screen flex flex-col">
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shrink-0">
        <button onClick={() => router.push('/editor')} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-medium text-gray-900 text-sm truncate">{screen?.name ?? ''}</h2>

        {/* 프리뷰 토글 */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5 ml-2">
          <button
            onClick={() => setIsPreview(false)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1
              ${!isPreview ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            <Pencil size={12} /> 편집
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1
              ${isPreview ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            <Play size={12} /> 프리뷰
          </button>
        </div>

        {isPreview && (
          <span className="text-[11px] text-gray-400">
            {preview.currentScreen?.name ?? ''}
            {preview.screenHistory.length > 1 && ` (${preview.screenHistory.length - 1}단계)`}
          </span>
        )}

        <div className="flex-1" />
        <Button
          variant={published ? 'secondary' : 'primary'}
          size="sm"
          onClick={handleTogglePublish}
          loading={publishing}
        >
          {published ? <><GlobeLock size={14} className="mr-1" /> 비공개로</> : <><Globe size={14} className="mr-1" /> 퍼블리시</>}
        </Button>
      </header>

      <div className="flex-1 overflow-hidden">
        {isPreview ? (
          <div className="h-full bg-gray-100 flex items-center justify-center p-8">
            {preview.currentScreen ? (
              <PreviewFrame
                screen={preview.currentScreen}
                componentStates={preview.componentStates}
                onTrigger={preview.trigger}
              />
            ) : (
              <p className="text-gray-400">화면을 찾을 수 없습니다</p>
            )}
          </div>
        ) : (
          <PageEditor screenId={screenId} screenNames={allScreens.map(s => s.name)} />
        )}
      </div>

      {isDirty && !isPreview && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-full">
          저장 중...
        </div>
      )}
    </div>
  );
}
