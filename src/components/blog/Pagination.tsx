import Link from 'next/link';

export function Pagination({ current, total }: { current: number; total: number }) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav aria-label="Paginación del blog" className="flex items-center justify-center gap-2 mt-16">
      {current > 1 && (
        <Link
          href={current === 2 ? '/blog' : `/blog/page/${current - 1}`}
          className="px-4 py-2 text-sm font-mono text-[#a1a1aa] border border-[#2a2c1f] rounded-lg hover:border-[#03fa6e]/30 hover:text-[#03fa6e] transition-colors"
        >
          ← Anterior
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={p === 1 ? '/blog' : `/blog/page/${p}`}
          className={`w-10 h-10 flex items-center justify-center text-sm font-mono rounded-lg border transition-colors ${
            p === current
              ? 'bg-[#03fa6e]/10 border-[#03fa6e]/30 text-[#03fa6e]'
              : 'border-[#2a2c1f] text-[#a1a1aa] hover:border-[#03fa6e]/30 hover:text-[#03fa6e]'
          }`}
        >
          {p}
        </Link>
      ))}
      {current < total && (
        <Link
          href={`/blog/page/${current + 1}`}
          className="px-4 py-2 text-sm font-mono text-[#a1a1aa] border border-[#2a2c1f] rounded-lg hover:border-[#03fa6e]/30 hover:text-[#03fa6e] transition-colors"
        >
          Siguiente →
        </Link>
      )}
    </nav>
  );
}
