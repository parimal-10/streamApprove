import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'


const MeetingModal = ({ isOpen, onClose, title, className, children, handleClick, buttonText, image, buttonIcon, isJoinStream }) => {
    const handleJoinStream = () => {
        const streamID = document.querySelector('input[name="streamID"]').value;
        if (!streamID) return;
        handleClick(streamID);
    } 

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white'>
                <div className='flex flex-col gap-6'>
                    {image &&
                        <div className='flex justify-center'>
                            <Image src={image} width={72} height={72} />
                        </div>
                    }
                    <h1 className={cn('text-3xl font-bold leading-[42px]', className)}>{title}</h1>
                    {children}
                    {isJoinStream && (
                        <div>
                            <input
                                name='streamID'
                                type='text'
                                placeholder='Enter the stream ID'
                                className='bg-transparent border-2 border-white text-white w-full p-2 rounded-lg'
                            />
                        </div>
                    )}
                    <Button className='bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0' onClick={isJoinStream ? handleJoinStream : handleClick}>
                        {buttonIcon && (
                            <Image src={buttonIcon} width={13} height={13} />
                        )} &nbsp;
                        {buttonText || 'Join Stream'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MeetingModal