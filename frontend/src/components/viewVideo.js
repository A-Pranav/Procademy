import React from 'react'

export default function ViewVideo(props) {
    return (
        <>
            <div>
                ViewVideo
                <br />
                <video controls width="600px" height="500px" src={props.videoLink}></video>
                <h6>{props.vid}</h6>
            </div>
        </>

    )
}