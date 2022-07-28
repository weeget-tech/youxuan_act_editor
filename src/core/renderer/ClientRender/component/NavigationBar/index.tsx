import React, { memo } from 'react';
import styles from './index.less';

type TNavigationBar = {
  navigationData: {
    naviTitle?: string;
    naviBgColor?: string;
    naviBgImg?: string;
  };
};

const NavigationBar = memo(({ navigationData }: TNavigationBar) => {
  const { naviTitle, naviBgColor, naviBgImg } = navigationData;
  return (
    <>
      <div
        className={styles.navigationBar}
        style={{
          backgroundImage: `url(${naviBgImg})`,
          backgroundColor: naviBgImg ? '' : naviBgColor,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% auto',
        }}
      >
        <div className={styles.naviTitle}>{naviTitle}</div>
      </div>
    </>
  );
});

export default NavigationBar;
