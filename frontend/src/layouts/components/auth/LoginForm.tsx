// ** React Imports
import { ChangeEvent, MouseEvent, PropsWithoutRef, ReactNode, useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import {
  Box,
  Button,
  Divider,
  Checkbox,
  InputLabel,
  Typography,
  IconButton,
  CardContent,
  FormControl,
  OutlinedInput,
  styled,
  Card as MuiCard,
  CardProps,
  InputAdornment,
  FormControlLabel as MuiFormControlLabel,
  FormControlLabelProps
} from '@mui/material';

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
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { handleLoginService, handleSetUserInfoService } from 'src/services/userServices'
import { AxiosError, AxiosResponse } from 'axios'
import { useDispatch } from 'src/app/hooks'
import { setUser } from 'src/app/redux/slices/loginSlice'
import { useRouter } from 'next/router'
import { setFileList } from 'src/app/redux/slices/fileSlice'
import { handleFetchData } from 'src/services/fileServices';
import { setUserInfo } from 'src/app/redux/slices/userInfoSlice';
import { isValidEmail } from 'src/utils/format';

interface State {
  email: string,
  password: string,
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
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginForm = (props: PropsWithoutRef<{
  onChangeViewRegister?: () => void;
  onClickForgotPassword?: () => void;
}>) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const { onChangeViewRegister = () => { }, onClickForgotPassword = () => { } } = props;

  // ** State
  const [values, setValues] = useState<State>({
    email: '',
    password: '',
    showPassword: false,
    errCode: -1,
    errMessage: '',
  })

  // ** Hook
  const router = useRouter()
  const dispatch = useDispatch()

  // const { isLoggedIn, user } = useSelector((state) => state.loginState)

  useEffect(() => {
    setValues(prevState => ({ ...prevState, errMessage: '' }))
  }, [values.email, values.password])

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const fetchData = async (user: string, page: number) => {
    try {
      const response = await handleFetchData(user, page);

      return response.data.file;
    } catch (error) {
      console.error(error);
    }
  }

  const handleLogin = async () => {
    try {
      const response = await handleLoginService(values.email, values.password)

      // @ts-ignore
      const data = response.data;
      if (data && data.errCode !== 0) {
        setValues(prevState => ({ ...prevState, errMessage: data.errMessage }));
      }
      if (data && data.errCode === 0) {
        dispatch(setUser(data.user))

        const fileList = await fetchData(data.user.username, 1)

        dispatch(setFileList(fileList))
        router.push("/")

        const userInfo = await handleSetUserInfoService(data.user.email);
        if (!!userInfo) {
          dispatch(setUserInfo(userInfo.data.userInfo))
        }
      }
    } catch (e) {
      setValues(prevState => ({ ...prevState, errMessage: e.data.errMessage }));
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
                ml: 0,
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
              Welcome to {themeConfig.templateName}! 👋🏻
            </Typography>
            <Typography variant='body2'>Please sign-in to your account and start the adventure</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
            <FormControl fullWidth sx={{ mb: 5 }}>
              <InputLabel htmlFor='auth-login-email'>Email</InputLabel>
              <OutlinedInput
                label='Email'
                value={values.email}
                id='auth-login-email'
                onChange={handleChange('email')}
              />
              {values.email.length > 0 && !isValidEmail(values.email) && <div className="auth-error-msg">Invalid email</div>}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-login-password'
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
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              <FormControlLabel control={<Checkbox />} label='Remember Me' />
              <Typography variant='body2' style={{ cursor: 'pointer', color: "#507DD4" }} onClick={onClickForgotPassword}>
                Forgot Password?
              </Typography>
            </Box>
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
              variant='contained'
              sx={{ marginBottom: 7 }}
              onClick={() => handleLogin()}
            >
              Login
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                New on our platform?
              </Typography>
              <Typography variant='body2' style={{ cursor: 'pointer', color: "#507DD4" }} onClick={onChangeViewRegister}>
                Create an account
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

LoginForm.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginForm
