export default { // TODO : method, params, query 등에 대한 검증
  searchNft: {
    methods: ['GET'],
    path: '/v1/nfts',
    requiredParam: ['page', 'status'],
    requiredQuery: []
  },
  likeNft: {
    methods: ['POST'],
    path: '/v1/nfts/like',
    requiredBody: ['accountAddr', 'tokenId'],
    requiredParam: [],
    requiredQuery: []
  },
  unlikeNft: {
    methods: ['POST'],
    path: '/v1/nfts/unlike',
    requiredBody: ['accountAddr', 'tokenId'],
    requiredParam: [],
    requiredQuery: []
  },
  getLatestNft: {
    methods: ['GET'],
    path: '/v1/nfts/',
    requiredParam: [],
    requiredQuery: []
  },
  getPopularNft: {
    methods: ['GET'],
    path: '/v1/nfts/mostLike',
    requiredParam: [],
    requiredQuery: []
  },
  getItemDetail: {
    methods: ['GET'],
    path: '/v1/nfts/:tokenAddress/:tokenId',
    requiredParam: [],
    requiredQuery: []
  },
  getWritingDetailBuy: {
    methods: ['GET'],
    path: '/v1/buys/:tradeId',
    requiredParam: [],
    requiredQuery: []
  },
  getWritingDetailSale: {
    methods: ['GET'],
    path: '/v1/sale/:tradeId',
    requiredParam: [],
    requiredQuery: []
  },
  addItemReadLog: {
    methods: ['POST'],
    path: '/v1/nfts/recentView',
    requiredParam: ['accountAddr', 'tokenAddr', 'tokenId'],
    requiredQuery: []
  },
  getAuctionDetail: {
    methods: ['GET'],
    path: '/v1/auctions/:auctionId',
    requiredParam: [],
    requiredQuery: []
  },
  getUserInfo: {
    methods: ['GET'],
    path: '/v1/account/:user',
    requiredParam: [],
    requiredQuery: []
  },
  getUserDeposited: {
    methods: ['GET'],
    path: '/v1/account/:user/totalBalance',
    requiredParam: [],
    requiredQuery: []
  },
  getRecentViewOfUser: {
    methods: ['GET'],
    path: '/v1/nfts/recentView/:user',
    requiredParam: [],
    requiredQuery: []
  },
  getLikedItemsOfUser: {
    methods: ['GET'],
    path: '/v1/nfts/like/:user',
    requiredParam: [],
    requiredQuery: []
  },
  getUserItems: {
    methods: ['GET'],
    path: '/v1/account/:user/nfts',
    requiredParams: [],
    requiredQuery: []
  },
  getUserActivities: {
    methods: ['GET'],
    path: '/v1/account/:user/activites',
    requiredParams: [],
    requiredQuery: []
  },
  sendSignedMessageTx: {
    methods: ['POST'],
    path: '/v1/sign/send',
    requiredParams: ['hash', 'msg', 'hashType', 'signHash', 'cate'],
    requiredQuery: []
  },
  getBuyOrder: {
    methods: ['GET'],
    path: '/v1/buys/:offerId',
    requiredParams: [],
    requiredQuery: []
  },
  getSellOrder: {
    methods: ['GET'],
    path: '/v1/sells/:offerId',
    requiredParams: [],
    requiredQuery: []
  },
  getBuyOrders: {
    methods: ['GET'],
    path: '/v1/buys',
    requiredParams: [],
    requiredQuery: []
  },
  getSellOrders: {
    methods: ['GET'],
    path: '/v1/sells',
    requiredParams: [],
    requiredQuery: []
  },
  getMyTotalBalance: {
    methods: ['GET'],
    path: '/v1/account/:accountAddr/totalBalance',
    requiredParams: ['accountAddr'],
    requiredQuery: []
  },
  getAuctionOrders: {
    methods: ['GET'],
    path: '/v1/auctions',
    requiredParams: [],
    requiredQuery: []
  },
  declineNego: {
    methods: ['POST'],
    path: '/v1/sells/:sellId/declineNego/:negoId',
    requiredParams: [],
    requiredQuery: []
  },
  getAllActivities: {
    methods: ['GET'],
    path: '/v1/explorer/activity',
    requiredParams: [],
    requiredQuery: []
  },
  getAllRanks: {
    methods: ['GET'],
    path: '/v1/explorer/rank',
    requiredParams: [],
    requiredQuery: []
  },
  login: {
    methods: ['POST'],
    path: '/v1/users/login',
    requiredParams: [],
    requiredQuery: []
  },
  getWhitelistTokens: {
    methods: ['GET'],
    path: '/v1/common/token/whitelist',
    requiredParams: [],
    requiredQuery: []
  },
  reportItem: {
    methods: ['POST'],
    path: '/v1/common/report',
    requiredParams: [],
    requiredQuery: []
  },
  modifyUserInfo: {
    methods: ['POST'],
    path: '/v1/account/:user/profile',
    requiredParams: [],
    requiredQuery: []
  },
  checkUsernameRegex: {
    methods: ['GET'],
    path: '/v1/common/nameCheck/:username',
    requiredParams: [],
    requiredQuery: []
  },
  getRecentViewOfAll: {
    methods: ['GET'],
    path: '/v1/nfts/recentView',
    requiredParams: [],
    requiredQuery: []
  },
  getItemHistory: {
    methods: ['GET'],
    path: '/v1/nfts/:tokenAddress/:tokenId/history',
    requiredParams: [],
    requiredQuery: []
  },
  getSideInfo: {
    methods: ['GET'],
    path: '/v1/common/sideInfo',
    requiredParams: [],
    requiredQuery: []
  },
  getAccountStaking: {
    methods: ['GET'],
    path: '/v1/account/:accountAddress/staking',
    requiredParams: [],
    requiredQuery: []
  },
  setAgreement: {
    methods: ['POST'],
    path: '/v1/account/:accountAddr/agreement',
    requiredParams: ['accountAddr'],
    requiredQuery: []
  },
  collectItem: {
    methods: ['GET'],
    path: '/v1/nfts/metadata',
    requiredParams: [],
    requiredQuery: []
  }
}
