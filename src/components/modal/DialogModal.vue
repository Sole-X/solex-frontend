<template>
  <section class="gen-modal dialog-modal">
    <div class="gen-modal__close" @click="close()" />

    <!--<div v-if="getType === 'nameCheck'"></div>-->
    <div class="dialog-modal__icon">
      <img :src="$static.getFileURL('img/icon/ic-modal-check.svg')" />
    </div>

    <article class="dialog-modal__title" v-html="data.title" />
    <article class="dialog-modal__article" v-html="data.content" />

    <article v-if="!data.confirm" class="gen-modal__submit">
      <button :class="$bem('common-submit-button', '', ['primary'])" @click="close()">
        {{ $t('UserPage.DialogModalClose') }}
      </button>
    </article>

    <article v-else :class="$bem('gen-modal__submit', ['confirm'], '')">
      <button :class="$bem('common-submit-button', '', ['cancel'])" @click="closeButtonClicked">
        {{data.confirm.cancel.text}}
      </button>

      <button :class="$bem('common-submit-button', '', ['primary'])" @click="handleConfirm()">
        {{data.confirm.accept.text}}
      </button>
    </article>
  </section>
</template>

<script>
  let $t, component

  export default {
    name: 'DialogModal',
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

      }
    },

    computed: {
      getType() {
        switch (this.data.type) {
          case 'nameCheck':
            return 'nameCheck';
          default:
            return null;
        }
      }
    },

    watch: {

    },

    methods: {
      handleConfirm() {
        const { accept } = this.data.confirm

        if(!accept) {
          return false
        }

        accept.callback && accept.callback()
        this.close()

        return true
      },

      closeButtonClicked() {
        setTimeout(() => {
          this.$eventBus.$emit('retrievedAsset');
        }, 500);
        this.close();
      }
    },

    components: {}
  }
</script>
