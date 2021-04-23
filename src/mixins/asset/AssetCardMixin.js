export default {
  methods: {
    $_AssetCardMixin_getImage(info) {
      if(!info || !info.metadata) {
        return {}
      }

      const { image } = info.metadata

      if(!image) {
        return {}
      }

      if (image) {
        return {
          backgroundImage: `url(${image})`,
          backgroundSize: 'contain'
        }
      }
    }
  }
}
