import React, { useContext } from 'react';
import  Button  from '@material-ui/core/Button';

import { SocketContext } from '../SocketContext';

function Notifications()
{
  const { answerCall, call, callAccepted } = useContext(SocketContext);

  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h1>{call.name} is calling:</h1>
          <Button variant="contained" color="primary" size="large" onClick={answerCall}>
            Accept Call
          </Button>
        </div>
      )}
    </>
  );
};

export default Notifications;