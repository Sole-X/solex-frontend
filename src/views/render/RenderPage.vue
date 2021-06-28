<template>
  <div>render...</div>
</template>

<script>
export default {
  name: 'RenderPage',

  mounted() {
    if (this.$route.query.path) {
      const fromPath = this.$route.query.path;

      this.$router.replace(fromPath || '/home');
    }
  },
};
</script>
