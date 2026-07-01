import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/blog';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-[#1f2017] border border-[#2a2c1f] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#03fa6e]/30 hover:shadow-[0_0_30px_rgba(3,250,110,0.05)]"
    >
      {post.thumbnail && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="text-[11px] font-mono text-[#03fa6e] bg-[#03fa6e]/10 px-2.5 py-1 rounded-full border border-[#03fa6e]/20"
          >
            {tag}
          </span>
        ))}
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#03fa6e] transition-colors duration-300 mb-3 leading-tight">
        {post.title}
      </h2>

      <p className="text-[#a1a1aa] text-sm leading-relaxed mb-4 line-clamp-3">
        {post.description}
      </p>

      <div className="flex items-center gap-4 text-xs text-[#63635d] font-mono">
        <span>{post.date}</span>
        <span className="w-1 h-1 rounded-full bg-[#2a2c1f]" />
        <span>{post.readingTime}</span>
      </div>
      </div>
    </Link>
  );
}
