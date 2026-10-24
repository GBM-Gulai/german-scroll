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
     idioms:  [German idiom, correct meaning, wrong meaning, wrong meaning, literal translation]
*/
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const LEVEL_NAMES = ["Anfänger", "Grundlagen", "Mittelstufe", "Selbstständig", "Fortgeschritten", "Experte"];
const NOUN_DATA = [], GAPS = [], BUILD = [], TF = [], ODD = [], GRAMMAR = [], READS = [], LESSONS = [], IDIOMS = [];
const LV = { nouns: [], gaps: [], build: [], tf: [], odd: [], grammar: [], reads: [], lessons: [], idioms: [] };   // level (1–6) of every item
const PACK_TARGET = { nouns: NOUN_DATA, gaps: GAPS, build: BUILD, tf: TF, odd: ODD, grammar: GRAMMAR, reads: READS, lessons: LESSONS, idioms: IDIOMS };
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
  ["brauchen", "brauche brauchst braucht brauchen braucht brauchen", "to need"], ["finden", "finde findest findet finden findet finden", "to find"],
  ["trinken", "trinke trinkst trinkt trinken trinkt trinken", "to drink"]
];

// Objects for the sentence generators, tagged by kind so verbs and adjectives only meet objects that make sense:
// food, drink, clothes, thing, doc (documents), read (things you read), buy (things you buy that aren't food/clothes/things),
// own (things you own, e.g. a car), animal, vehicle (transport you take)
const OBJECTS = [
  "der|Apfel|apple|food", "die|Banane|banana|food,sweet", "das|Brot|loaf of bread|food", "der|Käse|cheese|food", "die|Pizza|pizza|food",
  "der|Kuchen|cake|food,sweet", "das|Eis|ice cream|food,sweet", "die|Wurst|sausage|food", "die|Semmel|bread roll|food", "das|Kipferl|croissant|food",
  "die|Suppe|soup|food", "der|Salat|salad|food", "die|Schokolade|chocolate bar|food,sweet", "die|Orange|orange|food",
  "das|Schnitzel|schnitzel|food", "die|Erdbeere|strawberry|food,sweet",
  "der|Kaffee|coffee|drink", "der|Tee|tea|drink", "das|Bier|beer|drink", "der|Wein|wine|drink", "der|Saft|juice|drink",
  "der|Almdudler|Almdudler (herbal lemonade)|drink",
  "die|Jacke|jacket|clothes", "das|Hemd|shirt|clothes", "die|Hose|pair of trousers|clothes", "das|Kleid|dress|clothes",
  "der|Schal|scarf|clothes", "die|Kappe|cap|clothes", "das|T-Shirt|T-shirt|clothes", "der|Pullover|jumper|clothes", "die|Mütze|woolly hat|clothes",
  "der|Schlüssel|key|thing", "das|Handy|phone|thing", "die|Brille|pair of glasses|thing", "die|Tasche|bag|thing",
  "der|Regenschirm|umbrella|thing", "das|Buch|book|thing,read", "der|Kuli|pen|thing", "der|Rucksack|backpack|thing", "die|Uhr|watch|thing",
  "der|Laptop|laptop|thing", "das|Heft|notebook|thing", "die|Lampe|lamp|thing", "der|Koffer|suitcase|thing",
  "die|Fahrkarte|ticket|doc,buy", "der|Reisepass|passport|doc", "das|Formular|form|doc,read", "die|Rechnung|bill|doc,read",
  "der|Ausweis|ID card|doc", "die|Zeitung|newspaper|read,buy", "der|Brief|letter|doc,read", "die|E-Mail|email|read",
  "der|Hund|dog|animal", "die|Katze|cat|animal", "das|Pferd|horse|animal", "der|Vogel|bird|animal", "die|Kuh|cow|animal",
  "der|Bus|bus|vehicle", "das|Taxi|taxi|vehicle", "die|Straßenbahn|tram|vehicle", "der|Zug|train|vehicle",
  "das|Fahrrad|bike|vehicle,own", "das|Auto|car|vehicle,own"
];

// Verbs that take a direct object (Akkusativ) | English base form | kinds of objects that fit
const OBJ_VERBS = [
  ["kaufen", "buy", ["food", "drink", "clothes", "thing", "buy", "own"]], ["brauchen", "need", ["thing", "clothes", "doc"]],
  ["suchen", "look for", ["thing", "doc"]], ["sehen", "see", ["animal", "vehicle"]], ["haben", "have", ["thing", "animal", "doc", "clothes", "own"]],
  ["finden", "find", ["thing", "doc"]], ["nehmen", "take", ["vehicle", "food", "drink"]], ["mögen", "like", ["food", "drink", "animal"]],
  ["essen", "eat", ["food"]], ["trinken", "drink", ["drink"]], ["lesen", "read", ["read"]]
];

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

// Adjective-ending generator (B1): adjective | English | kinds of objects (from OBJECTS) it fits
const ADJECTIVES = [
  ["groß", "big", ["thing", "clothes", "animal", "own", "food"]], ["klein", "small", ["thing", "clothes", "animal", "own", "food"]],
  ["neu", "new", ["thing", "clothes", "own", "doc"]], ["alt", "old", ["thing", "clothes", "own", "animal"]],
  ["schön", "beautiful", ["thing", "clothes", "animal", "own"]], ["billig", "cheap", ["thing", "clothes", "food", "drink", "own"]],
  ["rot", "red", ["thing", "clothes", "own"]], ["blau", "blue", ["thing", "clothes", "own"]], ["schwarz", "black", ["thing", "clothes", "own", "animal"]],
  ["grün", "green", ["thing", "clothes", "own"]], ["gelb", "yellow", ["thing", "clothes", "own"]], ["frisch", "fresh", ["food"]],
  ["lecker", "tasty", ["food"]], ["süß", "sweet", ["sweet", "animal"]], ["kalt", "cold", ["drink"]], ["warm", "warm", ["clothes", "drink"]],
  ["schnell", "fast", ["animal", "vehicle"]], ["lang", "long", ["clothes"]], ["kurz", "short", ["clothes"]]
];
