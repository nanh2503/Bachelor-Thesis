import { HomeOutline, AccountCogOutline } from 'mdi-material-ui';
import { CollectionsBookmark, Favorite } from '@mui/icons-material';
import { VerticalNavItemsType } from 'src/@core/layouts/types';

const navigation = (role: string): VerticalNavItemsType => {
  if (role === "ADMIN") {
    return [
      {
        title: 'Dashboard',
        icon: HomeOutline,
        path: '/'
      },
      {
        title: 'Collections',
        icon: CollectionsBookmark,
        path: '/collection'
      },
      {
        title: 'Account Settings',
        icon: AccountCogOutline,
        path: '/account-settings'
      }
    ];
  } else {
    return [
      {
        title: 'Dashboard',
        icon: HomeOutline,
        path: '/'
      },
      {
        title: 'Favorite',
        icon: Favorite,
        path: '/user/favorite'
      },
      {
        title: 'Albums',
        icon: CollectionsBookmark,
        path: '/user/albums'
      },
      {
        title: 'Account Settings',
        icon: AccountCogOutline,
        path: '/user/account-settings'
      }
    ];
  }
};

export default navigation;
