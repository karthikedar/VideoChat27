import React, { useRef} from 'react';
import { Typography, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import VideoPlayer from './components/VideoPlayer';
import Options from './components/Options';
import Notifications from './components/Notifications';
import VideoCallOutlinedIcon from '@material-ui/icons/VideoCall';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
    //Title styling
    vidIcon:
    {
      '& svg': {
        fontSize: 100
      }
    },
    
    appBar: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
     // borderRadius: 15,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      color: 'white',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    overall: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
  }));
function App(){ 
    const classes = useStyles();
    const vidRef = useRef();
    return(

        <div className={classes.overall}>
           <AppBar className={classes.appBar} position="static" color="inherit">
                 <IconButton className={classes.vidIcon} onClick={() =>{ vidRef.current.scrollIntoView({ behavior: 'smooth' }) } } > <VideoCallOutlinedIcon /> </IconButton>
                 <Typography variant="h1" align="center">Video Call</Typography>
           </AppBar> 
           <VideoPlayer />
           <div ref={vidRef}>
            <Options >
               <Notifications />
            </Options>
           </div> 
           
        </div>
    )
    
}

export default App;
