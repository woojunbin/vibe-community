import { EditorPageClient } from './EditorPageClient';

export default async function ScreenEditorPage({ params }: { params: Promise<{ screenId: string }> }) {
  const { screenId } = await params;
  return <EditorPageClient screenId={screenId} />;
}
