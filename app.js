"use strict";
/* German Scroll – an endless feed of tiny German games. Content lives in content.js. */

// ---------- helpers ----------
const $ = (s, r = document) => r.querySelector(s);
function h(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}
const rnd = a => a[Math.floor(Math.random() * a.length)];
const ri = a => Math.floor(Math.random() * a.length);
function shuffle(a) {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const sample = (a, n, not) => shuffle(a.filter(x => x !== not)).slice(0, n);
const strip = s => s.replace(/<[^>]+>/g, "");
const ARTS = ["der", "die", "das"];
const art = a => `<span class="art ${a}">${a}</span>`;
const say = t => `<button class="say" data-say="${strip(t).replace(/"/g, "&quot;")}" aria-label="anhören">🔊</button>`;
const PRAISE = ["Super!", "Toll!", "Genau!", "Sehr gut!", "Perfekt!", "Wahnsinn!", "Bravo!", "Leiwand!"];
const OOPS = ["Fast!", "Nicht ganz…", "Hoppla!", "Knapp daneben!", "Macht nix!"];

const NOUNS = NOUN_DATA.map((l, i) => { const [a, w, en, e = ""] = l.split("|"); return { a, w, en, e, i }; });

// ---------- saved progress ----------
// prog: correct answers per level · learned: finished lessons (by title) · passed: level tests passed
const S = Object.assign({ xp: 0, best: 0, wrong: [], mute: false, level: 2, prog: {}, learned: {}, passed: {}, notified: {} },
  (() => { try { return JSON.parse(localStorage.getItem("gscroll")) || {}; } catch { return {}; } })());
const save = () => { try { localStorage.setItem("gscroll", JSON.stringify(S)); } catch {} };
let streak = 0;

// ---------- level-aware picking: mostly your level, some review from easier levels ----------
function pickIdx(key, ok = () => true) {
  const all = LV[key].map((l, i) => i).filter(i => LV[key][i] <= S.level && ok(i));
  const top = all.filter(i => LV[key][i] === S.level);
  return top.length && Math.random() < .65 ? rnd(top) : rnd(all);
}
function pickMany(key, n, ok) {
  const s = new Set();
  for (let g = 0; s.size < n && g < 200; g++) s.add(pickIdx(key, ok));
  return [...s];
}
const pickNoun = needEmoji => NOUNS[pickIdx("nouns", i => !needEmoji || NOUNS[i].e)];
const nounSet = (n, needEmoji, not) => pickMany("nouns", n, i => (!needEmoji || NOUNS[i].e) && NOUNS[i] !== not).map(i => NOUNS[i]);

// ---------- sound, speech, vibration ----------
let ac;
function tone(f, t, d, type = "sine", v = .14) {
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d);
}
function sfx(kind) {
  if (S.mute) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const t = ac.currentTime;
    if (kind === "ok") { tone(660, t, .12); tone(990, t + .08, .2); }
    else if (kind === "bad") tone(160, t, .25, "sawtooth", .07);
    else if (kind === "win") [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * .09, .25));
    else tone(520, t, .05, "triangle", .05);
  } catch {}
}
const buzz = p => navigator.vibrate && navigator.vibrate(p);

let deVoice;
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const voices = speechSynthesis.getVoices(), lang = v => v.lang.replace("_", "-");
  deVoice = deVoice || voices.find(v => lang(v) === "de-AT") || voices.find(v => lang(v).startsWith("de"));
  const u = new SpeechSynthesisUtterance(strip(text).replace(/_+/g, "…"));
  u.lang = deVoice ? lang(deVoice) : "de-DE";
  if (deVoice) u.voice = deVoice;
  u.rate = .9;
  speechSynthesis.speak(u);
}
const autoSay = t => { if (!S.mute) speak(t); };

// ---------- visual effects ----------
const fx = $("#fx"), ctx = fx.getContext("2d");
let parts = [], raf = 0;
function resize() { fx.width = innerWidth * devicePixelRatio; fx.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); }
addEventListener("resize", resize); resize();
const COLORS = ["#ffd166", "#2ee59d", "#ff5c7a", "#4cc9f0", "#ffffff", "#c77dff"];
function confetti(x, y, n = 30) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = 3 + Math.random() * 7;
    parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 4, r: 3 + Math.random() * 4, c: rnd(COLORS), life: 50 + Math.random() * 40, rot: Math.random() * 6 });
  }
  if (!raf) raf = requestAnimationFrame(loop);
}
function loop() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter(p => p.life-- > 0);
  for (const p of parts) {
    p.vy += .25; p.vx *= .98; p.x += p.vx; p.y += p.vy; p.rot += .2;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = Math.min(1, p.life / 20);
    ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore();
  }
  raf = parts.length ? requestAnimationFrame(loop) : 0;
}
function center(el) {
  if (!el) return [innerWidth / 2, innerHeight / 2];
  const r = el.getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2];
}
function floatText(x, y, txt) {
  const e = h("div", "float", txt);
  e.style.left = x + "px"; e.style.top = y + "px";
  document.body.append(e); setTimeout(() => e.remove(), 1000);
}
function combo(n) {
  const e = h("div", "combo", `🔥 ${n}er-Serie!`);
  document.body.append(e); setTimeout(() => e.remove(), 1500);
  confetti(innerWidth / 2, innerHeight * .4, 90); sfx("win");
}

// ---------- score & HUD ----------
function score(ok, el, { id, pts = 10 } = {}) {
  const [x, y] = center(el);
  if (ok) {
    streak++;
    const mult = streak >= 10 ? 3 : streak >= 5 ? 2 : 1;
    S.xp += pts * mult;
    S.prog[S.level] = (S.prog[S.level] || 0) + 1;
    floatText(x, y - 30, `+${pts * mult}${mult > 1 ? " ×" + mult : ""}`);
    confetti(x, y, 22); sfx("ok"); buzz(15);
    if (id) S.wrong = S.wrong.filter(w => w !== id);
    if ([3, 5, 10, 15, 20, 30, 50, 100].includes(streak)) combo(streak);
  } else {
    streak = 0; sfx("bad"); buzz([40, 40, 40]);
    if (id && !S.wrong.includes(id)) { S.wrong.push(id); if (S.wrong.length > 80) S.wrong.shift(); }
  }
  S.best = Math.max(S.best, streak);
  save(); hud(ok);
}
// Level progress: 40 % lessons + 40 % correct answers + 20 % level test. The test unlocks at 60 %.
const PRACTICE_GOAL = 150, TEST_UNLOCK = 60, TEST_QUESTIONS = 10, TEST_PASS = 8;
function mastery(l) {
  const ls = LESSONS.filter((L, k) => LV.lessons[k] === l), done = ls.filter(L => S.learned[L.t]).length;
  const lessons = ls.length ? done / ls.length : 1, correct = S.prog[l] || 0, practice = Math.min(1, correct / PRACTICE_GOAL);
  const base = lessons * 40 + practice * 40;
  return { done, total: ls.length, correct, passed: !!S.passed[l], unlocked: base >= TEST_UNLOCK, pct: Math.round(base + (S.passed[l] ? 20 : 0)) };
}
function celebrate(small, big) {
  const e = h("div", "levelup", `<div><small>${small}</small><b>${big}</b></div>`);
  document.body.append(e); setTimeout(() => e.remove(), 2600);
  setTimeout(() => sfx("win"), 300); confetti(innerWidth / 2, innerHeight / 2, 220);
}
function hud(pulse) {
  $("#streak b").textContent = streak;
  $("#xp b").textContent = S.xp;
  const M = mastery(S.level);
  $("#lvl").textContent = `${LEVELS[S.level - 1]} · ${M.pct}%`;
  $("#level i").style.width = M.pct + "%";
  if (pulse) { const s = $("#streak"); s.classList.remove("pop"); void s.offsetWidth; s.classList.add("pop"); }
  if (M.unlocked && !M.passed && !S.notified[S.level]) { S.notified[S.level] = 1; save(); celebrate("Level-Test freigeschaltet", "🎓"); }
}
$("#mute").textContent = S.mute ? "🔇" : "🔊";
$("#mute").onclick = () => { S.mute = !S.mute; save(); $("#mute").textContent = S.mute ? "🔇" : "🔊"; };
$("#level").onclick = () => $("#feed").scrollTo({ top: 0, behavior: "smooth" });   // back to the start card to change level

