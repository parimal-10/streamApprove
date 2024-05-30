"use client"
import { useEffect, useState } from "react";

export default function StreamPage() {

  const [media, setMedia] = useState(null);
  const [socket, setSocket] = useState(null);
  const [video, setVideo] = useState(null);

  async function showVideo() {
    setVideo(document.createElement('video'));
    video.style.transform = 'scaleX(-1)';

    setCanvas(document.getElementById('user-canvas'));
    setCanvasContext(canvas.getContext('2d'));
    document.body.appendChild(canvas);

    const userMedia = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
    setMedia(userMedia);
    video.srcObject = userMedia;
    video.play();

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      chooseLayout(canvas, canvasContext, video, 0);
    };
  }

  async function startStream() {
    setSocket(new WebSocket(process.env.NEXT_PUBLIC_BACKEND_URL));

    const canvasStream = canvas.captureStream(30); // Capture canvas at 30fps

    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...media.getAudioTracks()
    ]);

    const mediaRecorder = new MediaRecorder(combinedStream, {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
      framerate: 30
    });

    mediaRecorder.ondataavailable = (e) => {
      // console.log('Data', e.data);
      socket.send(e.data); // Send the data to the server
    };

    mediaRecorder.start(500); // Start recording, and set timeslice to 500ms

    socket.onopen = () => {
      console.log('Connected to server');
    };
    socket.onmessage = (event) => {
      console.log('Message received:', event.data);
    };
    socket.onclose = () => {
      mediaRecorder.stop(); // Stop recording when WebSocket connection is closed
      console.log('WebSocket connection closed');
    };
    socket.onerror = (error) => {
      mediaRecorder.stop(); // Stop recording on error
      console.error('WebSocket error:', error);
    };
  }

  async function stopVideo() {
    const videoTracks = media.getVideoTracks();
    videoTracks.forEach(track => {
      track.stop();
    });
  }

  async function muteStream() {
    const audioTracks = media.getAudioTracks();
    audioTracks.forEach(track => {
      track.enabled = !track.enabled;
    });
  }

  async function stopStream() {
    socket.close();
  }

  function chooseLayout(canvas, video, canvasContext, layout) {
    if (layout === 0) {
      canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(drawCanvas);
    }
  }

  useEffect(() => {
    showVideo();
  }, []);
  return (
    <div>
      <button onClick={startStream}>Start Stream</button>
      <canvas id="user-canvas"></canvas>
    </div>
  )
}