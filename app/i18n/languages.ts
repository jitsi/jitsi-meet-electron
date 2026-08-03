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

/**
 * The i18next resource bundles, shared by the renderer instance ({@link ./index})
 * and the main process one ({@link ./main}). Adding a language means adding it
 * here (and to `Comment[lang]` in package.json for the Linux desktop file).
 */
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

export default languages;