// ---------- shared card pieces ----------
function card(type, title) {
  const c = h("section", "card t-" + type), inner = h("div", "inner");
  inner.append(h("div", "badge", title));
  c.append(inner); c.body = inner;
  return c;
}
function done(c, ok, html) {
  if (c.classList.contains("done")) return;
  c.classList.add("done");
  c.append(h("div", "fb " + (ok ? "good" : "meh"),
    `<div class="fb-t">${ok ? rnd(PRAISE) : rnd(OOPS)}</div><div>${html}</div><div class="next">↑ Weiter</div>`));
}
function choices(opts, ans, onPick, cls = "") {
  const box = h("div", "opts " + cls);
  opts.forEach((t, i) => {
    const b = h("button", "btn", t);
    b.onclick = () => {
      if (box.locked) return;
      box.locked = true;
      const ok = i === ans;
      box.children[ans].classList.add("ok");
      if (!ok) b.classList.add("bad", "shake");
      onPick(ok, b);
    };
    box.append(b);
  });
  return box;
}
// Timed multi-round game; pauses when scrolled away.
function rapid(c, intro, rounds, ms, layout = "row") {
  const start = h("button", "btn start", "▶ Los geht's!"), introEl = h("div", "intro", intro);
  const box = h("div", "rapid"), meta = h("div", "rmeta"), bar = h("div", "timer"), q = h("div", "rq"), opts = h("div", "opts " + layout);
  box.append(meta, bar, q, opts);
  c.body.append(introEl, start);
  let i = 0, right = 0, timer = 0, lock = true, paused = false, visible = true;
  const missed = [];
  start.onclick = () => { introEl.remove(); start.replaceWith(box); next(); };
  c.onHide = () => { visible = false; if (!lock) { clearTimeout(timer); lock = true; paused = true; } };
  c.onShow = () => { visible = true; if (paused) { paused = false; next(); } };
  function next() {
    const r = rounds[i];
    lock = false;
    meta.textContent = `${i + 1} / ${rounds.length}`;
    q.innerHTML = r.q; q.classList.remove("pop"); void q.offsetWidth; q.classList.add("pop");
    opts.innerHTML = "";
    r.opts.forEach((t, j) => { const b = h("button", "btn " + (r.cls ? r.cls[j] : ""), t); b.onclick = () => pick(j, b); opts.append(b); });
    bar.innerHTML = `<i style="--ms:${ms}ms"></i>`;
    if (r.speak) speak(r.speak);
    timer = setTimeout(() => pick(-1, null), ms);
  }
  function pick(j, b) {
    if (lock) return;
    lock = true; clearTimeout(timer);
    const r = rounds[i], ok = j === r.ans;
    opts.children[r.ans].classList.add("ok");
    if (b && !ok) b.classList.add("bad", "shake");
    bar.firstChild.style.animationPlayState = "paused";
    if (!ok) q.insertAdjacentHTML("beforeend", `<div class="reveal">${j < 0 ? "⏰ Zu langsam! " : ""}${r.reveal}</div>`);
    score(ok, b || q, { pts: 5, id: r.id });
    if (ok) right++; else missed.push(r);
    setTimeout(() => {
      if (++i >= rounds.length) return end();
      if (visible) next(); else paused = true;
    }, ok ? 450 : 1600);
  }
  function end() {
    box.remove();
    const n = rounds.length, perfect = right === n;
    c.body.append(h("div", "result", `<div class="big">${right}<small>/${n}</small></div>${perfect ? "🏆 Fehlerlos!" : ""}`));
    if (perfect) { sfx("win"); confetti(innerWidth / 2, innerHeight / 2, 150); }
    done(c, right >= n - 1, missed.length ? "<ul>" + missed.map(r => `<li>${r.reveal}</li>`).join("") + "</ul>" : "Alles richtig! 🎉");
  }
}
function glossify(text, dict) {
  const keys = Object.keys(dict).sort((a, b) => b.length - a.length).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(?<!\\p{L})(${keys.join("|")})(?!\\p{L})`, "gu");
  return text.replace(re, m => `<span class="g" data-k="${m}">${m}</span>`);
}
let tipEl;
function showTip(el, html) {
  if (tipEl) tipEl.remove();
  const r = el.getBoundingClientRect(), t = tipEl = h("div", "tip", html);
  document.body.append(t);
  t.style.left = Math.max(8, Math.min(innerWidth - t.offsetWidth - 8, r.left + r.width / 2 - t.offsetWidth / 2)) + "px";
  t.style.top = Math.max(8, r.top - t.offsetHeight - 8) + "px";
  setTimeout(() => t.remove(), 2600);
}
document.addEventListener("click", e => {
  const s = e.target.closest("[data-say]");
  if (s) return speak(s.dataset.say);
  const g = e.target.closest(".g");
  if (g) { showTip(g, `<b>${g.textContent}</b> → ${g.closest(".rbox").dict[g.dataset.k]}`); speak(g.textContent); }
});

// ---------- the games ----------
const G = {};

G.artikel = () => {
  const c = card("artikel", "⚡ Artikel-Blitz");
  rapid(c, "6 Wörter · 4 Sekunden pro Wort<br><b>der, die oder das?</b>", nounSet(6).map(n => ({
    q: `${n.e ? `<div class="emoji-md">${n.e}</div>` : ""}<div class="rword">${n.w}</div><div class="intro">${n.e ? "" : n.en}</div>`,
    opts: ARTS, cls: ARTS, ans: ARTS.indexOf(n.a), id: "emoji:" + n.i,
    reveal: `${art(n.a)} ${n.w} <i>· ${n.en}</i>`
  })), 4000);
  return c;
};

G.tf = () => {
  const c = card("tf", "✅ Richtig oder falsch?");
  rapid(c, "5 Sätze · 6 Sekunden<br><b>Stimmt das?</b>", pickMany("tf", 5).map(i => TF[i]).map(([s, t, en]) => ({
    q: `<div class="rword sm">${s}</div>`, opts: ["👍 Richtig", "👎 Falsch"], cls: ["yes", "no"], ans: t ? 0 : 1,
    reveal: `${s} → <b>${t ? "richtig" : "falsch"}</b> <i>(${en})</i>`
  })), 6000);
  return c;
};

const PRON = [["ich", 0], ["du", 1], ["er", 2], ["sie (she)", 2], ["wir", 3], ["ihr", 4], ["sie (they)", 5], ["Sie (formal)", 5]];
G.verb = () => {
  const c = card("verb", "🥊 Verb-Duell");
  const rounds = Array.from({ length: 6 }, () => {
    const [inf, f, en] = rnd(VERBS), forms = f.split(" "), [p, k] = rnd(PRON), right = forms[k];
    const opts = shuffle([right, ...sample([...new Set(forms)].filter(x => x !== right), 2)]);
    return { q: `<div class="pron">${p}</div><div class="rword sm">${inf} <i>(${en})</i></div>`, opts, ans: opts.indexOf(right),
             reveal: `${p.split(" ")[0]} <b>${right}</b> <i>(${inf})</i>` };
  });
  rapid(c, "6 Runden · 5 Sekunden<br><b>Welche Form passt?</b>", rounds, 5000, "");
  return c;
};

G.emoji = k => {
  const n = NOUNS[k], c = card("emoji", "🖼️ Was ist das?"), right = n.a + " " + n.w;
  const opts = shuffle([right, rnd(ARTS.filter(a => a !== n.a)) + " " + n.w, ...nounSet(2, false, n).map(o => o.a + " " + o.w)]);
  c.body.append(h("div", "big-emoji", n.e), choices(opts, opts.indexOf(right), (ok, b) => {
    score(ok, b, { id: "emoji:" + k }); autoSay(right);
    done(c, ok, `${art(n.a)} <b>${n.w}</b> = ${n.en} ${say(right)}`);
  }, "grid2"));
  return c;
};

G.listen = k => {
  const n = NOUNS[k], c = card("listen", "🎧 Hör zu!"), word = n.a + " " + n.w;
  const play = h("button", "play", "🔊");
  play.onclick = () => { speak(word); play.classList.remove("ping"); void play.offsetWidth; play.classList.add("ping"); };
  if (!("speechSynthesis" in window)) { play.textContent = n.w; play.classList.add("noaudio"); }
  const opts = shuffle([n, ...nounSet(3, true, n)]);
  c.body.append(h("div", "intro", "Tippe zum Anhören – welches Bild ist es?"), play,
    choices(opts.map(o => o.e), opts.indexOf(n), (ok, b) => {
      score(ok, b, { id: "listen:" + k });
      done(c, ok, `${n.e} ${art(n.a)} <b>${n.w}</b> = ${n.en} ${say(word)}`);
    }, "grid"));
  return c;
};

G.pairs = () => {
  const c = card("pairs", "🧩 Finde die Paare"), set = nounSet(5, true);
  const grid = h("div", "pairs"), L = h("div", "col"), R = h("div", "col");
  let sel = null, left = set.length, errors = 0, t0 = 0;
  const tile = (n, side, label) => {
    const b = h("button", "btn tile", label);
    b.onclick = () => {
      if (b.classList.contains("match")) return;
      t0 = t0 || Date.now(); sfx("tap");
      if (!sel || sel.side === side) { if (sel) sel.el.classList.remove("sel"); sel = { el: b, n, side }; b.classList.add("sel"); return; }
      const a = sel; sel = null; a.el.classList.remove("sel");
      if (a.n === n) {
        [a.el, b].forEach(x => x.classList.add("match"));
        setTimeout(() => [a.el, b].forEach(x => x.classList.add("gone")), 400);
        score(true, b, { pts: 5 }); autoSay(n.a + " " + n.w);
        if (--left === 0) {
          const secs = ((Date.now() - t0) / 1000).toFixed(1);
          setTimeout(() => { sfx("win"); done(c, errors < 2, `Alle Paare in <b>${secs} s</b> · ${errors} Fehler<br>` + set.map(x => `${x.e} ${art(x.a)} ${x.w}`).join(" · ")); }, 450);
        }
      } else {
        errors++; sfx("bad"); buzz(60);
        [a.el, b].forEach(x => { x.classList.add("bad", "shake"); setTimeout(() => x.classList.remove("bad", "shake"), 450); });
      }
    };
    return b;
  };
  shuffle(set).forEach(n => L.append(tile(n, "l", `<span class="e">${n.e}</span>`)));
  shuffle(set).forEach(n => R.append(tile(n, "r", `${art(n.a)} ${n.w}`)));
  grid.append(L, R);
  c.body.append(h("div", "intro", "Bild + Wort: Was gehört zusammen?"), grid);
  return c;
};

const norm = s => s.toLowerCase().replace(/[.,?!]/g, "").trim();
G.builder = k => { const [de, en, alts = []] = BUILD[k]; return buildCard(de, en, alts, "builder:" + k); };
function buildCard(de, en, alts, id) {
  const c = card("builder", "🧱 Satzbau");
  const words = de.replace(/[.,?!]/g, "").split(" "), line = h("div", "line"), pool = h("div", "chips");
  let order = shuffle(words);
  for (let n = 0; n < 5 && order.join(" ") === words.join(" "); n++) order = shuffle(words);
  order.forEach(w => {
    const b = h("button", "btn chip", w);
    b.onclick = () => {
      if (c.classList.contains("done")) return;
      sfx("tap");
      (b.parentNode === pool ? line : pool).append(b);
      if (line.children.length === words.length) check();
    };
    pool.append(b);
  });
  c.body.append(h("div", "prompt", "🇬🇧 " + en), line, pool);
  function check() {
    const got = norm([...line.children].map(x => x.textContent).join(" "));
    const ok = [de, ...alts].some(s => norm(s) === got);
    [...line.children].forEach(x => x.classList.add(ok ? "ok" : "bad"));
    score(ok, line, { id, pts: 15 }); autoSay(de);
    done(c, ok, `<b>${de}</b> ${say(de)}`);
  }
  return c;
}

G.scramble = k => {
  const n = NOUNS[k], c = card("scramble", "🔤 Buchstabensalat");
  const target = [...n.w].map(ch => ch === "ß" ? "ß" : ch.toUpperCase()), slots = h("div", "slots"), pool = h("div", "letters");
  let order = shuffle(target), tries = 0;
  for (let i = 0; i < 5 && order.join("") === target.join(""); i++) order = shuffle(target);
  target.forEach(() => slots.append(h("div", "slot")));
  order.forEach(ch => {
    const b = h("button", "btn letter", ch);
    b.onclick = () => {
      if (c.classList.contains("done")) return;
      sfx("tap");
      if (b.parentNode === pool) [...slots.children].find(s => !s.firstChild).append(b); else pool.append(b);
      if ([...slots.children].every(s => s.firstChild)) check();
    };
    pool.append(b);
  });
  c.body.append(h("div", "big-emoji", n.e || "🔤"), h("div", "intro", `${art(n.a)} ? · <i>${n.en}</i>`), slots, pool);
  function check() {
    const ok = [...slots.children].map(s => s.firstChild.textContent).join("") === target.join("");
    if (!ok && ++tries < 2) {
      sfx("bad"); buzz(60); slots.classList.add("shake"); floatText(...center(slots), "Noch einmal!");
      setTimeout(() => { slots.classList.remove("shake"); [...slots.children].forEach(s => s.firstChild && pool.append(s.firstChild)); }, 450);
      return;
    }
    slots.querySelectorAll(".letter").forEach(l => l.classList.add(ok ? "ok" : "bad"));
    score(ok, slots, { id: "scramble:" + k, pts: 15 }); autoSay(n.a + " " + n.w);
    done(c, ok, `${n.e} ${art(n.a)} <b>${n.w}</b> = ${n.en} ${say(n.a + " " + n.w)}`);
  }
  return c;
};

G.odd = k => {
  const [odd, a, b, d, reason] = ODD[k], c = card("odd", "🕵️ Was passt nicht?"), opts = shuffle([odd, a, b, d]);
  c.body.append(h("div", "intro", "Ein Wort gehört nicht dazu. Welches?"), choices(opts, opts.indexOf(odd), (ok, btn) => {
    score(ok, btn, { id: "odd:" + k });
    done(c, ok, `<b>${odd}</b> passt nicht. ${reason}`);
  }, "grid2"));
  return c;
};

G.gap = k => { const [s, o, en, rule] = GAPS[k]; return gapCard("gap", "✏️ Lückentext", s, o, en, rule, "gap:" + k); };
// s contains ___ ; o = options with the correct one first
function gapCard(type, title, s, o, en, rule, id) {
  const c = card(type, title), full = s.replace("___", o[0]).replace(/\s*<small>.*?<\/small>/, ""), opts = shuffle(o);
  const sent = h("div", "sentence", s.replace("___", `<span class="blank">?</span>`));
  c.body.append(sent, h("div", "intro", "🇬🇧 " + en), choices(opts, opts.indexOf(o[0]), (ok, b) => {
    const bl = $(".blank", sent); bl.textContent = o[0]; bl.classList.add("filled");
    score(ok, b, { id }); autoSay(full);
    done(c, ok, `<b>${full}</b> ${say(full)}<div class="rule-tip">💡 ${rule}</div>`);
  }));
  return c;
}

// ---------- generated games: built fresh from rules + word lists, so they never run out ----------
const ONES = ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf",
  "dreizehn", "vierzehn", "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn"];
const TENS = ["", "", "zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig", "achtzig", "neunzig"];
function num(n) {
  if (n < 20) return ONES[n];
  if (n < 100) { const o = n % 10, t = Math.floor(n / 10); return o ? (o === 1 ? "ein" : ONES[o]) + "und" + TENS[t] : TENS[t]; }
  if (n < 1000) { const hd = Math.floor(n / 100), r = n % 100; return (hd === 1 ? "ein" : ONES[hd]) + "hundert" + (r ? num(r) : ""); }
  const th = Math.floor(n / 1000), r = n % 1000;
  return (th === 1 ? "ein" : num(th)) + "tausend" + (r ? num(r) : "");
}
const between = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
// Two believable wrong numbers – always includes the 43/34 swap trap when possible
function nearNums(n) {
  const s = String(n), out = [];
  if (s.length >= 2) { const sw = +(s.slice(0, -2) + s.slice(-1) + s.slice(-2, -1)); if (sw !== n && String(sw).length === s.length) out.push(sw); }
  for (const d of shuffle([10, -10, 1, -1, 2, -2, 100, -100])) if (n + d >= 0 && !out.includes(n + d)) out.push(n + d);
  return out.slice(0, 2);
}
const euro = (e, c) => `${e === 1 ? "ein" : num(e)} Euro${c ? " " + num(c) : ""}`;
const euroStr = (e, c) => `${e},${String(c).padStart(2, "0")} €`;

function numberRound() {
  const mode = rnd(["read", "read", "listen", "listen", "math", "price"]);
  if (mode === "price") {
    const e = between(1, 29), c = rnd([0, 5, 10, 20, 49, 50, 90, 95, 99, between(11, 89)]);
    const right = euro(e, c);
    const wrong = [...new Set([[e + 1, c], [e, (c + 10) % 100], [Math.floor(c / 10) || e + 2, e % 100], [e + 2, c], [e, (c + 1) % 100]]
      .map(([x, y]) => euro(x, y)))].filter(w => w !== right);
    const opts = shuffle([right, ...sample(wrong, 2)]);
    return { q: `<div class="emoji-md">🏷️</div><div class="clock">${euroStr(e, c)}</div>`, opts, ans: opts.indexOf(euro(e, c)),
             reveal: `${euroStr(e, c)} = <b>${euro(e, c)}</b>` };
  }
  if (mode === "math") {
    const a = between(2, 20), b = between(2, 20), plus = Math.random() < .6 || a <= b, res = plus ? a + b : a - b;
    const opts = shuffle([res, ...nearNums(res)].map(num));
    const q = `${num(a)} ${plus ? "plus" : "minus"} ${num(b)}`;
    return { q: `<div class="rword sm">${q} = ?</div>`, opts, ans: opts.indexOf(num(res)), reveal: `${q} = <b>${num(res)}</b> (${res})` };
  }
  const n = rnd([between(13, 99), between(21, 99), between(100, 999), between(1000, 2030)]);
  const opts = shuffle([n, ...nearNums(n)].map(String)), ans = opts.indexOf(String(n));
  if (mode === "listen") return { q: `<div class="emoji-md">🎧</div>${say(num(n))}`, speak: String(n), opts, ans, reveal: `<b>${num(n)}</b> = ${n}` };
  return { q: `<div class="rword sm">${num(n)}</div>`, opts, ans, reveal: `<b>${num(n)}</b> = ${n}` };
}
G.zahlen = () => {
  const c = card("zahlen", "🔢 Zahlen-Blitz");
  rapid(c, "Lesen, hören, rechnen, bezahlen<br><b>6 Runden · 7 Sekunden</b>", Array.from({ length: 6 }, numberRound), 7000, "");
  return c;
};

const h12 = h => ((h - 1) % 12 + 12) % 12 + 1;
const hourWord = h => h12(h) === 1 ? "eins" : ONES[h12(h)];
function timeText(h, m) {
  const next = hourWord(h + 1), now = hourWord(h);
  return { 0: (h12(h) === 1 ? "ein" : now) + " Uhr", 5: "fünf nach " + now, 10: "zehn nach " + now, 15: "Viertel nach " + now,
    20: "zwanzig nach " + now, 30: "halb " + next, 40: "zwanzig vor " + next, 45: "Viertel vor " + next,
    50: "zehn vor " + next, 55: "fünf vor " + next }[m];
}
const clock = (h, m) => `${h12(h)}:${String(m).padStart(2, "0")}`;
function timeRound() {
  const h = between(1, 12), m = rnd([0, 15, 30, 30, 30, 45, 45, 10, 50, 20, 40, 5, 55]);
  const cand = [[h - 1, m], [h + 1, m], [h, (60 - m) % 60]].filter(([x, y]) => clock(x, y) !== clock(h, m) && timeText(x, y) !== timeText(h, m));
  const wrong = sample(cand, 2), at = m === 45 ? ` <i>(in Österreich auch: dreiviertel ${hourWord(h + 1)})</i>` : "";
  const reveal = `${clock(h, m)} = <b>${timeText(h, m)}</b>${at}`;
  if (Math.random() < .5) {
    const opts = shuffle([[h, m], ...wrong].map(([x, y]) => timeText(x, y)));
    return { q: `<div class="clock">${clock(h, m)}</div>`, opts, ans: opts.indexOf(timeText(h, m)), reveal };
  }
  const opts = shuffle([[h, m], ...wrong].map(([x, y]) => clock(x, y)));
  return { q: `<div class="rword sm">Es ist ${timeText(h, m)}.</div>${say("Es ist " + timeText(h, m))}`, opts, ans: opts.indexOf(clock(h, m)), reveal };
}
G.uhr = () => {
  const c = card("uhr", "🕒 Wie spät ist es?");
  rapid(c, "Achtung: <b>halb vier</b> = 3:30!<br>6 Runden · 7 Sekunden", Array.from({ length: 6 }, timeRound), 7000, "");
  return c;
};

G.gegenteil = () => {
  const c = card("gegenteil", "↔️ Gegenteil-Blitz");
  const rounds = sample(OPPOSITES, 6).map(p => {
    const flip = Math.random() < .5, [a, b, ea, eb] = flip ? [p[1], p[0], p[3], p[2]] : p;
    const others = shuffle(OPPOSITES.filter(x => x !== p).flat().filter((w, i) => i % 4 < 2 && w !== a && w !== b)).slice(0, 2);
    const opts = shuffle([b, ...others]);
    return { q: `<div class="rword">${a}</div><div class="intro">Das Gegenteil ist …</div>`, opts, ans: opts.indexOf(b),
             reveal: `${a} ↔ <b>${b}</b> <i>(${ea} ↔ ${eb})</i>` };
  });
  rapid(c, "Finde das Gegenteil!<br><b>6 Runden · 5 Sekunden</b>", rounds, 5000, "");
  return c;
};

G.kalender = () => {
  const c = card("kalender", "📅 Tage & Monate");
  const rounds = Array.from({ length: 6 }, () => {
    const list = Math.random() < .5 ? DAYS : MONTHS, L = list.length, i = ri(list), after = Math.random() < .5;
    const at = d => list[((i + d) % L + L) % L], right = at(after ? 1 : -1);
    const opts = shuffle([right, at(after ? -1 : 1), at(after ? 2 : -2)]);
    return { q: `<div class="rword sm">Was kommt <u>${after ? "nach" : "vor"}</u><br>${list[i]}?</div>`, opts, ans: opts.indexOf(right),
             reveal: after ? `${list[i]} → <b>${right}</b>` : `<b>${right}</b> → ${list[i]}` };
  });
  rapid(c, "Wochentage & Monate (mit Jänner 🇦🇹)<br><b>6 Runden · 5 Sekunden</b>", rounds, 5000, "");
  return c;
};

// Sentence generator: random pronoun × verb × noun × grammar point
const PRONOUNS = [["ich", 0, "I"], ["du", 1, "you"], ["er", 2, "he"], ["sie", 2, "she"], ["wir", 3, "we"], ["ihr", 4, "you all"], ["sie", 5, "they"]];
const cap = s => s[0].toUpperCase() + s.slice(1);
const forms = inf => VERBS.find(v => v[0] === inf)[1].split(" ");
const enNoun = n => n.en.split(" / ")[0].replace(/ \(.*\)/, "");
const aAn = w => (/^[aeiou]/i.test(w) ? "an " : "a ") + w;
const enVerb = (base, k) => k !== 2 ? base : base === "have" ? "has" : base.replace(/^\w+/, w => w + (/(s|sh|ch|x)$/.test(w) ? "es" : "s"));
const AKK = { der: "den", die: "die", das: "das" }, EIN = { der: "einen", die: "eine", das: "ein" };
const KEIN = { der: "keinen", die: "keine", das: "kein" }, DAT = { der: "dem", die: "der", das: "dem" };
const POSS = [["mein", "my"], ["dein", "your"], ["sein", "his"], ["ihr", "her"], ["unser", "our"]];

G.satz = () => {
  const n = pickNoun(), [p, k, pen] = rnd(PRONOUNS), [inf, ven] = rnd(OBJ_VERBS), f = forms(inf), en = enNoun(n);
  const subj = `${cap(pen === "I" ? "I" : pen)} ${enVerb(ven, k)}`;
  const mode = rnd(["akk", "ein", "kein", "poss", "conj", "conj", ...(S.level >= 2 ? ["dat", "dat"] : [])]);
  if (mode === "akk") return gapCard("satz", "🎯 Akkusativ", `${cap(p)} ${f[k]} ___ ${n.w}.`, [AKK[n.a], ...ARTS.filter(a => a !== AKK[n.a])],
    `${subj} the ${en}.`, `${art(n.a)} ${n.w} → Akkusativ: <b>${AKK[n.a]} ${n.w}</b>` + (n.a === "der" ? " (only der changes!)" : " (die & das stay the same)"));
  if (mode === "ein") return gapCard("satz", "🎯 Akkusativ", `${cap(p)} ${f[k]} ___ ${n.w}.`, [EIN[n.a], ...Object.values(EIN).filter(a => a !== EIN[n.a])],
    `${subj} ${aAn(en)}.`, `${art(n.a)} ${n.w} → Akkusativ: <b>${EIN[n.a]} ${n.w}</b>` + (n.a === "der" ? " (ein → einen)" : ""));
  if (mode === "kein") {
    const hf = forms("haben");
    return gapCard("satz", "🚫 kein / keine", `${cap(p)} ${hf[k]} ___ ${n.w}.`, [KEIN[n.a], ...Object.values(KEIN).filter(a => a !== KEIN[n.a])],
      `${cap(pen === "I" ? "I" : pen)} ${enVerb("have", k)} no ${en}.`, `${art(n.a)} ${n.w} → <b>${KEIN[n.a]} ${n.w}</b> (works like ein/eine/einen)`);
  }
  if (mode === "poss") {
    const [st, pe] = rnd(POSS), right = n.a === "die" ? st + "e" : st;
    return gapCard("satz", "👤 mein, dein, sein …", `Das ist ___ ${n.w}.`, [right, ...[st, st + "e", st + "en"].filter(x => x !== right)],
      `That is ${pe} ${en}.`, `${art(n.a)} ${n.w} → <b>${right} ${n.w}</b> (die → add <b>-e</b>)`);
  }
  if (mode === "dat") return gapCard("satz", "🧲 Dativ mit „mit“", `Was machst du mit ___ ${n.w}?`, [DAT[n.a], ...["dem", "der", "den"].filter(a => a !== DAT[n.a])],
    `What are you doing with the ${en}?`, `<b>mit</b> + Dativ: der → dem · die → der · das → dem → <b>${DAT[n.a]} ${n.w}</b>`);
  const other = sample([...new Set(f)].filter(x => x !== f[k]), 2);
  return gapCard("satz", "🔧 Konjugation", `${cap(p)} ___ ${AKK[n.a]} ${n.w}. <small>(${inf})</small>`, [f[k], ...other],
    `${subj} the ${en}.`, `${inf}: ich ${f[0]} · du ${f[1]} · er/sie ${f[2]} · wir ${f[3]} · ihr ${f[4]} · sie/Sie ${f[5]}`);
};

// Generated word-order puzzle: time word first → verb stays in position 2
G.genbuild = () => {
  const n = pickNoun(), [p, k, pen] = rnd(PRONOUNS), [inf, ven] = rnd(OBJ_VERBS), [t, ten] = rnd(TIME_WORDS), f = forms(inf);
  const def = Math.random() < .5, obj = `${def ? AKK[n.a] : EIN[n.a]} ${n.w}`, low = t[0].toLowerCase() + t.slice(1);
  const de = `${t} ${f[k]} ${p} ${obj}.`, alt = `${cap(p)} ${f[k]} ${low} ${obj}.`;
  const en = `${cap(ten)} ${pen} ${enVerb(ven, k)} ${def ? "the " + enNoun(n) : aAn(enNoun(n))}.`;
  return buildCard(de, en, [alt], null);
};

// A2+: Perfekt – haben or sein, and the right participle
G.perfekt = () => {
  const [inf, aux, part, rest, enPast] = rnd(PERFEKT), [p, k, pen] = rnd(PRONOUNS), af = forms(aux);
  const en = `${cap(pen)} ${enPast} yesterday.`;
  const rule = `${inf} → <b>${aux}</b> + <b>${part}</b>` + (aux === "sein" ? " (movement / change → sein)" : "");
  if (Math.random() < .5) {
    const other = forms(aux === "haben" ? "sein" : "haben")[k], wrongPerson = af.find(x => x !== af[k]);
    return gapCard("perfekt", "🔁 haben oder sein?", `${cap(p)} ___ gestern ${rest} ${part}.`, [af[k], other, wrongPerson], en, rule);
  }
  const stem = inf.replace(/e?n$/, "");
  let fake = "ge" + stem + "t";
  if (fake === part) fake = "ge" + stem + "en";
  return gapCard("perfekt", "🧪 Partizip II", `${cap(p)} ${af[k]} gestern ${rest} ___. <small>(${inf})</small>`, [part, fake, inf], en, rule);
};

// A2+: two-way prepositions – Wohin? (Akkusativ) vs Wo? (Dativ)
G.wechsel = () => {
  const [ta, tw, ten] = rnd(THINGS), [pa, pw, plen] = rnd(PLACES), [pr, pren] = rnd(PREPS), wohin = Math.random() < .5;
  const right = wohin ? AKK[pa] : DAT[pa];
  const opts = [...new Set([right, wohin ? DAT[pa] : AKK[pa], ...shuffle(["der", "die", "das", "den", "dem"])])].slice(0, 3);
  const s = wohin ? `Ich lege ${AKK[ta]} ${tw} ${pr} ___ ${pw}.` : `${cap(ta)} ${tw} liegt ${pr} ___ ${pw}.`;
  const en = wohin ? `I'm putting the ${ten} ${pren} the ${plen}.` : `The ${ten} is ${pren} the ${plen}.`;
  const rule = wohin ? `<b>Wohin?</b> (movement: legen) → Akkusativ: ${pr} <b>${AKK[pa]}</b> ${pw}`
                     : `<b>Wo?</b> (location: liegen) → Dativ: ${pr} <b>${DAT[pa]}</b> ${pw}`;
  return gapCard("wechsel", "📦 Wo oder wohin?", s, opts, en, rule);
};

