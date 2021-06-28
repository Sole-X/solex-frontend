import axios from 'axios';
import VueI18n from 'vue-i18n';
import { getFileURL } from '@/main';

const initTranslation = async () => {
  const en = await axios.get(getFileURL(`lang/en.json?t=${process.env.version}`)).then((res) => {
    return res.data;
  });

  const ko = await axios.get(getFileURL(`lang/ko.json?t=${process.env.version}`)).then((res) => {
    return res.data;
  });

  return new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en,
      ko,
    },
  });
};

export default initTranslation;
