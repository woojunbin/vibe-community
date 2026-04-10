'use client';

import { useState, useEffect } from 'react';
import { X, Download, Copy, Check, FileCode, FolderTree } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { generateFullApp, type GeneratedFile } from '@/lib/codegen/generate-react';
import { Button } from '@/components/ui/Button';
import type { Screen, AppComponent } from '@/types/project';
import type { Connection } from '@/types/community';

export function CodeExportPanel({ onClose }: { onClose: () => void }) {
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generate() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: screenRows } = await supabase
        .from('screens')
        .select('*')
        .eq('owner_id', user.id);

      const { data: connRows } = await supabase
        .from('connections')
        .select('*');

      const screens: Screen[] = (screenRows ?? []).map(s => ({
        id: s.id,
        name: s.name,
        components: (s.components ?? []) as AppComponent[],
        canvasSize: { width: s.canvas_width, height: s.canvas_height },
        backgroundColor: s.background_color,
      }));

      const connections = ((connRows ?? []) as Connection[])
        .filter(c => c.source_block_id)
        .map(c => {
          const targetScreen = screens.find(s => s.id === c.target_screen_id);
          return {
            sourceBlockId: c.source_block_id!,
            targetScreenId: c.target_screen_id,
            targetScreenName: targetScreen?.name ?? 'Unknown',
          };
        });

      const generated = generateFullApp(screens, connections);
      setFiles(generated);
      if (generated.length > 0) setSelectedFile(generated[0].path);
      setLoading(false);
    }
    generate();
  }, []);

  const selectedContent = files.find(f => f.path === selectedFile)?.content ?? '';

  async function handleCopy() {
    await navigator.clipboard.writeText(selectedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleDownloadZip() {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    for (const f of files) {
      zip.file(f.path, f.content);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vibe-app.zip';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FileCode size={18} className="text-blue-600" />
            <h2 className="font-semibold text-gray-900">코드 내보내기</h2>
            <span className="text-xs text-gray-400 ml-2">React Native (Expo)</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" onClick={handleDownloadZip}>
              <Download size={14} className="mr-1" /> ZIP 다운로드
            </Button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            코드 생성 중...
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* 파일 트리 */}
            <div className="w-56 border-r border-gray-200 overflow-y-auto p-3">
              <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-500 uppercase">
                <FolderTree size={12} /> 파일
              </div>
              <div className="mt-1 space-y-0.5">
                {files.map(f => (
                  <button
                    key={f.path}
                    onClick={() => setSelectedFile(f.path)}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs truncate transition-colors
                      ${selectedFile === f.path ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {f.path}
                  </button>
                ))}
              </div>
            </div>

            {/* 코드 뷰어 */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
                <span className="text-xs text-gray-600 font-mono">{selectedFile}</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                >
                  {copied ? <><Check size={12} /> 복사됨</> : <><Copy size={12} /> 복사</>}
                </button>
              </div>
              <pre className="flex-1 overflow-auto p-4 text-xs font-mono text-gray-800 bg-gray-50 leading-relaxed whitespace-pre-wrap">
                {selectedContent}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