// B1: adjective endings
const ADJ_END = { nomDef: { der: "e", die: "e", das: "e" }, nomEin: { der: "er", die: "e", das: "es" },
  akkDef: { der: "en", die: "e", das: "e" }, akkEin: { der: "en", die: "e", das: "es" }, dat: { der: "en", die: "en", das: "en" } };
const NOM_EIN = { der: "ein", die: "eine", das: "ein" };
G.adjektiv = () => {
  const n = pickNoun(), [adj, aen] = rnd(ADJECTIVES), en = enNoun(n), mode = rnd(Object.keys(ADJ_END)), end = ADJ_END[mode][n.a];
  const s = { nomDef: `${cap(n.a)} ___ ${n.w} ist hier.`, nomEin: `Das ist ${NOM_EIN[n.a]} ___ ${n.w}.`, akkDef: `Ich sehe ${AKK[n.a]} ___ ${n.w}.`,
    akkEin: `Ich kaufe ${EIN[n.a]} ___ ${n.w}.`, dat: `Was machst du mit ${DAT[n.a]} ___ ${n.w}?` }[mode];
  const e = { nomDef: `The ${aen} ${en} is here.`, nomEin: `That is ${aAn(aen + " " + en)}.`, akkDef: `I see the ${aen} ${en}.`,
    akkEin: `I'm buying ${aAn(aen + " " + en)}.`, dat: `What are you doing with the ${aen} ${en}?` }[mode];
  const why = { nomDef: "after der/die/das (Nominativ) → always <b>-e</b>", nomEin: "after ein (Nominativ) the adjective shows the gender: -er / -e / -es",
    akkDef: "Akkusativ after den/die/das: masculine <b>-en</b>, otherwise <b>-e</b>", akkEin: "Akkusativ after einen/eine/ein: -en / -e / -es",
    dat: "Dativ → always <b>-en</b>" }[mode];
  return gapCard("adjektiv", "🎨 Adjektiv-Endungen", `${s} <small>(${adj})</small>`,
    [adj + end, ...["e", "en", "er", "es"].filter(x => x !== end).map(x => adj + x)], e, `${art(n.a)} ${n.w}: ${why} → <b>${adj + end}</b>`);
};

