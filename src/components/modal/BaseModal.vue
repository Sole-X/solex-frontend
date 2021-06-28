<template>
  <div class="base-modal" :class="modalComponent.name">
    <component :is="modalComponent" :data="modalProps" :close="handleClose" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import ModalAction from '@/utils/ModalAction';

export default {
  name: 'BaseModal',
  props: {
    modalProps: Object,
    modalComponent: Object,
  },

  mounted() {
    setTimeout(this.initBaseModal, 400);
  },

  beforeDestroy() {
    this.closeModal();
  },

  data() {
    return {};
  },

  computed: {},

  watch: {
    $route() {
      this.handleClose();
    },
  },

  methods: {
    ...mapActions(['closeModal']),

    initBaseModal() {
      const modalEl = $(this.$el);
      const isCloseable = ModalAction.isCloseableModal(this.modalComponent.name);

      this.$_ModalMixin_setModalPos(modalEl, modalEl.height());
      isCloseable && this.$nextTick(() => this.$_ModalMixin_setModalCloseAction(modalEl, this));
    },

    handleClose() {
      this.$emit('close');
    },
  },
};
</script>
