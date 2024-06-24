// ** MUI Imports
import { PaletteMode } from '@mui/material'

// ** Types
import { ContentWidth } from 'src/@core/layouts/types'

type ThemeConfig = {
  mode: PaletteMode
  templateName: string
  routingLoader: boolean
  disableRipple: boolean
  navigationSize: number
  menuTextTruncate: boolean
  contentWidth: ContentWidth
  responsiveFontSizes: boolean
}

const themeConfig: ThemeConfig = {
  // ** Layout Configs
  templateName: 'NAUIV',
  mode: 'light',
  contentWidth: 'boxed',

  // ** Routing Configs
  routingLoader: true,

  // ** Navigation (Menu) Configs
  menuTextTruncate: true,
  navigationSize: 260,

  // ** Other Configs
  responsiveFontSizes: true,
  disableRipple: false
}

export default themeConfig
