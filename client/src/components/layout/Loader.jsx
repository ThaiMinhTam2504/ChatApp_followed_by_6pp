import React from 'react'
import { Grid, Stack, Skeleton } from '@mui/material'

const Loader = () => {
    return (
        <Grid overflow='hidden' wrap='nowrap' direction="row" container minWidth={'100%'} height={"calc(100vh - 4rem)"} spacing={"1rem"} sx={{ bgcolor: 'background.default' }}>
            <Grid
                item
                sm={4}
                md={3}
                lg={3}
                xl={2}
                sx={{
                    display: { xs: "none", sm: "block" },
                    minWidth: { xs: '0%', sm: "33%", md: "25%", lg: '20%' },

                }}
                height={"100%"}
            >
                <Skeleton variant='rectangular' height={"100vh"} sx={{ backgroundColor: "red.300" }} />
            </Grid>

            <Grid
                position={'relative'}
                zIndex={1}
                item
                xs={12}
                sm={8}
                md={6}
                lg={6}
                xl={8}
                height={"100%"}
                sx={{
                    minWidth: { xs: "100%", sm: "67%", md: "50%", lg: '60%' },

                }}
            >
                <Stack>
                    {
                        Array.from({ length: 10 }).map((_, index) => (
                            <Skeleton key={index} variant='text' height={"5rem"} sx={{ bgcolor: 'grey.200', zIndex: 30 }} />

                        ))
                    }
                </Stack>
            </Grid>


            <Grid
                item
                md={4}
                sm={3}
                lg={3}
                xl={2}
                height={"100%"}
                sx={{
                    display: { sm: "none", md: "block" },
                    minWidth: { xs: '0%', md: "25%", lg: "20%" },

                }}
            >
                <Skeleton variant='rectangular' height={"100vh"} sx={{ bgcolor: "grey.300" }} />
            </Grid>
        </Grid >
    )
}

export default Loader