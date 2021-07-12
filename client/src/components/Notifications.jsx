import React, { useContext } from 'react';
import { SocketContext } from '../SocketContext';
import  Button  from '@material-ui/core/Button';
import CallIcon from '@material-ui/icons/Call';
import CallEndIcon from '@material-ui/icons/CallEnd';

function Notifications()
{
  const { answerCall, call, callAccepted, rejectCall } = useContext(SocketContext);

  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h1>{call.name} is calling:</h1>
          <Button variant="contained" color="primary" startIcon={<CallIcon fontSize="large" />}  size="medium"  onClick={answerCall}>
            Accept
          </Button>
          <Button variant="contained" color="secondary" startIcon={<CallEndIcon fontSize="large" />}  size="medium" onClick={rejectCall}>
            Reject
          </Button>
        </div>
      )}
    </>
  );
};

export default Notifications;