G.grammar = k => {
  const g = GRAMMAR[k], c = card("grammar", "💡 Grammar Bite");
  c.body.append(h("div", "g-emoji", g.e), h("div", "g-title", g.t), h("div", "g-rule", g.rule),
    ...g.ex.map(x => h("div", "g-ex", `<span>${x}</span>${say(x)}`)));
  const test = h("button", "btn start", "🎯 Teste mich!");
  test.onclick = () => {
    const opts = shuffle(g.o);
    test.replaceWith(h("div", "q", g.q), choices(opts, opts.indexOf(g.o[0]), (ok, b) => {
      score(ok, b, { id: "grammar:" + k, pts: 15 });
      done(c, ok, g.why);
    }));
    c.body.scrollTo({ top: c.body.scrollHeight, behavior: "smooth" });
  };
  c.body.append(test);
  return c;
};

G.read = k => {
  const r = READS[k], c = card("read", "📖 Lesen · " + r.title), gl = t => glossify(t, r.gloss);
  const box = h("div", "rbox " + r.kind);
  box.dict = r.gloss;
  if (r.kind === "chat") box.innerHTML = `<div class="chat-head">${r.who}</div>` + r.msgs.map(([w, t]) => `<div class="msg ${w}">${gl(t)}</div>`).join("");
  else if (r.kind === "menu") box.innerHTML = `<div class="menu-t">${r.head}</div>` + r.items.map(([n, p]) => `<div class="mrow"><span>${gl(n)}</span><span>${p} €</span></div>`).join("");
  else if (r.kind === "mail") box.innerHTML = `<div class="mail-h">Von: ${r.from}<b>${r.subject}</b></div>` + gl(r.text).replace(/\n/g, "<br>");
  else box.innerHTML = gl(r.text).replace(/\n/g, "<br>");
  c.body.append(box, h("div", "hint", "👆 Tippe auf <u>unterstrichene</u> Wörter"));
  if (r.task) c.body.append(h("div", "task", r.task));
  const go = h("button", "btn start", "Fragen beantworten →");
  c.body.append(go);
  let qi = 0, right = 0;
  go.onclick = () => { go.remove(); ask(); };
  function ask() {
    const [q, o] = r.qs[qi], opts = shuffle(o), wrap = h("div", "qwrap", `<div class="q">${qi + 1}/${r.qs.length} · ${q}</div>`);
    wrap.append(choices(opts, opts.indexOf(o[0]), (ok, b) => {
      score(ok, b, { pts: 10, id: ok ? null : "read:" + k });
      if (ok) right++;
      setTimeout(() => {
        wrap.remove();
        if (++qi < r.qs.length) return ask();
        if (right === r.qs.length) { S.wrong = S.wrong.filter(w => w !== "read:" + k); save(); }
        done(c, right === r.qs.length, `<b>${right}/${r.qs.length}</b> Fragen richtig 📖`);
      }, 1100);
    }));
    c.body.append(wrap);
    c.body.scrollTo({ top: c.body.scrollHeight, behavior: "smooth" });
  }
  return c;
};

