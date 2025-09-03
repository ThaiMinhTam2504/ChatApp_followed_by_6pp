import { Box, Drawer, Grid, IconButton, Stack, styled, Typography, } from '@mui/material'
import {
    Close as CloseIcon,
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    ManageAccounts as ManageAccountsIcon,
    Group as GroupIcon,
    Message as MessageIcon,
    ExitToApp as ExitToAppIcon,
} from '@mui/icons-material'
import React, { useState } from 'react'
import { useLocation, Link as LinkComponent, Navigate } from 'react-router-dom'
import { matBlack } from '../constants/color'



const Link = styled(LinkComponent)`
text-decoration: none;
border-radius: 2rem;
color: black;
&:hover{
    color:rgb(0,0,0,0.54)
}
`

const adminTabs = [
    {
        name: 'Dashboard',
        path: '/admin/dashboard',
        icon: <DashboardIcon />,
    },
    {
        name: 'Users',
        path: '/admin/users',
        icon: <ManageAccountsIcon />,
    },
    {
        name: 'Chats',
        path: '/admin/chats',
        icon: <GroupIcon />,
    },
    {
        name: 'Messages',
        path: '/admin/messages',
        icon: <MessageIcon />,
    },
];
const Sidebar = ({ w = '100%' }) => {
    const location = useLocation()

    const logoutHandler = () => {
        console.log('Logout clicked')
    }

    return <Stack width={w} direction={'column'} p={'3rem'} spacing={'3rem'} >
        <Typography variant='h5' textTransform={'uppercase'}>
            Chat App Admin
        </Typography>

        <Stack spacing={'1rem'}>
            {
                adminTabs.map((tab) => (
                    <Link key={tab.path}
                        to={tab.path}
                        sx={
                            location.pathname === tab.path && {
                                bgcolor: matBlack,
                                color: 'white',
                                ":hover": {
                                    color: 'white'
                                },
                                padding: '0.5rem',
                            }
                        }

                    >
                        <Stack direction={'row'} alignItems={'center'} spacing={'1rem'}>
                            {tab.icon}
                            <Typography fontSize={'1.2rem'}>{tab.name}</Typography>
                        </Stack>
                    </Link>
                ))
            }

            <Link onClick={logoutHandler}>
                <Stack direction={'row'} alignItems={'center'} spacing={'1rem'}>
                    <ExitToAppIcon />
                    <Typography fontSize={'1.2rem'}>Logout</Typography>
                </Stack>
            </Link>

        </Stack>
    </Stack>
}

const isAdmin = true

const AdminLayout = ({ children }) => {

    const [isMobile, setIsMobile] = useState(false)

    const handleMobile = () => {
        setIsMobile(!isMobile)

    }
    const handleClose = () => {
        setIsMobile(false)
    }

    if (!isAdmin) return <Navigate to='/admin' />
    return <Grid container minHeight={'100vh'}>
        <Box sx={{
            display: { xs: 'block', md: 'none' },
            position: 'fixed',
            right: '1rem',
            top: '1rem'
        }}>
            <IconButton onClick={handleMobile}>
                {
                    isMobile ? <CloseIcon /> : <MenuIcon />
                }
            </IconButton>
        </Box>
        <Grid
            item
            md={3}
            sm={3}
            lg={3}
            sx={{
                display: { xs: 'none', md: 'block' },
                minWidth: {
                    xs: '0%',
                    sm: '33%',
                    md: '33%',
                    lg: '33%',
                    xl: '20%'
                }
            }}
        >
            <Sidebar />
        </Grid>

        <Grid
            item
            xs={12}
            sm={9}
            md={9}
            lg={9}
            sx={{
                bgcolor: '#f5f5f5',
                minWidth: {
                    xs: '100%',
                    sm: '67%',
                    md: '67%',
                    lg: '67%',
                    xl: '80%'
                }
            }}
        >
            {children}
        </Grid>

        <Drawer open={isMobile} onClose={handleClose}>
            <Sidebar w='50vw' />
        </Drawer >

    </Grid>


}

export default AdminLayout