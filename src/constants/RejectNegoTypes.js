export default [
  {
    id: 1,
    type: 'price',
    text: ($t) => {
      return $t('Market.DeclineNegoReason1');
    },
  },
  {
    id: 2,
    type: 'interest',
    text: ($t, token) => {
      return $t('Market.DeclineNegoReason2', {
        token,
      });
    },
  },
  {
    id: 3,
    type: 'other',
    text: ($t) => {
      return $t('Market.DeclineNegoReason3');
    },
  },
];
