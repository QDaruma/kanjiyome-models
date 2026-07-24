/* Lecteur KanjiYome : init moteur (engine.js + sqlite3.wasm + base), analyse,
   rendu ruby interactif, panneau fiche mot/kanji. */

const POS_LABELS = {
  fr: { n: 'nom', 'adj-i': 'adjectif en -i', 'adj-na': 'adjectif en -na', 'adj-no': 'adjectif en の', adv: 'adverbe', exp: 'expression', prt: 'particule', conj: 'conjonction', int: 'interjection', pn: 'pronom', num: 'numéral', ctr: 'compteur', 'aux-v': 'auxiliaire', cop: 'copule', pref: 'préfixe', suf: 'suffixe', vs: 'nom + する', v1: 'verbe ichidan', vk: 'verbe kuru', 'vs-i': 'verbe suru' },
  en: { n: 'noun', 'adj-i': 'i-adjective', 'adj-na': 'na-adjective', 'adj-no': 'no-adjective', adv: 'adverb', exp: 'expression', prt: 'particle', conj: 'conjunction', int: 'interjection', pn: 'pronoun', num: 'numeral', ctr: 'counter', 'aux-v': 'auxiliary', cop: 'copula', pref: 'prefix', suf: 'suffix', vs: 'suru noun', v1: 'ichidan verb', vk: 'kuru verb', 'vs-i': 'suru verb' },
};

function posLabel(tag) {
  const map = POS_LABELS[kyLang] || POS_LABELS.en;
  if (map[tag]) return map[tag];
  if (tag.startsWith('v5')) return kyLang === 'fr' ? 'verbe godan' : 'godan verb';
  return tag;
}

const state = { ready: false, tokens: [], jlpt: {}, selected: -1, lastWord: null };

const $ = (id) => document.getElementById(id);

async function kyBoot() {
  const status = $('status');
  const bar = $('dlbar');
  try {
    status.textContent = t('statusInit');
    const [wasmResp, db] = await Promise.all([
      fetch('sqlite3.wasm').then((r) => r.arrayBuffer()),
      (async () => {
        status.textContent = t('statusDl');
        bar.hidden = false;
        const bytes = await kyLoadDictionary((f) => {
          if (f != null) bar.value = f;
        });
        bar.hidden = true;
        return bytes;
      })(),
    ]);
    $('status').textContent = t('statusOpen');
    await kyInit(new Uint8Array(wasmResp), db, kyLang !== 'fr');
    state.ready = true;
    status.textContent = t('statusReady');
    $('analyzeBtn').disabled = false;
    const params = new URLSearchParams(location.search);
    const preset = params.get('t');
    if (preset) {
      $('input').value = preset;
      kyRead();
    }
  } catch (e) {
    console.error(e);
    bar.hidden = true;
    status.textContent = t('statusError');
  }
}

function wordLevel(surface) {
  let lvl = null;
  for (const ch of surface) {
    const l = state.jlpt[ch];
    if (l != null && (lvl == null || l < lvl)) lvl = l;
  }
  return lvl;
}

async function kyRead() {
  if (!state.ready) return;
  const text = $('input').value.trim();
  if (!text) return;
  const res = JSON.parse(await kyAnalyze(text));
  state.tokens = res.tokens;
  state.jlpt = res.jlpt;
  state.selected = -1;
  renderTokens();
  closePanelWord();
}

function renderTokens() {
  const out = $('out');
  out.textContent = '';
  state.tokens.forEach((tok, i) => {
    // Ponctuation/retours à la ligne : texte nu, sauts respectés.
    if (!tok.e && !tok.r && /^[\s　]*$/.test(tok.s)) {
      tok.s.split('\n').forEach((part, j) => {
        if (j > 0) out.appendChild(document.createElement('br'));
        if (part) out.appendChild(document.createTextNode(part));
      });
      return;
    }
    const span = document.createElement('span');
    span.className = 'tok';
    span.dataset.i = i;
    const lvl = wordLevel(tok.s);
    if (lvl != null) span.classList.add('j' + lvl);
    if (tok.ax) span.classList.add('approx');
    else if (tok.un) span.classList.add('uncertain');
    for (const [txt, ruby] of tok.f) {
      if (ruby) {
        const r = document.createElement('ruby');
        r.appendChild(document.createTextNode(txt));
        const rt = document.createElement('rt');
        rt.textContent = ruby;
        r.appendChild(rt);
        span.appendChild(r);
      } else {
        txt.split('\n').forEach((part, j) => {
          if (j > 0) span.appendChild(document.createElement('br'));
          if (part) span.appendChild(document.createTextNode(part));
        });
      }
    }
    if (tok.e || tok.r) {
      span.tabIndex = 0;
      span.setAttribute('role', 'button');
      span.addEventListener('click', () => selectToken(i));
      span.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); selectToken(i); }
      });
    }
    out.appendChild(span);
  });
}

