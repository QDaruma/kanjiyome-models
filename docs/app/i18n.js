/* i18n minimal FR/EN : data-i18n sur les éléments, t(clé) côté script.
   Langue = localStorage.kyLang sinon langue du navigateur (repli EN). */
const KY_STRINGS = {
  fr: {
    navReader: 'Lecteur',
    navApp: 'App Android',
    navExt: 'Extension',
    heroTitle1: 'Lis le japonais.',
    heroTitle2: 'Vraiment.',
    heroSub: 'Furigana et dictionnaire instantanés sur n’importe quel texte japonais. Sur ton téléphone, dans ton navigateur, partout. 100 % local, sans compte.',
    ctaTry: 'Essayer le lecteur',
    ctaPlay: 'App Android (bêta)',
    featTitle: 'Le même moteur, trois surfaces',
    feat1t: 'Lectures fiables',
    feat1p: 'Segmentation Viterbi sur JMdict, fréquences JPDB, accent tonal : les homographes courants (今日, 下手, 何時) sortent juste, et le moteur signale ses doutes.',
    feat2t: 'Dictionnaire intégré',
    feat2p: 'Un clic sur un mot : sens, lecture, catégorie, niveau JLPT, fiche kanji avec composants. Sans quitter le texte.',
    feat3t: 'Code couleur JLPT',
    feat3p: 'Chaque mot est souligné selon son kanji le plus difficile, du vert N5 à l’orange N1 : tu vois d’un regard ce qui est à ta portée.',
    feat4t: 'Local et privé',
    feat4p: 'Le dictionnaire (37 Mo) se télécharge une fois puis tout tourne dans ton navigateur. Tes textes ne quittent jamais ta machine.',
    feat5t: 'Scan sur mobile',
    feat5p: 'L’app Android lit les livres et mangas papier à la caméra : OCR japonais, furigana sur l’image, SRS, quiz JLPT, bibliothèque graduée.',
    feat6t: 'Extension navigateur',
    feat6p: 'Furigana et dictionnaire au survol sur n’importe quel site japonais, façon Migaku : le web devient ton immersion.',
    ecoTitle: 'Chaque plateforme fait ce qu’elle fait le mieux',
    ecoMobile: 'Mobile',
    ecoWeb: 'Web',
    ecoExt: 'Extension',
    ecoRow1: 'Scan caméra (livres, mangas)',
    ecoRow2: 'Lecture de texte collé',
    ecoRow3: 'Furigana sur les sites web',
    ecoRow4: 'SRS, quiz JLPT, progression',
    ecoRow5: 'Hors-ligne complet',
    ecoSoon: 'bientôt',
    readerTitle: 'Lecteur',
    readerIntro: 'Colle un texte japonais, il devient lisible : furigana, dictionnaire au clic, niveaux JLPT.',
    placeholder: 'Colle ton texte japonais ici…',
    analyze: 'Lire',
    furigana: 'Furigana',
    colors: 'Couleurs JLPT',
    statusInit: 'Préparation du dictionnaire…',
    statusDl: 'Téléchargement du dictionnaire (une seule fois)…',
    statusOpen: 'Ouverture du dictionnaire…',
    statusReady: 'Prêt.',
    statusError: 'Le dictionnaire n’a pas pu se charger. Recharge la page pour réessayer.',
    outPlaceholder: 'Le texte analysé s’affichera ici.',
    panelHint: 'Touche un mot pour ouvrir sa fiche.',
    back: '← Retour au mot',
    strokes: 'traits',
    freqRank: 'fréquence',
    components: 'Composants',
    onyomi: 'on’yomi',
    kunyomi: 'kun’yomi',
    extTitle: 'Extension navigateur',
    extP: 'Furigana pleine page et dictionnaire au survol sur n’importe quel site japonais. En cours de publication sur le Chrome Web Store ; en attendant, installe-la en deux minutes :',
    extStep1: 'Télécharge le paquet de l’extension (.zip) et décompresse-le.',
    extStep2: 'Ouvre chrome://extensions, active le « Mode développeur ».',
    extStep3: '« Charger l’extension non empaquetée » → choisis le dossier décompressé.',
    extStep4: 'Clique l’icône KanjiYome sur une page japonaise : furigana instantané.',
    extDl: 'Télécharger l’extension',
    footPriv: 'Confidentialité',
    footMade: 'KanjiYome est édité par Mundle SAS. Dictionnaire : JMdict, KANJIDIC2 (EDRDG), JPDB, Kanjium, KRADFILE, sous licences libres.',
  },
  en: {
    navReader: 'Reader',
    navApp: 'Android app',
    navExt: 'Extension',
    heroTitle1: 'Read Japanese.',
    heroTitle2: 'For real.',
    heroSub: 'Instant furigana and dictionary on any Japanese text. On your phone, in your browser, everywhere. 100% local, no account.',
    ctaTry: 'Try the reader',
    ctaPlay: 'Android app (beta)',
    featTitle: 'One engine, three surfaces',
    feat1t: 'Readings you can trust',
    feat1p: 'Viterbi segmentation over JMdict, JPDB frequencies, pitch accent: common homographs (今日, 下手, 何時) come out right, and the engine flags its doubts.',
    feat2t: 'Built-in dictionary',
    feat2p: 'Click any word: meanings, reading, part of speech, JLPT level, kanji sheet with components. Without leaving the text.',
    feat3t: 'JLPT color coding',
    feat3p: 'Every word is underlined by its hardest kanji, from N5 green to N1 orange: see at a glance what is within reach.',
    feat4t: 'Local and private',
    feat4p: 'The dictionary (37 MB) downloads once, then everything runs in your browser. Your texts never leave your machine.',
    feat5t: 'Camera scan on mobile',
    feat5p: 'The Android app reads paper books and manga through the camera: Japanese OCR, furigana over the image, SRS, JLPT quizzes, graded library.',
    feat6t: 'Browser extension',
    feat6p: 'Furigana and hover dictionary on any Japanese website, Migaku-style: the web becomes your immersion.',
    ecoTitle: 'Each platform does what it does best',
    ecoMobile: 'Mobile',
    ecoWeb: 'Web',
    ecoExt: 'Extension',
    ecoRow1: 'Camera scan (books, manga)',
    ecoRow2: 'Paste-and-read texts',
    ecoRow3: 'Furigana on websites',
    ecoRow4: 'SRS, JLPT quizzes, progress',
    ecoRow5: 'Full offline',
    ecoSoon: 'soon',
    readerTitle: 'Reader',
    readerIntro: 'Paste Japanese text and it becomes readable: furigana, click-to-look-up dictionary, JLPT levels.',
    placeholder: 'Paste your Japanese text here…',
    analyze: 'Read',
    furigana: 'Furigana',
    colors: 'JLPT colors',
    statusInit: 'Preparing the dictionary…',
    statusDl: 'Downloading the dictionary (one time only)…',
    statusOpen: 'Opening the dictionary…',
    statusReady: 'Ready.',
    statusError: 'The dictionary could not load. Reload the page to try again.',
    outPlaceholder: 'Your analyzed text will appear here.',
    panelHint: 'Tap a word to open its sheet.',
    back: '← Back to word',
    strokes: 'strokes',
    freqRank: 'frequency',
    components: 'Components',
    onyomi: 'on’yomi',
    kunyomi: 'kun’yomi',
    extTitle: 'Browser extension',
    extP: 'Full-page furigana and hover dictionary on any Japanese website. Chrome Web Store publication is underway; meanwhile, install it in two minutes:',
    extStep1: 'Download the extension package (.zip) and unzip it.',
    extStep2: 'Open chrome://extensions and enable "Developer mode".',
    extStep3: '"Load unpacked" → pick the unzipped folder.',
    extStep4: 'Click the KanjiYome icon on a Japanese page: instant furigana.',
    extDl: 'Download the extension',
    footPriv: 'Privacy',
    footMade: 'KanjiYome is published by Mundle SAS. Dictionary data: JMdict, KANJIDIC2 (EDRDG), JPDB, Kanjium, KRADFILE, under open licenses.',
  },
};

const kyLang = (() => {
  const saved = localStorage.getItem('kyLang');
  if (saved === 'fr' || saved === 'en') return saved;
  return (navigator.language || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';
})();

function t(key) {
  return (KY_STRINGS[kyLang] && KY_STRINGS[kyLang][key]) || KY_STRINGS.en[key] || key;
}

function kyApplyI18n() {
  document.documentElement.lang = kyLang;
  for (const el of document.querySelectorAll('[data-i18n]')) {
    el.textContent = t(el.dataset.i18n);
  }
  for (const el of document.querySelectorAll('[data-i18n-ph]')) {
    el.setAttribute('placeholder', t(el.dataset.i18nPh));
  }
  const btn = document.getElementById('langBtn');
  if (btn) btn.textContent = kyLang === 'fr' ? 'EN' : 'FR';
}

function kyToggleLang() {
  localStorage.setItem('kyLang', kyLang === 'fr' ? 'en' : 'fr');
  location.reload();
}

document.addEventListener('DOMContentLoaded', kyApplyI18n);
