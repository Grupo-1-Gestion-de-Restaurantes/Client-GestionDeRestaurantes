import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useThemeStore } from '../shared/store/useThemeStore'
import '../styles/index.css'

useThemeStore.getState().init()

const Root = () => {
  const { isDark, toggle } = useThemeStore()
  return (
    <div>
      <h1>Gestión de Restaurantes</h1>
      <button onClick={toggle}>
        {isDark ? '☀️ Claro' : '🌙 Oscuro'}
      </button>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)