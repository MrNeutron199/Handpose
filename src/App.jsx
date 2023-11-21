import React, { useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "./App.css";
import { drawHand } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const [webcamEnabled, setEnabled]= useState(true)
  const [loadedModel, setModel] = useState(false)
  const [model, setTheModel] = useState()
  const canvasRef = useRef(null);

  const runHandpose = async () => {
   const net = await handpose.load();
   console.log("Loaded Handpose Model")
   setModel(true)
   setTheModel(net)
 };
 runHandpose();
 const startLoad = () => {
  setInterval(() => {
     detect(model);
   }, 150);
 }
 const startCam = () => {
  setEnabled(true)
  if (!webcamRef.current.video.srcObject) {
    navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then((vid) => {
      webcamRef.current.video.srcObject = vid
    });
  }
}
const stopCam = () => {
  setEnabled(false)
  if (webcamRef.current.video.srcObject) {
    for (const track of webcamRef.current.video.srcObject.getVideoTracks()) {
      track.stop();
    }
    webcamRef.current.video.srcObject = null;
  };
}
const detect = async (net) => {
 if (typeof webcamRef.current !== 'undefined' && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
   const video = webcamRef.current.video;
   const videoWidth = video.videoWidth;
   const videoHeight = video.videoHeight;
   video.width = videoWidth;
   video.height = videoHeight;
   canvasRef.current.width = videoWidth;
   canvasRef.current.height = videoHeight;
   const hand = await net.estimateHands(video);
   const ctx = canvasRef.current.getContext('2d');
   drawHand(hand, ctx);
 }
};

return (
 <>
 <header className="App-header">
 <div style={{ width: 640, height: 480 }}>
 <Webcam ref={webcamRef} className="forOverlap"style={{ position: 'absolute', marginLeft: 'auto', marginRight: 'auto', left: 0, 
 right: 0, textAlign: 'center', width: 640, height: 480, zindex: 1 }}/>
 <canvas ref={canvasRef} className="forOverlap" style={{ position: 'absolute', marginLeft: 'auto', marginRight: 'auto', left: 0, 
 right: 0, textAlign: 'center', width: 640, height: 480, zindex: 2 }}/>
 </div>
 <div className="controlDiv">
 {
  webcamEnabled? <button onClick={stopCam}>Disable Webcam</button> : <button onClick={startCam}>Enable Webcam</button>
}
{
  loadedModel? <button onClick={startLoad}>Detect Hands</button> : <button disabled={true}>Detect Hands</button>
}
</div>
</header>
</>
);
}

export default App;
