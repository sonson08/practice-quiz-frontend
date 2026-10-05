import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

function Button({ className = '', type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={`btn ${className}`.trim()} {...props} />
}

export default Button
