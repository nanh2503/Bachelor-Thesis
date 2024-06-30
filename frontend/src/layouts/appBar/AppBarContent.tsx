import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearFiles } from 'src/app/redux/slices/uploadFileSlice';
import { Menu, Magnify } from 'mdi-material-ui';
import styles from '/styles/appBarLayout.module.scss';
import { Button } from '@mui/material';
import UserDropdown from '../UserDropdown';

interface Props {
  hidden: boolean;
  settings: any;
  toggleNavVisibility: () => void;
  saveSettings: (values: any) => void;
}

const AppBarContent = (props: Props) => {
  const { hidden, toggleNavVisibility } = props;
  const dispatch = useDispatch();

  const { isLoggedIn, user } = useSelector((state: any) => state.localStorage.userState);

  const [searchTerm, setSearchTerm] = useState('');
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('check event.target.value: ', event.target.value);
    setSearchTerm(event.target.value);
  };

  return (
    <div className={styles.appBarContainer}>
      <div className={styles.contentLeft}>
        {hidden && (
          <button className={styles.iconButton} onClick={toggleNavVisibility}>
            <Menu style={{ width: 30, height: 30, color: '#000' }} />
          </button>
        )}
        {user?.role === 'USER' && (
          <Button
            variant='contained'
            href="/user/upload"
            onClick={() => dispatch(clearFiles())}
            className={styles.newPostButton}
            startIcon={
              <img src="/images/icon-new-post.svg" alt='New Post icon' />
            }
          >
            <div className={styles.newPostText}>
              New Post
            </div>
          </Button>
        )}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Images, #tags, @users oh my!"
            value={searchTerm}
            onChange={handleSearchInputChange}
            className={styles.searchInput}
          />
          <button>
            <Magnify />
          </button>
        </div>
      </div>
      <div className={styles.contentRight}>
        {!isLoggedIn && (
          <a href="/auth/login" className={styles.loginButton}>
            LOGIN
          </a>
        )}
        <div className={styles.text}>
          Hi {user?.username}!
        </div>
        <div className={styles.avatar}>
          <UserDropdown />
        </div>
      </div>
    </div>
  );
};

export default AppBarContent;
