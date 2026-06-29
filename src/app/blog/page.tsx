import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import { BlogCard } from '@/components/blog/BlogCard';

export const metadata: Metadata = {
  title: 'Blog — IA y Automatización para Empresas en Venezuela',
  description:
    'Guías, casos de uso y reflexiones sobre cómo la inteligencia artificial y la automatización están transformando el tejido empresarial en Venezuela.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog — IA y Automatización para Empresas en Venezuela',
    description:
      'Guías, casos de uso y reflexiones sobre cómo la inteligencia artificial y la automatización están transformando el tejido empresarial en Venezuela.',
    url: '/blog',
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <section className="min-h-screen bg-[#171810] pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="mb-12 sm:mb-16">
          <p className="text-[#03fa6e] font-mono text-sm tracking-widest uppercase mb-3">
            Blog
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

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#63635d] text-lg">No hay artículos aún. Vuelve pronto.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
