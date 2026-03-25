import React from 'react'

export interface InputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
  name?: string
  disabled?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, placeholder, className, name, disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        name={name}
        disabled={disabled}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export default Input
