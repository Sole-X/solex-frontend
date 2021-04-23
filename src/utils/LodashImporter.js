/** @LodashImporter.js
 * 프로젝트 내에서 사용하는 lodash 함수만 불러오는 곳
 * 이렇게 사용하니 번들 용량이 획기적으로 감소하여 살짝 불편하긴하지만 방식을 유지하기로
**/

module.exports = {
  map: require('lodash/map'),
  find: require('lodash/find'),
  findIndex: require('lodash/findIndex'),
  filter: require('lodash/filter'),
  sortBy: require('lodash/sortBy'),
  orderBy: require('lodash/orderBy'),
  camelCase: require('lodash/camelCase'),
  capitalize: require('lodash/capitalize'),
  cloneDeep: require('lodash/cloneDeep'),
  pickBy: require('lodash/pickBy'),
  isEmpty: require('lodash/isEmpty'),
  debounce: require('lodash/debounce')
};
