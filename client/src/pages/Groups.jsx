import React, { lazy, memo, Suspense, useEffect, useState } from 'react'
import { Avatar, Backdrop, Box, Button, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { bgGradient, bgGradientForMembersList, matBlack, orange } from '../components/constants/color'
import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from '@mui/icons-material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Link } from '../components/styles/StyledComponents'
import AvatarCard from '../components/shared/AvatarCard'
import { sampleChats, sampleUsers } from '../components/constants/sampleData'
import UserItem from '../components/shared/UserItem'

const ConfirmDeleteDialog = lazy(() => import('../components/dialogs/ConfirmDeleteDialog'))
const AddMemberDialog = lazy(() => import('../components/dialogs/AddMemberDialog'))

const isAddMember = false

const Groups = () => {
    // const [searchParams, setSearchParams] = useSearchParams()
    // searchParams.forEach((value, key) => {
    //     console.log(key, value)
    // })
    const chatId = useSearchParams()[0].get('group')

    // console.log(sampleUsers)

    const navigate = useNavigate()

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isEdit, setIsEdit] = useState()
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)
    const [groupName, setGroupName] = useState('')
    const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState('')

    const navigateBack = () => {
        navigate('/')
    }

    const handleMobile = () => {
        setIsMobileMenuOpen(prev => !prev)
    }
    const handleMobileClose = () => {
        setIsMobileMenuOpen(false)
    }

    const updateGroupName = () => {
        setIsEdit(false)
    }

    const openConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(true)
    }
    const closeConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(false)
    }
    const openAddMemberHandler = () => {

    }
    const deleteHandler = () => {

        closeConfirmDeleteHandler()
    }

    const removeMemberHandler = (id) => {
        console.log('remove member', id)
    }

    useEffect(() => {
        if (chatId) {
            setGroupName(`Group Name ${chatId}`)
            setGroupNameUpdatedValue(`Group Name ${chatId}`)
        }

        return () => {
            setGroupName('')
            setGroupNameUpdatedValue('')
            setIsEdit(false)
        }
    }, [chatId])

    const IconBtns = (
        <>
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

        </>
    )
    const GroupName = <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={'1rem'} padding={'3rem'}>
        {
            isEdit
                ? <>
                    <TextField value={groupNameUpdatedValue} onChange={e => setGroupNameUpdatedValue(e.target.value)} />
                    <IconButton
                        onClick={() => updateGroupName}
                    ><DoneIcon /></IconButton>
                </>
                : <>
                    <Typography variant='h4'>{groupName}</Typography>
                    <IconButton onClick={() => setIsEdit(true)}><EditIcon /></IconButton>
                </>
        }
    </Stack>


    const ButtonGroup = <Stack direction={{
        sm: 'row',
        xs: 'column-reverse'
    }}
        spacing={'1rem'}
        p={{
            xs: '0',
            sm: '1rem',
            md: '1rem 4rem'
        }}
    >
        <Button size='large' color='error' startIcon={<DeleteIcon />} onClick={openConfirmDeleteHandler}>Delete Group</Button>
        <Button size='large' variant='contained' startIcon={<AddIcon />} onClick={openAddMemberHandler}>Add member</Button>
    </Stack>
    return <Grid container height={'100vh'} >
        <Grid
            item
            sx={{
                display: {
                    xs: 'none',
                    sm: 'block'
                },
                minWidth: {
                    xs: '0',
                    sm: '30%',
                    md: '40%',
                    lg: '30%',
                    xl: '20%'
                }

            }}
            sm={4}

        >
            <GroupList myGroups={sampleChats} chatId={chatId} />
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
                minWidth: {
                    xs: '100%',
                    sm: '70%',
                    md: '60%',
                    lg: '70%',
                    xl: '80%'
                }
            }}
        >
            {IconBtns}

            {
                GroupName && <>
                    {GroupName}

                    <Typography variant='h5' color='primary' >Members List</Typography>

                    <Stack
                        maxWidth={'45rem'}
                        width={'100%'}
                        boxSizing={'border-box'}
                        padding={{
                            sm: '1rem',
                            xs: '0',
                            md: '1rem 4rem'
                        }}
                        spacing={'2rem'}
                        bgcolor={'white'}
                        height={'50vh'}
                        overflow={'auto'}
                    >
                        {/*members list */}

                        {
                            sampleUsers.map((i) => (
                                <UserItem
                                    user={i}
                                    key={i._id}
                                    isAdded
                                    styling={{
                                        boxShadow: '0 0 0.5rem rgba(0,0,0,0.2)',
                                        padding: '1rem 2rem',
                                        borderRadius: '1rem'
                                    }}
                                    handler={removeMemberHandler}
                                />
                            ))
                        }
                    </Stack>

                    {ButtonGroup}

                </>
            }
        </Grid>

        {
            isAddMember && <Suspense fallback={<Backdrop open />}>
                <AddMemberDialog />
            </Suspense>
        }


        {
            confirmDeleteDialog && <>
                <Suspense fallback={<Backdrop open />}>
                    <ConfirmDeleteDialog
                        open={confirmDeleteDialog}
                        handleClose={closeConfirmDeleteHandler}
                        deleteHandler={deleteHandler}
                        WarnningContent=' Are you sure you want to delete this group? This action cannot be undone.'
                    />
                </Suspense>
            </>
        }


        <Drawer sx={{
            display: {
                xs: 'block',
                sm: 'none'
            }
        }}
            open={isMobileMenuOpen}
            onClose={handleMobileClose}>
            <GroupList w={'50vw'} myGroups={sampleChats} chatId={chatId} />
        </Drawer>


    </Grid>

}

const GroupList = ({ w = '100%', myGroups = [], chatId }) => (
    <Stack
        width={w}
        sx={{
            backgroundImage: bgGradient,
            height: '100vh',
            overflow: 'auto'
        }} >
        {
            myGroups.length > 0
                ? myGroups.map((group) => <GroupListItem group={group} chatId={chatId} key={group._id} />)
                : <Typography textAlign={'center'} padding={'1rem'}>No Groups</Typography>
        }
    </Stack>
)

const GroupListItem = memo(({ group, chatId }) => {
    const { name, avatar, _id } = group

    return <Link to={`?group=${_id}`} onClick={e => {
        if (chatId === _id) e.preventDefault()
    }}>
        <Stack direction={'row'} spacing={'1rem'} alignItems={'center'}>
            <AvatarCard avatar={avatar} />
            <Typography>{name}</Typography>
        </Stack>
    </Link>
})


export default Groups