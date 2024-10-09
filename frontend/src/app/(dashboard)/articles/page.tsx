import ArticleTable from '@/components/article-table';
import { Article } from '@/types';

export default async function ArticlesPage() {
  const articles: Article[] = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles`,
    { cache: 'no-cache' },
  )
    .then((res) => res.json())
    .catch(console.error);

  return <ArticleTable data={articles} />;
}

export const dynamic = 'force-dynamic';
