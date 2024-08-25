export const processApiResponse = (apiResponse) => {
  return apiResponse.reduce((acc, item) => {
    acc[item.themeName] = {
      title: item.themeName,
      content: item.themeDesc,
      투자수익률: {
        "원자재": item.commodityReturn,
        "코인": item.coinReturn,
        "주식": item.stockReturn,
        "부동산": item.realEstateReturn
      }
    };
    return acc;
  }, {});
};