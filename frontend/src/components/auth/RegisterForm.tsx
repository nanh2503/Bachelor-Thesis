// ** React Imports
import { useState, Fragment, ChangeEvent, MouseEvent, PropsWithoutRef, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import {
    Box,
    Button,
    Divider,
    Checkbox,
    Typography,
    InputLabel,
    IconButton,
    CardContent,
    FormControl,
    OutlinedInput,
    Card as MuiCard,
    CardProps,
    InputAdornment,
    FormControlLabel as MuiFormControlLabel,
    FormControlLabelProps
} from '@mui/material';

import { styled } from '@mui/material/styles'

// ** Icons Imports
import {
    Google,
    Github,
    Twitter,
    Facebook,
    EyeOutline,
    EyeOffOutline
} from 'mdi-material-ui';

// ** Configs
import themeConfig from 'src/configs/themeConfig';

// ** Demo Imports
import { useRouter } from 'next/router'
import { handleRegisterService } from 'src/services/userServices';
import { isValidEmail } from 'src/utils/format';

interface State {
    username: string,
    email: string,
    password: string,
    cfPassword: string,
    showPassword: boolean,
    errCode: number,
    errMessage: string,
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
    [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
    fontSize: '0.875rem',
    textDecoration: 'none',
    color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(4),
    '& .MuiFormControlLabel-label': {
        fontSize: '0.875rem',
        color: theme.palette.text.secondary
    }
}))

const RegisterForm = (props: PropsWithoutRef<{
    onChangeViewLogin?: () => void;
}>) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const { onChangeViewLogin = () => { } } = props;

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

    useEffect(() => {
        setValues(prevState => ({ ...prevState, errMessage: '' }))
    }, [values.email, values.password, values.cfPassword, values.username])

    const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value })
    }
    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword })
    }
    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }

    const handleRegister = async () => {
        try {
            const response = await handleRegisterService(values.username, values.email, values.password, values.cfPassword)

            const data = response.data;
            if (data && data.errCode !== 0) {
                setValues(prevState => ({ ...prevState, errMessage: data.errMessage }));
            } else if (data && data.errCode === 0) {
                router.push(`/otp-verification/${values.email}`)
            }
        } catch (e) {
            const error = e as { data: { errMessage: string } }
            setValues(prevState => ({ ...prevState, errMessage: error.data.errMessage }));
        }
    }

    return (
        <Box className='content-center' sx={{ minWidth: '100%' }}>
            <Card sx={{ zIndex: 1 }}>
                <CardContent sx={{ padding: theme => `${theme.spacing(1, 9, 7)} !important` }}>
                    <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg
                            width={80}
                            height={80}
                            version='1.1'
                            viewBox='0 0 30 23'
                            xmlns='http://www.w3.org/2000/svg'
                            xmlnsXlink='http://www.w3.org/1999/xlink'
                        >
                            <image width={30} height={30} href='/images/logoA.png' />
                        </svg>
                        <Typography
                            variant='h6'
                            sx={{
                                mt: 7,
                                lineHeight: 1,
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                fontSize: '2rem !important'
                            }}
                        >
                            {themeConfig.templateName}
                        </Typography>
                    </Box>
                    <Box sx={{ mb: 6, mt: -3 }}>
                        <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                            Adventure starts here 🚀
                        </Typography>
                        <Typography variant='body2'>Make your app management easy and fun!</Typography>
                    </Box>
                    <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor='auth-register-username'>Username</InputLabel>
                            <OutlinedInput
                                label='Username'
                                value={values.username}
                                id='auth-register-username'
                                onChange={handleChange('username')}
                                sx={{ mb: 5 }}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 5 }}>
                            <InputLabel htmlFor='auth-register-email'>Email</InputLabel>
                            <OutlinedInput
                                label='Email'
                                value={values.email}
                                id='auth-register-email'
                                onChange={handleChange('email')}
                            />
                            {values.email.length > 0 && !isValidEmail(values.email) && <div className="auth-error-msg">Invalid email</div>}
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel htmlFor='auth-register-password'>Password</InputLabel>
                            <OutlinedInput
                                sx={{ marginBottom: 4 }}
                                label='Password'
                                value={values.password}
                                id='auth-register-password'
                                onChange={handleChange('password')}
                                type={values.showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton
                                            edge='end'
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            aria-label='toggle password visibility'
                                        >
                                            {values.showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel htmlFor='auth-register-cfpassword'>Confirm Password</InputLabel>
                            <OutlinedInput
                                label='Password'
                                value={values.cfPassword}
                                id='auth-register-cfpassword'
                                onChange={handleChange('cfPassword')}
                                type={values.showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton
                                            edge='end'
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            aria-label='toggle password visibility'
                                        >
                                            {values.showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        {values.errMessage &&
                            <Box sx={{ mt: 3, mb: 3 }}>
                                <Typography variant='body2' sx={{ color: 'red' }}>
                                    {values.errMessage}
                                </Typography>
                            </Box>
                        }

                        <Button
                            fullWidth
                            size='large'
                            type='submit'
                            variant='contained'
                            sx={{ marginBottom: 7, marginTop: 7 }}
                            onClick={() => handleRegister()}
                        >
                            Register
                        </Button>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Typography variant='body2' sx={{ marginRight: 2 }}>
                                Already have an account?
                            </Typography>
                            <Typography variant='body2' style={{ cursor: 'pointer', color: "#507DD4" }} onClick={onChangeViewLogin}>
                                Sign in instead
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 5 }}>or</Divider>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Link href='/' passHref>
                                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                                    <Facebook sx={{ color: '#497ce2' }} />
                                </IconButton>
                            </Link>
                            <Link href='/' passHref>
                                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                                    <Twitter sx={{ color: '#1da1f2' }} />
                                </IconButton>
                            </Link>
                            <Link href='/' passHref>
                                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                                    <Github
                                        sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : theme.palette.grey[300]) }}
                                    />
                                </IconButton>
                            </Link>
                            <Link href='/' passHref>
                                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                                    <Google sx={{ color: '#db4437' }} />
                                </IconButton>
                            </Link>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    )
}

export default RegisterForm
