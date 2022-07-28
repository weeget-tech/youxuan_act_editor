type params = {
  skipType: string;
  skipDesc: string;
  skipUrl: string;
};
function jumpUrlHandle(params: params = { skipType: '', skipDesc: '', skipUrl: '' }): string {
  const { skipType, skipDesc, skipUrl } = params;
  //  跳转类型 1. 不跳 ，2.领券中心，3.商品详情页，4.品牌特卖页，5.小程序， 6.H5页面,   7.多件促销,  8.满折满减，   9.活动专区
  // 11. 跳转到小助手 12. 直播广场 14.品牌分类  16. 多件任选  17.双十一活动会场  18.跳转到首页 19.店铺分享 20.当前活动分享
  if (skipType === '1') {
    return '';
  }
  if (skipType === '2') {
    // 领券中心
    return '/pages/couponCenter/couponCenter';
  }
  if (skipType === '3') {
    // 商品详情
    return `/pages/InPurchasing/goodsDetail?goodsId=${skipDesc}&goodsGroupId=${skipUrl}`;
  }
  if (skipType === '4') {
    // 品牌特卖
    return `/pages/InPurchasing/detail?goodsGroupId=${skipUrl}`;
  }
  if (skipType === '5') {
    // 小程序
    return skipUrl;
  }
  if (skipType === '6') {
    return `/pages/H5/h5Page?type=3&link='${encodeURIComponent(skipUrl)}`;
  }
  if (skipType === '7') {
    return `/subpages/morePromotionList/morePromotionList?actMorePromotionId=${skipUrl}`;
  }
  if (skipType === '8') {
    return `/pages/actArea/actArea?actDiscountId=${skipUrl}`;
  }
  if (skipType === '9') {
    return `/pages/activityArea/activityArea?id=${skipUrl}`;
  }
  // if (skipType === '11') {
  //   return `/subpages/my/imgPage?actBannerPageUrl=${skipUrl}`;
  // }
  if (skipType === '12') {
    return `/pages/livePage/liveList`;
  }
  if (skipType === '14') {
    return '/pages/brandClassify/brandClassify?type=2';
  }
  if (skipType === '17') {
    return `/subpages/activity/layout/index?actPath=${skipUrl}`;
  }
  if (skipType === '18') {
    return '';
  }
  if (skipType === '19') {
    return '';
  }
  if (skipType === '20') {
    return '';
  }

  if (skipType === 'couponAct') {
    return skipUrl;
  }
  return '';
}

export default jumpUrlHandle;
