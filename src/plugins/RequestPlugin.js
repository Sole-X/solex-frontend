import axios from 'axios'
import Store from '@/store'
import ApiDocs from '@/constants/ApiDocs'

export default class RequestPlugin {
  constructor() {
    const defaultHeaders = {
      'Accept': '*/*',
      'Content-Type': 'application/json; charset=UTF-8'
    }

    this.requestModule = axios.create({
      headers: defaultHeaders,
      // withCredentials: true,
      baseURL: process.env.VUE_APP_API_ENDPOINT
    })

    this.responseModule = {}
  }

  /**
   * action = 기본값은 @/api/ApiDocs.js 에 매핑되어있는 액션
   * 주소 매핑하고 이벤트 이름 정해서 붙이기 귀찮을 수 있는 다른 사람들을 위해 그냥 주소 자체를 직접 입력할 수도 있게끔 해놓기
  **/
  getRequestUrl(action) {
    const actionIsURL = /(https:|\/)/g
    return actionIsURL.exec(action) || action.charAt(0) === '/' ? action : ApiDocs[action].path
  }

  async get(action, params) {
    return await this.executeRequest(
      'GET',
      this.getRequestUrl(action),
      params,
      action
    )
  }

  async post(action, params) {
    return await this.executeRequest(
      'POST',
      this.getRequestUrl(action),
      params,
      action
    )
  }

  async put(action, params) {
    return await this.executeRequest(
      'PUT',
      this.getRequestUrl(action),
      params,
      action
    )
  }

  async delete(action, params) {
    return await this.executeRequest(
      'DELETE',
      this.getRequestUrl(action),
      params,
      action
    )
  }

  async file(url) {
    const res = await axios({
      url,
      method: 'GET'
    })

    if(res.status === 200) {
      return {
        data: res.data,
        result: 'success'
      }
    }

    return {
      result: 'fail',
      status: res.status
    }
  }

  onProgress(event) {
    Log('event is : ', event)
  }

  paramsToForm(params) {
    const result = new FormData()

    for(const key in params) {
      result.append(key, params[key])
    }

    return result
  }

  extractParams(params = {}, type = 'json') {
    if(type === 'form') {
      return this.paramsToForm(params)
    }

    const result = {}

    for(const [key, value] of Object.entries(params)) {
      result[key] = value
    }

    return result
  }

  /**
   *
   * @param method = string
   * @param url = string
   * @param params = {
   *   _eventName: string(같은 url인데 목적이 다른 경우 쓸 구분자)
   *   body: object(request body)
   *   urlQuery: string(주소 뒤에 붙는 쿼리)
   *   urlParams: string(주소 뒤에 붙는 파라미터),
   *   reqHeaders: object(custom request header)
   * }
   * @param action = string
   * @param progress = boolean
   * @return {Promise<*>}
  **/
  async executeRequest(method, url, params = {}, action, progress = false) {
    const reqData = {
      url,
      method,
      headers: {},
      data: this.extractParams(params.body, params.bodyType)
    }

    // url 중간에 들어갈 파라미터 추가
    if(params.urlParams) {
      for(const key in params.urlParams) {
        let param = ''
        let paramLiteral = `/:${key}`

        if(reqData.url.includes(paramLiteral)) {
          param = `/${params.urlParams[key]}`
        }

        reqData.url = reqData.url.replace(paramLiteral, param)
      }
    }

    if(reqData.url.includes('/:')) {
      reqData.url = reqData.url.split('/:')[0]
    }

    // url 뒤에 붙을 쿼리 추가
    if(params.urlQuery) {
      reqData.url += '?'
      for(const key in params.urlQuery) {
        if(params.urlQuery[key]) {
          reqData.url += `${key}=${params.urlQuery[key]}&`
        }
      }

      reqData.url = reqData.url.slice(0, reqData.url.length - 1)
    }

    // request header 추가
    if(params.reqHeaders) {
      for(const key in params.reqHeaders) {
        reqData.headers[key] = params.reqHeaders[key]
      }
    }

    if(params.bodyType === 'form') {
      reqData.headers['Content-Type'] = 'multipart/form-data; charset=UTF-8'
    }

    // 요청 진행 중에 대응해 줄 액션이 있는 경우
    if(progress) {
      reqData.onDownloadProgress = this.onProgress
    }

    // 같은 Endpoint는 _eventName으로 구분
    const eventKey = params._eventName || action

    Store.dispatch('setLoadingStatus', {
      [eventKey]: method
    })

    try {
      const res = await this.requestModule(reqData)

      return res.status === 200 ? {
        success: true,
        info: res.data
      } : {
        success: false,
        info: res.status
      }
    } catch(err) {
      const errInfo = err.response || {
        status: -1,
        data: {
          error: 'network_error'
        }
      }

      return {
        success: false,
        info: {
          status: errInfo.status,
          message: errInfo.data ? errInfo.data.errors : -1
        }
      }
    } finally {
      Store.dispatch('setLoadingStatus', {
        [eventKey]: false
      })
    }
  }
}
