// ** Icon imports
import { HomeOutline, AccountCogOutline } from 'mdi-material-ui'
import GroupsIcon from '@mui/icons-material/Groups'
import FavoriteIcon from '@mui/icons-material/Favorite';

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
      title: 'Favorite',
      icon: FavoriteIcon,
      path: '/favorite'
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
