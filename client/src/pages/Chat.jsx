import React, { Fragment, useRef } from 'react'
import { IconButton, Stack } from '@mui/material'
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material'
import { grayColor } from '../components/constants/color'
import { InputBox } from '../components/styles/StyledComponents'
import FileMenu from '../components/dialogs/FileMenu'
import { sampleMessage } from '../components/constants/sampleData'
import MessageComponent from '../components/shared/MessageComponent'

const user = {
    _id: 'asdasdafff',
    name: 'Abishek Nahar Singh'
}

const Chat = () => {

    const containerRef = useRef(null)


    return (
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
            }}>
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

                    <InputBox placeholder='Type message here...' />

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