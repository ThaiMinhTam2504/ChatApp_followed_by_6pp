import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import {
    Face as FaceIcon,
    AlternateEmail as EmailIcon,
    CalendarMonth as CalendarMonthIcon,

} from '@mui/icons-material'
import moment from 'moment/moment'
import { transformImage } from '../../lib/features'

const Profile = ({ user }) => {
    return (
        <Stack spacing={'2rem'} direction={"column"} alignItems={"center"}>
            <Avatar
                src={transformImage(user?.avatar?.url)}
                sx={{
                    width: 200,
                    height: 200,
                    objectFit: 'contain',
                    marginBottom: '1rem',
                    border: '5px solid white'
                }} />
            <ProfileCard
                heading={"Bio"}
                text={user?.bio || "No bio"}
            />
            <ProfileCard
                heading={"Username"}
                text={user?.username || "No username"}
                Icon={<EmailIcon />}
            />
            <ProfileCard
                heading={"Name"}
                text={user?.name || "No name"}
                Icon={<FaceIcon />}
            />
            <ProfileCard
                heading={"Joined"}
                text={moment(user?.createdAt).fromNow()}
                Icon={<CalendarMonthIcon />}
            />
        </Stack>
    )
}

const ProfileCard = ({ text, Icon, heading }) => <Stack
    direction={'row'}
    alignItems={'center'}
    spacing={'1rem'}
>
    {Icon && Icon}
    <Stack direction={'column'} spacing={0} alignItems={'center'}>
        <Typography variant='body1'>{text}</Typography>
        <Typography color='gray' variant='caption'>{heading}</Typography>
    </Stack>



</Stack>

export default Profile