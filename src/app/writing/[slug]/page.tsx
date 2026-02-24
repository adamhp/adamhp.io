export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: Post } = await import(`@/content/${slug}.mdx`);

  return (
    <article className='prose lg:prose-xl'>
      <Post />
    </article>
  );
}

export function generateStaticParams() {
  return [{ slug: 'decisions' }];
}

export const dynamicParams = false;
