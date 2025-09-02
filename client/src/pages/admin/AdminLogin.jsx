import React from 'react'
import {
    Container,
    Avatar,
    Button,
    Paper,
    TextField,
    Typography,
    Stack,
    IconButton
} from '@mui/material'
import { bgGradient } from '../../components/constants/color'
import { useInputValidation } from '6pp'
import { Navigate } from 'react-router-dom'

const isAdmin = true

const AdminLogin = () => {
    const secrectKey = useInputValidation('')
    const submitHandler = (e) => {
        e.preventDefault();
        // Handle login logic here
    }

    if (isAdmin) return <Navigate to='/admin/dashboard' />
    return (
        <div
            style={{
                backgroundImage:
                    bgGradient,
            }}>
            <Container component={"main"} maxWidth={"xs"} sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Paper elevation={3}
                    sx={{
                        padding: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <Typography variant='h5'>Admin Login</Typography>
                    <form style={{
                        width: "100%",
                        marginTop: "1rem"
                    }}
                        onSubmit={submitHandler}
                    >

                        <TextField
                            required
                            fullWidth
                            label="Secret Key"
                            type='password'
                            margin='normal'
                            variant='outlined'
                            value={secrectKey.value}
                            onChange={secrectKey.changeHandler}
                        />
                        <Button sx={{ marginTop: "1rem" }} fullWidth type='submit' color='primary' variant='contained'>Login</Button>
                    </form>
                </Paper>
            </Container>
        </div>
    )
}

export default AdminLogin