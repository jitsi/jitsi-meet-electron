import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import moment from 'moment';

const languages = {
    en: { translation: require('./lang/en.json') }
};

const detectedLocale = window.jitsiNodeAPI.getLocale();

i18n
    .use(initReactI18next)
    .init({
        resources: languages,
        lng: detectedLocale,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // not needed for react as it escapes by default
        }
    });

moment.locale(detectedLocale);

export default i18n;
