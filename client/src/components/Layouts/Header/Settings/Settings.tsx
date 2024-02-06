import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { changeDeviceAction } from 'redux/actions/userActions'
import { userDevicesSelector } from 'redux/selectors/userSelectors'

import Selector from 'components/components/Selector/Selector'
import PopupWindow from 'components/components/PopupWindow/PopupWindow'

import './styles.scss'

type SettingsProps = {
  close: () => void
}

const Settings = (props: SettingsProps) => {
  const dispatch = useDispatch()
  
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([])
  // const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([])
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([])

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      setAudioInputDevices(devices.filter(device => device.kind === 'audioinput'))
      // setAudioOutputDevices(devices.filter(device => device.kind === 'audiooutput'))
      setVideoInputDevices(devices.filter(device => device.kind === 'videoinput'))
    })
  }, [])

  const userDevices = useSelector(userDevicesSelector)

  const changeDevice = (inputId: string, inputName: string) => {
    localStorage.setItem(inputName, inputId)
    changeDeviceAction(dispatch, { id: inputId, name: inputName })
  }

  return (
    <PopupWindow close={props.close} alt='Settings'>
      <Selector
        label='Audio input'
        value={userDevices.audioInput}
        onChange={(value) => {
          changeDevice(value, 'audioInput')
        }}
        options={audioInputDevices}
        optionLabel='label'
        optionValue='deviceId'
      />
      
      {/* <Selector
        label='Audio output'
        value={userDevices.audioOutput}
        onChange={(value) => {
          changeDevice(value, 'audioOutput')
        }}
        options={audioOutputDevices}
        optionLabel='label'
        optionValue='deviceId'
      /> */}

      <Selector
        label='Video input'
        value={userDevices.videoInput}
        onChange={(value) => {
          changeDevice(value, 'videoInput')
        }}
        options={videoInputDevices}
        optionLabel='label'
        optionValue='deviceId'
      />
    </PopupWindow>
  )
}

export default Settings