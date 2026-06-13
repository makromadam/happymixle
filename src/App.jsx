import { lazy, Suspense, useEffect, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import { CONTACT } from "./config"
import { services } from "./content"
import { Navigation } from "./components/Navigation"
const WebGLStage = lazy(() =>
  import("./components/WebGLStage").then((module) => ({ default: module.WebGLStage })),
)

gsap.registerPlugin(ScrollTrigger)

function getQuality() {
  if (typeof window === "undefined") return "fallback"
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "fallback"
  try {
    const canvas = document.createElement("canvas")
    if (!canvas.getContext("webgl2") && !canvas.getContext("webgl")) return "fallback"
  } catch {
    return "fallback"
  }
  return window.innerWidth < 820 || navigator.hardwareConcurrency <= 4 ? "lite" : "full"
}

function App() {
  const [quality, setQuality] = useState(getQuality)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const lenis = reduced ? null : new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.85 })
    let rafId
    const raf = (time) => {
      lenis?.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    if (lenis) rafId = requestAnimationFrame(raf)

    const context = gsap.context(() => {
      gsap.utils.toArray("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { yPercent: 115, rotate: 2 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 1.1,
            ease: "power4.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        )
      })
      gsap.utils.toArray(".service-row").forEach((row, index) => {
        gsap.fromTo(
          row,
          { xPercent: index % 2 ? 12 : -12, opacity: 0.15 },
          {
            xPercent: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: row, start: "top 90%", end: "center 55%", scrub: reduced ? false : 1 },
          },
        )
      })
    })

    const onResize = () => {
      setQuality(getQuality())
      ScrollTrigger.refresh()
    }
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      if (rafId) cancelAnimationFrame(rafId)
      lenis?.destroy()
      context.revert()
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">İçeriğe geç</a>
      <Navigation />
      <Suspense fallback={<div className="fallback-sculpture" aria-hidden="true" />}>
        <WebGLStage quality={quality} />
      </Suspense>
      <a
        className="whatsapp-float"
        href={CONTACT.whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Happy Mixle ile WhatsApp üzerinden iletişime geç"
      >
        <span className="whatsapp-label">WHATSAPP</span>
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16.04 3.2A12.7 12.7 0 0 0 5.1 22.34L3.2 28.8l6.62-1.74a12.76 12.76 0 1 0 6.22-23.86Zm0 22.98c-2.02 0-4-.54-5.72-1.56l-.41-.24-3.93 1.03 1.05-3.82-.27-.43a10.24 10.24 0 1 1 9.28 5.02Zm5.62-7.67c-.31-.15-1.82-.9-2.1-1-.28-.1-.49-.15-.69.15-.2.31-.8 1-1 1.2-.18.21-.36.23-.67.08-.31-.16-1.3-.48-2.48-1.53a9.32 9.32 0 0 1-1.72-2.14c-.18-.31-.02-.48.14-.63.14-.14.31-.36.46-.54.16-.18.21-.31.31-.52.1-.2.05-.38-.02-.54-.08-.15-.7-1.67-.95-2.29-.25-.6-.51-.52-.7-.53h-.59c-.2 0-.54.08-.82.38-.28.31-1.08 1.06-1.08 2.57 0 1.52 1.1 2.98 1.26 3.19.15.2 2.17 3.31 5.25 4.64.73.32 1.3.5 1.75.65.73.23 1.4.2 1.93.12.59-.09 1.82-.75 2.08-1.47.25-.72.25-1.34.18-1.47-.08-.12-.28-.2-.59-.36Z" />
        </svg>
      </a>
      <main id="main">
        <section id="manifesto" className="scene hero" data-scene="0">
          <div className="eyebrow">HAPPY MIXLE / YARATICI STÜDYO</div>
          <div className="hero-title title-mask">
            <h1 data-reveal>ALGIYI</h1>
            <h1 className="outline" data-reveal>TASARLIYORUZ.</h1>
          </div>
          <p className="hero-copy">
            Markaların nasıl göründüğünü değil,<br />
            <strong>nasıl hatırlandığını</strong> tasarlıyoruz.
          </p>
          <span className="scroll-note">KAYDIR / DENEYİMLE <i>↓</i></span>
        </section>

        <section id="system" className="scene system-scene" data-scene="1">
          <p className="section-index">02 / SİSTEM</p>
          <div className="system-equation">
            <div className="title-mask"><h2 data-reveal>YARATICILIK</h2></div>
            <span>+</span>
            <div className="title-mask"><h2 data-reveal>STRATEJİ</h2></div>
            <span>=</span>
            <div className="title-mask"><h2 className="orange" data-reveal>ETKİ</h2></div>
          </div>
          <p className="statement">
            Happy Mixle; yaratıcılığı, stratejiyi, yapay zekâyı ve kodu
            <strong> aynı sistemde buluşturarak </strong> markalar için gerçek etki üretir.
          </p>
          <div className="orbit-copy" aria-hidden="true">FİKİR · TEKNOLOJİ · HAREKET · HAFIZA ·</div>
        </section>

        <section id="impact" className="scene impact-scene" data-scene="2">
          <div className="impact-grid">
            <p className="section-index">03 / MANİFESTO</p>
            <div className="title-mask"><h2 data-reveal>ETKİ <span>&gt;</span> GÜRÜLTÜ</h2></div>
            <p className="impact-copy">
              Dijital dünyada herkes konuşur.<br /><br />
              Biz markaların daha yüksek ses çıkarmasına değil,
              <strong> daha güçlü iz bırakmasına </strong> odaklanırız.
            </p>
          </div>
          <div className="marquee" aria-hidden="true">
            <div>ETKİ &gt; GÜRÜLTÜ · ETKİ &gt; GÜRÜLTÜ · ETKİ &gt; GÜRÜLTÜ ·</div>
          </div>
        </section>

        <section id="services" className="scene services-scene" data-scene="3">
          <header className="services-header">
            <p className="section-index">04 / ÜRETİM ALANLARI</p>
            <div className="title-mask"><h2 data-reveal>NE YAPIYORUZ?</h2></div>
          </header>
          <div className="service-list">
            {services.map((service) => (
              <article className="service-row" key={service.number}>
                <span>{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.note}</p>
                <i aria-hidden="true">↗</i>
              </article>
            ))}
          </div>
        </section>

        <section id="method" className="scene method-scene" data-scene="4">
          <p className="section-index">05 / YAKLAŞIM</p>
          <div className="method-heading">
            <span>GÜZEL</span>
            <div className="title-mask"><h2 data-reveal>YETMEZ.</h2></div>
          </div>
          <div className="method-copy">
            <p>Güzel görünen işler üretmek kolaydır.</p>
            <p>İnsanların durup baktığı, hatırladığı ve harekete geçtiği işler üretmek zordur.</p>
            <p>
              Happy Mixle yaratıcı fikri stratejik düşünceyle birleştirir. Yapay zekâ ve kod destekli üretimle
              <strong> modern, hızlı ve etkili </strong> çözümler geliştirir.
            </p>
          </div>
        </section>

        <section id="contact" className="scene contact-scene" data-scene="5">
          <p className="section-index">06 / TEMAS</p>
          <div className="title-mask contact-title">
            <h2 data-reveal>BİR SONRAKİ<br /><span>BÜYÜK FİKİR</span> İÇİN.</h2>
          </div>
          <div className="contact-links">
            {CONTACT.phoneHref ? (
              <a href={`tel:${CONTACT.phoneHref}`}><small>TELEFON</small>{CONTACT.phoneDisplay}<span>↗</span></a>
            ) : (
              <span className="pending-contact"><small>TELEFON</small>{CONTACT.phoneDisplay}</span>
            )}
            <a href={CONTACT.instagramUrl} target="_blank" rel="noreferrer">
              <small>INSTAGRAM</small>{CONTACT.instagramHandle}<span>↗</span>
            </a>
          </div>
          <footer>
            <span>HAPPY MIXLE © {new Date().getFullYear()}</span>
            <span>FETHİYE, MUĞLA</span>
            <a href="#manifesto">YUKARI ↑</a>
          </footer>
        </section>
      </main>
    </>
  )
}

export default App
