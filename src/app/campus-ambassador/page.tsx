import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Campus Ambassador Program | Myark',
  description: 'Join the Myark Campus Ambassador Program and lead your school.',
};

export default function CampusAmbassadorPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <div className="pt-24 pb-20 border-b border-default bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-bg to-bg relative overflow-hidden text-center">
        <div className="container-main relative z-10 max-w-4xl">
          <span className="inline-block py-1.5 px-3 rounded-md bg-blue-500/10 text-blue-600 font-bold text-[12px] uppercase tracking-wider mb-6">
            Student Leadership
          </span>
          <h1 className="text-display mb-6 leading-tight">Become a Myark Campus Ambassador.</h1>
          <p className="text-body text-[18px] text-muted mb-10 max-w-2xl mx-auto">
            Lead the most powerful opportunity network right from your school. Gain exclusive leadership experience, mentorship, and certifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#apply" className="btn bg-blue-600 text-white hover:bg-blue-700 px-8 py-3.5 rounded-xl font-bold text-[15px] shadow-lg">
              Apply for 2026 Cohort
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits Content */}
      <div className="container-main py-24 max-w-3xl">
        <div className="prose prose-invert max-w-none text-[16px] leading-relaxed text-body">
          <h2 className="text-3xl font-extrabold text-heading mb-6 tracking-tight">Who We&apos;re Looking For</h2>
          <p className="mb-8 font-medium">
            We are selecting one driven student from every major school across India to represent Myark locally. 
            If you are in classes 9-12, heavily involved in extracurriculars, and passionate about helping your peers succeed, this program is designed for you.
          </p>
          
          <div className="w-full h-px bg-default my-12"></div>
          
          <h2 className="text-3xl font-extrabold text-heading mb-6 tracking-tight">The Three Tiers of Leadership</h2>
          <p className="mb-10 font-medium">
            Our program is designed to give you continuous room to grow. As you drive more impact, you unlock higher tiers of recognition and exclusive perks.
          </p>

          <div className="space-y-6 mb-12">
            
            {/* Tier 1 */}
            <div className="bg-surface border border-default p-6 lg:p-8 rounded-[20px] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-400"></div>
              <h3 className="text-2xl font-black text-heading mb-2">⭐ Tier 1: Myark Scout</h3>
              <p className="text-muted text-[15px] mb-4"><strong>Milestone:</strong> Just joined. Shared their first listing and submitted their first unlisted opportunity to our database.</p>
              <h4 className="font-bold text-[13px] uppercase tracking-wider text-blue-500 mb-2">Rewards</h4>
              <ul className="text-[14px] text-body space-y-1">
                <li>• Digital Welcome Kit & onboarding guide</li>
                <li>• Official &quot;Scout&quot; Certificate</li>
                <li>• Verified Scout badge on your Myark Student Profile</li>
              </ul>
            </div>

            {/* Tier 2 */}
            <div className="bg-surface border border-default p-6 lg:p-8 rounded-[20px] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-purple-500"></div>
              <h3 className="text-2xl font-black text-heading mb-2">🏆 Tier 2: Myark Champion</h3>
              <p className="text-muted text-[15px] mb-4"><strong>Milestone:</strong> Active for 3+ months. Referred 10+ registered students and submitted 5+ new verified opportunities.</p>
              <h4 className="font-bold text-[13px] uppercase tracking-wider text-purple-500 mb-2">Rewards</h4>
              <ul className="text-[14px] text-body space-y-1">
                <li>• Physical Certificate signed by the founder</li>
                <li>• Personalized LinkedIn Recommendation written by the founder</li>
                <li>• Official &quot;Champion&quot; badge on your Myark Student Profile</li>
              </ul>
            </div>

            {/* Tier 3 */}
            <div className="bg-surface border border-default p-6 lg:p-8 rounded-[20px] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
              <h3 className="text-2xl font-black text-heading mb-2">👑 Tier 3: Myark Captain</h3>
              <p className="text-muted text-[15px] mb-4"><strong>Milestone:</strong> City-level leader. Manages a small network of Scouts in their area and directly brought 2+ schools onto the platform.</p>
              <h4 className="font-bold text-[13px] uppercase tracking-wider text-orange-500 mb-2">Rewards</h4>
              <ul className="text-[14px] text-body space-y-1">
                <li>• Personal Reference Letter from the founder for college apps</li>
                <li>• Featured interview/spotlight on the Myark Blog</li>
                <li>• Early beta access to all new Myark platform features</li>
              </ul>
            </div>

          </div>
          
          <div id="apply" className="bg-surface border border-blue-500/20 p-8 rounded-[24px] text-center mt-12 shadow-[0_0_40px_rgba(59,130,246,0.05)]">
            <h3 className="text-2xl font-extrabold text-heading mb-3">Applications open next month</h3>
            <p className="text-muted text-[15px] mb-6 max-w-md mx-auto">
              Our 2026 cohort is currently finalizing its curriculum. Drop your email below to get the application link 24 hours before public release.
            </p>
            <div className="flex max-w-sm mx-auto gap-2">
              <input type="email" placeholder="Your School Email" className="flex-1 bg-bg border border-default rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors text-heading" />
              <button className="bg-blue-600 text-white font-bold rounded-xl px-4 py-3 hover:bg-blue-700 transition">Notify Me</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
