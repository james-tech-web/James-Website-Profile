import React, { useEffect, useState, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Mail, Linkedin, GitHub, ArrowRight, ChevronUp } from 'lucide-react'

// Production-ready, reusable Footer component
// Expects TailwindCSS to be available in the host app.

const columnVariant = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.18 * i, duration: 0.72, ease: [0.22, 0.9, 0.3, 1] }
  })
}

export default function Footer({ year = new Date().getFullYear(), className = '' }) {
  const reduce = useReducedMotion()
  const [scrollPct, setScrollPct] = useState(0)
  const footerRef = useRef(null)

  useEffect(() => {
    // scroll percentage for progress ring
    function onScroll() {
      const scrolled = window.scrollY || window.pageYOffset
      const height = document.documentElement.scrollHeight - window.innerHeight
      const pct = height > 0 ? Math.min(100, Math.round((scrolled / height) * 100)) : 0
      setScrollPct(pct)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // intersection to add in-view class to footer (non-overlapping)
    if (reduce) return // avoid heavy observers when reduced-motion preferred
    const f = footerRef.current
    if (!f || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) f.classList.add('in-view')
      })
    }, { threshold: 0.06 })
    io.observe(f)
    return () => io.disconnect()
  }, [reduce])

  // progress ring math
  const R = 18
  const C = 2 * Math.PI * R
  const dash = C - (C * scrollPct) / 100

  // a tiny ripple helper on click (pure CSS class added)
  function ripple(e) {
    const target = e.currentTarget
    const span = document.createElement('span')
    span.className = 'footer-ripple'
    const rect = target.getBoundingClientRect()
    span.style.left = (e.clientX - rect.left) + 'px'
    span.style.top = (e.clientY - rect.top) + 'px'
    target.appendChild(span)
    setTimeout(() => span.remove(), 600)
  }

  return (
    <footer ref={footerRef} className={`relative w-full bg-[#0f172a] text-[#e2e8f0] ${className}`}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <motion.div
            custom={0}
            initial="hidden"
            animate="show"
            variants={columnVariant}
            className="space-y-3"
          >
            <h4 className="text-white text-2xl font-extrabold tracking-tight drop-shadow-[0_6px_18px_rgba(6,182,212,0.08)]">James Mutugi Njogu</h4>
            <p className="text-[#94a3b8] font-medium">Software Engineer | Enterprise Technology Leader</p>
            <p className="text-[#9aa8bb] italic">Transforming business through strategic technology solutions</p>
          </motion.div>

          <motion.div
            custom={1}
            initial="hidden"
            animate="show"
            variants={columnVariant}
            className="space-y-2"
          >
            <h5 className="text-[#0ea5e9] uppercase text-sm font-bold tracking-wider drop-shadow-[0_6px_18px_rgba(6,182,212,0.06)]">Quick Links</h5>
            <ul className="space-y-2">
              {[
                { href: '/index', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/experience', label: 'Experience' },
                { href: '/projects', label: 'Projects' }
              ].map((l, i) => (
                <li key={i}>
                  <a
                    onClick={ripple}
                    className="group inline-flex items-center gap-3 text-[#cbd5e1] hover:text-[#0ea5e9] transform-gpu transition-all duration-220 ease-in-out"
                    href={l.href}
                  >
                    <motion.span whileHover={{ x: 6 }} className="opacity-80">
                      <ArrowRight size={16} />
                    </motion.span>
                    <span className="relative overflow-hidden">
                      <span className="after:block after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 group-hover:after:w-full after:transition-all after:duration-300 after:bg-gradient-to-r after:from-[#0ea5e9] after:to-[#06b6d4]"></span>
                      {l.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            custom={2}
            initial="hidden"
            animate="show"
            variants={columnVariant}
            className="space-y-2"
          >
            <h5 className="text-[#0ea5e9] uppercase text-sm font-bold tracking-wider drop-shadow-[0_6px_18px_rgba(6,182,212,0.06)]">Connect</h5>
            <ul className="space-y-3">
              <li>
                <a onClick={ripple} className="group inline-flex items-center gap-3 text-[#cbd5e1] hover:text-[#0ea5e9] transition-all duration-220" href="mailto:your@email.com">
                  <Mail size={16} className="opacity-90 group-hover:translate-x-1 transition-transform duration-220" /> Email
                </a>
              </li>
              <li>
                <a onClick={ripple} className="group inline-flex items-center gap-3 text-[#cbd5e1] hover:text-[#0ea5e9] transition-all duration-220" href="https://linkedin.com" target="_blank" rel="noreferrer">
                  <Linkedin size={16} className="opacity-90 group-hover:translate-x-1 transition-transform duration-220" /> LinkedIn
                </a>
              </li>
              <li>
                <a onClick={ripple} className="group inline-flex items-center gap-3 text-[#cbd5e1] hover:text-[#0ea5e9] transition-all duration-220" href="https://github.com" target="_blank" rel="noreferrer">
                  <GitHub size={16} className="opacity-90 group-hover:translate-x-1 transition-transform duration-220" /> GitHub
                </a>
              </li>
              <li>
                <a onClick={ripple} className="group inline-flex items-center gap-3 text-[#cbd5e1] hover:text-[#0ea5e9] transition-all duration-220" href="/contact">
                  <ArrowRight size={16} className="opacity-90 group-hover:translate-x-1 transition-transform duration-220" /> Contact
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-[#0ea5e9]/40 to-transparent w-full animate-slide-left" />

        <div className="mt-6 flex items-center justify-between text-sm text-[#94a3b8]">
          <div>© {year} James Mutugi Njogu. All Rights Reserved.</div>
          <div className="flex items-center gap-4">
            <div className="text-[#64748b] italic">Crafted with precision | Enterprise Portfolio</div>

            {/* Scroll-to-top circular glowing button with progress */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              onMouseDown={ripple}
              aria-label="Back to top"
              className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] shadow-[0_6px_24px_rgba(14,165,233,0.16)] flex items-center justify-center hover:scale-105 transition-transform duration-200"
            >
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48" fill="none" aria-hidden>
                <defs />
                <circle cx="24" cy="24" r={R} className="opacity-10" stroke="#e2e8f0" strokeWidth="2" />
                <circle
                  cx="24"
                  cy="24"
                  r={R}
                  stroke="#002b3a"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={dash}
                  transform="rotate(-90 24 24)"
                />
              </svg>
              <ChevronUp size={18} className="relative text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* small styling injection for ripple and divider animation (tailwind + small CSS) */}
      <style jsx>{`
        .footer-ripple{ position:absolute; width:12px; height:12px; background:rgba(14,165,233,0.14); border-radius:999px; transform:translate(-50%,-50%) scale(0.2); animation:ripple .52s ease-out forwards; pointer-events:none; }
        @keyframes ripple{ to{ transform:translate(-50%,-50%) scale(6); opacity:0 } }
        .animate-slide-left{ animation:slideLeft 700ms cubic-bezier(.22,.9,.3,1) both }
        @keyframes slideLeft{ from{ background-position:100% 50%; opacity:0; transform:translateX(-8px) } to{ background-position:0% 50%; opacity:1; transform:none } }
      `}</style>
    </footer>
  )
}
