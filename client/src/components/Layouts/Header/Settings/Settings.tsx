import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OutsideClickHandler from 'react-outside-click-handler';

import { changeDeviceAction } from 'redux/actions/userActions'
import { userDevicesSelector } from 'redux/selectors/userSelectors'

import './styles.scss'

type SettingsProps = {
  close: () => void
}

const Settings = (props: SettingsProps) => {
  const dispatch = useDispatch()
  
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([])
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([])
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([])

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      setAudioInputDevices(devices.filter(device => device.kind === 'audioinput'))
      setAudioOutputDevices(devices.filter(device => device.kind === 'audiooutput'))
      setVideoInputDevices(devices.filter(device => device.kind === 'videoinput'))
    })
  }, [])

  const userDevices = useSelector(userDevicesSelector)

  const changeDevice = (inputId: string, inputName: string) => {
    localStorage.setItem(inputName, inputId)
    changeDeviceAction(dispatch, { id: inputId, name: inputName })
  }

  return (
    <div className='settings'>
      <OutsideClickHandler onOutsideClick={(e) => {
        if (e.target instanceof HTMLElement && 'alt' in e.target) {
          e.target.alt !== 'Settings' && props.close() 
        }
      }}>
        <div>
          <p>Audio input</p>
          
          <select onChange={(e) => changeDevice(e.target.value, 'audioInput')} value={userDevices.audioInput}>
            {audioInputDevices.map(device => (
              <option value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <p>Audio output</p>

          <select onChange={(e) => changeDevice(e.target.value, 'audioOutput')} value={userDevices.audioOutput}>
            {audioOutputDevices.map(device => (
              <option value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p>Video input</p>

          <select onChange={(e) => changeDevice(e.target.value, 'videoInput')} value={userDevices.videoInput}>
            {videoInputDevices.map(device => (
              <option value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </div>
      </OutsideClickHandler>
    </div>
  )
}

export default Settings