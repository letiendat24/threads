import type { Metadata } from "next";

import { PostDetailView } from "@/features/posts/components/post-detail-view";

interface PostDetailPageProps {
  params: Promise<{
    postId: string;
  }>;
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { postId } = await params;

  return {
    title: "Post",
    description: "View a post and its replies on Soi chi city.",
    alternates: {
      canonical: `/post/${postId}`,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { postId } = await params;

  return <PostDetailView postId={decodeURIComponent(postId)} />;
}
