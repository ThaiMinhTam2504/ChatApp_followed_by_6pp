import React, { Fragment, useState } from 'react'
import { Box, Drawer, Grid, IconButton, Tooltip } from '@mui/material'
import { matBlack, orange } from '../components/constants/color'
import { KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'


const Groups = () => {

    const navigate = useNavigate()

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navigateBack = () => {
        navigate('/')
    }

    const handleMobile = () => {
        setIsMobileMenuOpen(prev => !prev)
    }
    const handleMobileClose = () => {
        setIsMobileMenuOpen(false)
    }

    const IconBtns = (
        <Fragment>
            <Box
                sx={{
                    display: {
                        xs: 'block',
                        sm: 'none',
                        position: 'fixed',
                        right: '1rem',
                        top: '1rem',
                    },
                }}>
                <Tooltip title='menu'>
                    <IconButton onClick={handleMobile} >
                        < MenuIcon />
                    </IconButton>
                </Tooltip>
            </Box>



            <Tooltip title='back'>
                <IconButton sx={{
                    position: 'absolute',
                    top: '2rem',
                    left: '2rem',
                    bgcolor: matBlack,
                    color: 'white',
                    '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.6)'
                    }
                }}
                    onClick={navigateBack}
                >
                    <KeyboardBackspaceIcon />
                </IconButton>
            </Tooltip>

        </Fragment>
    )
    return <Grid container height={'100vh'}>
        <Grid
            item
            sx={{
                display: {
                    xs: 'none',
                    sm: 'block'
                },
                minWidth: '40%'
            }}
            sm={4}
            bgcolor={orange}
        >
            group list
        </Grid>
        <Grid
            item
            xs={12}
            sm={8}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                padding: '1rem 3rem',
            }}
        >
            {IconBtns}
        </Grid>

        <Drawer sx={{
            display: {
                xs: 'block',
                sm: 'none'
            }
        }} open={isMobileMenuOpen} onClose={handleMobileClose}>
            Group List
        </Drawer>


    </Grid>


}

export default Groups