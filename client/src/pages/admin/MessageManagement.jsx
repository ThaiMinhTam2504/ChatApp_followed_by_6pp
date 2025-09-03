import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Table'
import { Avatar, Box, colors, Stack } from '@mui/material'
import { dashboardData } from '../../components/constants/sampleData'
import { fileFormat, transformImage } from '../../lib/features'
import moment from 'moment'
import RenderAttachment from '../../components/shared/RenderAttachment'

const columns = [{
    field: 'id',
    headerName: 'ID',
    headerClassName: 'table-header',
    width: '200',

},
{
    field: 'attachments',
    headerName: 'Attachments',
    headerClassName: 'table-header',
    width: '200',
    renderCell: (params) => {
        const { attachments } = params.row
        return attachments?.length > 0 ? attachments.map(i => {

            const url = i.url
            const file = fileFormat(url)

            return <Box>
                <a href={url} download target='_blank' style={{ color: 'black' }}>
                    {RenderAttachment(file, url)}
                </a>
            </Box>
        }) : "No attachments"
    }
},
{
    field: 'content',
    headerName: 'Content',
    headerClassName: 'table-header',
    width: '400',

},
{
    field: 'sender',
    headerName: 'Sent By',
    headerClassName: 'table-header',
    width: '200',
    renderCell: (params) => (
        <Stack direction={'column'} spacing={'1rem'} sx={{ alignItems: 'center', marginTop: '1rem', position: 'relative' }}>
            <Box >
                <Avatar sx={{ height: '50%', width: '60%' }} alt={params.row.sender.name} src={params.row.sender.avatar} />
            </Box>
            <Box sx={{ position: 'absolute', top: '2rem', left: '1.2rem' }}>
                <span style={{ fontWeight: 'bold', color: 'red' }}>{params.row.sender.name}</span>
            </Box>

        </Stack>
    )

},
{
    field: 'chat',
    headerName: 'Chat',
    headerClassName: 'table-header',
    width: '220',

},
{
    field: 'groupChat',
    headerName: 'Group Chat',
    headerClassName: 'table-header',
    width: '100',
},
{
    field: 'createdAt',
    headerName: 'Time',
    headerClassName: 'table-header',
    width: '250'
}

]
const MessageManagement = () => {
    const [rows, setRows] = useState([])
    useEffect(() => {
        setRows(dashboardData.messages.map(i => (
            {
                ...i,
                id: i._id,
                sender: {
                    name: i.sender.name,
                    avatar: transformImage(i.sender.avatar, 50)
                },
                createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a")
            }
        )))
    }, [])
    return (
        <AdminLayout>
            <Table heading={'All Messages'} columns={columns} rows={rows} rowHeight={150} />
        </AdminLayout>
    )
}

export default MessageManagement