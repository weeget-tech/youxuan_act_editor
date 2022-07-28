import React from 'react';

const iconMap = {
  imageRange: 'icon-icon_pic',
  TextTitle: 'icon-icon_title',
  Banner: 'icon-icon_banner',
  Coupon: 'icon-icon_coupon',
  Space: 'icon-icon_divider',
  FixedToolBar: 'icon-icon_fly',
  BottomNavBar: 'icon-icon_tab5',
  ToolTip: 'iconf-notice_li',
  TabAnchor: 'icon-icon_tab4',
  TabSecond: 'icon-icon_tab2',
  TabSlider: 'icon-icon_tab1',
  TabText: 'icon-icon_tab3',
  GoodsNormal: 'icon-icon_goods',
  Brand: 'icon-icon_date',
  GroupBuying: 'icon-icon_team',
  null: 'iconf-feedback-warning',
  Material: 'icon-icon_material',
  Seckill: 'icon-icon_seckill',
  MainRecommend: 'icon-icon_zhutuilanmu',
  SecondaryRecommend: 'icon-icon_cituilanmu',
};

const CompIcon = ({ type }: any) => {
  return (
    <div
      style={{ fontSize: '24px' }}
      className={`iconfont ${iconMap[type] || 'iconf-selection'}`}
    />
  );
};

export default CompIcon;
