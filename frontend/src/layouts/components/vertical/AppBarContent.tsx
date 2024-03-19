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
import { useSelector } from 'src/app/hooks'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}


const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  // ** Hook
  const hiddenSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('xl'))
  const textFieldWidth = isLargeScreen ? '500px' : '300px'
  const { isLoggedIn } = useSelector((state) => state.loginState)

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
      {!isLoggedIn && (
        <Box sx={{ ml: isLargeScreen ? 50 : 0 }}>
          <Button
            variant='contained'
            href='/login'
            sx={{ color: 'white', backgroundColor: 'green', border: 'none', ml: 10, mt: 3 }}
          >
            LOGIN
          </Button>
        </Box>
      )}
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        {isLoggedIn && <UserDropdown />}
      </Box>
    </Box>
  )
}

export default AppBarContent
