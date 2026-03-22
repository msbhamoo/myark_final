import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us | Myark',
  description: 'Get in touch with the Myark support team.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Header */}
      <div className="pt-24 pb-16 border-b border-default bg-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-bg to-bg opacity-70"></div>
        <div className="container-main relative z-10 text-center max-w-2xl">
          <h1 className="text-display mb-6">Let&apos;s talk.</h1>
          <p className="text-body text-[16px] text-muted">
            Whether you have a question about a scholarship, need help as a school administrator, or want to list your competition, our team is here to help.
          </p>
        </div>
      </div>

      <div className="container-main py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Contact Form Structure */}
          <div className="bg-surface border border-default p-8 sm:p-10 rounded-[28px] shadow-2xl">
            <h3 className="text-h2 text-heading mb-6">Send a Message</h3>
            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[12px] font-bold text-heading mb-2 ml-1">First Name</label>
                  <input type="text" className="w-full bg-[#f4f4f5] dark:bg-white/5 border border-transparent rounded-[14px] px-4 py-3 outline-none focus:border-primary focus:bg-white dark:focus:bg-black/50 transition-all text-heading placeholder-muted" placeholder="Elon" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-heading mb-2 ml-1">Last Name</label>
                  <input type="text" className="w-full bg-[#f4f4f5] dark:bg-white/5 border border-transparent rounded-[14px] px-4 py-3 outline-none focus:border-primary focus:bg-white dark:focus:bg-black/50 transition-all text-heading placeholder-muted" placeholder="Musk" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-heading mb-2 ml-1">Email Address</label>
                <input type="email" className="w-full bg-[#f4f4f5] dark:bg-white/5 border border-transparent rounded-[14px] px-4 py-3 outline-none focus:border-primary focus:bg-white dark:focus:bg-black/50 transition-all text-heading placeholder-muted" placeholder="elon@spacex.com" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-heading mb-2 ml-1">How can we help?</label>
                <textarea rows={4} className="w-full bg-[#f4f4f5] dark:bg-white/5 border border-transparent rounded-[14px] px-4 py-3 outline-none focus:border-primary focus:bg-white dark:focus:bg-black/50 transition-all text-heading placeholder-muted resize-none" placeholder="Write your message here..."></textarea>
              </div>
              <div className="pt-2">
                <button type="submit" disabled className="w-full btn-primary font-bold rounded-[14px] py-4 shadow-sm opacity-50 cursor-not-allowed">
                  Send Message
                </button>
                <p className="text-[11px] text-center text-muted mt-3">Form is currently in beta mode. Please email us directly.</p>
              </div>
            </form>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col justify-center space-y-12">
            <div>
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <h4 className="text-[18px] font-bold text-heading mb-2">Email Us</h4>
              <p className="text-[15px] text-muted leading-relaxed mb-3">Generally the fastest way to get a response. We try our best to reply within 24 hours.</p>
              <a href="mailto:support@myark.in" className="text-primary font-bold hover:underline">support@myark.in</a>
            </div>

            <div>
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <h4 className="text-[18px] font-bold text-heading mb-2">Visit Us</h4>
              <p className="text-[15px] text-muted leading-relaxed mb-3">If you are in the area or attending an event, you can find our headquarters here.</p>
              <address className="text-heading font-medium not-italic">
                Myark Education Campus<br />
                New Delhi, DL 110001<br />
                India
              </address>
            </div>
            
            <div className="pt-8 border-t border-default">
               <h4 className="text-[14px] font-bold text-heading mb-4 uppercase tracking-wider">Social Support</h4>
               <div className="flex gap-4">
                  <Link href="#" className="w-10 h-10 rounded-full bg-surface border border-default flex items-center justify-center text-muted hover:text-heading hover:bg-bg transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </Link>
                  <Link href="#" className="w-10 h-10 rounded-full bg-surface border border-default flex items-center justify-center text-muted hover:text-heading hover:bg-bg transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </Link>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
