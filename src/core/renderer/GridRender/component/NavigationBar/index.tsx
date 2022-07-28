import { uuid } from "@/utils/tool";
import React, { memo, useCallback } from "react";

import styles from "./index.less";

const deviceBackgroundUrl =
  "https://img.wenhairu.com/images/2022/07/25/7E2TU.md.png";

type TNavigationBar = {
  navigationData: {
    title?: string;
    naviBgColor?: string;
    naviBgImg?: string;
    naviBarTextStyle?: string;
  };
  openSettingCB?: Function;
};

const NavigationBar = memo(
  ({ navigationData, openSettingCB }: TNavigationBar) => {
    const {
      title,
      naviBgColor,
      naviBgImg = [],
      naviBarTextStyle = "black",
    } = navigationData;
    const handleOpenSetting = useCallback(() => {
      // 打开页面设置
      if (openSettingCB) {
        openSettingCB();
      }
    }, [openSettingCB]);

    let bgStyle = {};
    if (naviBgImg?.length > 0) {
      const { url } = naviBgImg[0] as any;
      bgStyle = {
        backgroundImage: `url(${url || ""})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% auto",
      };
    } else {
      bgStyle = {
        backgroundColor: naviBgColor,
      };
    }

    return (
      <div
        key={uuid(3, 6)}
        onClick={handleOpenSetting}
        className={styles.navigationBar}
        style={{ ...bgStyle }}
      >
        <img
          draggable="false"
          src={deviceBackgroundUrl}
          className={styles.deviceBackground}
          alt=""
        />
        <div
          className={styles.naviTitle}
          style={{ color: naviBarTextStyle === "black" ? "#000" : "#fff" }}
        >
          {title || ""}
        </div>
      </div>
    );
  }
);

export default NavigationBar;
