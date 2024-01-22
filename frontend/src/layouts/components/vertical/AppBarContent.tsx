// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'

// ** Icons Imports
import Menu from 'mdi-material-ui/Menu'
import Magnify from 'mdi-material-ui/Magnify'

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
  const hiddenSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))
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
          href="/pages/upload"
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
          {isLargeScreen ? "New post" : null}
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
            href='/pages/login'
            sx={{ color: 'white', backgroundColor: 'green', border: 'none', ml: 10, mt: 3 }}
          >
            Sign in
          </Button>
          <Button
            variant='contained'
            href='/pages/register'
            sx={{ color: 'white', backgroundColor: 'orange', border: 'none', ml: 5, mt: 3 }}
          >
            Sign up
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
