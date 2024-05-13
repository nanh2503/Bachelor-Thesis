// ** MUI Imports
import {
  Box,
  Theme,
  TextField,
  IconButton,
  useMediaQuery,
  InputAdornment,
  Button,
  Typography
} from '@mui/material';

// ** Icons Imports
import { Menu, Magnify } from 'mdi-material-ui';

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import { useDispatch, useSelector } from 'src/app/hooks'
import { clearFiles } from 'src/app/redux/slices/uploadFileSlice';

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}


const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.loginState)

  // ** Hook
  const hiddenSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('xl'))
  const isLargestScreen = useMediaQuery('(min-width: 1600px)')
  const isMediumScreen = useMediaQuery('(max-width: 1199px)')
  const textFieldWidth = isLargeScreen ? '500px' : '300px'
  const tleft = isLargestScreen ? 382 : isMediumScreen ? 24 : 285
  const tright = isLargestScreen ? 120.8 : 25

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, position: 'fixed', backgroundColor: 'white', borderRadius: '6px', padding: '20px', left: tleft, right: tright, boxShadow: '0px 2px 10px 0px rgba(58, 53, 65, 0.1)' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton
            color='inherit'
            onClick={toggleNavVisibility}
            sx={{ ml: -2.75, ...(hiddenSm ? {} : { mr: 3.5 }) }}
          >
            <Menu />
          </IconButton>
        ) : null}
        <Button
          variant='contained'
          href="/upload"
          onClick={() => dispatch(clearFiles())}
          sx={{
            backgroundColor: '#1bb76e',
            borderRadius: '3px',
            width: 'auto',
            mt: 3,
          }}
          startIcon={
            <img src="https://s.imgur.com/desktop-assets/desktop-assets/icon-new-post.da483e9d9559c3b4e912.svg" />
          }
        >
          <Typography
            sx={{
              color: 'white',
              fontSize: isLargeScreen ? '16px' : !hiddenSm ? '14px' : '0px'
            }}
          >
            New Post
          </Typography>
        </Button>

        <TextField
          size='small'
          sx={
            settings.mode === 'light'
              ? { '& .MuiOutlinedInput-root': { borderRadius: 1, backgroundColor: 'white', color: 'black', width: textFieldWidth, mt: 3, ml: 5 } }
              : { '& .MuiOutlinedInput-root': { borderRadius: 1, backgroundColor: '#312D4B', color: 'white', width: textFieldWidth, mt: 3, ml: 5 } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <Magnify fontSize='medium' />
              </InputAdornment>
            )
          }}
          placeholder='Images, #tags, @users oh my!'
        />
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {!isLoggedIn && (
          <Box>
            <Button
              variant='contained'
              href='/login'
              sx={{ color: 'white', backgroundColor: 'green', border: 'none', mt: 3 }}
            >
              LOGIN
            </Button>
          </Box>
        )}
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        {!isLoggedIn && (
          <Box>
            <img
              alt='Avatar'
              style={{ width: 40, height: 40, borderRadius: 50 }}
              src={"/images/avatars/male.png"}
            />
          </Box>
        )}
        {isLoggedIn && <UserDropdown />}
      </Box>
    </Box>
  )
}

export default AppBarContent
