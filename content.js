/* Shared content + the level system.
   Level content lives in content/a1.js, content/a2.js, content/b1.js – each calls pack("A1", {...}).
   To add content: append lines to the right level file. The app picks them up automatically.

   Formats inside a pack:
     nouns:   "article|word|English|emoji"   (emoji optional – leave empty for abstract words)
     gaps:    [sentence with ___, [correct, wrong, wrong], English, rule]
     build:   [German sentence, English, [other accepted word orders]]
     tf:      [statement, true/false, English]
     odd:     [odd one out, word, word, word, reason]
     grammar: { e, t, rule, ex: [...], q, o: [correct, wrong, wrong], why }
     reads:   { kind: chat|note|menu|story|mail|sign, title, ..., gloss: {word: translation}, qs: [[question, [correct, wrong, wrong]]] }
     lessons: { e, t, slides: [{ h, p?, table?: { head: [...], rows: [[...]] }, ex?: [...] }], quiz: [[question, [correct, wrong, wrong]]] }
              (in ex, text after " – " is not read aloud, so "der Tisch – the table" only speaks "der Tisch")
*/
const LEVELS = ["A1", "A2", "B1"];
const LEVEL_NAMES = ["Anfänger", "Grundlagen", "Mittelstufe"];
const NOUN_DATA = [], GAPS = [], BUILD = [], TF = [], ODD = [], GRAMMAR = [], READS = [], LESSONS = [];
const LV = { nouns: [], gaps: [], build: [], tf: [], odd: [], grammar: [], reads: [], lessons: [] };   // level (1–3) of every item
const PACK_TARGET = { nouns: NOUN_DATA, gaps: GAPS, build: BUILD, tf: TF, odd: ODD, grammar: GRAMMAR, reads: READS, lessons: LESSONS };
function pack(level, data) {
  const l = LEVELS.indexOf(level) + 1;
  for (const key in data) for (const item of data[key]) { PACK_TARGET[key].push(item); LV[key].push(l); }
}

// ---------- word lists used by the generated games (all levels) ----------

// infinitive | ich du er/sie wir ihr sie/Sie | English
const VERBS = [
  ["sein", "bin bist ist sind seid sind", "to be"], ["haben", "habe hast hat haben habt haben", "to have"],
  ["gehen", "gehe gehst geht gehen geht gehen", "to go"], ["fahren", "fahre fährst fährt fahren fahrt fahren", "to drive"],
  ["essen", "esse isst isst essen esst essen", "to eat"], ["sprechen", "spreche sprichst spricht sprechen sprecht sprechen", "to speak"],
  ["lesen", "lese liest liest lesen lest lesen", "to read"], ["nehmen", "nehme nimmst nimmt nehmen nehmt nehmen", "to take"],
  ["können", "kann kannst kann können könnt können", "can"], ["müssen", "muss musst muss müssen müsst müssen", "must"],
  ["wollen", "will willst will wollen wollt wollen", "to want"], ["arbeiten", "arbeite arbeitest arbeitet arbeiten arbeitet arbeiten", "to work"],
  ["schlafen", "schlafe schläfst schläft schlafen schlaft schlafen", "to sleep"], ["werden", "werde wirst wird werden werdet werden", "to become"],
  ["wissen", "weiß weißt weiß wissen wisst wissen", "to know"], ["sehen", "sehe siehst sieht sehen seht sehen", "to see"],
  ["geben", "gebe gibst gibt geben gebt geben", "to give"], ["mögen", "mag magst mag mögen mögt mögen", "to like"],
  ["helfen", "helfe hilfst hilft helfen helft helfen", "to help"], ["laufen", "laufe läufst läuft laufen lauft laufen", "to run"],
  ["suchen", "suche suchst sucht suchen sucht suchen", "to look for"], ["kaufen", "kaufe kaufst kauft kaufen kauft kaufen", "to buy"],
  ["brauchen", "brauche brauchst braucht brauchen braucht brauchen", "to need"], ["finden", "finde findest findet finden findet finden", "to find"]
];

// Verbs that take a direct object (Akkusativ) + English base form
const OBJ_VERBS = [["suchen", "look for"], ["brauchen", "need"], ["kaufen", "buy"], ["sehen", "see"], ["haben", "have"],
  ["finden", "find"], ["nehmen", "take"], ["mögen", "like"]];

// Time words that start a sentence (→ verb second, subject third)
const TIME_WORDS = [["Heute", "today"], ["Morgen", "tomorrow"], ["Jetzt", "now"], ["Am Montag", "on Monday"],
  ["Am Wochenende", "at the weekend"], ["Später", "later"], ["Am Abend", "in the evening"], ["Am Freitag", "on Friday"]];

