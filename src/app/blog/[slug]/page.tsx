import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import type { Metadata } from 'next';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import type { Components } from 'react-markdown';

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://scalesystems.dev';

const markdownComponents: Components = {
  h1: ({ children, ...props }) => (
    <h1 className="text-3xl sm:text-4xl font-bold text-white mt-12 mb-6 leading-tight" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-2xl sm:text-3xl font-bold text-white mt-10 mb-4 leading-tight border-b border-[#2a2c1f] pb-3" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-xl sm:text-2xl font-semibold text-white mt-8 mb-3 leading-tight" {...props}>{children}</h3>
  ),
  p: ({ children, ...props }) => (
    <p className="text-[#a1a1aa] text-base sm:text-lg leading-relaxed mb-5" {...props}>{children}</p>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-bold text-white" {...props}>{children}</strong>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside text-[#a1a1aa] text-base sm:text-lg leading-relaxed mb-5 space-y-2" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside text-[#a1a1aa] text-base sm:text-lg leading-relaxed mb-5 space-y-2" {...props}>{children}</ol>
  ),
  li: ({ children, ...props }) => (
    <li className="text-[#a1a1aa]" {...props}>{children}</li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-[#03fa6e] bg-[#03fa6e]/5 pl-5 py-3 pr-4 my-6 rounded-r-lg text-[#e4e4e7] italic" {...props}>{children}</blockquote>
  ),
  code: ({ children, ...props }) => {
    const { className, ...rest } = props;
    const isInline = !className;
    if (isInline) {
      return <code className="bg-[#2a2c24] text-[#03fa6e] px-1.5 py-0.5 rounded text-sm font-mono" {...rest}>{children}</code>;
    }
    return (
      <pre className="bg-[#1f2017] border border-[#2a2c1f] rounded-xl p-4 sm:p-6 my-6 overflow-x-auto">
        <code className="text-sm text-[#e4e4e7] font-mono leading-relaxed" {...rest}>{children}</code>
      </pre>
    );
  },
  a: ({ children, href, ...props }) => {
    const isExternal = href?.startsWith('http');
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="text-[#03fa6e] hover:text-[#02d65e] underline underline-offset-2 transition-colors"
        {...props}
      >
        {children}
      </a>
    );
  },
  hr: (props) => <hr className="border-[#2a2c1f] my-10" {...props} />,
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse text-sm sm:text-base" {...props}>{children}</table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th className="border border-[#2a2c1f] bg-[#1f2017] text-white font-semibold px-4 py-3 text-left" {...props}>{children}</th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-[#2a2c1f] px-4 py-3 text-[#a1a1aa]" {...props}>{children}</td>
  ),
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      tags: post.tags,
      images: post.ogImage ? [{url: post.ogImage}] : [],
    },
    alternates: {canonical: `/blog/${post.slug}`},
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="min-h-screen bg-[#171810] pt-32 pb-20">
      <article className="max-w-3xl mx-auto px-5 sm:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Inicio',
                  item: SITE_URL,
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Blog',
                  item: `${SITE_URL}/blog`,
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: post.title,
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              description: post.description,
              datePublished: post.date,
              author: {
                '@type': 'Organization',
                name: 'Scale Systems',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Scale Systems',
              },
            }),
          }}
        />
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#a1a1aa] hover:text-[#03fa6e] transition-colors mb-8 text-sm font-mono"
        >
          <ArrowLeft size={16} />
          Volver al blog
        </Link>

        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="text-[11px] font-mono text-[#03fa6e] bg-[#03fa6e]/10 px-2.5 py-1 rounded-full border border-[#03fa6e]/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {post.featuredImage && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-8 border border-[#2a2c1f]">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 768px"
              priority
            />
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
          {post.title}
        </h1>

        <p className="text-[#a1a1aa] text-base sm:text-lg mb-6 leading-relaxed">
          {post.description}
        </p>

        <div className="flex items-center gap-4 text-xs sm:text-sm text-[#63635d] font-mono pb-8 border-b border-[#2a2c1f] mb-8">
          <span>{post.date}</span>
          <span className="w-1 h-1 rounded-full bg-[#2a2c1f]" />
          <span>{post.readingTime}</span>
        </div>

        <div className="prose-custom">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSlug]} components={markdownComponents}>
            {post.content}
          </ReactMarkdown>
        </div>

        {post.relatedService && (
          <div className="mt-16 pt-8 border-t border-[#2a2c1f]">
            <p className="text-[#63635d] text-sm font-mono uppercase tracking-wider mb-4">
              Servicio relacionado
            </p>
            <Link
              href={`/servicio/${post.relatedService}`}
              className="group block bg-[#1f2017] border border-[#2a2c1f] rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:border-[#03fa6e]/30 hover:shadow-[0_0_30px_rgba(3,250,110,0.05)]"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#03fa6e] transition-colors duration-300 mb-2">
                {post.relatedService === 'chatbots' && 'AI Chatbots'}
                {post.relatedService === 'diseno-web' && 'Diseño Web Vanguardista'}
                {post.relatedService === 'automatizacion' && 'Automatización Pro'}
              </h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">
                {post.relatedService === 'chatbots' &&
                  'Entrenamos agentes de IA para responder dudas, agendar citas y cerrar ventas 24/7.'}
                {post.relatedService === 'diseno-web' &&
                  'Creamos sitios web ultrarrápidos, con diseño premium y enfocados en conversiones.'}
                {post.relatedService === 'automatizacion' &&
                  'Conectamos tus herramientas para que trabajen de forma sincronizada y sin intervención humana.'}
              </p>
              <span className="inline-flex items-center gap-1 text-[#03fa6e] text-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                Ver servicio →
              </span>
            </Link>
          </div>
        )}
      </article>
    </section>
  );
}
