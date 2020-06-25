import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const languages = {
    en: { translation: require('./lang/en.json') }
};

i18n
    .use(initReactI18next)
    .init({
        resources: languages,
        lng: window.jitsiNodeAPI.getLocale(),
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // not needed for react as it escapes by default
        }
    });

export default i18n;
