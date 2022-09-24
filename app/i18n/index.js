import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import moment from 'moment';

const languages = {
    de: { translation: require('./lang/de.json') },
    en: { translation: require('./lang/en.json') },
    es: { translation: require('./lang/es.json') },
    fr: { translation: require('./lang/fr.json') },
    gl: { translation: require('./lang/gl.json') },
    hr: { translation: require('./lang/hr.json') },
    hu: { translation: require('./lang/hu.json') },
    it: { translation: require('./lang/it.json') },
    nl: { translation: require('./lang/nl.json') },
    pt: { translation: require('./lang/pt-br.json') },
    ru: { translation: require('./lang/ru.json') },
    sq: { translation: require('./lang/sq.json') },
    'zh-CN': { translation: require('./lang/zh-CN.json') },
    'zh-TW': { translation: require('./lang/zh-TW.json') }
};

const detectedLocale = navigator.language;

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
