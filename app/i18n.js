import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const languages = {
    de: { translation: require('./lang/de.json') },
    en: { translation: require('./lang/en.json') },
    it: { translation: require('./lang/it.json') }
}

i18n
    .use(initReactI18next)
    .init({
        resources: languages,
        lng: window.jitsiNodeAPI.getLocale(),
        fallbackLng: 'en',
        debug: true,
        interpolation: {
            escapeValue: false // not needed for react as it escapes by default
        }
    });

export default i18n;
