# Happy Mixle

Happy Mixle için React, React Three Fiber ve GSAP ile geliştirilmiş tek sayfalık dijital sanat deneyimi.

## Kurulum

```bash
npm install
npm run dev
```

Üretim derlemesi:

```bash
npm run build
```

## Yayın Öncesi

- `src/config.js` içindeki telefon numarasını güncelleyin.
- Lisanslı Monofonto webfont dosyasını `public/fonts/` altına ekleyip `src/styles.css` içindeki `@font-face` kaynağını güncelleyin.
- `index.html`, `public/robots.txt` ve `public/sitemap.xml` içindeki alan adını doğrulayın.

## Teknoloji

- React + Vite
- React Three Fiber / Three.js
- GSAP + Lenis
- Adaptif WebGL, mobil ve reduced-motion fallback
