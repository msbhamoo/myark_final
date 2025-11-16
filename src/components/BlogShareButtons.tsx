'use client';

export function ShareButtons({ slug, title }: { slug: string; title: string }) {
  async function share(network: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'other') {
    try {
      await fetch(`/api/blogs/${slug}/share`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ network }) })
      const url = typeof window !== 'undefined' ? window.location.href : ''
      const text = encodeURIComponent(title)
      const shareUrl = encodeURIComponent(url)
      const map: Record<string, string> = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${text}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
        whatsapp: `https://api.whatsapp.com/send?text=${text}%20${shareUrl}`,
        other: url,
      }
      window.open(map[network], '_blank')
    } catch {}
  }
  return (
    <div className="flex gap-2">
      <button className="px-3 py-2 border rounded" onClick={() => share('facebook')}>Facebook</button>
      <button className="px-3 py-2 border rounded" onClick={() => share('twitter')}>Twitter</button>
      <button className="px-3 py-2 border rounded" onClick={() => share('linkedin')}>LinkedIn</button>
      <button className="px-3 py-2 border rounded" onClick={() => share('whatsapp')}>WhatsApp</button>
    </div>
  )
}
