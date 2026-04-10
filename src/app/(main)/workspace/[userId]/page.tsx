import { WorkspaceViewClient } from './WorkspaceViewClient';

export default async function WorkspacePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return <WorkspaceViewClient userId={userId} />;
}
