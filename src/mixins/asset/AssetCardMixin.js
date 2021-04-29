export default {
  methods: {
    $_AssetCardMixin_getImage(info) {
      if (!info || !info.metadata) {
        return {};
      }

      if (info.image && info.image !== "") {
        return {
          backgroundImage: `url(${info.image})`,
          backgroundSize: "contain",
        };
      }

      const { image } = info.metadata;

      if (!image) {
        return {};
      }

      if (image) {
        return {
          backgroundImage: `url(${image})`,
          backgroundSize: "contain",
        };
      }
    },
  },
};
