import { WorkSection } from "@/components/sections/work-section"
import { ServicesSection } from "@/components/sections/services-section"
import { AboutSection } from "@/components/sections/about-section"
import { ContactSection } from "@/components/sections/contact-section"
import { MagneticButton } from "@/components/magnetic-button"
import { useRef, useEffect, useState } from "react"

export default function Index() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const scrollThrottleRef = useRef<number>()

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const sectionWidth = scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({
        left: sectionWidth * index,
        behavior: "smooth",
      })
      setCurrentSection(index)
    }
  }

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY.current - touchEndY
      const deltaX = touchStartX.current - touchEndX

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentSection < 4) {
          scrollToSection(currentSection + 1)
        } else if (deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        if (!scrollContainerRef.current) return
        scrollContainerRef.current.scrollBy({
          left: e.deltaY,
          behavior: "instant",
        })
        const sectionWidth = scrollContainerRef.current.offsetWidth
        const newSection = Math.round(scrollContainerRef.current.scrollLeft / sectionWidth)
        if (newSection !== currentSection) {
          setCurrentSection(newSection)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }
    return () => {
      if (container) container.removeEventListener("wheel", handleWheel)
    }
  }, [currentSection])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return
      scrollThrottleRef.current = requestAnimationFrame(() => {
        if (!scrollContainerRef.current) {
          scrollThrottleRef.current = undefined
          return
        }
        const sectionWidth = scrollContainerRef.current.offsetWidth
        const scrollLeft = scrollContainerRef.current.scrollLeft
        const newSection = Math.round(scrollLeft / sectionWidth)
        if (newSection !== currentSection && newSection >= 0 && newSection <= 4) {
          setCurrentSection(newSection)
        }
        scrollThrottleRef.current = undefined
      })
    }

    const container = scrollContainerRef.current
    if (container) container.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      if (container) container.removeEventListener("scroll", handleScroll)
      if (scrollThrottleRef.current) cancelAnimationFrame(scrollThrottleRef.current)
    }
  }, [currentSection])

  return (
    <main className="relative h-screen w-full overflow-hidden" style={{ background: "var(--gn-bg)" }}>
      {/* Градиентные орбы — лёгкие, CSS-only */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="gn-orb gn-orb-1" />
        <div className="gn-orb gn-orb-2" />
        <div className="gn-orb gn-orb-3" />
      </div>

      {/* Навигация */}
      <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 md:px-12">
        <button
          onClick={() => scrollToSection(0)}
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gn-logo-bg">
            <span className="font-bold text-white text-lg">G</span>
          </div>
          <span className="font-semibold tracking-tight text-white text-xl">Galaxy Net</span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {["Главная", "Покрытие", "Тарифы", "О нас", "Подключение"].map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index)}
              className={`relative text-sm font-medium transition-colors ${
                currentSection === index ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {item}
              {currentSection === index && (
                <span className="absolute -bottom-1 left-0 h-px w-full gn-underline" />
              )}
            </button>
          ))}
        </div>

        <MagneticButton variant="secondary" onClick={() => scrollToSection(4)}>
          Подключиться
        </MagneticButton>
      </nav>

      {/* Секции */}
      <div
        ref={scrollContainerRef}
        data-scroll-container
        className="relative z-10 flex h-screen overflow-x-auto overflow-y-hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Hero */}
        <section className="flex min-h-screen w-screen shrink-0 flex-col justify-end px-6 pb-16 pt-24 md:px-12 md:pb-24">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 gn-badge">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <p className="text-xs text-blue-200 font-mono">Интернет-провайдер · Работаем с 2008</p>
            </div>

            <h1 className="mb-6 text-6xl font-light leading-[1.08] tracking-tight text-white md:text-7xl lg:text-8xl">
              Интернет со<br />
              <span className="gn-gradient-text">скоростью галактики</span>
            </h1>

            <p className="mb-10 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">
              Высокоскоростной интернет для дома и бизнеса. Стабильное соединение, честные тарифы и поддержка 24/7.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <MagneticButton size="lg" variant="primary" onClick={() => scrollToSection(4)}>
                Подключиться
              </MagneticButton>
              <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection(2)}>
                Тарифы
              </MagneticButton>
            </div>

            {/* Метрики */}
            <div className="mt-12 flex gap-8 border-t border-white/10 pt-8">
              {[
                { value: "50К+", label: "Абонентов" },
                { value: "1 Гбит/с", label: "Макс. скорость" },
                { value: "99.9%", label: "Uptime" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="text-2xl font-light text-white md:text-3xl">{m.value}</div>
                  <div className="text-xs text-white/50 font-mono mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs text-white/50">Листайте вправо</p>
              <div className="flex h-6 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                <div className="h-2 w-2 animate-pulse rounded-full bg-white/70" />
              </div>
            </div>
          </div>
        </section>

        <WorkSection />
        <ServicesSection />
        <AboutSection scrollToSection={scrollToSection} />
        <ContactSection />
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }

        :root {
          --gn-bg: #080d1a;
          --gn-blue: #2563eb;
          --gn-cyan: #38bdf8;
        }

        .gn-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
        }
        .gn-orb-1 {
          width: 600px; height: 600px;
          top: -200px; left: -100px;
          background: radial-gradient(circle, #1e40af 0%, transparent 70%);
          animation: orbFloat 12s ease-in-out infinite;
        }
        .gn-orb-2 {
          width: 500px; height: 500px;
          top: 10%; right: -150px;
          background: radial-gradient(circle, #0ea5e9 0%, transparent 70%);
          animation: orbFloat 16s ease-in-out infinite reverse;
        }
        .gn-orb-3 {
          width: 400px; height: 400px;
          bottom: -100px; left: 40%;
          background: radial-gradient(circle, #3730a3 0%, transparent 70%);
          animation: orbFloat 10s ease-in-out infinite 3s;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        .gn-logo-bg {
          background: linear-gradient(135deg, #2563eb, #0ea5e9);
        }
        .gn-badge {
          background: rgba(37, 99, 235, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.25);
          backdrop-filter: blur(8px);
        }
        .gn-gradient-text {
          background: linear-gradient(90deg, #60a5fa, #38bdf8, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gn-underline {
          background: linear-gradient(90deg, #60a5fa, #38bdf8);
        }
      `}</style>
    </main>
  )
}
