<template>
  <div class="user-modify-profile">
    <section class="user-modify-profile__title">
      <div class="user-modify-profile__title__icon" @click="handlePrepareUpload()">
        <!--<img v-if="profileImage.buffer" :src="profileImage.buffer" />-->
        <img ref="profile_image" :src="profileImage.buffer"/>
        <input name="profileImage" ref="profileImageUpload" type="file" @change="handleUploadFile" />
        
        <div class="img-cover">
          <img class="img-cover-camera" :src="$static.getFileURL(`img/icon/camera.png`)"  />

        </div>
      </div>

      <div class="user-modify-profile__title__notice">
        <h1>{{$t('UserPage.MyProfile')}}</h1>
        <p>{{$t('UserPage.MyProfileManageDescription')}}</p>
      </div>
    </section>

    <section class="user-modify-profile__form">
      <h4>
        <strong>{{$t('UserPage.WalletAddress')}}</strong>
      </h4>
      <div class="user-modify-profile__form__input">
        <input
          type="text"
          :value="getUserInfo.address"
          disabled
        />
      </div>
    </section>

    <section class="user-modify-profile__form">
      <h4>
        <strong>{{$t('UserPage.UserNickname')}}</strong>
      </h4>
      <div class="user-modify-profile__form__input">
        <input
          type="text"
          v-model="username"
          :placeholder="$t('UserPage.UserNicknamePlaceholder')"
        />
        <button class="text-lightblack" @click="handleCheckAvail()">
          {{$t('UserPage.CheckAvail')}}
        </button>
      </div>
    </section>

    <section class="user-modify-profile__form">
      <h4>
        <strong>{{$t('UserPage.UsernameAka')}}</strong>
      </h4>

      <div class="user-modify-profile__form__notice">
        {{$t('UserPage.UsernameAkaDescription1')}}
        <br/>
        * {{$t('UserPage.UsernameAkaDescription2')}}
      </div>

      <common-search-dropdown
        :list="getAkaList"
        :selected="selectedAka"
        @onSelect="(option) => selectedAka = option"
      />
    </section>

    <section class="user-modify-profile__warning">
      <ul>
        <li v-for="(text, i) in getWarningList" :key="i">
          <img :src="$static.getFileURL('img/icon/ic-info-black.svg')" alt="info" />
          <p class="text-lightblack">{{text}}</p>
        </li>
      </ul>
    </section>

    <section class="user-modify-profile__submit">
      <button :class="$bem('common-submit-button', '', ['outline-primary'])" @click="handleCancelModify()">
        {{$t('General.Cancel')}}
      </button>

      <button :class="$bem('common-submit-button', '', getSaveButtonClass)" @click="handleSubmitModify()">
        {{$t('General.Save')}}
      </button>
    </section>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import isImage from 'is-image'
  import CommonSearchDropdown from '@/components/common/CommonSearchDropdown'
  import prohibitNames from '@/constants/data/prohibitNames'
  import axios from "axios";

  let $t, component

  export default {
    name: 'UserDetailModifyProfile',
    created() {
      component = this
      $t = this.$t.bind(this)
    },

    mounted() {
      this.$nextTick(() => {
        this.initPage();
        this.initSelectedAka();
      });
    },

    beforeDestroy() {

    },

    data() {
      return {
        profileImage: {
          buffer: '',
          object: {}
        },
        username: this.$store.getters.getUserInfo.username,
        availUsernameInput: this.$store.getters.getUserInfo.username,
        isAvailUsername: false,
        isChangeProfile: false,
        selectedAka: {}
      }
    },

    computed: {
      ...mapGetters([
        'getMaskedAddress'
      ]),

      getAkaList() {
        const { address } = this.getUserInfo

        return [
          {
            type: 'address',
            name: this.getMaskedAddress(address),
            value: address
          },
          {
            type: 'username',
            name: this.availUsernameInput
          }
        ]
      },

      getWarningList() {
        return [
          $t('UserPage.MyProfileManageWarning1'),
          $t('UserPage.MyProfileManageWarning2')
        ]
      },

      availUsername() {
        return /[a-z][0-9]{4, 0}/g
      },

      enableSubmit() {
        return this.availUsername && !_.isEmpty(this.selectedAka)
      },

      getSaveButtonClass() {
        return [this.enableSubmit ? 'primary' : 'disabled']
      },
    },

    watch: {
      'getUserInfo.username'(newVal) {
        if(newVal) {
          this.username = newVal
        }
      },

      'getUserInfo.display'() {
        this.initSelectedAka()
      },

      username: function (newVal, oldVal) {
        this.isAvailUsername = false;
      }
    },

    methods: {
      ...mapActions([
        'modifyUserInfo',
        'checkUsernameRegex'
      ]),

      initPage() {
        this.profileImage.buffer = `https://solex.ozys.net/images/${this.getUserInfo.address}.png`;
        this.getUserProfileImageSrc();
      },

      initSelectedAka() {
        this.selectedAka = this.getAkaList[this.getUserInfo.display - 1]
      },

      handleUploadFile(e) {
        const file = e.target.files[0]

        if(!isImage(file.name)) {
          return this.showAlert({
            content: '이미지만 업로드 가능합니다.'
          })
        }

        const reader  = new FileReader()

        reader.addEventListener('load', () => {
          this.profileImage = {
            buffer: reader.result,
            object: file
          }
          this.isChangeProfile = true;
        }, false)

        if (file) {
          reader.readAsDataURL(file);
        }
      },

      handlePrepareUpload() {
        this.$refs.profileImageUpload.click()
      },

      handleCancelModify() {
        this.$router.push({
          path: this.$route.path,
          query: {}
        })
      },

      async handleCheckAvail() {
        const { username } = this

        let flag = true;

        if(!username) {
          return false
        }

        for (const key in prohibitNames) {
          const row = prohibitNames[key];
          for (const col of row) {
            let newUsername = username.toLowerCase();
            flag = false;
            const idxs = new Array();
            for (let c of col) {
              c = c.toLowerCase();
              const idx = newUsername.indexOf(c);
              if (idx === -1) {
                flag = true;
                break;
              }
              idxs.push(idx);
              newUsername = newUsername.substring(0, idx) + '_' + newUsername.substring(idx + 1);
            }

            if (!flag) {
              let beforeIdx = null;
              for (const idx of idxs) {
                if (beforeIdx !== null) {
                  if (beforeIdx >= idx || (idx - beforeIdx) > 2) {
                    flag = true
                    break
                  }
                }
                beforeIdx = idx;
              }
            }
            if (!flag) {
              break;
            }
          }
          if (!flag) {
            break;
          }
        }

        if (flag) {
          const res = await this.checkUsernameRegex({
            username
          });

          if(!res.success) {
            this.showAlert({
              content: $t('UserPage.IsUnavailableName'),
              type: 'nameCheck'
            })
          } else {
            this.showAlert({
              content: $t('UserPage.IsAvailableName'),
              type: 'nameCheck'
            })
            this.isAvailUsername = true;
            this.availUsernameInput = this.username;
          }
        } else {
          this.showAlert({
            content: $t('UserPage.IsUnavailableName'),
            type: 'nameCheck'
          })
        }
      },

      async handleSubmitModify() {
        if(!this.enableSubmit) {
          return
        }

        // TODO : No Account 에러 파악
        const res = await this.modifyUserInfo({
          username: this.availUsernameInput,
          profile: this.profileImage.buffer,
          display: this.selectedAka.type === 'username' ? 2 : 1
        })

        if(!res.success) {
          return
        }

        return this.handleCancelModify()
      },

      getUserProfileImageSrc() {
        const baseURL = process.env.VUE_APP_API_ENDPOINT;
        const userAddress = this.getUserInfo.address;
        if (userAddress) {
          const pathURL = `images/${userAddress}.png`;
          const targetURL = `${baseURL}/${pathURL}`;

          axios.get(targetURL).then(res => {
            this.profileImage.buffer = targetURL;
            // this.$refs.profile_image.src = targetURL
          }).catch(res => {
            this.profileImage.buffer = this.$static.getFileURL('img/icon/ic-profile-default.svg');
            // this.$refs.profile_image.src = this.$static.getFileURL('img/icon/ic-profile-default.svg');
          })
        }
      }
    },

    components: {
      CommonSearchDropdown
    }
  }
</script>
