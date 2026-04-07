'use client';

export function GlobalShareButton() {
  const handleShare = () => {
    const text = `🚀 *Unlock Your Potential with Myark!*\n\nI’ve been using Myark to discover verified scholarships, olympiads, and career roadmaps for students. It’s a game-changer for academic excellence!\n\nCheck it out here: https://myark.in\n\n✨ *Make your mark today!*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <button 
      onClick={handleShare}
      className="inline-flex items-center justify-center h-16 px-12 rounded-[20px] bg-white/[0.04] border border-white/[0.1] text-[#f0ede5] font-bold text-[17px] hover:bg-white/[0.08] transition-all backdrop-blur-md active:scale-95"
    >
      Share on WhatsApp
    </button>
  );
}
