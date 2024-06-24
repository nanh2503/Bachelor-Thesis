import { ReactNode } from 'react';
import { AppBar, Toolbar, useTheme } from '@mui/material';
import { Settings } from 'src/@core/context/settingsContext';
import styles from '/styles/appBarLayout.module.scss';

interface Props {
  hidden: boolean;
  settings: Settings;
  toggleNavVisibility: () => void;
  saveSettings: (values: Settings) => void;
  verticalAppBarContent?: (props?: any) => ReactNode;
}

const LayoutAppBar = (props: Props) => {
  const { settings, verticalAppBarContent: userVerticalAppBarContent } = props;

  const theme = useTheme();

  const { contentWidth } = settings;

  console.log('check userVerticalAppBarContent: ', userVerticalAppBarContent);

  return (
    <AppBar elevation={0} color='default' className={styles.layoutNavbar} position='static'>
      <Toolbar
        className={styles.navbarContent}
        sx={{
          ...(contentWidth === 'boxed' && {
            '@media (min-width:1440px)': { maxWidth: `calc(1440px - ${theme.spacing(6)} * 2)` }
          })
        }}
      >
        {(userVerticalAppBarContent && userVerticalAppBarContent(props)) || null}
      </Toolbar>
    </AppBar>
  );
};

export default LayoutAppBar;
