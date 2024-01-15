import React, { useEffect, useRef, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import Peer from 'simple-peer'
import { useSelector } from 'react-redux'
import html2canvas from 'html2canvas'
import axios from 'axios'

import { DOMAIN } from 'redux/reduxVariables'
import { userDevicesSelector, userSelector } from 'redux/selectors/userSelectors'

import Button from 'components/components/Button/Button'

import './styles.scss'

const Main = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [stream, setStream] = useState<MediaStream | undefined>()
  const [userId, setUserId] = useState('')
  // const [interlocutorId, setInterlocutorId] = useState('')
  const [brokenCamera, setBrokenCamera] = useState(false)
  const [chatStarted, setChatStarted] = useState(false)

  const myVideo = useRef<HTMLVideoElement | null>(null)
  const interlocutorVideo = useRef<HTMLVideoElement | null>(null)
  const connectionRef = useRef<Peer.Instance | null>(null)

  const userDevices = useSelector(userDevicesSelector)
  const user = useSelector(userSelector)

  useEffect(() => {
    setSocket(io('https://192.168.0.38:8080'))
  }, [])

  const startCommunication = () => {
    if (socket && userId) {
      try {
        const peer = new Peer({ initiator: true, trickle: false, stream })
        
        socket.off('callAccepted')
        connectionRef.current?.destroy(new Error('External connection'))

        peer.on('signal', (signal) => {
          socket.emit('startCommunication', { signal, from: userId, country: 'pl', reputation: user.reputation, restrictionOn: true })
        })
        peer.on('stream', (currentStream) => {
          if (interlocutorVideo.current) interlocutorVideo.current.srcObject = currentStream
        })

        socket.on('callAccepted', (signal) => {
          peer.signal(signal)
        })

        let destructionСause = ''

        peer.on('close', () => {
          console.log('initiator', destructionСause)
          
          if (destructionСause == 'External connection') {
            console.log(11)
          } else if (destructionСause == 'Manually stopped') {
            console.log(12)
          } else if (destructionСause == 'Cleaning') {
            console.log(13)
          } else {
            console.log(14)
            startCommunication()
          }
        })

        peer.on('error', (err) => {
          console.error('Initiator Peer connection error:', err)

          destructionСause = err.message
        })

        connectionRef.current = peer
      } catch (error) {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { deviceId: userDevices.videoInput }, audio: true })
    .then((currentStream) => {
      setStream(currentStream)
      if (myVideo.current) {
        myVideo.current.srcObject = currentStream
      }
      setBrokenCamera(false)
    }).catch(() => setBrokenCamera(true))
  }, [userDevices.videoInput])

  useEffect(() => {
    if (socket) {
      socket.on('getId', (id) => setUserId(id))
    }
  }, [socket])

  useEffect(() => {
    if (socket && stream) {
      socket.off('connectInterlocutorToUser')

      socket.on('connectInterlocutorToUser', ({ signal, from }) =>  {
        const peer = new Peer({ initiator: false, trickle: false, stream })
        peer.on('signal', (signal) => {
          socket.emit('answerCall', { signal, userId: from })
        })
        peer.on('stream', (currentStream) => {
          if (interlocutorVideo.current) interlocutorVideo.current.srcObject = currentStream
        })

        peer.signal(signal)

        let destructionСause = ''

        peer.on('close', () => {
          console.log('non initiator', destructionСause)

          if (destructionСause === 'Cleaning') {
            console.log(21)
          } else if (destructionСause === 'Manually stopped') {
            console.log(22)
          } else {
            console.log(23)
            startCommunication()
          }
        })
        peer.on('error', (err) => {
          console.error('Non-Initiator Peer connection error:', err)

          destructionСause = err.message
        })
        
        connectionRef.current?.destroy(new Error('Cleaning'))
        connectionRef.current = peer
      })
    }
  }, [userId, stream?.id])

  const stop = () => {
    connectionRef.current?.destroy(new Error('Manually stopped'))
    socket?.off('connectInterlocutorToUser')
  }

  const ban = async () => {
    if (interlocutorVideo.current) {
      const videoElement = interlocutorVideo.current

      const canvas = await html2canvas(videoElement)
      const screenshotDataUrl = await canvas.toDataURL('image/png')
      await axios.post(`${DOMAIN}/user/ban`, {
        picture: screenshotDataUrl
      })
    }
  }


  return (
    <div className='main'>
      <div className={`main__videos ${chatStarted ? 'main__videos_half-size' : ''}`}>
        <div className={`main__video_container ${chatStarted ? 'main__video_container_half-size' : ''}`}>
          <video
            className={`main__video ${chatStarted ? '' : 'main__video_full-size'} ${brokenCamera ? 'hide' : ''}`}
            ref={myVideo}
            playsInline
            muted
            autoPlay
          />
          {brokenCamera && <div>Broken camera</div>}
        </div>

        <div className={`main__video_container ${chatStarted ? '' : 'hide'} ${chatStarted ? 'main__video_container_half-size' : ''}`}>
          <video
            className={`main__video`}
            ref={interlocutorVideo}
            playsInline
            autoPlay
          />
        </div>
      </div>

      {!chatStarted ?
        <Button
          text='Start'
          onClick={() => {
            startCommunication()
            setChatStarted(true)
          }}
          className='main__start-button'
          style='long'
          disabled={!user.name}
        /> :
        <div className='main__action-buttons'>
          <Button
            text='Next'
            onClick={startCommunication}
            className=''
          />
          <Button
            text='Stop'
            onClick={stop}
            className=''
          />
          <Button
            text='Ban'
            onClick={ban}
            className=''
          />
        </div>
      }
    </div>
  )
}

export default Main