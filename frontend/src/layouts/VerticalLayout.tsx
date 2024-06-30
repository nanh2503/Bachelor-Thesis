import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styles from '/styles/verticalLayout.module.scss';
import { ArrowUp, ArrowDown } from 'mdi-material-ui'
import { LayoutProps } from 'src/@core/layouts/types'
import Navigation from './navigation'
import Footer from './footer'
import ScrollToTop from 'src/layouts/fix-button/scroll-to-top'
import ScrollToBottom from './fix-button/scroll-to-bottom'
import AppBarContent from 'src/layouts/appBar/AppBarContent';

const VerticalLayout = (props: LayoutProps) => {
  const { children, scrollToTop, scrollToBottom, hidden } = props;

  const { isLoggedIn, user } = useSelector((state: any) => state.localStorage.userState);

  const [navVisible, setNavVisible] = useState<boolean>(false);
  const toggleNavVisibility = () => setNavVisible(!navVisible);

  const isUserLoggedIn = isLoggedIn && user?.role === 'USER';

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
