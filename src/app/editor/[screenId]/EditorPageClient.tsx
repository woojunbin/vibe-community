'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe, GlobeLock } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { PageEditor } from '@/components/editor/PageEditor';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import type { Screen, AppComponent } from '@/types/project';

export function EditorPageClient({ screenId }: { screenId: string }) {
  const router = useRouter();
  const loadScreen = useEditorStore((s) => s.loadScreen);
  const screen = useEditorStore((s) => s.screen);
  const isDirty = useEditorStore((s) => s.isDirty);
  const markClean = useEditorStore((s) => s.markClean);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [loaded, setLoaded] = useState(false);
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

      setLoaded(true);
    }
    load();
  }, [screenId, loadScreen, router]);

  // 자동 저장 (debounce 1.5초)
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

  if (!loaded) return <div className="h-screen flex items-center justify-center text-gray-400">로딩 중...</div>;

  return (
    <div className="h-screen flex flex-col">
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shrink-0">
        <button onClick={() => router.push('/editor')} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-medium text-gray-900 text-sm truncate">{screen?.name ?? ''}</h2>
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
        <PageEditor screenId={screenId} />
      </div>
      {isDirty && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-full">
          저장 중...
        </div>
      )}
    </div>
  );
}
