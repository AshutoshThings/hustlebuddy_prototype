import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const FadeIn = ({ children, delay = 0, className = "" }: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const WaveIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
    <path d="M2 12h4l3-9 5 18 3-9h5"/>
  </svg>
);

const NodeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v7 M12 15v7 M2 12h7 M15 12h7" strokeLinecap="round"/>
    <circle cx="12" cy="2" r="1"/><circle cx="12" cy="22" r="1"/><circle cx="2" cy="12" r="1"/><circle cx="22" cy="12" r="1"/>
  </svg>
);

const FlashIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

export default function Landing() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const yParallax = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const indicatorOpacity = useTransform(heroScroll, [0, 0.2], [1, 0]);

  const flowSteps = [
    { num: "01", title: "Build Profile", desc: "Skills, projects & portfolio in 60 seconds" },
    { num: "02", title: "Smart Discovery", desc: "All opportunities from 8+ platforms in one feed" },
    { num: "03", title: "Sarvam Magic", desc: "Personalized proposals generated instantly" },
    { num: "04", title: "1-Click Apply", desc: "Apply directly + track everything in real time" },
    { num: "05", title: "Win & Scale", desc: "Community Vault boosts your win rate" }
  ];

  return (
    <div className="bg-[#030303] text-white font-sans min-h-screen overflow-x-hidden">
      
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-white/20 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      <section ref={heroRef} className="relative h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030303]/0 to-transparent blur-3xl pointer-events-none" />
        
        <nav className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-20">
          <div className="text-2xl font-semibold tracking-[-0.05em] text-white/90">HustleBuddy</div>
          <button 
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 text-xs font-semibold tracking-wide uppercase border border-white/10 hover:bg-white/5 rounded-full transition-all text-white/80"
          >
            Sign In
          </button>
        </nav>

        <div className="z-10 max-w-6xl mt-12">
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.2 }}
            className="text-[4.5rem] md:text-[9vw] font-medium tracking-[-0.04em] leading-[0.9] mb-8 text-white/90"
          >
            Stop applying<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-[#555]">
              manually.
            </span>
          </motion.h1>


          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl text-slate-500 max-w-3xl leading-relaxed font-light"
          >
            We automated the entire student job hunt. Reclaim your time, build actual skills, and let our engine handle the friction of filling forms.
          </motion.p>

         <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
            className="inline-flex items-center gap-3 px-4 mt-4 py-1.5 bg-[#111] border border-white/10 rounded-full text-[11px] font-mono tracking-[0.2em] uppercase mb-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-slate-400"
          >
            Opportunities Found. Application Done.
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}
            onClick={() => navigate('/login')}
            className="mt-8 px-8 py-4 bg-white text-black text-lg font-medium rounded-full hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 shadow-[inset_0_-3px_10px_rgba(0,0,0,0.15),0_10px_30px_rgba(255,255,255,0.1)]"
          >
            Goto Dashboard
            <span className="text-xl opacity-50 relative top-[1px]">→</span>
          </motion.button>
        </div>

        <motion.div style={{ opacity: indicatorOpacity }} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-[10px] tracking-[0.2em] font-medium text-slate-600">
          <div>SCROLL TO EXPLORE</div>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="text-lg mt-2 font-light">↓</motion.div>
        </motion.div>
      </section>

      <section className="py-32 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto border-t border-white/5">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/3 sticky top-40">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-6 text-white/90">
                The job hunt is broken.
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed font-light">Skilled Indian students are losing hours every day to repetitive administrative tasks instead of building real careers.</p>
            </FadeIn>
          </div>

          <div className="lg:w-2/3 space-y-12">
            <div className="grid md:grid-cols-3 gap-6">
              <FadeIn delay={0.1} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 hover:bg-[#111] transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
                <div className="text-5xl font-light tracking-tighter mb-4">9.9<span className="text-2xl text-slate-600">{' '}%</span></div>
                <div className="text-slate-300 text-sm font-medium mb-1">Youth Unemployment</div>
                <p className="text-slate-600 text-xs tracking-wide">PLFS 2025 REPORT</p>
              </FadeIn>
              <FadeIn delay={0.2} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 hover:bg-[#111] transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
                <div className="text-5xl font-light tracking-tighter mb-4">43.6<span className="text-2xl text-slate-600">{' '}%</span></div>
                <div className="text-slate-300 text-sm font-medium mb-1">Skilled but Invisible</div>
                <p className="text-slate-600 text-xs tracking-wide">INDIA SKILLS REPORT</p>
              </FadeIn>
              <FadeIn delay={0.3} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 hover:bg-[#111] transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
                <div className="text-5xl font-light tracking-tighter mb-4">2-3<span className="text-2xl text-slate-600">{' '}h r</span></div>
                <div className="text-slate-300 text-sm font-medium mb-1">Wasted Daily</div>
                <p className="text-slate-600 text-xs tracking-wide">REPETITIVE APPLICATIONS</p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white text-black py-32 px-6 md:px-12 lg:px-24 rounded-t-[3rem]">
        <div className="max-w-[1600px] mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-center mb-24">Live Processing Pipeline</h2>
          </FadeIn>

          <div className="flex flex-col md:flex-row items-center justify-between relative gap-12 md:gap-0">
            {flowSteps.map((step, i) => (
              <div key={i} className="flex flex-col items-center flex-1 relative w-full md:w-auto">
                <FadeIn delay={i * 0.15} className="flex flex-col items-center text-center z-10 px-4">
                  <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-xl font-light mb-6 shadow-xl ring-8 ring-white">
                    {step.num}
                  </div>
                  <h4 className="text-lg font-medium mb-2 whitespace-nowrap">{step.title}</h4>
                  <p className="text-slate-500 text-sm max-w-[200px] leading-relaxed font-light">{step.desc}</p>
                </FadeIn>

                {i < flowSteps.length - 1 && (
                  <>
                    <div className="hidden md:block absolute top-7 left-[50%] w-full h-[1px] bg-slate-200 overflow-hidden z-0">
                      <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: i * 0.2 }} className="w-1/2 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                    </div>
                    <div className="md:hidden w-[1px] h-12 bg-slate-200 mt-4 overflow-hidden relative">
                       <motion.div animate={{ y: ["-100%", "200%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: i * 0.2 }} className="w-full h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white text-black pb-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1600px] mx-auto">
          <FadeIn className="mb-16">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight">One dashboard.<br />Everything automated.</h2>
          </FadeIn>

          <div className="grid md:grid-cols-12 gap-6">
            <FadeIn delay={0.1} className="md:col-span-7 bg-[#FAFAFA] rounded-[2rem] p-12 border border-black/[0.04]">
              <span className="uppercase text-[10px] tracking-[0.2em] font-semibold text-slate-400">Smart Feed</span>
              <h3 className="text-3xl font-medium mt-4 mb-4 tracking-tight">All platforms. One place.</h3>
              <p className="text-slate-500 text-lg font-light">Internshala • Unstop • LinkedIn • Indeed • wellfound</p>
            </FadeIn>

            <FadeIn delay={0.2} className="md:col-span-5 bg-[#0A0A0A] text-white rounded-[2rem] p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full" />
              <span className="uppercase text-[10px] tracking-[0.2em] font-semibold text-indigo-400">AI Engine</span>
              <h3 className="text-3xl font-medium mt-4 mb-4 tracking-tight text-white/90">Sarvam-105B does the heavy lifting.</h3>
              <p className="text-slate-400 text-lg font-light">Personalized proposals drafted in seconds.</p>
            </FadeIn>

            <FadeIn delay={0.3} className="md:col-span-12 bg-[#FAFAFA] rounded-[2rem] p-12 flex flex-col md:flex-row gap-12 items-center border border-black/[0.04]">
              <div className="flex-1">
                <span className="uppercase text-[10px] tracking-[0.2em] font-semibold text-slate-400">Open Innovation</span>
                <h3 className="text-3xl font-medium mt-4 mb-4 tracking-tight">Real winning proposals shared anonymously.</h3>
                <p className="text-slate-500 text-lg font-light max-w-2xl">The entire community levels up together based on actual recruiter response data.</p>
              </div>
              <div className="bg-white px-8 py-6 rounded-2xl shadow-sm border border-black/[0.04] text-center">
                <div className="text-5xl font-light tracking-tighter mb-2">+87%</div>
                <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-emerald-500">Response Boost</div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-[#030303] text-white py-32 px-6 md:px-12 lg:px-24 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        
        <div className="max-w-[1600px] mx-auto relative z-10">
          <FadeIn className="text-center mb-24">
            <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono tracking-[0.2em] uppercase text-slate-400 mb-6 inline-block">
              Technology Deep Dive
            </span>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white/90">Why Sarvam AI?</h2>
            <p className="text-slate-500 mt-6 text-lg max-w-2xl mx-auto font-light leading-relaxed">We integrated India's most powerful language model to ensure your applications sound human, professional, and culturally aware.</p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            <FadeIn delay={0.1} className="bg-[#0A0A0A] border border-white/5 p-10 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] group hover:bg-[#111] transition-colors">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <WaveIcon />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white/90">Native Hinglish</h3>
              <p className="text-slate-500 leading-relaxed font-light text-sm">Most AIs sound overly formal. Sarvam is trained natively on Indian languages, allowing for a natural, grounded tone that recruiters actually respond to.</p>
            </FadeIn>

            <FadeIn delay={0.2} className="bg-[#0A0A0A] border border-white/5 p-10 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] group hover:bg-[#111] transition-colors">
              <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <NodeIcon />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white/90">Context Aware</h3>
              <p className="text-slate-500 leading-relaxed font-light text-sm">It doesn't just copy-paste. The 105B parameter engine deeply analyzes the target job description and automatically aligns your most relevant skills.</p>
            </FadeIn>

            <FadeIn delay={0.3} className="bg-[#0A0A0A] border border-white/5 p-10 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] group hover:bg-[#111] transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <FlashIcon />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white/90">Sub-Second Drafts</h3>
              <p className="text-slate-500 leading-relaxed font-light text-sm">Cut your application time from 15 minutes to 10 seconds. Generate, review, and apply directly through the HustleBuddy dashboard instantly.</p>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-[#030303] text-white py-40 text-center border-t border-white/5">
        <FadeIn>
          <h2 className="text-5xl md:text-6xl font-medium tracking-tight mb-10 text-white/90">Ready to stop applying manually?</h2>
          <button 
            onClick={() => navigate('/login')}
            className="bg-white text-black px-10 py-4 text-lg font-medium rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-[inset_0_-2px_6px_rgba(0,0,0,0.15)]"
          >
            Get Started Free
          </button>
        </FadeIn>
      </section>

      <footer className="bg-[#000] text-white py-16 px-6 md:px-12 lg:px-24 border-t border-white/10">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-sm">
          <div className="font-semibold tracking-tight text-xl text-white/90">HustleBuddy.</div>
          
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-slate-500 font-medium tracking-[0.1em] uppercase text-[10px]">
            <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Platform</button>
            <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Sarvam Engine</button>
            <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Vault</button>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>

          <div className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
            Team ThePenguin • Ashutosh & Kishan
          </div>
        </div>
      </footer>
      
    </div>
  );
}


