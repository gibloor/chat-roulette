import React from 'react'

import './styles.scss'

type ButtonProps = {
  text: string
  onClick: () => void
  className?: string
  disabled?: boolean
  style?: 'long'
}

const Button = (props: ButtonProps) => {

  return (
    <>
    <button
      onClick={props.disabled ? () => {} : props.onClick}
      className={`button ${props.className} ${props.style ? `button__${props.style}` : ''}`}
      disabled={props.disabled}
    >
      {props.text}
    </button>
    </>
  )
}

export default Button