<template>
  <section class="gen-modal dialog-modal report-item-modal">
    <div class="gen-modal__close" @click="close()" />

    <article class="report-item__title">
      <h4>{{$t('Market.ReportItemTitle')}}</h4>
    </article>

    <article class="dialog-modal__article report-item__desc">
      <span v-html="$t('Market.ReportItemNotice', { collection: data.info.collectionName, item: data.info.itemName })" />
    </article>

    <textarea
      id="report-message"
      class="report-item__message-box"
      v-model="message"
      :placeholder="$t('Market.ReportFormPlaceholder')"
    />

    <button :class="$bem('common-submit-button', '', getButtonClasses)" class="report-btn" @click="handleSubmit()">
      <common-loader v-if="getLoadingStatus.reportItem" color="white" :size="24" />
      <span v-else>{{$t('Market.DoReport')}}</span>
    </button>
  </section>
</template>

<script>
  let $t, component

  export default {
    name: 'ReportItemModal',
    props: {
      data: Object,
      close: Function
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
      return {
        message: ''
      }
    },

    computed: {
      getButtonClasses() {
        return this.message.trim().length === 0 ? ['disabled'] : ['primary']
      }
    },

    watch: {},

    methods: {
      handleSubmit() {
        const { message } = this

        if(message.length === 0) {
          return false
        }

        if(!this.data.submit) {
          return false
        }

        this.data.submit(this.message, (isSuccess) => {
          isSuccess && this.close()
        })
      }
    },

    components: {}
  }
</script>
