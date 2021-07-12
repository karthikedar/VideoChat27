import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();
const socket = io('https://video-chat-app2705.herokuapp.com');

const ContextProvider = ({ children }) => {
const [callAccepted, setCallAccepted] = useState(false);
const [callEnded, setCallEnded] = useState(false);
const [stream, setStream] = useState();
const [name, setName] = useState('');
const [call, setCall] = useState({});
const [me, setMe] = useState('');
const [micswitch, setMicswitch] = useState(false);
const [videoswitch, setVideoswitch] = useState(false);

const myVideo = useRef();
const userVideo = useRef();
const connectionRef = useRef();


useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
});

socket.on('me', (id) => setMe(id));

socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
    
}, []);


const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);
    
    connectionRef.current = peer;
  };

  const callUser = (id) => {
    if(id === '')
   {
     alert('Enter A CaLLer Id');
   }
   else
   {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      if(name === '')
      {
        alert('Enter Your Name Pls');
      }
      else
      {
       socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
      }
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });
    connectionRef.current = peer;
  }
  };
  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();
  };
  const rejectCall = () => {
      setCall({ isReceivingCall:false });
  };


  const toggleVideo = () => {
    if(stream != null && stream.getVideoTracks().length > 0){
      setVideoswitch(!videoswitch)
      stream.getVideoTracks()[0].enabled = videoswitch;
    }
  
  }
  
  const toggleMic= () => {
    if(stream != null && stream.getAudioTracks().length > 0){
      setMicswitch(!micswitch)
      stream.getAudioTracks()[0].enabled = micswitch;
    }     
  }
  
return (
    <SocketContext.Provider value={{
      
      callAccepted,
      callEnded,
      stream,
      name,
      call,
      myVideo,
      userVideo,
      me,
      micswitch,
      videoswitch,
      setName,
      callUser,
      leaveCall,
      answerCall,
      toggleVideo,
      toggleMic,
      rejectCall
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };