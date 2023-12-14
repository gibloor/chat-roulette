import React from 'react'

import './styles.scss'

type ButtonProps = {
  text: string
  onClick: () => void
  className?: string
}

const Button = (props: ButtonProps) => {

  return (
    <button onClick={props.onClick} className={`button ${props.className}`}>
      {props.text}
    </button>
  )
}

export default Button