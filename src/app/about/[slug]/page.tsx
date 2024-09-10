import { MDXRemote } from "next-mdx-remote/rsc";
import getPostContent from "@/lib/helpers/get-post-content";
import fs from "fs";
import path from "path";

interface PostProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "src", "posts");
  const filenames = fs.readdirSync(postsDirectory);

  return filenames.map((filename) => ({
    slug: filename.replace(".mdx", ""),
  }));
}

export default async function Post({ params }: PostProps) {
  const { content, frontMatter } = await getPostContent(params.slug);

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-8 prose">
        <h1>{frontMatter.title}</h1>
        <p className="text-sm text-gray-500">
          {new Date(frontMatter.date).toLocaleDateString()}
        </p>
        <MDXRemote source={content} />
      </div>
    </>
  );
}
