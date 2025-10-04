import React, { Fragment, useRef } from 'react'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material'
import { grayColor } from '../components/constants/color'
import { InputBox } from '../components/styles/StyledComponents'
import FileMenu from '../components/dialogs/FileMenu'
import { sampleMessage } from '../components/constants/sampleData'
import MessageComponent from '../components/shared/MessageComponent'
import { getSocket } from '../socket'
import { useState } from 'react'
import { NEW_MESSAGE } from '../components/constants/events.js'
import { useChatDetailsQuery } from '../redux/api/api.js'

const user = {
    _id: 'asdasdafff',
    name: 'Abishek Nahar Singh'
}

const Chat = ({ chatId }) => {
    const containerRef = useRef(null)

    const socket = getSocket()
    // console.log('from chat component: ', socket)
    const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId })
    // console.log('chatDetails: ', chatDetails.data.chat.members)



    const [message, setMessage] = useState('')
    const members = chatDetails?.data?.chat?.members
    // console.log(members)

    const submitHandler = (e) => {
        e.preventDefault()

        if (!message.trim()) return


        //Emmit message to server using socket
        socket.emit(NEW_MESSAGE, { chatId, members, message });
        setMessage('')

        containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: 'smooth'
        })

    }


    return chatDetails.isLoading ? <Skeleton /> : (
        <Fragment>
            <Stack
                ref={containerRef}
                boxSizing={'border-box'}
                padding={'1rem'}
                spacing={'1rem'}
                bgcolor={grayColor}
                height={'90%'}
                sx={{
                    overflow: 'hidden',
                    overflowY: 'auto'
                }}
            >

                {
                    sampleMessage.map(i => (
                        <MessageComponent key={i._id} message={i} user={user} />
                    ))
                }

            </Stack>
            <form style={{
                height: '10%'
            }}
                onSubmit={submitHandler}
            >
                <Stack
                    direction={'row'}
                    height={'100%'}
                    padding={'1rem'}
                    bgcolor={'lightsalmon'}
                    alignItems={'center'}
                    position={'relative'}
                >
                    <IconButton
                        sx={{
                            position: 'absolute',
                            left: '1.5rem',
                            rotate: '30deg'
                        }}

                    >
                        <AttachFileIcon />
                    </IconButton>

                    <InputBox
                        placeholder='Type message here...'
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />

                    <IconButton
                        type='submit'
                        sx={{
                            rotate: '-36deg',
                            color: 'white',
                            textAlign: 'center',
                            bgcolor: 'deepskyblue',
                            '&:hover': {
                                bgcolor: 'lightskyblue',
                            },
                            padding: '0.5rem',
                            marginLeft: '1rem',
                        }}
                    >
                        <SendIcon />
                    </IconButton>
                </Stack>
            </form>
            <FileMenu />
        </Fragment>
    )
}

export default Chat