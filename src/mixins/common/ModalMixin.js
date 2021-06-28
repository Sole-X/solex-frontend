/**
 * @ModalMixin.js - 모달과 관련된 작업들을 전반적으로 처리해 줄 믹스인
 * 모달 Close 액션 설정, 리사이징에 따라 계속 업데이트되는 모달 포지션 설정 등의 기능이 존재
 **/

import ModalAction from '@/utils/ModalAction';

let component;

export default {
  created() {
    component = this;
  },

  mounted() {},

  data() {
    return {};
  },

  methods: {
    $_ModalMixin_showModal(component, params, subParams) {
      ModalAction.show(component, params, subParams);
    },

    // 모달의 포지션 설정
    $_ModalMixin_setModalPos(el, height = 480) {
      const diff = this.getWindowInfo.height - height;

      // 항상 팝업이 화면의 중앙에 오게, 만약 팝업이 클 경우 맨 위로 오게
      el.parent().css({
        top: `${diff <= 0 ? 0 : diff / 2}px`,
      });
    },

    // 모달이 자동으로 닫히게
    $_ModalMixin_setModalCloseAction(modalEl, vm) {
      const { isMobile } = this.getPlatformInfo;
      const action = isMobile ? 'touchstart' : 'mousedown';

      modalEl.bind(action, (e) => {
        // 모바일 웹은 그냥 바로 바깥 눌리면 닫아버리기
        if (isMobile && modalEl.is(e.target)) {
          return vm.$emit('close');
        }

        modalEl.attr('is-outside', modalEl.is(e.target) ? 1 : 0);
      });

      // PC 웹은 mouseup, mousedown 이벤트 둘 다 모달 영역 밖에서 발생한 경우에만 닫기. 드래그 역동적으로하는 유저들 대응
      if (!isMobile) {
        modalEl.bind('mouseup', (e) => {
          if (modalEl.is(e.target) && modalEl.attr('is-outside') === '1') {
            return vm.$emit('close');
          }
        });
      }
    },

    $_ModalMixin_showAlert(params) {
      ModalAction.show('DialogModal', params);
    },

    $_ModalMixin_showOkayAlert(obj = {}) {
      if (!obj.hasOwnProperty('showErrorIcon')) {
        obj.showErrorIcon = false;
      }

      let { text, title, okText, okAction, showErrorIcon, hideIcon } = obj;

      if (!okText) {
        okText = this.$t('Submit');
      }

      this.$_ModalMixin_showAlert({
        title,
        text,
        buttons: [
          {
            title: okText,
            handler: () => {
              okAction && okAction();
            },
          },
        ],
        hideIcon,
        showErrorIcon,
        type: obj.type || '',
      });
    },

    $_ModalMixin_showConfirmAlert(params = {}) {
      this.$_ModalMixin_showModal('ConfirmModal', {
        ...params,
      });
    },
  },
};
