export default {
  methods: {
    $_AssetCardMixin_getImage(info) {
      if(!info || !info.metadata) {
        return {}
      }

      const { image } = info.metadata;

      if(!image) {
        return {}
      }

      if (image) {
        return {
          backgroundImage: `url(${image})`,
          backgroundSize: 'contain'
        }
      }
    },

    async $_AssetCardMixin_getImage_inwallet(info) {
      if (!info) {
        return {}
      }

      let image = '';

      const res = await this.$http.get('collectItem', {
        urlQuery: {
          tokenAddr: info.tokenAddress || '',
          tokenIds: info.tokenId || ''
        }
      })

      if (res.success) {
        if (res.info && res.info.nfts) {
          const d1 = res.info.nfts[info.tokenAddress];
          if (d1) {
            const d2 = d1[info.tokenId];
            if (d2) {
              const metadata = d2.desc;
              image = metadata ? metadata.image : '';
            }
          }
        }
      }
      return {
        backgroundImage: `url(${image})`,
        backgroundSize: 'contain'
      }
    }
  }
}
