import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import languages from './languages';

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

export default i18n;
