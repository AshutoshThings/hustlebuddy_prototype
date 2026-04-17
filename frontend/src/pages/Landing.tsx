import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
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

const TiltCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const LanguageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
    <path d="M14 19a6 6 0 0 0 8-6 6 6 0 0 0-8-6" />
    <path d="M2 13a6 6 0 0 0 10 4l4 4-1-4a6 6 0 0 0-11-8 6 6 0 0 0-2 4Z" />
    <circle cx="18" cy="10" r="1" fill="currentColor" />
  </svg>
);

const ContextIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
    {/* Abstract AI Context Nodes */}
    <circle cx="16" cy="13" r="2" fill="currentColor" className="opacity-40" />
    <circle cx="14" cy="17" r="2" fill="currentColor" className="opacity-80" />
  </svg>
);

const SpeedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2 2" />
    <path d="M5 3L2 6" />
    <path d="M19 3l3 3" />
    <path d="M12 2v2" />
    {/* Speed lines */}
    <path d="M1 18h2" />
    <path d="M21 18h2" />
  </svg>
);

const CountUp = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * end);
      setDisplay(value);
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <div className="text-5xl font-light tracking-tighter mb-4">
      {display}{suffix}
    </div>
  );
};

export default function Landing() {
  const navigate = useNavigate();
  const { scrollYProgress: globalScroll } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const indicatorOpacity = useTransform(heroScroll, [0, 0.2], [1, 0]);

  const transitionContainerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress: containerScroll } = useScroll({
    target: transitionContainerRef,
    offset: ["start end", "end start"]
  });

  const smoothContainerScroll = useSpring(containerScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const dynamicBg = useTransform(
    smoothContainerScroll,
    [0, 0.15, 0.85, 1],
    ["#030303", "#ffffff", "#ffffff", "#030303"]
  );

  const dynamicText = useTransform(
    smoothContainerScroll,
    [0, 0.15, 0.85, 1],
    ["#ffffff", "#000000", "#000000", "#ffffff"]
  );

  const dynamicScale = useTransform(
    smoothContainerScroll,
    [0, 0.15, 0.85, 1],
    [1, 0.96, 0.96, 1] 
  );

  const dynamicBorderRadius = useTransform(
    smoothContainerScroll,
    [0, 0.15, 0.85, 1],
    ["0rem", "3rem", "3rem", "0rem"]
  );

  const dynamicShadow = useTransform(
    smoothContainerScroll,
    [0, 0.15, 0.85, 1],
    [
      "0px 0px 0px rgba(255,255,255,0)", 
      "0px 30px 60px rgba(255,255,255,0.1)",
      "0px 30px 60px rgba(255,255,255,0.1)", 
      "0px 0px 0px rgba(255,255,255,0)"
    ]
  );

  const isLightTransform = useTransform(
    smoothContainerScroll,
    [0, 0.1, 0.15],
    [0, 0, 1]
  );

  const flowSteps = [
    { 
      num: "01", 
      title: "Build your profile once", 
      desc: "Skills, projects, and portfolio — done in under a minute" 
    },
    { 
      num: "02", 
      title: "All opportunities in one feed", 
      desc: "Internshala, Unstop, LinkedIn, Indeed, Wellfound and others" 
    },
    { 
      num: "03", 
      title: "AI writes your applications", 
      desc: "Sarvam creates proposals that actually sound like you" 
    },
    { 
      num: "04", 
      title: "Apply with one click", 
      desc: "Submit and track everything from the same dashboard" 
    },
    { 
      num: "05", 
      title: "Community Vault", 
      desc: "See what actually worked for other students (anonymously shared)" 
    }
  ];

  return (
    <div className="bg-[#030303] text-white font-sans min-h-screen overflow-x-hidden">
      
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-white/20 origin-left z-50"
        style={{ scaleX: globalScroll }}
      />

      {/* --- HERO --- */}
      <section ref={heroRef} className="relative h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030303]/0 to-transparent blur-3xl pointer-events-none" />
        
        <nav className="absolute top-0 left-0 w-full px-6 md:px-12 lg:px-24 py-8 flex justify-between items-center z-20">
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
            We built a tool that handles all the boring parts of internship hunting for Indian students. 
            No more copying-pasting the same details 20 times a day. Just focus on your projects and studies - we take care of the forms.
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
            Open my dashboard
            <span className="text-xl opacity-50 relative top-[1px]">→</span>
          </motion.button>
        </div>

        <motion.div style={{ opacity: indicatorOpacity }} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-[10px] tracking-[0.2em] font-medium text-slate-600">
          <div>SCROLL TO EXPLORE</div>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="text-lg mt-2 font-light">↓</motion.div>
        </motion.div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-32 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto border-t border-white/5">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/3 sticky top-40">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-6 text-white/90">
                The job hunt is broken.
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed font-light">Skilled students in India are wasting hours every week on the same repetitive forms instead of actually building things that matter.</p>
            </FadeIn>
          </div>

          <div className="lg:w-2/3 space-y-12">
            <div className="grid md:grid-cols-3 gap-6">
              <FadeIn delay={0.1} className="h-full">
                <TiltCard className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] h-full cursor-default">
                  <CountUp end={9.9} suffix="%" />
                  <div className="text-slate-300 text-sm font-medium mb-1">Youth unemployment rate</div>
                  <p className="text-slate-600 text-xs tracking-wide">PLFS 2025</p>
                </TiltCard>
              </FadeIn>
              <FadeIn delay={0.2} className="h-full">
                <TiltCard className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] h-full cursor-default">
                  <CountUp end={43.6} suffix="%" />
                  <div className="text-slate-300 text-sm font-medium mb-1">Skilled but still invisible</div>
                  <p className="text-slate-600 text-xs tracking-wide">INDIA SKILLS REPORT 2026</p>
                </TiltCard>
              </FadeIn>
              <FadeIn delay={0.3} className="h-full">
                <TiltCard className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] h-full cursor-default">
                  <CountUp end={2} suffix="-3 hr" />
                  <div className="text-slate-300 text-sm font-medium mb-1">Lost every week on applications</div>
                  <p className="text-slate-600 text-xs tracking-wide">REPETITIVE FORMS</p>
                </TiltCard>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* --- COMPARISON SECTION --- */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#0A0A0A]">
        <div className="max-w-[1600px] mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-center mb-16">Manual vs HustleBuddy</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
            {/* Manual column */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="text-red-400 text-sm font-medium uppercase tracking-widest">Manual hunt</div>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Time spent applying per week</span>
                    <span className="font-medium">14 hours</span>
                  </div>
                  <motion.div className="h-3 bg-[#1F1F1F] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "85%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-red-400/80 rounded-full"
                    />
                  </motion.div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Applications sent per week</span>
                    <span className="font-medium">4–6</span>
                  </div>
                  <motion.div className="h-3 bg-[#1F1F1F] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "35%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                      className="h-full bg-red-400/80 rounded-full"
                    />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* HustleBuddy column */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="text-emerald-400 text-sm font-medium uppercase tracking-widest">With HustleBuddy</div>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Time spent applying per week</span>
                    <span className="font-medium text-emerald-400">Under 30 minutes</span>
                  </div>
                  <motion.div className="h-3 bg-[#1F1F1F] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "12%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-emerald-400 rounded-full"
                    />
                  </motion.div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Applications sent per week</span>
                    <span className="font-medium text-emerald-400">25+</span>
                  </div>
                  <motion.div className="h-3 bg-[#1F1F1F] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "92%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                      className="h-full bg-emerald-400 rounded-full"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-slate-500 text-sm mt-12 max-w-md mx-auto">Real numbers from students who switched to HustleBuddy in the last 3 months.</p>
        </div>
      </section>

      {/* --- CARD POP WRAPPER --- */}
      <motion.div 
        ref={transitionContainerRef}
        style={{ 
          backgroundColor: dynamicBg, 
          color: dynamicText,
          scale: dynamicScale,
          borderRadius: dynamicBorderRadius,
          boxShadow: dynamicShadow
        }}
        className="overflow-hidden"
      >
        <section className="pt-32 pb-16 px-6 md:px-12 lg:px-24">
          <div className="max-w-[1600px] mx-auto">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-center mb-24">How it actually works (5 steps)</h2>
            </FadeIn>

            <div className="flex flex-col md:flex-row items-center justify-between relative gap-12 md:gap-0">
              {flowSteps.map((step, i) => (
                <div key={i} className="flex flex-col items-center flex-1 relative w-full md:w-auto">
                  <FadeIn delay={i * 0.15} className="flex flex-col items-center text-center z-10 px-4 w-full">
                    <TiltCard className="flex flex-col items-center text-center w-full">
                      <motion.div 
                        style={{ 
                          backgroundColor: useTransform(isLightTransform, [0, 1], ["#ffffff", "#000000"]),
                          color: useTransform(isLightTransform, [0, 1], ["#000000", "#ffffff"])
                        }}
                        className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-light mb-6 shadow-xl ring-8 ring-transparent"
                      >
                        {step.num}
                      </motion.div>
                      <h4 className="text-lg font-medium mb-2 whitespace-nowrap">{step.title}</h4>
                      <motion.p 
                        style={{ opacity: useTransform(isLightTransform, [0, 1], [0.6, 0.5]) }}
                        className="text-sm max-w-[200px] leading-relaxed font-light mx-auto"
                      >
                        {step.desc}
                      </motion.p>
                    </TiltCard>
                  </FadeIn>

                  {i < flowSteps.length - 1 && (
                    <>
                      <div className="hidden md:block absolute top-7 left-[50%] w-full h-[1px] bg-slate-400/20 overflow-hidden z-0">
                        <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: i * 0.2 }} className="w-1/2 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                      </div>
                      <div className="md:hidden w-[1px] h-12 mt-4 bg-slate-400/20 overflow-hidden relative">
                         <motion.div animate={{ y: ["-100%", "200%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: i * 0.2 }} className="w-full h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-32 px-6 md:px-12 lg:px-24">
          <div className="max-w-[1600px] mx-auto">
            <FadeIn className="mb-16">
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight">One dashboard.<br />Nothing else to open.</h2>
            </FadeIn>

            <div className="grid md:grid-cols-12 gap-6">
              <FadeIn delay={0.1} className="md:col-span-7 h-full">
                <TiltCard className="rounded-[2rem] p-12 border border-current/5 bg-current/5 h-full cursor-default">
                  <span className="uppercase text-[10px] tracking-[0.2em] font-semibold opacity-50">Smart Feed</span>
                  <h3 className="text-3xl font-medium mt-4 mb-4 tracking-tight">All platforms. One place.</h3>
                  <p className="text-lg font-light opacity-60">Internshala • Unstop • LinkedIn • Indeed • wellfound</p>
                </TiltCard>
              </FadeIn>

              {/* This card stays visually dark for contrast */}
              <FadeIn delay={0.2} className="md:col-span-5 h-full">
                <TiltCard className="bg-[#0A0A0A] text-white rounded-[2rem] p-12 shadow-2xl relative overflow-hidden h-full cursor-default">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full" />
                  <span className="uppercase text-[10px] tracking-[0.2em] font-semibold text-indigo-400">Powered by Sarvam</span>
                  <h3 className="text-3xl font-medium mt-4 mb-4 tracking-tight text-white/90">Applications that don’t sound like AI</h3>
                  <p className="text-slate-400 text-lg font-light">Sarvam writes proposals the way you would — natural, professional, and Indian.</p>
                </TiltCard>
              </FadeIn>

              <FadeIn delay={0.3} className="md:col-span-12 h-full">
                <TiltCard className="rounded-[2rem] p-12 flex flex-col md:flex-row gap-12 items-center border border-current/5 bg-current/5 h-full cursor-default">
                  <div className="flex-1">
                    <span className="uppercase text-[10px] tracking-[0.2em] font-semibold opacity-50">Community Vault</span>
                    <h3 className="text-3xl font-medium mt-4 mb-4 tracking-tight">Real applications that actually worked</h3>
                    <p className="text-lg font-light max-w-2xl opacity-60">Students share what got them interviews. You learn from real recruiter feedback instead of guessing.</p>
                  </div>
                </TiltCard>
              </FadeIn>
            </div>
          </div>
        </section>
      </motion.div>
      {/* --- END CARD POP WRAPPER --- */}

      {/* --- MAIN DARK THEME (WHY SARVAM) --- */}
      <section className="bg-[#030303] text-white py-32 px-6 md:px-12 lg:px-24 border-t border-white/5 relative overflow-hidden mt-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        
        <div className="max-w-[1600px] mx-auto relative z-10">
          <FadeIn className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white/90">Why we chose Sarvam (and not ChatGPT)</h2>
            <p className="text-slate-500 mt-6 text-lg max-w-2xl mx-auto font-light leading-relaxed">We didn’t want your applications to sound like every other AI-generated one. So we built on Sarvam - India’s own large language model that actually understands how we speak and how recruiters here think.</p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* The 3D TiltCards for the final section */}
            <FadeIn delay={0.1} className="h-full">
              <TiltCard className="bg-[#0A0A0A] border border-white/5 p-10 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] h-full flex flex-col items-start cursor-default">
                <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-8">
                  <LanguageIcon />
                </div>
                <h3 className="text-xl font-medium mb-3 text-white/90">It speaks like us</h3>
                <p className="text-slate-500 leading-relaxed font-light text-sm">Most AIs sound too American or too robotic. Sarvam was trained on Indian English and Hinglish, so the tone feels natural to Indian recruiters.</p>
              </TiltCard>
            </FadeIn>

            <FadeIn delay={0.2} className="h-full">
              <TiltCard className="bg-[#0A0A0A] border border-white/5 p-10 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] h-full flex flex-col items-start cursor-default">
                <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center mb-8">
                  <ContextIcon />
                </div>
                <h3 className="text-xl font-medium mb-3 text-white/90">It reads the description</h3>
                <p className="text-slate-500 leading-relaxed font-light text-sm">It doesn’t just fill in blanks. It understands what the company is really looking for and highlights the right parts of your profile.</p>
              </TiltCard>
            </FadeIn>

            <FadeIn delay={0.3} className="h-full">
              <TiltCard className="bg-[#0A0A0A] border border-white/5 p-10 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] h-full flex flex-col items-start cursor-default">
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-8">
                  <SpeedIcon />
                </div>
                <h3 className="text-xl font-medium mb-3 text-white/90">Done in seconds</h3>
                <p className="text-slate-500 leading-relaxed font-light text-sm">Generate → review → apply. The whole thing takes less than 30 seconds once your profile is ready.</p>
              </TiltCard>
            </FadeIn>

          </div>
        </div>
      </section>

      <section className="bg-[#030303] text-white py-40 text-center border-t border-white/5">
        <FadeIn>
          <h2 className="text-5xl md:text-6xl font-medium tracking-tight mb-10 text-white/90">Tired of applying manually?</h2>
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