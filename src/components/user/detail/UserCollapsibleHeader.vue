<template>
  <div class="user-collapsible__header">
    <h4>
      <strong>{{title}}</strong>
    </h4>
    <label>{{total}}</label>
  </div>
</template>

<script>
  let $t, component

  export default {
    name: 'UserCollapsibleHeader',
    props: {
      title: String,
      total: [String, Number]
    },
    created() {
      component = this
      $t = this.$t.bind(this)
    },

    mounted() {

    },

    beforeDestroy() {

    },

    data() {
      return {}
    },

    computed: {},

    watch: {},

    methods: {},

    components: {}
  }
</script>
