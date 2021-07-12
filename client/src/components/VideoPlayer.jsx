import React, { useContext } from 'react';
import { Grid, Typography, Paper, makeStyles } from '@material-ui/core';
import { SocketContext } from '../SocketContext';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import  Button  from '@material-ui/core/Button';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

const useStyles = makeStyles((theme) => ({
    video: {
      width: '600px',
      [theme.breakpoints.down('xs')]: {
        width: '250px',
      },
    },
    gridContainer: {
      justifyContent: 'center',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    paper: {
      padding: '10px',
      border: '2px solid black',
      margin: '10px',
    },
    padding: {
      width:"100px",
      padding: "20px"
    }
  }));

    
function VideoPlayer()
{
      const { name, callAccepted, myVideo, userVideo, callEnded, stream, call, micswitch,videoswitch, toggleMic, toggleVideo} = useContext(SocketContext);
      const classes = useStyles();
    
      return (
        <Grid container className={classes.gridContainer}>
          {stream && (
            <Paper className={classes.paper} variant="outlined">
              <Grid item xs={12} md={6} >
                <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
                    <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
                <Grid container className={classes.video} spacing={3} >
                     <Grid item xs={6}  className={classes.padding}>
                     {!micswitch ? 
                     (<Button variant="contained" color="primary" startIcon={<MicIcon fontSize="large" />} fullWidth onClick={toggleMic} >
                       Mute
                     </Button>) : 
                     (<Button  variant="contained" color="secondary" startIcon={<MicOffIcon fontSize="large" />} fullWidth onClick={toggleMic} >
                       Unmute
                     </Button>
                     )}
                     </Grid>   
                     <Grid item xs={6} className={classes.padding}>
                     {!videoswitch ? 
                       (<Button  variant="contained" color="primary" startIcon={<VideocamIcon fontSize="large" />} fullWidth onClick={toggleVideo} >
                          Disable Video
                       </Button>) : 
                       (<Button  variant="contained" color="secondary" startIcon={<VideocamOffIcon fontSize="large" />} fullWidth onClick={toggleVideo}  >
                          Enable Video 
                      </Button>
                     )}
                     </Grid>
                 </Grid>     

                
              </Grid>
            </Paper>

          )}
          {callAccepted && !callEnded && (
            <Paper className={classes.paper} variant = "outlined">
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>{call.name || 'Name'}</Typography>
                <video playsInline ref={userVideo} autoPlay className={classes.video} />
              </Grid>
            </Paper>
          )}
        </Grid>
      );
   };

export default VideoPlayer;