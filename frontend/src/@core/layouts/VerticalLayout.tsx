import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styles from '/styles/verticalLayout.module.scss';
import { ArrowUp, ArrowDown } from 'mdi-material-ui'
import { LayoutProps } from 'src/@core/layouts/types'
import AppBar from './components/vertical/appBar'
import Navigation from './components/vertical/navigation'
import Footer from './components/shared-components/footer'
import ScrollToTop from 'src/@core/components/scroll-to-top'
import ScrollToBottom from '../components/scroll-to-bottom'
import AppBarContent from 'src/layouts/components/vertical/AppBarContent';
import classNames from 'classnames';

const VerticalLayout = (props: LayoutProps) => {
  const { children, scrollToTop, scrollToBottom, hidden } = props;

  const { isLoggedIn, user } = useSelector((state: any) => state.localStorage.userState);

  const [navVisible, setNavVisible] = useState<boolean>(false);
  const toggleNavVisibility = () => setNavVisible(!navVisible);

  const isUserLoggedIn = isLoggedIn && user?.role === 'USER';

  const appBarContent = classNames({
    [styles.appBarContent]: isUserLoggedIn,
    [styles.hiddenAppBar]: !isUserLoggedIn,
  });

  console.log('appBarContent: ', appBarContent);

  return (
    <div className={styles.container}>
      <div className={styles.layoutContainer}>
        {/* Navigation Menu */}
        <div className={styles.verticalNav}>
          {!hidden && isLoggedIn && (
            <Navigation
              navVisible={navVisible}
              setNavVisible={setNavVisible}
              toggleNavVisibility={toggleNavVisibility}
              {...props}
            />
          )}
        </div>

        <div className={styles.layoutContent}>
          {/* AppBar Component */}
          <div className={styles.appBar}>
            {isUserLoggedIn ? (
              <div className={styles.appBarContent}>
                <AppBarContent toggleNavVisibility={toggleNavVisibility} {...props} />
              </div>
            ) : null}
          </div>

          {/* Content */}
          <div className={styles.layoutPage}>
            {children}
          </div>

          <Footer {...props} />
        </div>
      </div>

      {/* Scroll to top button */}
      {scrollToTop ? (
        scrollToTop(props)
      ) : (
        <ScrollToTop className={styles.fixedButton}>
          <button className={styles.fab} aria-label='scroll back to top'>
            <ArrowUp />
          </button>
        </ScrollToTop>
      )}

      {/* Scroll to bottom button */}
      {scrollToBottom ? (
        scrollToBottom(props)
      ) : (
        <ScrollToBottom className={styles.fixedButton}>
          <button className={styles.fab} aria-label='scroll down to bottom'>
            <ArrowDown />
          </button>
        </ScrollToBottom>
      )}
    </div>
  );
};

export default VerticalLayout;
