import { useState, useRef, forwardRef } from 'react'
import Input from './components/Input'
import withFocusTracker, { FocusTrackerInjectedProps } from './hoc/withFocusTracker'
import './App.css'

interface InputWithTrackerProps extends FocusTrackerInjectedProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
}

const InputWithFocusTracker = withFocusTracker<InputWithTrackerProps>(Input)

function App() {
  const [value, setValue] = useState('')
  const [isFocused, setFocused] = useState(false)
  const [focusCount, setFocusCount] = useState(0)
  const [blurCount, setBlurCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleFocus = () => {
    console.log('Focus event triggered')
    setFocusCount((prev) => prev + 1)
  }

  const handleBlur = () => {
    console.log('Blur event triggered')
    setBlurCount((prev) => prev + 1)
  }

  const handleFocusChange = (focused: boolean) => {
    console.log('Focus state changed:', focused)
    setFocused(focused)
  }

  return (
    <div className="app">
      <h1>Focus Tracker HOC Demo</h1>

      <div className="demo-container">
        <h2>Пример с Input</h2>

        <div className="input-wrapper">
          <InputWithFocusTracker
            ref={containerRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocusChange={handleFocusChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Введите текст..."
            className={`custom-input ${isFocused ? 'focused' : ''}`}
          />
        </div>

        <div className="status-panel">
          <h3>Статус фокуса</h3>
          <div className={`status-indicator ${isFocused ? 'active' : ''}`}>
            {isFocused ? '🟢 В фокусе' : '🔴 Не в фокусе'}
          </div>

          <div className="stats">
            <p>Событий focus: <strong>{focusCount}</strong></p>
            <p>Событий blur: <strong>{blurCount}</strong></p>
          </div>
        </div>

        <div className="info-panel">
          <h3>Информация</h3>
          <p>Значение: <code>{value || '(пусто)'}</code></p>
          <p>Ref доступен: <code>{containerRef.current ? '✅' : '❌'}</code></p>
        </div>
      </div>

      <div className="demo-container">
        <h2>Пример с кнопкой</h2>
        <ButtonWithFocusTracker
          onFocusChange={(focused) => console.log('Button focus:', focused)}
          className="custom-button"
        >
          Нажми меня
        </ButtonWithFocusTracker>
      </div>
    </div>
  )
}

interface ButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={className}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

const ButtonWithFocusTracker = withFocusTracker(Button)

export default App
