// Menus that scroll sideways give no sign that more items are hidden. This marks each such menu with
// data-scroll-left / data-scroll-right while there is more to see on that side; scroll-hint.css fades those edges.
const MENUS = '.activity-bar-items,.portal-nav,.community-section-nav,.contribution-section-nav,.evidence-section-nav,.research-tasks-hero nav,.district-history-view-menu,.dyn-rail,.dyn-ticks'

function mark(menu) {
  // Bring the open page's entry into view once per page, so it is never the item hidden behind the fade.
  const active = menu.querySelector('a.active,[aria-current="page"]')
  if (active && menu.dataset.hintSeen !== active.textContent) {
    menu.dataset.hintSeen = active.textContent
    menu.scrollLeft = Math.max(0, active.offsetLeft - menu.offsetLeft - menu.clientWidth / 2 + active.offsetWidth / 2)
  }
  const left = menu.scrollLeft > 2
  const right = menu.scrollLeft + menu.clientWidth < menu.scrollWidth - 2
  menu.toggleAttribute('data-scroll-left', left)
  menu.toggleAttribute('data-scroll-right', right)
}

export function watchScrollHints(root = document, win = window) {
  let queued = false
  const refresh = () => { queued = false; root.querySelectorAll(MENUS).forEach(mark) }
  const schedule = () => { if (!queued) { queued = true; win.requestAnimationFrame(refresh) } }
  root.addEventListener('scroll', event => { if (event.target.matches?.(MENUS)) mark(event.target) }, true)
  win.addEventListener('resize', schedule)
  new win.MutationObserver(schedule).observe(root.body || root, { childList: true, subtree: true })
  schedule()
}
