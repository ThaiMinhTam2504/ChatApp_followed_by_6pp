import { Dialog, DialogTitle, Stack, Typography, ListItem, Avatar, Button } from '@mui/material'
import React, { memo } from 'react'
import { sampleNotifications } from '../constants/sampleData'
import { useGetNotificationsQuery } from '../../redux/api/api'
import { useErrors } from '../../hooks/hook'

const Notifications = () => {

    const { isLoading, data, error, isError } = useGetNotificationsQuery()


    const friendRequestHandler = ({ _id, accept }) => {

    }
    useErrors([{ error, isError }])
    return (
        <Dialog open>
            <Stack p={{ xs: '1rem', sm: '2rem' }} maxWidth={'25rem'}>
                <DialogTitle>Notifications</DialogTitle>
                {
                    data?.allRequests.length > 0 ?
                        (
                            data?.allRequests?.map(({ sender, _id }) => <NotificaitonItem sender={sender} _id={_id} handler={friendRequestHandler} key={_id} />)
                        ) : (
                            <Typography textAlign={'center'}>No notifications</Typography>
                        )
                }
            </Stack>
        </Dialog>
    )
}

const NotificaitonItem = memo(({ sender, _id, handler }) => {
    const { name, avatar } = sender
    return (
        <ListItem

        >
            <Stack
                direction={"row"}
                alignItems={'center'}
                spacing={"1rem"}
                width={"100%"}
            >
                <Avatar src={avatar} />

                <Typography variant='body1' sx={{
                    flexGrow: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: "100%",
                }}>
                    {`${name} sent you a friend request`}
                </Typography>

                <Stack direction={{
                    xs: 'column',
                    sm: 'row'
                }}>
                    <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
                    <Button color='error' onClick={() => handler({ _id, accept: false })}>Decline</Button>
                </Stack>
            </Stack>
        </ListItem>
    )
})

export default Notifications