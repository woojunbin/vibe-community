import { ScreenDetailClient } from './ScreenDetailClient';

export default async function ScreenDetailPage({ params }: { params: Promise<{ screenId: string }> }) {
  const { screenId } = await params;
  return <ScreenDetailClient screenId={screenId} />;
}
