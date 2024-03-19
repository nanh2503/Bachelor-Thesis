// ** Icon imports
import { HomeOutline, AccountCogOutline } from 'mdi-material-ui'
import PeopleIcon from '@mui/icons-material/People'
import GroupsIcon from '@mui/icons-material/Groups'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Friends',
      icon: PeopleIcon,
      path: '/friends'
    },
    {
      title: 'Groups',
      icon: GroupsIcon,
      path: '/groups'
    },
    {
      title: 'Account Settings',
      icon: AccountCogOutline,
      path: '/account-settings'
    }
  ]
}

export default navigation
