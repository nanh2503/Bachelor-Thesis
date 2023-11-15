// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import { ReactNode, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'src/app/hooks'
import BlankLayout from 'src/@core/layouts/BlankLayout'

interface State {
    username: string,
    email: string,
    password: string,
    cfPassword: string,
    showPassword: boolean,
    errCode: number,
    errMessage: string,
}

const RegisterPage = () => {
    // ** States
    const [values, setValues] = useState<State>({
        username: '',
        email: '',
        password: '',
        cfPassword: '',
        showPassword: false,
        errCode: -1,
        errMessage: '',
    })

    // ** Hook
    const router = useRouter()
    const dispatch = useDispatch()

    return (
        <Box
            sx={{
                mt: 30,
                height: '100%',
                width: '100%',
                minWidth: '300px',
                minHeight: '150px',
                backgroundColor: '#fff',
                overflow: 'hidden',
                boxShadow: '0 6px 10px 0 rgba(27,28,30,.31)',
                flexDirection: 'column',
                display: 'flex',
                color: '#000',
                borderRadius: '6px',
                position: 'relative'
            }}
        >
            <Button
                type='button'
                aria-label='close'
                sx={{
                    position: 'absolute',
                    top: '-35px',
                    right: '-35px',
                    width: '88px',
                    height: '88px',
                    border: '0',
                    background: 'transparent',
                    cursor: 'pointer',
                    outline: 'none',
                    zIndex: 6,
                }}
            >
                <img src="https://s.imgur.com/desktop-assets/desktop-assets/upload_dialog_close.090c128bffd440597750.svg" alt="Close" />
            </Button>


            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#000',
                    color: '#fff',
                    height: '320px',
                    overflow: 'hidden',
                    float:'left'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        width: '264px',
                        margin: '0 auto',
                        height: '72px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '3px dashed rgba(255,255,255,.4)',
                        borderRadius: '6px',
                        position: 'relative',
                        lineHeight: '40px',
                        verticalAlign: 'middle',
                        mixBlendMode: 'overlay',
                    }}
                >

                </Box>
                <Box></Box>
            </Box>
        </Box >
    )
}

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default RegisterPage