function selectToken(i) {
  state.selected = i;
  for (const el of document.querySelectorAll('.tok.sel')) el.classList.remove('sel');
  const el = document.querySelector('.tok[data-i="' + i + '"]');
  if (el) el.classList.add('sel');
  showWord(state.tokens[i]);
}

function showWord(tok) {
  state.lastWord = tok;
  document.querySelector('.reader-grid').classList.add('with-panel');
  const p = $('panelBody');
  const e = tok.e;
  const lvl = wordLevel(tok.s);
  p.textContent = '';
  const h = document.createElement('h3');
  h.className = 'word jp';
  h.textContent = tok.d || tok.s;
  if (lvl != null) {
    const b = document.createElement('span');
    b.className = 'badge j' + lvl;
    b.textContent = 'N' + lvl;
    h.appendChild(b);
  }
  p.appendChild(h);
  if (e || tok.r) {
    const r = document.createElement('p');
    r.className = 'reading';
    r.textContent = e ? e.r : (tok.r || '');
    if (e && e.pitch != null) {
      const pi = document.createElement('span');
      pi.className = 'pitch';
      pi.textContent = '[' + e.pitch + ']';
      r.appendChild(pi);
    }
    p.appendChild(r);
  }
  if (e && e.p) {
    const pos = document.createElement('p');
    pos.className = 'pos';
    pos.textContent = e.p.split(',').slice(0, 3).map(posLabel).join(' · ');
    p.appendChild(pos);
  }
  if (e && e.g) {
    const g = document.createElement('p');
    g.className = 'gloss';
    g.textContent = e.g;
    p.appendChild(g);
  }
  const kanjis = [...new Set([...tok.s].filter((c) => state.jlpt[c] != null || /[一-鿿]/.test(c)))];
  if (kanjis.length) {
    const row = document.createElement('div');
    row.className = 'kanjis';
    for (const k of kanjis) {
      const btn = document.createElement('button');
      btn.className = 'kbtn';
      btn.textContent = k;
      btn.addEventListener('click', () => showKanji(k));
      row.appendChild(btn);
    }
    p.appendChild(row);
  }
}

async function showKanji(literal) {
  const info = JSON.parse(await kyKanji(literal));
  if (!info) return;
  const p = $('panelBody');
  p.textContent = '';
  const back = document.createElement('button');
  back.className = 'chip back';
  back.textContent = t('back');
  back.addEventListener('click', () => { if (state.lastWord) showWord(state.lastWord); });
  p.appendChild(back);
  const h = document.createElement('h3');
  h.className = 'word jp';
  h.textContent = info.literal;
  if (info.jlpt) {
    const b = document.createElement('span');
    b.className = 'badge j' + info.jlpt;
    b.textContent = 'N' + info.jlpt;
    h.appendChild(b);
  }
  p.appendChild(h);
  const meta = (label, val, jp) => {
    if (!val) return;
    const m = document.createElement('p');
    m.className = 'kmeta';
    if (label) {
      const lab = document.createElement('span');
      lab.textContent = label + ' : ';
      m.appendChild(lab);
    }
    const v = document.createElement(jp ? 'b' : 'span');
    v.textContent = val;
    m.appendChild(v);
    p.appendChild(m);
  };
  meta(t('onyomi'), info.on, true);
  meta(t('kunyomi'), info.kun, true);
  meta('', info.meanings, false);
  meta(t('strokes'), String(info.strokes), false);
  if (info.components && info.components.length) {
    const lab = document.createElement('p');
    lab.className = 'pos';
    lab.textContent = t('components');
    p.appendChild(lab);
    const row = document.createElement('div');
    row.className = 'komp';
    for (const c of info.components) {
      const s = document.createElement('span');
      s.textContent = c;
      row.appendChild(s);
    }
    p.appendChild(row);
  }
}

function closePanelWord() {
  const p = $('panelBody');
  p.textContent = '';
  const hint = document.createElement('p');
  hint.className = 'hint';
  hint.textContent = t('panelHint');
  p.appendChild(hint);
}

document.addEventListener('DOMContentLoaded', () => {
  $('analyzeBtn').addEventListener('click', kyRead);
  $('input').addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') kyRead();
  });
  $('furiBtn').addEventListener('click', () => {
    const on = $('furiBtn').getAttribute('aria-pressed') !== 'true';
    $('furiBtn').setAttribute('aria-pressed', on);
    $('out').classList.toggle('nofuri', !on);
  });
  $('colorBtn').addEventListener('click', () => {
    const on = $('colorBtn').getAttribute('aria-pressed') !== 'true';
    $('colorBtn').setAttribute('aria-pressed', on);
    $('out').classList.toggle('nojlpt', !on);
  });
  let size = 21;
  $('sizeUp').addEventListener('click', () => {
    size = Math.min(size + 2, 33);
    $('out').style.setProperty('--reader-size', size + 'px');
  });
  $('sizeDown').addEventListener('click', () => {
    size = Math.max(size - 2, 15);
    $('out').style.setProperty('--reader-size', size + 'px');
  });
  closePanelWord();
  kyBoot();
});
