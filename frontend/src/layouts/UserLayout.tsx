// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
// import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import VerticalLayout from 'src/@core/layouts/VerticalLayout'

// ** Navigation Imports
import navigation from 'src/navigation/vertical'

// ** Component Import
import VerticalAppBarContent from './components/vertical/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import { useSelector } from 'src/app/hooks'

interface Props {
  children: ReactNode
}

const UserLayout = ({ children }: Props) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()
  const role = useSelector((state) => state.localStorage.userState.user?.role) || "USER";
  const user = useSelector((state) => state.localStorage.userState.user);
  const isLoggedIn = useSelector((state) => state.localStorage.userState.isLoggedIn);

  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const verticalNavItems = navigation(role);

  return (
    <VerticalLayout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      verticalNavItems={verticalNavItems} // Navigation Items
      verticalAppBarContent={(
        props // AppBar Content
      ) => (
        <VerticalAppBarContent
          hidden={hidden}
          settings={settings}
          saveSettings={saveSettings}
          toggleNavVisibility={props.toggleNavVisibility}
        />
      )}
    >
      {children}
    </VerticalLayout>
  )
}

export default UserLayout
