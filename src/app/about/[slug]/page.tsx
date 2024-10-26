import { MDXRemote } from 'next-mdx-remote/rsc';
import getPostContent from '@/lib/helpers/get-post-content';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'src', 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  return filenames.map((filename) => ({
    slug: filename.replace('.mdx', ''),
  }));
}

export default async function Post({ params }: { params: Params }) {
  const { slug } = await params;

  const { content, frontMatter } = await getPostContent(slug);

  return (
    <div className='flex max-w-4xl w-full py-8 space-y-4 mx-auto flex-col items-start justify-start'>
      <Link
        href={'/'}
        className='flex items-center font-medium text-sm text-gray-800'
      >
        <ArrowLeft size={13} className='mr-1' />
        <span className='hover:underline'>Go Back</span>
      </Link>
      <article className='px-4 prose'>
        <h1>{frontMatter.title}</h1>
        <p className='text-sm text-gray-500'>
          {new Date(frontMatter.date).toLocaleDateString()}
        </p>
        <MDXRemote source={content} />
      </article>
    </div>
  );
}