// ---------- lessons: short story-style explanations + a mini quiz ----------
function table(t) {
  return `<div class="l-tablewrap"><table class="l-table"><tr>${t.head.map(x => `<th>${x}</th>`).join("")}</tr>` +
    t.rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join("")}</tr>`).join("") + "</table></div>";
}
G.lesson = k => {
  const L = LESSONS[k], c = card("lesson", `📚 Lektion · ${LEVELS[LV.lessons[k] - 1]}`);
  const segs = h("div", "segs", L.slides.map(() => "<i></i>").join("") + "<i></i>"), stage = h("div", "l-stage");
  const nav = h("div", "l-nav"), back = h("button", "btn l-back", "←"), next = h("button", "btn start l-next");
  nav.append(back, next);
  c.body.append(h("div", "l-title", `${L.e} ${L.t}`), segs, stage, nav);
  let i = 0;
  function show() {
    const s = L.slides[i];
    stage.innerHTML = `<div class="l-h">${s.h}</div>${s.p ? `<div class="l-p">${s.p}</div>` : ""}${s.table ? table(s.table) : ""}` +
      (s.ex || []).map(x => `<div class="g-ex"><span>${x}</span>${say(x.split(" – ")[0].replace(/→/g, ","))}</div>`).join("");
    stage.classList.remove("pop"); void stage.offsetWidth; stage.classList.add("pop");
    [...segs.children].forEach((g, j) => g.classList.toggle("on", j <= i));
    back.disabled = i === 0;
    next.textContent = i === L.slides.length - 1 ? "🎯 Kurzer Test" : "Weiter →";
    c.body.scrollTo({ top: 0 });
  }
  back.onclick = () => { if (i > 0) { i--; show(); } };
  next.onclick = () => { sfx("tap"); if (i < L.slides.length - 1) { i++; show(); } else quiz(); };
  function quiz() {
    nav.remove(); segs.lastChild.classList.add("on"); stage.innerHTML = "";
    let qi = 0, right = 0;
    const ask = () => {
      const [q, o] = L.quiz[qi], opts = shuffle(o), wrap = h("div", "qwrap", `<div class="q">${qi + 1}/${L.quiz.length} · ${q}</div>`);
      wrap.append(choices(opts, opts.indexOf(o[0]), (ok, b) => {
        score(ok, b, { pts: 10 }); if (ok) right++;
        setTimeout(() => {
          wrap.remove();
          if (++qi < L.quiz.length) return ask();
          S.learned[L.t] = 1; save(); hud(); refreshHero();
          done(c, right === L.quiz.length, `Lektion „${L.t}“ geschafft 🎓 <b>${right}/${L.quiz.length}</b> richtig`);
        }, 1000);
      }));
      stage.append(wrap);
    };
    ask();
  }
  show();
  return c;
};

// ---------- level test: pass it to move up a level ----------
function testPool(l) {
  const qs = [];
  GAPS.forEach((g, i) => { if (LV.gaps[i] === l) qs.push([g[0].replace("___", "<span class='blank'>?</span>"), g[1]]); });
  LESSONS.forEach((L, i) => { if (LV.lessons[i] === l) qs.push(...L.quiz); });
  GRAMMAR.forEach((g, i) => { if (LV.grammar[i] === l) qs.push([g.q, g.o]); });
  return qs;
}
G.pruefung = () => {
  const l = S.level, c = card("pruefung", `🎓 Level-Test · ${LEVELS[l - 1]}`), qs = sample(testPool(l), TEST_QUESTIONS);
  const goal = l < 3 ? `Bereit für ${LEVELS[l]}?` : "B1 abschließen?";
  c.body.append(h("div", "g-emoji", "🎓"), h("div", "g-title", goal),
    h("div", "intro", `${qs.length} Fragen aus Grammatik & Lektionen.<br>Du brauchst <b>${TEST_PASS} richtige</b>.`));
  const go = h("button", "btn start", "Test starten");
  c.body.append(go);
  let qi = 0, right = 0;
  go.onclick = () => { [...c.body.children].slice(1).forEach(x => x.remove()); ask(); };
  function ask() {
    const [q, o] = qs[qi], opts = shuffle(o), wrap = h("div", "qwrap", `<div class="rmeta">Frage ${qi + 1} / ${qs.length} · ✅ ${right}</div><div class="q">${q}</div>`);
    wrap.append(choices(opts, opts.indexOf(o[0]), (ok, b) => {
      score(ok, b, { pts: 10 }); if (ok) right++;
      setTimeout(() => { wrap.remove(); if (++qi < qs.length) ask(); else finish(); }, 900);
    }));
    c.body.append(wrap);
  }
  function finish() {
    const ok = right >= TEST_PASS;
    if (ok) {
      S.passed[l] = 1;
      if (l < 3) S.level = l + 1;   // new cards come from the next level from now on
      save(); hud(); refreshHero();
      celebrate(l < 3 ? "Du bist jetzt" : "Geschafft!", l < 3 ? LEVELS[l] : "B1 🏆");
    }
    done(c, ok, ok ? (l < 3 ? `<b>${right}/${qs.length}</b> – bestanden! Ab jetzt spielst du auf <b>${LEVELS[l]}</b> 🎉` : `<b>${right}/${qs.length}</b> – B1 bestanden! 🏆`)
                   : `<b>${right}/${qs.length}</b> – du brauchst ${TEST_PASS}. Mach noch ein paar Lektionen und versuch es nochmal!`);
  }
  return c;
};

// ---------- overlays: lesson library and progress backup ----------
function overlay(html, onClick) {
  const ov = h("div", "lib", `<div class="lib-in">${html}</div>`);
  ov.onclick = e => { if (e.target === ov || e.target.closest(".lib-x")) return ov.remove(); onClick(e, ov); };
  document.body.append(ov);
  return ov;
}
function library() {
  overlay(`<div class="lib-top"><b>📚 Lektionen</b><button class="pill lib-x" aria-label="Schließen">✕</button></div>` +
    LEVELS.map((lv, li) => `<div class="lib-lv">${lv} · ${LEVEL_NAMES[li]} <span>${mastery(li + 1).done}/${mastery(li + 1).total}</span></div>` +
      LESSONS.map((L, k) => LV.lessons[k] === li + 1 ? `<button class="lib-item" data-k="${k}"><span>${L.e}</span>${L.t}${S.learned[L.t] ? "<i>✓</i>" : ""}</button>` : "").join("")).join(""),
    (e, ov) => { const it = e.target.closest(".lib-item"); if (it) { ov.remove(); openCard(G.lesson(+it.dataset.k)); } });
}
function backup() {
  const code = btoa(unescape(encodeURIComponent(JSON.stringify(S))));
  const ov = overlay(`<div class="lib-top"><b>💾 Your progress</b><button class="pill lib-x" aria-label="Close">✕</button></div>
    <p class="lib-p">Your progress is saved automatically on this device. To move it to another phone or browser, copy this code and paste it there.</p>
    <textarea id="bk-out" readonly>${code}</textarea>
    <button class="btn start" data-act="copy">Copy code</button>
    <div class="lib-lv">Paste a code from another device</div>
    <textarea id="bk-in" placeholder="Paste code here"></textarea>
    <button class="btn" data-act="load">Load progress</button>
    <div class="lib-msg" role="status"></div>`, (e, ov) => {
    const act = e.target.closest("[data-act]")?.dataset.act, msg = t => { $(".lib-msg", ov).textContent = t; };
    if (act === "copy") navigator.clipboard.writeText(code).then(() => msg("Copied ✓"), () => { $("#bk-out", ov).select(); msg("Selected – now copy it"); });
    if (act === "load") {
      try {
        const d = JSON.parse(decodeURIComponent(escape(atob($("#bk-in", ov).value.trim()))));
        if (typeof d.xp !== "number") throw new Error();
        Object.assign(S, d); save(); location.reload();
      } catch { msg("That code doesn't work – make sure you copied all of it."); }
    }
  });
  $("#bk-out", ov).onclick = e => e.target.select();
}
function openCard(c) {   // insert a card right after the one on screen and scroll to it
  const idx = Math.min(feed.children.length - 1, Math.round(feed.scrollTop / feed.clientHeight));
  feed.children[idx].after(c); io.observe(c);
  feed.scrollTo({ top: (idx + 1) * feed.clientHeight, behavior: "smooth" });
}

function hero() {
  const c = h("section", "card t-hero"), M = mastery(S.level), nextLv = LEVELS[S.level];
  const title = M.passed ? `${LEVELS[S.level - 1]} geschafft! 🏆` : nextLv ? `Dein Weg zu ${nextLv}` : "Dein Weg durch B1";
  c.innerHTML = `<div class="inner hero">
    <div class="logo">German Scroll <span>🇦🇹</span></div>
    <p class="slogan">Doomscrolling – aber du lernst Deutsch.</p>
    <div class="levels">${LEVELS.map((l, i) => `<button class="lvbtn${S.level === i + 1 ? " on" : ""}${S.passed[i + 1] ? " passed" : ""}" data-lv="${i + 1}">${l}<small>${S.passed[i + 1] ? "✓ bestanden" : LEVEL_NAMES[i]}</small></button>`).join("")}</div>
    <div class="path">
      <div class="path-h">${title}<b>${M.pct}%</b></div>
      <div class="bar big"><i style="width:${M.pct}%"></i></div>
      <div class="path-rows">
        <div>📚 Lektionen <b>${M.done} / ${M.total}</b></div>
        <div>🎯 Richtige Antworten <b>${Math.min(M.correct, PRACTICE_GOAL)} / ${PRACTICE_GOAL}</b></div>
        <div>🎓 Level-Test <b>${M.passed ? "bestanden ✓" : M.unlocked ? "bereit!" : `ab ${TEST_UNLOCK} %`}</b></div>
      </div>
    </div>
    <div class="hero-btns">
      <button class="btn start" data-act="lib">📚 Lektionen</button>
      <button class="btn start${M.unlocked ? "" : " dim"}" data-act="test">🎓 Level-Test</button>
    </div>
    <div class="stats"><div><b>${S.xp}</b>XP</div><div><b>${S.best}</b>Beste Serie</div><div><b>${S.wrong.length}</b>Zum Üben</div></div>
    <button class="linkbtn" data-act="backup">💾 Fortschritt sichern / übertragen</button>
    <div class="swipe">☝️<span>Swipe up</span></div></div>`;
  c.onclick = e => {
    const lv = e.target.closest(".lvbtn"), act = e.target.closest("[data-act]")?.dataset.act;
    if (lv) return setLevel(+lv.dataset.lv);
    if (act === "lib") library();
    if (act === "backup") backup();
    if (act === "test") {
      if (mastery(S.level).unlocked) openCard(G.pruefung());
      else floatText(...center(e.target), `Noch gesperrt – ab ${TEST_UNLOCK} %`);
    }
  };
  return c;
}
function refreshHero() {
  const old = feed.firstChild, fresh = hero();
  io.unobserve(old); old.replaceWith(fresh); fresh.classList.add("seen"); io.observe(fresh);
}
function setLevel(l) {
  S.level = l; save(); hud(); sfx("win");
  [...feed.children].slice(1).forEach(c => { io.unobserve(c); c.remove(); });   // rebuild the feed below the start card
  refreshHero();
  lastType = ""; recent.length = 0;
  more(5);
}

// ---------- endless feed ----------
const WEIGHTS = {
  artikel: 2, emoji: 2, listen: 2, pairs: 1.5, builder: 1.2, tf: 1.2, scramble: 1.5, odd: 1, grammar: 1.2, read: 1.2, verb: 1.5, gap: 1.2,
  // generated – endless variety
  satz: 3, genbuild: 1.5, zahlen: 1.3, uhr: 1.2, gegenteil: 1.2, kalender: .8, perfekt: 1.8, wechsel: 1.4, adjektiv: 1.8,
  lesson: 1.4, pruefung: .6
};
const TYPE_LEVEL = { perfekt: 2, wechsel: 2, adjektiv: 3 };   // minimum level for a game type
const EASY = ["artikel", "emoji", "listen", "pairs", "scramble", "kalender"];   // shown less often at B1
function typeWeight(t) {
  if ((TYPE_LEVEL[t] || 1) > S.level) return 0;
  if (t === "pruefung") { const M = mastery(S.level); return M.unlocked && !M.passed ? WEIGHTS[t] : 0; }
  return WEIGHTS[t] * (S.level === 3 && EASY.includes(t) ? .4 : 1);
}
const POOL = {
  lesson: () => { const i = pickIdx("lessons", k => !S.learned[LESSONS[k].t]); return i === undefined ? pickIdx("lessons") : i; },
  emoji: () => pickIdx("nouns", i => NOUNS[i].e), listen: () => pickIdx("nouns", i => NOUNS[i].e),
  scramble: () => pickIdx("nouns", i => NOUNS[i].w.length >= 3 && NOUNS[i].w.length <= 9),
  builder: () => pickIdx("build"), odd: () => pickIdx("odd"), gap: () => pickIdx("gaps"),
  grammar: () => pickIdx("grammar"), read: () => pickIdx("reads")
};
let lastType = "";
const recent = [];
function pickType() {
  const ts = Object.keys(WEIGHTS).filter(t => t !== lastType && typeWeight(t) > 0);
  let r = Math.random() * ts.reduce((s, t) => s + typeWeight(t), 0);
  for (const t of ts) if ((r -= typeWeight(t)) < 0) return t;
  return ts[0];
}
function nextId() {
  const review = S.wrong.filter(w => !w.startsWith(lastType + ":") && !recent.includes(w));
  if (review.length && Math.random() < .25) return rnd(review);   // bring back earlier mistakes
  for (let n = 0; n < 15; n++) {
    const t = pickType();
    if (!POOL[t]) return t;
    const id = t + ":" + POOL[t]();
    if (!recent.includes(id)) return id;
  }
  return "tf";
}

const feed = $("#feed");
const io = new IntersectionObserver(es => es.forEach(e => {
  const c = e.target;
  if (e.intersectionRatio >= .6) { c.classList.add("seen"); if (c.onShow) c.onShow(); }
  else if (!e.isIntersecting && c.onHide) c.onHide();
}), { root: feed, threshold: [0, .6] });
function add(c) { feed.append(c); io.observe(c); }
function more(n = 4) {
  for (let made = 0, tries = 0; made < n && tries < n * 4; tries++) {
    const id = nextId(), [t, k] = id.split(":");
    lastType = t; recent.push(id); if (recent.length > 25) recent.shift();
    try { add(G[t](k === undefined ? undefined : +k)); made++; }
    catch (err) { console.warn("skipped", id, err); S.wrong = S.wrong.filter(w => w !== id); }
  }
}
feed.addEventListener("scroll", () => {
  if (tipEl) tipEl.remove();
  if (feed.scrollTop + feed.clientHeight * 3 > feed.scrollHeight) more();
}, { passive: true });

add(hero());
more(5);
hud();
if ("speechSynthesis" in window) speechSynthesis.getVoices();

// Installable app + offline mode when served from a real website (not from a local file)
if ("serviceWorker" in navigator && location.protocol === "https:" && !window.STANDALONE_BUNDLE)
  navigator.serviceWorker.register("sw.js").catch(() => {});
// Ask the browser not to clear saved progress when the phone runs low on space
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
