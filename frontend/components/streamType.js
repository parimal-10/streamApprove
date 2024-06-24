'use client'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'

const StreamType = () => {
  const router = useRouter();
  const [streamType, setStreamType] = useState(undefined);

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

  const createStream = () => {
    router.push(`/stream/${randomID(5)}`);
  }

  const joinStream = (streamID) => {
    const url = window.location.protocol + '//' +
      window.location.host + window.location.pathname + 
      '/stream' + 
      '?roomID=' +
      streamID +
      '&role=Audience'
    router.push(`/stream/${streamID}`)
  }

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard
        img='icons/add-meeting.svg'
        title='New Stream'
        description='Start an instant stream'
        handleClick={() => setStreamType('newStream')}
        className='bg-orange-1'
      />
      <HomeCard
        img='icons/join-meeting.svg'
        title='Join Stream'
        description='Join an existing stream'
        handleClick={() => setStreamType('joinStream')}
        className='bg-blue-1'
      />

      <MeetingModal
        isOpen={streamType === 'newStream' || streamType === 'joinStream'}
        onClose={() => setStreamType(undefined)}
        title={streamType === 'newStream'
          ? 'Start a new stream'
          : streamType === 'joinStream'
            ? 'Join a stream'
            : undefined
        }
        className='text-center'
        buttonText={streamType === 'newStream'
          ? 'Start Stream'
          : streamType === 'joinStream'
            ? 'Join Stream'
            : undefined
        }
        isJoinStream={streamType === 'joinStream' ? true : false}
        handleClick={streamType === 'newStream' ? createStream : joinStream}
      />
    </section>
  )
}

export default StreamType