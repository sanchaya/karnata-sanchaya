import { Component } from 'react'

// Last line of defence: if any screen throws while rendering, show a way back instead of a blank page.
export default class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error) { console.error('Atlas screen failed to render', error) }
  render() {
    if (!this.state.failed) return this.props.children
    const kn = typeof navigator !== 'undefined' && !/^en/i.test(document.documentElement.lang || 'kn')
    return <main role="alert" style={{ maxWidth: 560, margin: '12vh auto', padding: 24, font: '16px/1.6 system-ui, "Noto Sans Kannada", sans-serif', textAlign: 'center' }}>
      <h2 style={{ margin: '0 0 8px' }}>{kn ? 'ಏನೋ ತಪ್ಪಾಯಿತು' : 'Something went wrong'}</h2>
      <p>{kn ? 'ಈ ಪುಟ ತೋರಿಸಲಾಗಲಿಲ್ಲ. ಮರುಲೋಡ್ ಮಾಡಿ; ನಿಮ್ಮ ವರ್ಷ ಮತ್ತು ನಕ್ಷೆ ಸ್ಥಾನ ಕೊಂಡಿಯಲ್ಲಿ ಉಳಿದಿರುತ್ತದೆ.' : 'This page could not be shown. Reload to continue; your year and map position are kept in the link.'}</p>
      <button type="button" onClick={() => window.location.reload()} style={{ minHeight: 44, padding: '8px 22px', border: '1px solid #4361ee', borderRadius: 99, background: '#fff', color: '#4361ee', font: 'inherit', fontWeight: 700, cursor: 'pointer' }}>{kn ? 'ಮರುಲೋಡ್ ಮಾಡಿ' : 'Reload'}</button>
    </main>
  }
}
