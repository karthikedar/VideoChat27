import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();
const socket = io('http://localhost:5000');

const ContextProvider = ({ children }) => {
const [callAccepted, setCallAccepted] = useState(false);
const [callEnded, setCallEnded] = useState(false);
const [stream, setStream] = useState();
const [name, setName] = useState('');
const [call, setCall] = useState({});
const [me, setMe] = useState('');
const [micswitch, setMicswitch] = useState(false);
const [videoswitch, setVideoswitch] = useState(false);
const [shareScr, setShareScr] = useState(false);
//const [initialVideo, setInitialVideo] = useState({});
const [initialVideo, setInitialVideo] = useState({});

const myVideo = useRef();
const userVideo = useRef();
const connectionRef = useRef();
//const senders= useRef([]);


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

  const acceptCall = () => {
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
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });
    //added
    //stream.current.getTracks().forEach(track => senders.current.push(userVideo.current.addTrack(track,stream.current)));
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();
    //New edit
    //window.location.reload();
  };

  function toggleVideo() {
    if(stream != null && stream.getVideoTracks().length > 0){
      setVideoswitch(!videoswitch)
      stream.getVideoTracks()[0].enabled = videoswitch;
    }
  
  }
  
  function toggleMic() {
    if(stream != null && stream.getAudioTracks().length > 0){
      setMicswitch(!micswitch)
      stream.getAudioTracks()[0].enabled = micswitch;
    }     
  }
  function stopShare() {
    setShareScr(false);
    myVideo.current.srcObject = initialVideo;

  }
  function shareScreen()  {
    setShareScr(true);
    navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(currentStream => {
      const screenTrack = currentStream;
      setInitialVideo(myVideo.current.srcObject);
      myVideo.current.srcObject = screenTrack;
     
     //AddedNow
     //currentStream.getVideoTracks()[0].onended = stopShare();
   })
  }
  // function stopShare() {
  //   setShareScr(false);
  //   stream.getVideoTracks()[0]= initialVideo;

  // }
  // function shareScreen() {
  //   navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(currentStream => {
  //       const screenTrack = currentStream.getTracks()[0];
  //       setInitialVideo(stream.getVideoTracks()[0]);
  //       stream.getVideoTracks()[0] = screenTrack;
  //       setShareScr(true);
  //       screenTrack.onended = stopShare();
  //   })}


  

  

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
      shareScr,
      
      setName,
      callUser,
      leaveCall,
      acceptCall,
      toggleVideo,
      toggleMic,
      shareScreen,
      stopShare
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };