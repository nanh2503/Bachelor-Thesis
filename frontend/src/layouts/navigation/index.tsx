import { ReactNode, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import VerticalNavItems from './VerticalNavItems';
import VerticalNavHeader from './VerticalNavHeader';
import { BadgeContentSpan } from '../UserDropdown';
import { logoutUser } from 'src/app/redux/slices/userSlice';
import { Settings } from 'src/@core/context/settingsContext';
import { VerticalNavItemsType } from 'src/@core/layouts/types';
import styles from '/styles/navigation.module.scss'; // Import combined CSS module
import { List } from '@mui/material';

interface Props {
  hidden: boolean;
  settings: Settings;
  children: ReactNode;
  navVisible: boolean;
  toggleNavVisibility: () => void;
  setNavVisible: (value: boolean) => void;
  verticalNavItems?: VerticalNavItemsType;
  saveSettings: (values: Settings) => void;
}

const Navigation = (props: Props) => {
  const {
    hidden,
    navVisible,
  } = props;

  const router = useRouter();
  const dispatch = useDispatch();
  const [groupActive, setGroupActive] = useState<string[]>([]);
  const [currentActiveGroup, setCurrentActiveGroup] = useState<string[]>([]);
  const userInfo = useSelector((state: any) => state.localStorage.userInfoState.userInfo);

  const handleLogOut = () => {
    router.push("/auth/login");
    dispatch(logoutUser());
  };

  return (
    <div className={styles.drawer}>
      <VerticalNavHeader {...props} />
      <Box sx={{ pt: 7, pb: 3, px: 4, mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge
            overlap='circular'
            badgeContent={<BadgeContentSpan />}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Avatar alt={userInfo?.username} src={userInfo?.avatar ?? '/images/avatars/male.png'} sx={{ width: '3rem', height: '3rem', border: '1px solid #9E69FD' }} />
          </Badge>
          <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 600, fontSize: 18 }}>{userInfo?.username}</Typography>
            <Typography variant='body2' sx={{ fontSize: 13 }}>
              {userInfo?.email}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
        <Box
          sx={{
            height: '100%',
            overflowY: hidden ? 'auto' : 'hidden',
            overflowX: 'hidden',
          }}
        >
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <List className={styles.navItems} sx={{ transition: 'padding .25s ease', pr: 4.5 }}>
                <VerticalNavItems
                  groupActive={groupActive}
                  setGroupActive={setGroupActive}
                  currentActiveGroup={currentActiveGroup}
                  setCurrentActiveGroup={setCurrentActiveGroup}
                  {...props}
                />
              </List>
              <div className={styles.btnMenu}>
                <button className={styles.logout} onClick={handleLogOut}>
                  <FontAwesomeIcon icon={faArrowCircleLeft} className={styles.icon} />
                  <span className="px-2">Log Out</span>
                </button>
              </div>
            </div>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Navigation;
