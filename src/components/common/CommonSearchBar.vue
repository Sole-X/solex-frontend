<template>
  <div :class="$bem('common-search-bar', '', keyword.length > 0 ? ['dirty'] : '')">
    <slot name="option"></slot>
    <div class="common-search-bar__input-container">
      <div class="common-search-bar__input">
        <input
            ref="input"
            type="text"
            :placeholder="defaultText || 'search'"
            :value="keyword"
            @keyup="handleInput"
            @keyup.enter="$emit('onSubmit')"
            tabindex="-1"
            :disabled="disabled"
        />
        <slot name="result">
          <ui-popover
              v-if="!options.hideResultBox"
              ref="resultBox"
              onOpen="manual"
              :containFocus="true"
              class="common-search-bar__result"
              :style="options.resultStyle || {}"
          >
            <slot name="resultBody"></slot>
          </ui-popover>
        </slot>
      </div>
      <img v-if="!searchDisabled" :src="$static.getFileURL('img/icon/ic-search-bk.svg')" alt="search" />
    </div>

    <!--
    <slot name="result">
      <ui-popover
        v-if="!options.hideResultBox"
        ref="resultBox"
        onOpen="manual"
        :containFocus="true"
        class="common-search-bar__result"
        :style="options.resultStyle || {}"
      >
        <slot name="resultBody"></slot>
      </ui-popover>
    </slot>
    -->
  </div>
</template>

<script>
  let $t, component

  export default {
    name: 'CommonSearchBar',
    props: {
      keyword: String,
      defaultText: String,
      disabled: Boolean,
      searchDisabled: Boolean,
      options: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    created() {
      component = this
      $t = this.$t.bind(this)
    },

    mounted() {
      this.$nextTick(this.handleResultBox)
    },

    beforeDestroy() {

    },

    data() {
      return {
        optionsInData: {
          resultStyle: {
            backgroundColor : '#444444'
          }
        }
      }
    },

    computed: {},

    watch: {},

    methods: {
      handleInput(e) {
        const _value = e.target.value
        const { resultBox } = this.$refs

        if(resultBox) {
          if(_value.length >= 2) {
            resultBox.open()
          } else {
            resultBox.close()
          }
        }

        this.$emit('onInput', _value)
      },

      handleResultBox() {
        const { resultBox } = this.$refs

        if(!resultBox) {
          return
        }

        resultBox.isOpen() && resultBox.close()
      }
    },

    components: {}
  }
</script>
