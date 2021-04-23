import Store from '@/store/index'

export default class ModalAction {
  static isCloseableModal(name) {
    const disableClose = [
      'SelectWalletModal'
    ]

    return _.find(disableClose, o => o === name) === undefined
  }

  static show(moduleName, paramsOrProps = {}, params) {
    // 열고자 하는 모달의 이름을 제대로 넣지 않았을 경우
    if(!moduleName) {
      return
    }

    const component = Store.$app
    const baseModal = require(`@/components/modal/BaseModal`).default
    const modalComponent = require(`@/components/modal/${moduleName}`).default

    // 100만분의 1의 확률로 모달 라이브러리가 안깔렸으면
    if(!component || !component.$modal) {
      return
    }

    // 몇몇 모달은 배경 클릭으로 닫을 수 없게 설정
    if(!this.isCloseableModal(moduleName)) {
      params = Object.assign({}, params, {
        clickToClose: false
      })
    }

    // 모달에 들어갈 트랜지션명 설정
    if(!params) {
      params = {
        transition: 'solex-modal'
      }
    } else {
      params.transition = params.transition || 'solex-modal'
    }

    let modalData = {
      modalProps: paramsOrProps,
      modalComponent: modalComponent
    }

    component.$modal.show(baseModal, modalData, params)
  }
}
