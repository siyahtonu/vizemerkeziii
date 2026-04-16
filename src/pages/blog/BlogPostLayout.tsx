import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Calendar, ChevronRight } from 'lucide-react';
import { SEO } from '../../components/SEO';
import Footer from '../../components/Footer';
import { BlogPost, BLOG_POSTS } from './BlogIndex';

interface BlogPostLayoutProps {
  post: BlogPost;
  schema: object;
  children: React.ReactNode;
}

const CATEGORY_COLORS: Record<string, string> = {
  Schengen:  'bg-blue-100 text-blue-700',
  'ABD':     'bg-red-100 text-red-700',
  Almanya:   'bg-yellow-100 text-yellow-800',
  İngiltere: 'bg-purple-100 text-purple-700',
  Dubai:     'bg-amber-100 text-amber-700',
  Genel:     'bg-slate-100 text-slate-700',
  İpucu:     'bg-emerald-100 text-emerald-700',
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'bg-violet-100 text-violet-700';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function BlogPostLayout({ post, schema, children }: BlogPostLayoutProps) {
  // İlgili yazılar (aynı kategori, bu yazı hariç, max 3)
  const related = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.category === post.category,
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title={post.title}
        description={post.description}
        canonical={`/blog/${post.slug}`}
        schema={schema}
      />

      {/* ── Navigasyon ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-slate-800 transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/blog" className="hover:text-slate-800 transition-colors">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-medium truncate max-w-xs">{post.title}</span>
        </div>
      </div>

      {/* ── Makale header ── */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${categoryColor(post.category)}`}>
              <Tag className="w-3 h-3" />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime} dakika okuma
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">{post.description}</p>
        </div>
      </header>

      {/* ── İçerik ── */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="prose-custom">
          {children}
        </div>

        {/* ── İlgili yazılar ── */}
        {related.length > 0 && (
          <aside className="mt-16 pt-10 border-t border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-5">İlgili Yazılar</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  className="group bg-white rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all p-4 flex flex-col"
                >
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full self-start mb-2 ${categoryColor(p.category)}`}>
                    {p.category}
                  </span>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-700 transition-colors leading-snug">
                    {p.title}
                  </p>
                </Link>
              ))}
            </div>
          </aside>
        )}

        {/* ── Geri dön ── */}
        <div className="mt-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-800 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tüm yazılara dön
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
