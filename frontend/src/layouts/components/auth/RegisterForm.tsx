// ** React Imports
import { useState, Fragment, ChangeEvent, MouseEvent, ReactNode, PropsWithoutRef } from 'react'

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

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout';

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration';
import { AxiosError, AxiosResponse } from 'axios'
import { useDispatch } from 'src/app/hooks';
import { setUser } from 'src/app/redux/slices/loginSlice';
import { useRouter } from 'next/router'
import { handleRegisterService } from 'src/services/userServices';

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
    const dispatch = useDispatch()

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
        console.log('values: ', values.username);
        try {
            const response = await handleRegisterService(values.username, values.email, values.password, values.cfPassword)

            // @ts-ignore
            const data = response.data;
            console.log('data: ', data);
            if (data && data.errCode !== 0) {
                setValues(prevState => ({ ...prevState, errMessage: data.errMessage }));
                console.log('error: ', values.errMessage);
                console.log('Register error');
            }
            if (data && data.errCode === 0) {
                dispatch(setUser(data.user))
                router.push("/pages/login")
                console.log("Register succeed!")
            }
        } catch (e) {
            const errorResponse = ((e as AxiosError).response ?? {}) as AxiosResponse;
            if (errorResponse.data) {
                setValues(prevState => ({ ...prevState, errMessage: errorResponse.data.message }));
            } else {
                // Xử lý trường hợp 'data' không tồn tại trong 'errorResponse'
                console.error('Data is undefined in errorResponse:', errorResponse);
            }
        }
    }

    console.log('err: ', values.errMessage);

    return (
        <Box className='content-center' sx={{minWidth: '100%'}}>
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
                        <FormControl fullWidth>
                            <InputLabel htmlFor='auth-register-email'>Email</InputLabel>
                            <OutlinedInput
                                label='Email'
                                value={values.email}
                                id='auth-register-email'
                                onChange={handleChange('email')}
                                sx={{ mb: 5 }}
                            />
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
                            <InputLabel htmlFor='auth-register-password'>Confirm Password</InputLabel>
                            <OutlinedInput
                                label='Password'
                                value={values.cfPassword}
                                id='auth-register-password'
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
                        <FormControlLabel
                            control={<Checkbox />}
                            label={
                                <Fragment>
                                    <span>I agree to </span>
                                    <Link href='/' passHref>
                                        <LinkStyled onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                                            privacy policy & terms
                                        </LinkStyled>
                                    </Link>
                                </Fragment>
                            }
                        />

                        {values.errMessage &&
                            <Box sx={{ mt: -3, mb: 3 }}>
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
                            sx={{ marginBottom: 7 }}
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
            <FooterIllustrationsV1 />
        </Box>
    )
}

RegisterForm.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default RegisterForm
