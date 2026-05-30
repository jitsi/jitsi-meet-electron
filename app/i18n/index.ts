import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './lang/de.json';
import en from './lang/en.json';
import es from './lang/es.json';
import fr from './lang/fr.json';
import gl from './lang/gl.json';
import hi from './lang/hi.json';
import hr from './lang/hr.json';
import hu from './lang/hu.json';
import it from './lang/it.json';
import nl from './lang/nl.json';
import ptBr from './lang/pt-br.json';
import ru from './lang/ru.json';
import sq from './lang/sq.json';
import zhCN from './lang/zh-CN.json';
import zhTW from './lang/zh-TW.json';

const languages = {
    de: { translation: de },
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    gl: { translation: gl },
    hi: { translation: hi },
    hr: { translation: hr },
    hu: { translation: hu },
    it: { translation: it },
    nl: { translation: nl },
    pt: { translation: ptBr },
    ru: { translation: ru },
    sq: { translation: sq },
    'zh-CN': { translation: zhCN },
    'zh-TW': { translation: zhTW }
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

export default i18n;
