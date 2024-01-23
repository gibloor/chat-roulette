import React, { useState, useEffect } from 'react'

import arrow from './arrow.svg'

import './styles.scss'

type SelectorProps = {
  label: string
  value: string
  onChange: (value: any) => any
  options: any[]
  optionLabel: string
  optionValue: string
}

const Selector = (props: SelectorProps) => {
  const [openSelector, setOpenSelector] = useState(false)
  const [selectorLabel, setSelectorLabel] = useState('default')

  useEffect(() => {
    const option = props.options.find(option => option[props.optionValue] === props.value)
    option ? setSelectorLabel(option[props.optionLabel]) : setSelectorLabel('default')
  }, [props.value, props.options.length])

  return (
    <div className='selector'>
      <span className='selector__label'>
        {props.label}
      </span>
      
      <div className='selector__options'>
        <div
          className={`selector__value selector__field ${openSelector ? 'selector__value_open' : 'selector__value_closed'}`}
          onClick={() => {setOpenSelector(!openSelector)}}
        >
          <span>
            {selectorLabel}
          </span>
          <img
            className={`selector__arrow ${openSelector ? 'selector__arrow_open' : 'selector__arrow_closed'}`}
            src={arrow}
          />
        </div>
        {openSelector && props.options.map(option => (
          <>
            {props.value !== option[props.optionValue] &&
              <span
                key={option[props.optionValue]}
                className='selector__option selector__field'
                onClick={() => {
                  setOpenSelector(false)
                  props.onChange(option[props.optionValue])
                }}
              >
                {option[props.optionLabel]}
              </span>
            }
          </>
        ))}
      </div>
    </div>
  )
}

export default Selector