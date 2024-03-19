// ** MUI Imports
import { PaletteMode, IconButton } from '@mui/material'

// ** Icons Imports
import { WeatherNight, WeatherSunny } from 'mdi-material-ui'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const ModeToggler = (props: Props) => {
  // ** Props
  const { settings, saveSettings } = props

  const handleModeChange = (mode: PaletteMode) => {
    saveSettings({ ...settings, mode })
  }

  const handleModeToggle = () => {
    if (settings.mode === 'light') {
      handleModeChange('dark')
    } else {
      handleModeChange('light')
    }
  }

  return (
    <IconButton color='inherit' aria-haspopup='true' onClick={handleModeToggle}>
      {settings.mode === 'dark' ? <WeatherSunny /> : <WeatherNight />}
    </IconButton>
  )
}

export default ModeToggler
