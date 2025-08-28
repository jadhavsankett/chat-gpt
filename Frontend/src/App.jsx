import React, { useEffect } from 'react'
import './App.css'
import './styles/forms.css'
import AppRoutes from './AppRoutes'

const App = () => {
  useEffect(() => {
    // Apply system color scheme to the document element and listen for changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = (e) => {
      const isDark = e && typeof e.matches === 'boolean' ? e.matches : mq.matches
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    }

    apply()
    if (mq.addEventListener) mq.addEventListener('change', apply)
    else mq.addListener(apply)

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', apply)
      else mq.removeListener(apply)
    }
  }, [])

  return (
    <div>
      <AppRoutes />
    </div>
  )
}

export default App
