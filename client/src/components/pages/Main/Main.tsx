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
  const [socketId, setSocketId] = useState('')
  const [interlocutorId, setInterlocutorId] = useState('')
  const [brokenCamera, setBrokenCamera] = useState(false)
  const [chatStarted, setChatStarted] = useState(false)

  const myVideo = useRef<HTMLVideoElement | null>(null)
  const interlocutorVideo = useRef<HTMLVideoElement | null>(null)
  const connectionRef = useRef<Peer.Instance | null>(null)

  const userDevices = useSelector(userDevicesSelector)
  const user = useSelector(userSelector)

  useEffect(() => {
    setSocket(io(
      process.env.REACT_APP_DOMAIN ? `${process.env.REACT_APP_DOMAIN}` : 'https://localhost:8080'
      ,
      {
        transports: ['websocket'],
        path: '/socket.io'
      }
    ))
  }, [])
  
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { deviceId: userDevices.videoInput }, audio: { deviceId: userDevices.audioInput } })
    .then((currentStream) => {
      setStream(currentStream)
      if (myVideo.current) {
        myVideo.current.srcObject = currentStream
      }
      setBrokenCamera(false)
    }).catch(() => setBrokenCamera(true))
  }, [userDevices.videoInput, userDevices.audioInput])

  useEffect(() => {
    if (socket) {
      socket.on('getId', (id) => setSocketId(id))
    }
  }, [socket])

  const startCommunication = () => {
    console.log(socket, socketId)
    if (socket && socketId) {
      try {
        const peer = new Peer({ initiator: true, trickle: false, stream })
        
        socket.off('callAccepted')
        connectionRef.current?.destroy(new Error('External connection'))

        peer.on('signal', (signal) => {
          socket.emit('startCommunication', { signal, socketId: socketId, userId: user.id, country: 'pl', reputation: user.reputation, restrictionOn: true })
        })
        peer.on('stream', (currentStream) => {
          if (interlocutorVideo.current) interlocutorVideo.current.srcObject = currentStream
        })

        socket.on('callAccepted', ({ signal, userId }) => {
          setInterlocutorId(userId)
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
    if (socket && stream) {
      socket.off('connectInterlocutorToUser')

      socket.on('connectInterlocutorToUser', ({ signal, socketId, userId }) =>  {
        setInterlocutorId(userId)
        const peer = new Peer({ initiator: false, trickle: false, stream })
        peer.on('signal', (signal) => {
          socket.emit('answerCall', { signal, socketId: socketId, userId: user.id })
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
  }, [socketId, stream?.id])

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
        picture: screenshotDataUrl,
        userId: interlocutorId
      })
    }
  }


  useEffect(() => {
    if (stream?.id && connectionRef.current) {
      const currentVideoTrack = connectionRef.current?.streams[0].getVideoTracks()[0]
      const currentAudioTrack = connectionRef.current?.streams[0].getAudioTracks()[0]
      const newVideoTrack = stream.getVideoTracks()[0]
      const newAudioTrack = stream.getAudioTracks()[0]
      connectionRef.current.replaceTrack(currentVideoTrack, newVideoTrack, connectionRef.current?.streams[0])
      connectionRef.current.replaceTrack(currentAudioTrack, newAudioTrack, connectionRef.current?.streams[0])
    }
  }, [stream?.id])

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