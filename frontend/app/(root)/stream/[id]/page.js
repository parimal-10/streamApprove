'use client'
import React from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import Invalid from '@/components/Invalid';
import randomID from '@/lib/randomID';
import { useRouter } from 'next/navigation';

const appID = process.env.NEXT_PUBLIC_ZEGO_CLOUD_APP_ID;
const serverSecret = process.env.NEXT_PUBLIC_ZEGO_CLOUD_SERVER_SECRET;
const server = process.env.NEXT_PUBLIC_ZEGO_CLOUD_SERVER;

export function getUrlParams(
    url = window.location.href
) {
    let urlStr = url.split('?')[1];
    return new URLSearchParams(urlStr);
}

const Stream = ({ params }) => {
    const router = useRouter();

    const roomID = params.id;
    const userID = randomID(5);
    const userName = randomID(5);
    let role_str = getUrlParams(window.location.href).get('role');
    const role =
        role_str === 'Host'
            ? ZegoUIKitPrebuilt.Host
            : role_str === 'Cohost'
                ? ZegoUIKitPrebuilt.Cohost
                : role_str==='Audience'
                    ? ZegoUIKitPrebuilt.Audience
                    :null;

    if(!role) return (<Invalid />);
    
    const secret = randomID(5);

    const sharedLinks = [];
    if (role === ZegoUIKitPrebuilt.Host || role === ZegoUIKitPrebuilt.Cohost) {
        sharedLinks.push({
            name: 'Join as co-host',
            url:
                window.location.protocol + '//' +
                window.location.host + window.location.pathname +
                '?role=Cohost',
        });
    }
    sharedLinks.push({
        name: 'Join as audience',
        url:
            window.location.protocol + '//' +
            window.location.host + window.location.pathname +
            '?role=Audience',
    });

    // const streamURL = 'rtmp://a.rtmp.youtube.com/live2/w05a-a9we-y1g3-76wv-e0wa'

    const myMeeting = async (element) => {
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(Number(appID), serverSecret, roomID, userID, userName, 100);
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        const streamURL = zp.localStream;


        // start the call
        zp.joinRoom({
            container: element,
            scenario: {
                mode: ZegoUIKitPrebuilt.LiveStreaming,
                config: {
                    role,
                    liveStreamingMode: ZegoUIKitPrebuilt.LiveStreamingMode.LiveStreaming
                },
            },
            maxUsers: 100,
            videoResolutionList: [
                ZegoUIKitPrebuilt.VideoResolution_360P,
                ZegoUIKitPrebuilt.VideoResolution_180P,
                ZegoUIKitPrebuilt.VideoResolution_480P,
                ZegoUIKitPrebuilt.VideoResolution_720P,
            ],
            videoResolutionDefault: ZegoUIKitPrebuilt.VideoResolution_480P,
            sharedLinks,
            onReturnToHomeScreenClicked: () => { router.push('/') },
            enableUserSearch: true,
            showRoomTimer: true,
            branding: {
                logoURL: '/icons/logo.svg',
            },
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











