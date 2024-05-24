import express from "express";
import { WebSocketServer } from 'ws';
import { spawn } from 'child_process'

const app = express();
const port = 3000;
const wsPort = 8080;

app.get('/', (req, res) => {
    res.send('Hello, this is the WebSocket server.');
});

app.listen(port, () => {
    console.log(`HTTP server is running on http://localhost:${port}`);
});

const wss = new WebSocketServer({ port: wsPort });

function startFFmpegProcess(connectionUrl) {
    const options = [
        '-i', '-',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-tune', 'zerolatency',
        '-r', '25',
        '-g', '50',
        '-keyint_min', '25',
        '-crf', '25',
        '-pix_fmt', 'yuv420p',
        '-sc_threshold', '0',
        '-profile:v', 'main',
        '-level', '3.1',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-ar', '32000',
        '-f', 'flv',
        `${connectionUrl}`
    ];

    const ffmpegProcess = spawn('ffmpeg', options);

    ffmpegProcess.stdout.on('data', (data) => {
        console.log(`ffmpeg stdout: ${data}`);
    });

    ffmpegProcess.stderr.on('data', (data) => {
        console.error(`ffmpeg stderr: ${data}`);
    });

    ffmpegProcess.on('close', (code) => {
        console.log(`ffmpeg process exited with code ${code}`);
    });

    return ffmpegProcess;
}

wss.on('connection', (ws) => {

    let ffmpegProcess = startFFmpegProcess();

    ws.on('message', (data) => {
        // console.log(data);
        if (ffmpegProcess.stdin.writable) {
            ffmpegProcess.stdin.write(data, (err) => {
                if (err) {
                    console.error('Error writing to ffmpeg stdin:', err);
                }
            });
        } else {
            console.error('Cannot write to ffmpeg stdin, stream is destroyed.');
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.send('Welcome to the WebSocket server!');

    ffmpegProcess.on('close', (code) => {
        console.log(`ffmpeg process exited with code ${code}, restarting...`);
        ffmpegProcess = startFFmpegProcess();
    });
});