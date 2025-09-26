import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useInputValidation } from '6pp'
import { Search as SearchIcon } from '@mui/icons-material'
import UserItem from '../shared/UserItem'
import { sampleUsers } from '../constants/sampleData'
import { useDispatch, useSelector } from 'react-redux'
import { setIsSearch } from '../../redux/reducers/misc'
import { useLazySearchUserQuery } from '../../redux/api/api'

const Search = () => {
    const dispatch = useDispatch()
    const { isSearch } = useSelector(state => state.misc)

    const [searchUser] = useLazySearchUserQuery()

    const search = useInputValidation("")

    let isLoadingSendFriendRequest = false
    const [users, setUsers] = useState(sampleUsers)
    const addFriendHandler = () => {

    }

    const searchCloseHandler = () => {
        dispatch(setIsSearch(false))
    }

    useEffect(() => {

        const timeOutId = setTimeout(() => {
            console.log("searching for:", search.value)
        }, 1000)
        // console.log("this setTimeout func is called after 1 second")

        return () => {
            clearTimeout(timeOutId)
            // console.log("this clearTimeout func is called sooner than the above setTimeout func")
        }

    }, [search.value])


    //test de hieu useEffect
    //useEffect muốn trả lại một hàm cleanup function thì phải đặt trong return của useEffect hoặc không trả lại gì
    //useEffect sẽ bị trigger khi dependency thay đổi hoặc khi component mount hoặc unmount
    //cleanup function sẽ chạy trước khi useEffect chạy lại (trừ lần đầu tiên) và khi component unmount
    // useEffect(() => {
    //     console.log('🏃 chạy effect logic')

    //     return () => {
    //         console.log('🧹 cleanup')
    //     }
    // }, [search.value])

    return <Dialog open={isSearch} onClose={searchCloseHandler}>
        <Stack p={'2rem'} direction={'column'} width={'25rem'}>
            <DialogTitle textAlign={'center'}>Find People</DialogTitle>
            <TextField
                label="Search"
                value={search.value}
                onChange={search.changeHandler}
                variant='outlined'
                size='small'
                slots={{ inputAdornment: InputAdornment }}
                slotProps={{
                    inputAdornment: {
                        position: 'start',
                        children: <SearchIcon />
                    }
                }}
            />

            <List>
                {users.map((i, index) => (
                    <UserItem user={i} key={index} handler={addFriendHandler} handlerIsLoading={isLoadingSendFriendRequest} />
                ))}
            </List>


        </Stack>
    </Dialog>
}

export default Search