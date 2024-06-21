import StreamType from '@/components/streamType'
import React from 'react'

const Home = () => {
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div className='h-[300px] w-full rounded-[20px] bg-hero bg-cover'>
        <div className='flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11'>
          Start a new Stream
        </div>
      </div>

      <StreamType />
    </section>
  )
}

export default Home