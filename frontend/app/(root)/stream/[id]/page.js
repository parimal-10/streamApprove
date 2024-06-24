'use client'
import React from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function randomID(len) {
    let result = '';
    if (result) return result;
    var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
        maxPos = chars.length,
        i;
    len = len || 5;
    for (i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
}

const Stream = ({ params }) => {
    const roomID = params.id;
    const userID = '12345';
    const userName = 'Parimal';
    const role = ZegoUIKitPrebuilt.Host;

    const sharedLinks = [];
    sharedLinks.push({
        name: 'Join as audience',
        url:
            window.location.protocol + '//' +
            window.location.host + window.location.pathname +
            '?roomID=' +
            roomID +
            '&role=Audience',
    });

    const myMeeting = async (element) => {
        // Create instance object from Kit Token.
        const appID = process.env.NEXT_PUBLIC_ZEGO_CLOUD_APP_ID;
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_CLOUD_SERVER_SECRET;

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(Number(appID), serverSecret, roomID, userID, userName, '1200');
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        // start the call
        zp.joinRoom({
            container: element,
            scenario: {
                mode: ZegoUIKitPrebuilt.LiveStreaming,
                config: {
                    role,
                },
            },
            sharedLinks,
        });
    };

    return (
        <div>
            <div
                className="myCallContainer"
                ref={myMeeting}
                style={{ width: '100vw', height: '100vh' }}
            ></div>
        </div>
    )
}

export default Stream











