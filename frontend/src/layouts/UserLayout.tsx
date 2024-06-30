import { ReactNode } from 'react'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import VerticalLayout from 'src/layouts/VerticalLayout'
import VerticalAppBarContent from './appBar/AppBarContent'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useSelector } from 'src/app/hooks'
import navigation from './navigation-list'

interface Props {
  children: ReactNode
}

const UserLayout = ({ children }: Props) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()
  const role = useSelector((state) => state.localStorage.userState.user?.role) || "USER";

  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const verticalNavItems = navigation(role);

  return (
    <VerticalLayout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      verticalNavItems={verticalNavItems}
      verticalAppBarContent={(
        props
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
