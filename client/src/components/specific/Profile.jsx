import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import {
    Face as FaceIcon,
    AlternateEmail as EmailIcon,
    CalendarMonth as CalendarMonthIcon,

} from '@mui/icons-material'
import moment from 'moment/moment'

const Profile = () => {
    return (
        <Stack spacing={'2rem'} direction={"column"} alignItems={"center"}>
            <Avatar sx={{
                width: 200,
                height: 200,
                objectFit: 'contain',
                marginBottom: '1rem',
                border: '5px solid white'
            }} />
            <ProfileCard
                heading={"Bio"}
                text={"Lorem ipsum dolor sit amet."}
            />
            <ProfileCard
                heading={"Username"}
                text={"@username"}
                Icon={<EmailIcon />}
            />
            <ProfileCard
                heading={"Name"}
                text={"Alice"}
                Icon={<FaceIcon />}
            />
            <ProfileCard
                heading={"Joined"}
                text={moment().subtract(2, 'years').fromNow()}
                Icon={<CalendarMonthIcon />}
            />
        </Stack>
    )
}

const ProfileCard = ({ text, Icon, heading }) => <Stack
    direction={'row'}
    alignItems={'center'}
    spacing={'1rem'}>
    {Icon && Icon}

    <Stack>
        <Typography variant='body1'>{text}</Typography>
        <Typography color='gray' variant='caption'>{heading}</Typography>
    </Stack>



</Stack>

export default Profile