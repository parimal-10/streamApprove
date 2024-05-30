import express from "express";
import { WebSocketServer } from "ws";
import { spawn } from "child_process";
import options from "./utils/options";

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

let ffmpegProcess = startFFmpegProcess();

function startFFmpegProcess() {

    const ffmpegProcess = spawn("ffmpeg", options, {stdio: "pipe"});

    ffmpegProcess.stdout.on('data', (data) => {
        console.log(`ffmpeg stdout: ${data}`);
    });

    ffmpegProcess.stderr.on('data', (data) => {
        console.error(`ffmpeg stderr: ${data}`);
    });

    ffmpegProcess.on('close', (code) => {
        console.log(`ffmpeg process exited with code ${code}`);
    });

    ffmpegProcess.on('close', (code) => {
        console.log(`ffmpeg process exited with code ${code}, restarting...`);
        ffmpegProcess = startFFmpegProcess();
    });

    if (ffmpegProcess.stdin.writable) {
        ffmpegProcess.stdin.write(data, (err) => {
            if (err) {
                console.error('Error writing to ffmpeg stdin:', err);
            }
        });
    } else {
        console.error('Cannot write to ffmpeg stdin, stream is destroyed.');
    }

    return ffmpegProcess;
}

function signalData(data, ws) {
    
}

wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        signalData(data, ws);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});