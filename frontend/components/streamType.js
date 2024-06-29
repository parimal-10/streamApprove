'use client'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import randomID from '@/lib/randomID'

const StreamType = () => {
  const router = useRouter();
  const [streamType, setStreamType] = useState(undefined);

  const createStream = () => {
    router.push(`/stream/${randomID(5)}?role=Host`);
  }

  const joinStream = (streamID) => {
    const url = window.location.protocol + '//' +
      window.location.host + window.location.pathname + 
      '/stream/' + 
      streamID +
      '?role=Cohost'
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