import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostsPage, getTotalPages } from '@/lib/blog';
import { BlogCard } from '@/components/blog/BlogCard';
import { Pagination } from '@/components/blog/Pagination';

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://scalesystems.dev';

export async function generateStaticParams() {
  const total = getTotalPages();
  return Array.from({ length: total - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  const pageNum = Number(page);
  return {
    title: `Blog — Página ${pageNum} | IA y Automatización para Empresas en Venezuela`,
    description: `Página ${pageNum} del blog de Scale Systems: guías, casos de uso y reflexiones sobre IA y automatización para empresas en Venezuela.`,
    alternates: { canonical: `/blog/page/${pageNum}` },
  };
}

export default async function BlogPagePage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const pageNum = Number(page);
  if (!Number.isInteger(pageNum) || pageNum < 2) { notFound(); }

  const { posts, totalPages } = getPostsPage(pageNum);
  if (pageNum > totalPages) { notFound(); }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: `Página ${pageNum}` },
    ],
  };

  return (
    <section className="min-h-screen bg-[#171810] pt-32 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="mb-12 sm:mb-16">
          <p className="text-[#03fa6e] font-mono text-sm tracking-widest uppercase mb-3">
            Blog — Página {pageNum}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            IA y Automatización{' '}
            <span className="text-[#a1a1aa]">para Empresas</span>
          </h1>
          <p className="text-[#a1a1aa] text-base sm:text-lg mt-4 max-w-2xl leading-relaxed">
            Guías, casos de uso y reflexiones sobre cómo la inteligencia artificial
            y la automatización están transformando el tejido empresarial en Venezuela.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        <Pagination current={pageNum} total={totalPages} />
      </div>
    </section>
  );
}
