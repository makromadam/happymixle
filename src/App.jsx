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
