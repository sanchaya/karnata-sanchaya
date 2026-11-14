// Prerendered landing pages (/species/, /geography/, /species/pavo-cristatus/ ...) load the same app as the home page.
// The app reads its page from the URL hash, so move a bare landing URL to "/#<page>" before the app starts. A deep link that
// already has a hash is left alone.
(function () {
  var script = document.currentScript
  if (!script || (location.hash && location.hash !== '#')) return
  var view = script.getAttribute('data-view')
  if (!view) return
  var query = location.search || (script.getAttribute('data-query') ? '?' + script.getAttribute('data-query') : '')
  history.replaceState(null, '', '/' + query + '#' + view)
})()
