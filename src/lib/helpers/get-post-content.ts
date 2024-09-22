import fs from 'fs';
import path from 'path';
import { FrontMatter } from '@/lib/types';
import matter from 'gray-matter';

export default async function getPostContent(
  slug: string
): Promise<{ content: string; frontMatter: FrontMatter }> {
  const postsDirectory = path.join(process.cwd(), 'src', 'posts');
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readDocumentSync(filePath, 'utf8');

  const { content, data } = matter(fileContents);

  return {
    content,
    frontMatter: data as FrontMatter,
  };
}