// German | opposite | English | English opposite
const OPPOSITES = [
  ["groß", "klein", "big", "small"], ["heiß", "kalt", "hot", "cold"], ["schnell", "langsam", "fast", "slow"],
  ["teuer", "billig", "expensive", "cheap"], ["laut", "leise", "loud", "quiet"], ["hell", "dunkel", "bright", "dark"],
  ["voll", "leer", "full", "empty"], ["früh", "spät", "early", "late"], ["lang", "kurz", "long", "short"],
  ["schwer", "leicht", "heavy / difficult", "light / easy"], ["dick", "dünn", "thick", "thin"], ["reich", "arm", "rich", "poor"],
  ["offen", "geschlossen", "open", "closed"], ["richtig", "falsch", "right", "wrong"], ["oben", "unten", "up", "down"],
  ["links", "rechts", "left", "right"], ["viel", "wenig", "a lot", "a little"], ["immer", "nie", "always", "never"],
  ["gut", "schlecht", "good", "bad"], ["neu", "alt", "new", "old"], ["nass", "trocken", "wet", "dry"],
  ["hart", "weich", "hard", "soft"], ["sauber", "schmutzig", "clean", "dirty"], ["glücklich", "traurig", "happy", "sad"],
  ["stark", "schwach", "strong", "weak"], ["nah", "weit", "near", "far"], ["süß", "bitter", "sweet", "bitter"],
  ["fleißig", "faul", "hard-working", "lazy"], ["ruhig", "nervös", "calm", "nervous"], ["gesund", "krank", "healthy", "sick"]
];

const DAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const MONTHS = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

// Perfekt generator (A2+): infinitive | auxiliary | participle | rest of sentence | English past
const PERFEKT = [
  ["machen", "haben", "gemacht", "die Hausaufgaben", "did the homework"], ["kaufen", "haben", "gekauft", "ein neues Handy", "bought a new phone"],
  ["essen", "haben", "gegessen", "Schnitzel", "ate schnitzel"], ["trinken", "haben", "getrunken", "zu viel Kaffee", "drank too much coffee"],
  ["schlafen", "haben", "geschlafen", "sehr lange", "slept for a very long time"], ["lesen", "haben", "gelesen", "ein Buch", "read a book"],
  ["schreiben", "haben", "geschrieben", "eine E-Mail", "wrote an email"], ["sehen", "haben", "gesehen", "einen Film", "watched a film"],
  ["arbeiten", "haben", "gearbeitet", "bis 20 Uhr", "worked until 8 pm"], ["treffen", "haben", "getroffen", "Freunde", "met friends"],
  ["kochen", "haben", "gekocht", "Gulasch", "cooked goulash"], ["telefonieren", "haben", "telefoniert", "mit Mama", "talked to Mum on the phone"],
  ["einkaufen", "haben", "eingekauft", "im Supermarkt", "went shopping at the supermarket"],
  ["gehen", "sein", "gegangen", "ins Kino", "went to the cinema"], ["fahren", "sein", "gefahren", "nach Graz", "went to Graz"],
  ["fliegen", "sein", "geflogen", "nach Spanien", "flew to Spain"], ["kommen", "sein", "gekommen", "zu spät", "came too late"],
  ["laufen", "sein", "gelaufen", "zehn Kilometer", "ran ten kilometres"], ["schwimmen", "sein", "geschwommen", "im See", "swam in the lake"],
  ["aufstehen", "sein", "aufgestanden", "um sechs Uhr", "got up at six"], ["bleiben", "sein", "geblieben", "zu Hause", "stayed at home"]
];

// Wo/Wohin generator (A2+): things you put somewhere, places, two-way prepositions
const THINGS = [["das", "Buch", "book"], ["der", "Schlüssel", "key"], ["die", "Tasche", "bag"], ["das", "Handy", "phone"],
  ["die", "Brille", "glasses"], ["der", "Rucksack", "backpack"], ["die", "Jacke", "jacket"], ["der", "Ball", "ball"]];
const PLACES = [["der", "Tisch", "table"], ["der", "Stuhl", "chair"], ["das", "Bett", "bed"], ["das", "Sofa", "sofa"],
  ["der", "Boden", "floor"], ["das", "Regal", "shelf"], ["der", "Schrank", "wardrobe"], ["die", "Kommode", "chest of drawers"],
  ["der", "Schreibtisch", "desk"], ["die", "Couch", "couch"]];
const PREPS = [["auf", "on"], ["unter", "under"], ["neben", "next to"], ["hinter", "behind"], ["vor", "in front of"]];

// Adjective-ending generator (B1)
const ADJECTIVES = [["groß", "big"], ["klein", "small"], ["neu", "new"], ["alt", "old"], ["schön", "beautiful"], ["rot", "red"],
  ["blau", "blue"], ["schwarz", "black"], ["grün", "green"], ["gelb", "yellow"], ["kalt", "cold"], ["warm", "warm"],
  ["billig", "cheap"], ["frisch", "fresh"], ["schnell", "fast"], ["lang", "long"], ["kurz", "short"]];
