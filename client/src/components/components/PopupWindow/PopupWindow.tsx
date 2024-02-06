import React from 'react'
import OutsideClickHandler from 'react-outside-click-handler';

import cross from './cross.svg'

import './styles.scss'

type PopupWindowProps = {
  close: () => void
  alt: string
  children: React.ReactNode
}

const PopupWindow = (props: PopupWindowProps) => {

  return (
    <div className='popup-window'>
      <OutsideClickHandler onOutsideClick={(e) => {
        if (e.target instanceof HTMLElement && 'alt' in e.target) {
          e.target.alt !== props.alt && props.close() 
        } else {
          props.close()
        }
      }}>
        <img
          src={cross}
          className='popup-window__cross'
          onClick={() => props.close()}
        />
        {props.children}
      </OutsideClickHandler>
    </div>
  )
}

export default PopupWindow