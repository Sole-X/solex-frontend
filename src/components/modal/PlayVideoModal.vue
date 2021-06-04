<template>
  <article class="play-video-modal">
    <header class="play-video-modal-header">
      <img :src="$static.getFileURL('img/icon/ic-close-gray.svg')" @click="() => close()"/>
    </header>
    <video controls autoplay loop>
      <source :src="data.videoUrl" />
      Sorry, your browser doesn't support embedded videos.
    </video>
  </article>
</template>

<script>
let $t, self

export default {
  name: 'PlayVideoModal',

  mixins: [],

  props: {
    data: Object,
    close: Function
  },

  created() {
    self = this
    $t = this.$t.bind(this)
  },

  mounted() {

  },

  beforeDestroy() {

  },

  data() {
    return {

    }
  },

  computed: {

  },

  watch: {

  },

  methods: {

  },

  components: {

  }
}
</script>