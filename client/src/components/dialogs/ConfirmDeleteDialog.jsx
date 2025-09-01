import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'

const ConfirmDeleteDialog = ({ open, handleClose, deleteHandler, WarnningContent = 'This action cannot be undone.' }) => {
    return <Dialog open={open} onClose={handleClose} >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>

            <DialogContentText>
                {WarnningContent}
            </DialogContentText>

        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>NO</Button>
            <Button onClick={deleteHandler} color='error'>YES</Button>
        </DialogActions>
    </Dialog>
}

export default ConfirmDeleteDialog