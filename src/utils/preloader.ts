const MIN_VISIBLE_MS = 900
const FADE_MS = 400

export function hidePreloader() {
  const preloader = document.getElementById('preloader')
  if (!preloader) return

  const remaining = Math.max(0, MIN_VISIBLE_MS - performance.now())
  window.setTimeout(() => {
    preloader.classList.add('preloader-hidden')
    window.setTimeout(() => preloader.remove(), FADE_MS)
  }, remaining)
}
