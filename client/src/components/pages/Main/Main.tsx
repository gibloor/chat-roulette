import React, { useEffect, useRef, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import Peer from 'simple-peer'
import { useSelector } from 'react-redux'

import { userDevicesSelector, userSelector } from 'redux/selectors/userSelectors'

import Settings from 'components/Layouts/Header/Settings/Settings'
import Button from 'components/components/Button/Button'

import './styles.scss'

const Main = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [stream, setStream] = useState<MediaStream | undefined>()
  const [userId, setUserId] = useState('')
  const [brokenCamera, setBrokenCamera] = useState(false)

  const myVideo = useRef<HTMLVideoElement | null>(null)
  const interlocutorVideo = useRef<HTMLVideoElement | null>(null)
  const connectionRef = useRef<Peer.Instance | null>(null)

  const userDevices = useSelector(userDevicesSelector)
  const user = useSelector(userSelector)

  useEffect(() => {
    setSocket(io('https://192.168.0.38:8080'))
  }, [])

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
      socket.on('connectInterlocutorToUser', ({ signal, from }) =>  {
        const peer = new Peer({ initiator: false, trickle: false, stream })
        peer.on('signal', (signal) => {
          socket.emit('answerCall', { signal, userId: from })
        })
        peer.on('stream', (currentStream) => {
          console.log('I get video')
          if (interlocutorVideo.current) interlocutorVideo.current.srcObject = currentStream
        })

        peer.signal(signal)
        
        connectionRef.current?.destroy()
        connectionRef.current = peer
      })
    }
  }, [userId, stream?.id])

  const startCommunication = () => {
    if (socket && userId) {
      try {
        const peer = new Peer({ initiator: true, trickle: false, stream })
        
        peer.on('signal', (signal) => {
          socket.emit('startCommunication', { signal, from: userId, country: 'pl', reputation: user.reputation, restrictionOn: true })
        })
        peer.on('stream', (currentStream) => {
          if (interlocutorVideo.current) interlocutorVideo.current.srcObject = currentStream
        })

        socket.on('callAccepted', (signal) => {
          console.log('callAccepter', signal)
          peer.signal(signal)
          console.log(peer)
        })

        connectionRef.current = peer
      } catch (error) {
        console.error(error)
      }
    }
  }

  // const leaveCall = () => {
  //   setCallEnded(true)
  //   if (connectionRef.current) connectionRef.current.destroy()
  //   window.location.reload()
  // }

  return (
    <div className='main'>
      <video className={`main__video ${brokenCamera ? 'hide' : ''}`} playsInline muted ref={myVideo} autoPlay />
      {brokenCamera && <div>Broken camera</div>}

      <Button
        text='Start video chat'
        onClick={() => startCommunication()}
        className='main__start-button'
      />
        <div className={`main__video`}>
          <video playsInline ref={interlocutorVideo} autoPlay />
        </div>
    </div>
  )
}

export default Main