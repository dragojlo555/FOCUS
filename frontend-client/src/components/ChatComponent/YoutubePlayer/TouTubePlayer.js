import React from 'react';
import ReactPlayer from "react-player";

const YouTubePlayer=(props)=>{

    return(
        <div style={{width: '100%'}}>
        <ReactPlayer url={'https://www.youtube.com/watch?v=' + props.content}
                     width='100%'
                     config={{
                         youtube: {
                             playerVars: {
                                 showinfo: 0, controls: 1, origin: 'http://localhost:3000',
                                 enablejsapi: 1,
                             }
                         }
                     }}
        />
            /></div>
    )

};

export default YouTubePlayer;