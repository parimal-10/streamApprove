"use client"

export default function Home() {
  async function handle() {
    const socket = new WebSocket(process.env.NEXT_PUBLIC_BACKEND_URL);

    socket.onopen = () => {
      console.log('Connected to server');
    };
    socket.onmessage = (event) => {
      console.log('Message received:', event.data);
    };
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    const video = document.createElement('video');
    video.id = 'user-video';
    video.style.transform = 'scaleX(-1)';
    document.body.appendChild(video);

    const media = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    video.srcObject = media;
    video.play();

    const mediaRecorder = new MediaRecorder(media, {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
      framerate: 25
    });

    mediaRecorder.ondataavailable = (e) => {
      // console.log('Binary Stream Available', e.data);
      socket.send(e.data); // Send the binary data over WebSocket
    };

    mediaRecorder.start(25); // Start recording, and set timeslice to 100ms for more frequent data availability events

    socket.onclose = () => {
      mediaRecorder.stop(); // Stop recording when WebSocket connection is closed
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      mediaRecorder.stop(); // Stop recording on error
      console.error('WebSocket error:', error);
    };
  }

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handle}>Start</button>
    </div>
  );
}
