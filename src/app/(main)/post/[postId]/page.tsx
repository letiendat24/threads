import { PostDetailView } from "@/features/posts/components/post-detail-view";

interface PostDetailPageProps {
  params: Promise<{
    postId: string;
  }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { postId } = await params;

  return <PostDetailView postId={decodeURIComponent(postId)} />;
}
