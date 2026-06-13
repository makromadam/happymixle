import { useEffect, useState } from "react"
import { scenes } from "../content"
import { Logo } from "./Logo"

export function Navigation() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const sections = scenes.map(({ id }) => document.getElementById(id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(sections.indexOf(visible.target))
      },
      { threshold: [0.25, 0.5, 0.75] },
    )
    sections.forEach((section) => observer.observe(section))

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? window.scrollY / total : 0)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <>
      <header className={`site-header ${active === 2 ? "on-dark" : ""}`}>
        <Logo />
        <p className="location">FETHİYE / MUĞLA</p>
        <a className="contact-jump" href="#contact">
          BİRLİKTE ÜRETELİM <span aria-hidden="true">↗</span>
        </a>
      </header>
      <nav className={`scene-nav ${active === 2 ? "on-dark" : ""}`} aria-label="Sayfa bölümleri">
        <span className="scene-count">{String(active + 1).padStart(2, "0")}</span>
        <div className="progress-track" aria-hidden="true">
          <span style={{ transform: `scaleY(${progress})` }} />
        </div>
        <span className="scene-total">{String(scenes.length).padStart(2, "0")}</span>
        <span className="scene-label">{scenes[active]?.label}</span>
      </nav>
    </>
  )
}
