// ** Icon imports
import { HomeOutline, AccountCogOutline } from 'mdi-material-ui';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types';

const navigation = (role: string): VerticalNavItemsType => {
  if (role === "ADMIN") {
    // Navigation for Admin
    return [
      {
        title: 'Dashboard',
        icon: HomeOutline,
        path: '/'
      },
      {
        title: 'Manage Users',
        icon: PeopleAltIcon,
        path: '/manage-users'
      },
      {
        title: 'Collections',
        icon: CollectionsBookmarkIcon,
        path: '/collection'
      },
      {
        title: 'Account Settings',
        icon: AccountCogOutline,
        path: '/account-settings'
      }
    ];
  } else {
    // Navigation for User
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
        title: 'Collections',
        icon: CollectionsBookmarkIcon,
        path: '/collection'
      },
      {
        title: 'Account Settings',
        icon: AccountCogOutline,
        path: '/account-settings'
      }
    ];
  }
};

export default navigation;
