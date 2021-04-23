export default {
  methods: {
    $_UserSearchMixin_searchItem(item, keywords = []) {
      if(keywords.length === 0) {
        return true
      }

      // 아이템명, 토큰주소, 컬렉션명 중 하나라도 해당된다면 통과
      for(const row of keywords) {
        const valueRegex = new RegExp(row.value, 'gi')

        if(valueRegex.test(item.itemName)) {
          return true
        }

        if(valueRegex.test(item.tokenAddress)) {
          return true
        }

        if(valueRegex.test(item.collectionName)) {
          return true
        }
      }

      return false
    },

    $_UserSearchMixin_searchEvent(activity, keywords = []) {
      if(keywords.length === 0) {
        return true
      }

      // Raw eventType, 번역된 eventType 중 하나라도 해당되면 통과
      for(const row of keywords) {
        const valueRegex = new RegExp(row.value, 'gi')

        if(valueRegex.test(activity.eventToString)) {
          return true
        }

        if(valueRegex.test(activity.eventTypeToString)) {
          return true
        }
      }

      return false
    },

    $_UserSearchMixin_searchTx(activity, keywords = []) {
      if(keywords.length === 0) {
        return true
      }

      for(const row of keywords) {
        if(this.$wallet.utils.isHex(row.value)) {
          if(row.value.toLowerCase() === activity.txHash.toLowerCase()) {
            return true
          }
        }
      }

      return false
    }
  }
}
