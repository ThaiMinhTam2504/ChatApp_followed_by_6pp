import React from 'react'
import Header from './Header'
import Title from '../shared/Title'
import { Grid } from '@mui/material'
import Chatlist from '../specific/Chatlist'
import { sampleChats } from '../constants/sampleData'
import { useParams } from 'react-router-dom'
import Profile from '../specific/Profile'

const AppLayout = () => (WrappedComponent) => {
    return (props) => {
        const params = useParams()
        const chatId = params.chatId

        const handleDeleteChat = (e, _id, groupChat) => {

        }
        return (
            <>
                <Title />
                <Header />


                <Grid
                    container
                    height={"calc(100vh - 4rem)"}
                    wrap='nowrap'
                    sx={{
                        width: '100vw',
                        maxWidth: '100vw',
                        overflow: 'hidden'
                    }}
                >

                    {/* Left Sidebar */}
                    <Grid
                        item
                        xs={0}
                        sm={4}
                        md={3}
                        lg={3}
                        height="100%"
                        sx={{
                            display: {
                                xs: 'none', sm: 'block',
                            },
                            minWidth: {
                                md: '25%',
                                lg: '25%',
                                xl: '15%'
                            }
                        }}
                    // sx={{ display: { xs: 'none', sm: 'block' }, bgcolor: 'yellow', maxWidth: 280, flexBasis: 280, flexGrow: 0, flexShrink: 0 }}
                    >
                        <Chatlist
                            chats={sampleChats}
                            chatId={chatId}
                            newMessagesAlert={[{
                                chatId,
                                count: 4,
                            }]}
                            handleDeleteChat={handleDeleteChat}
                        />
                    </Grid>


                    {/*Middle */}
                    <Grid
                        item
                        xs={12}
                        sm={8}
                        md={5}
                        lg={6}
                        height="100%"
                        sx={{
                            minWidth: {
                                xs: '100%',
                                sm: '75%',
                                md: '50%',
                                lg: '50%',
                                xl: '65%'
                            }
                        }}
                    >
                        <WrappedComponent {...props} />
                    </Grid>


                    {/* Right Sidebar */}
                    <Grid
                        item
                        xs={0}
                        sm={0}
                        md={4}
                        lg={3}
                        height="100%"
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            padding: "2rem",
                            bgcolor: "rgba(0,0,0,0.85)",
                            color: "#fff",
                            minWidth: {
                                xs: '0%',
                                sm: '0%',
                                md: '25%',
                                lg: '25%',
                                xl: '20%'
                            }
                        }}
                    >
                        <Profile />
                    </Grid>
                </Grid>



            </>
        )
    }
}

export default AppLayout







// import React from "react";
// import Header from "./Header";
// import Title from "../shared/Title";
// import { Box } from "@mui/material";

// const AppLayout = () => (Wrapped) => (props) => (
//     <>
//         <Title />
//         <Header />

//         {/* Phủ kín toàn bộ không gian dưới header */}
//         <Box
//             sx={{
//                 position: "fixed",
//                 top: "4rem", left: 0, right: 0, bottom: 0,      // full dưới header
//                 width: "100vw", height: "calc(100vh - 4rem)",   // đảm bảo fill viewport
//                 overflow: "hidden",

//                 /* DÙNG CSS GRID CHO CHẮC */
//                 display: "grid",
//                 gridTemplateColumns: {
//                     xs: "1fr",              // mobile: chỉ cột giữa (ẩn 2 cột bên)
//                     sm: "3fr 6fr 3fr",      // sm: 3–6–3  => tổng = 12
//                     md: "3fr 6fr 3fr",      // md: bạn có thể đổi 3–5–4 nếu muốn
//                     lg: "3fr 6fr 3fr",
//                 },
//                 gridTemplateRows: "1fr",
//             }}
//         >
//             {/* LEFT */}
//             <Box
//                 sx={{
//                     display: { xs: "none", sm: "block" },
//                     bgcolor: "yellow",
//                     height: "100%",
//                 }}
//             >
//                 First
//             </Box>

//             {/* MIDDLE */}
//             <Box sx={{ bgcolor: "red", height: "100%" }}>
//                 <Wrapped {...props} />
//             </Box>

//             {/* RIGHT */}
//             <Box
//                 sx={{
//                     display: { xs: "none", sm: "block" },
//                     bgcolor: "rgba(0,0,0,0.85)",
//                     color: "#fff",
//                     p: 2,
//                     height: "100%",
//                 }}
//             >
//                 Third
//             </Box>
//         </Box>
//     </>
// );

// export default AppLayout;
















// import React from 'react'
// import Header from './Header'
// import Title from '../shared/Title'
// import { Grid, Box } from '@mui/material'

// const AppLayout = () => (WrappedComponent) => (props) => (
//     <>
//         <Title />
//         <Header />

//         {/* Khung phủ kín dưới header */}
//         <Box sx={{ position: 'fixed', top: '4rem', left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
//             <Grid
//                 container
//                 spacing={0}
//                 sx={{ width: '100%', height: '100%' }}
//             >
//                 {/* LEFT: ẩn ở xs, hiện từ sm */}
//                 <Grid
//                     item
//                     sm={4}                // ✅ bỏ xs={0}
//                     md={3}
//                     lg={3}
//                     sx={{ display: { xs: 'none', sm: 'block' }, bgcolor: 'yellow' }}
//                     height="100%"
//                 >
//                     First
//                 </Grid>

//                 {/* MIDDLE: luôn có */}
//                 <Grid
//                     item
//                     xs={12}
//                     sm={8}
//                     md={5}
//                     lg={6}
//                     height="100%"
//                     sx={{ bgcolor: 'red', minWidth: 0 }}   // ✅ minWidth:0 để flex không giữ “khoảng thở”
//                 >
//                     <WrappedComponent {...props} />
//                 </Grid>

//                 {/* RIGHT: ẩn ở xs & sm, hiện từ md */}
//                 <Grid
//                     item
//                     md={4}                // ✅ bỏ xs={0}, sm={0}
//                     lg={3}
//                     sx={{ display: { xs: 'none', sm: 'none', md: 'block' }, p: 2, bgcolor: 'rgba(0,0,0,0.85)', color: '#fff' }}
//                     height="100%"
//                 >
//                     Third
//                 </Grid>
//             </Grid>
//         </Box>
//     </>
// )

// export default AppLayout




















