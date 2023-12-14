import React, { useEffect, useRef, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import Peer from 'simple-peer'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useSelector } from 'react-redux'

import Settings from 'components/Layouts/Header/Settings/Settings'
import { userDevicesSelector } from 'redux/selectors/userSelectors'
import Button from 'components/components/Button/Button'

import './styles.scss'

type Call = {
  isReceivingCall: true
  from: any
  name: any
  signal: any
}

const Main = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [callAccepted, setCallAccepted] = useState(false)
  const [callEnded, setCallEnded] = useState(false)
  const [stream, setStream] = useState<MediaStream | undefined>()
  const [name, setName] = useState('')
  const [call, setCall] = useState<Call | undefined>()
  const [idToCall, setIdToCall] = useState('')
  const [brokenCamera, setBrokenCamera] = useState(false)
  const [me, setMe] = useState('')
  const myVideo = useRef<HTMLVideoElement | null>(null)
  const userVideo = useRef<HTMLVideoElement | null>(null)
  const connectionRef = useRef<Peer.Instance | null>(null)

  useEffect(() => {
    setSocket(io('https://192.168.0.38:8080'))
  }, [])

  const userDevices = useSelector(userDevicesSelector)

  useEffect(() => {
    if (socket) {
      navigator.mediaDevices.getUserMedia({ video: { deviceId: userDevices.videoInput }, audio: true })
      .then((currentStream) => {
        setStream(currentStream)
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream
        }
        setBrokenCamera(false)
      }).catch(() => setBrokenCamera(true))
      
      socket.on('me', (id) => setMe(id))
      socket.on('callUser', ({ from, name: callerName, signal }) => {
        setCall({ isReceivingCall: true, from, name: callerName, signal })
      })
    }
  }, [socket, userDevices.videoInput])

  const answerCall = () => {
    if (socket) {
      setCallAccepted(true)
      const peer = new Peer({ initiator: false, trickle: false, stream })
      peer.on('signal', (data) => {
        socket.emit('answerCall', { signal: data, to: call?.from })
      })
      peer.on('stream', (currentStream) => {
        if (userVideo.current) userVideo.current.srcObject = currentStream
      })
      peer.signal(call?.signal)
      connectionRef.current = peer
    }
  }

  const callUser = (id: string) => {
    if (socket) {
      const peer = new Peer({ initiator: true, trickle: false, stream })
      peer.on('signal', (data) => {
        socket.emit('callUser', { userToCall: id, signalData: data, from: me, name })
      })
      peer.on('stream', (currentStream) => {
        if (userVideo.current) userVideo.current.srcObject = currentStream
      })
      socket.on('callAccepted', (signal) => {
        setCallAccepted(true)
        peer.signal(signal)
      })
      connectionRef.current = peer
    }
  }

  const leaveCall = () => {
    setCallEnded(true)
    if (connectionRef.current) connectionRef.current.destroy()
    window.location.reload()
  }

  return (
    <div className='main'>
      <video className={`main__video ${brokenCamera ? 'hide' : ''}`} playsInline muted ref={myVideo} autoPlay />
      {brokenCamera && <div>Broken camera</div>}

      <Button
        text='Start video chat'
        onClick={() => {}}
        className='main__start-button'
      />
    </div>
    // <div className='main' style={{ display: 'flex' }}>
    //   <div>
    //     <div>
    //       <h5>
    //         {name || 'Name'}
    //       </h5>
    //       <video playsInline muted ref={myVideo} autoPlay width="600" />
    //     </div>
        
    //     <div>
    //       <h5>
    //         {call?.name || 'Name'}
    //       </h5>
    //       <video playsInline ref={userVideo} autoPlay width="600" />
    //     </div>
    //   </div>

    //   <div>
    //     <div>
    //       <div>
    //         <div>
    //           <h6> Account Info </h6>
    //           <div>Username</div>
    //           <input type='text' value={name} onChange={(e) => setName(e.target.value)} width="100%" />
    //           <CopyToClipboard text={me}>
    //             <button>
    //               Copy ID
    //             </button>
    //           </CopyToClipboard>
    //         </div>
    //         <div>
    //           <h6> Make a Call </h6>
    //           <div> User id to call </div>
    //           <input type='text' value={idToCall} onChange={(e) => setIdToCall(e.target.value)} width="100%" />
    //           {
    //             callAccepted && !callEnded ? (
    //               <button onClick={leaveCall}>
    //                 Hang up
    //               </button>
    //             ) : (
    //               <button onClick={() => callUser(idToCall)}>
    //                 Call
    //               </button>
    //             )
    //           }
    //         </div>
    //       </div>
    //     </div>

    //     {call?.isReceivingCall && !callAccepted && (
    //       <div>
    //         <h3> {call.name} is calling </h3>
    //         <button onClick={answerCall}>
    //           Answer Call
    //         </button>
    //       </div>
    //     )}
    //   </div>

    // <Settings />

    // </div>
  )
}

export default Main