import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useInputValidation } from '6pp'
import { Search as SearchIcon } from '@mui/icons-material'
import UserItem from '../shared/UserItem'
import { sampleUsers } from '../constants/sampleData'

const Search = () => {



    const search = useInputValidation("")

    let isLoadingSendFriendRequest = false
    const [users, setUsers] = useState(sampleUsers)
    const addFriendHandler = () => {

    }

    return <Dialog open>
        <Stack p={'2rem'} direction={'column'} width={'25rem'}>
            <DialogTitle textAlign={'center'}>Find People</DialogTitle>
            <TextField
                label="Search"
                value={search.value}
                onChange={search.changeHandler}
                variant='outlined'
                size='small'
                slots={{ inputAdornment: InputAdornment }}
                slotsProps={{
                    inputAdornment: {
                        position: 'start',
                        children: <SearchIcon />
                    }
                }}
            />

            <List>
                {users.map((i) => (
                    <UserItem user={i} key={i._id} handler={addFriendHandler} handlerIsLoading={isLoadingSendFriendRequest} />
                ))}
            </List>


        </Stack>
    </Dialog>
}

export default Search