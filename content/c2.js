/* C2 – Experte */
pack("C2", {
  nouns: [
    "die|Gratwanderung|balancing act|", "der|Zwiespalt|inner conflict|", "die|Befindlichkeit|sensitivity / state of mind|",
    "der|Kahlschlag|drastic cuts|", "die|Schadenfreude|malicious joy|", "das|Fingerspitzengefühl|tact / intuition|",
    "die|Torschlusspanik|fear of running out of time|", "der|Weltschmerz|world-weariness|", "die|Gemütlichkeit|cosiness|",
    "das|Fernweh|wanderlust|", "der|Ohrwurm|earworm|🐛", "der|Feierabend|end of the working day|🌇",
    "die|Verschlimmbesserung|making worse by 'improving'|", "der|Kummerspeck|weight from emotional eating|",
    "die|Fremdscham|second-hand embarrassment|", "der|Drahtesel|bike (colloquial)|", "das|Sitzfleisch|staying power|",
    "der|Spießbürger|narrow-minded conformist|", "die|Zwickmühle|dilemma|", "der|Sündenbock|scapegoat|🐐", "die|Eselsbrücke|mnemonic|",
    "die|Geborgenheit|feeling of security|", "der|Zeitgeist|spirit of the age|", "die|Wehmut|wistfulness|", "das|Heimweh|homesickness|",
    "die|Vergänglichkeit|transience|", "die|Ambivalenz|ambivalence|", "die|Gepflogenheit|custom / practice|",
    "die|Gemengelage|mix of factors|", "der|Schlendrian|slackness / sloppy routine|", "das|Pickerl|sticker / vignette (Austrian)|",
    "der|Grant|grumpiness (Austrian)|", "der|Topfen|curd cheese (Austrian)|", "das|Obers|cream (Austrian)|"
  ],

  gaps: [
    ["Was ist ___ los mit dir?", ["denn", "doch", "halt"], "What's the matter with you?", "<b>denn</b> in questions shows interest or surprise"],
    ["Das weißt du ___!", ["doch", "denn", "etwa"], "But you know that!", "<b>doch</b> = reminding someone of something they know"],
    ["Das ist ___ so, da kann man nichts machen.", ["halt", "denn", "etwa"], "That's just how it is, nothing you can do.", "<b>halt</b> (AT / southern) = resignation: that's just the way it is"],
    ["Sie hätte das Projekt beinahe ___ müssen.", ["aufgeben", "aufgegeben", "aufzugeben"], "She almost had to give up the project.", "Double infinitive: hätte … <b>aufgeben müssen</b>"],
    ["Ich weiß nicht, ob er hätte kommen ___.", ["können", "gekonnt", "kann"], "I don't know whether he could have come.", "In a subordinate clause: <b>hätte kommen können</b>"],
    ["Ungeachtet ___ Kritik hielt er an seinem Plan fest.", ["der", "dem", "die"], "Regardless of the criticism, he stuck to his plan.", "<b>ungeachtet</b> + Genitiv"],
    ["Wie dem auch ___, wir müssen weitermachen.", ["sei", "ist", "wäre"], "Be that as it may, we have to carry on.", "Fixed phrase with Konjunktiv I: <b>wie dem auch sei</b>"],
    ["Er ist alles ___ als zuverlässig.", ["andere", "weitere", "übrige"], "He's anything but reliable.", "<b>alles andere als</b> = anything but"],
    ["Das ist mir völlig ___.", ["wurscht", "Käse", "Brot"], "I couldn't care less.", "<b>Das ist mir wurscht</b> (AT / southern) = I don't care"],
    ["Ihm ist ___ Laus über die Leber gelaufen.", ["eine", "ein", "einen"], "He's in a bad mood.", "die Laus → <b>eine Laus über die Leber laufen</b> = to be grumpy"],
    ["Da liegt der Hund ___.", ["begraben", "gebraten", "geblieben"], "That's the crux of the matter.", "<b>Da liegt der Hund begraben</b> = that's the real problem"],
    ["Er redet um den heißen ___ herum.", ["Brei", "Topf", "Kaffee"], "He's beating around the bush.", "<b>um den heißen Brei herumreden</b>"],
    ["Es ist höchste ___. Der Zug fährt gleich!", ["Eisenbahn", "Straßenbahn", "Bahn"], "It's high time. The train is about to leave!", "Colloquial: <b>höchste Eisenbahn</b> = high time"],
    ["Sei es aus Neugier, ___ es aus Langeweile – er schaute nach.", ["sei", "wäre", "ist"], "Whether out of curiosity or boredom – he took a look.", "<b>sei es … sei es</b> = whether … or"],
    ["Selbst wenn er es gewollt ___, hätte er es nicht geschafft.", ["hätte", "wäre", "würde"], "Even if he had wanted to, he wouldn't have managed it.", "Konjunktiv II past: <b>hätte</b> gewollt"],
    ["Er hat mir reinen ___ eingeschenkt.", ["Wein", "Wasser", "Saft"], "He told me the plain truth.", "<b>jemandem reinen Wein einschenken</b> = to tell someone the truth"],
    ["Ich verstehe nur ___.", ["Bahnhof", "Zug", "Haltestelle"], "It's all Greek to me.", "<b>Ich verstehe nur Bahnhof</b> = I don't understand a thing"],
    ["Geh mir nicht auf den ___!", ["Keks", "Kuchen", "Kopf"], "Don't get on my nerves!", "<b>jemandem auf den Keks gehen</b> = to annoy someone"],
    ["___ heute, wo ich keinen Schirm habe, regnet es!", ["Ausgerechnet", "Sogar", "Erst"], "Of all days, it rains today when I have no umbrella!", "<b>ausgerechnet</b> = of all (days / people …)"],
    ["Heuer fahren wir nach Kärnten. – „Heuer“ bedeutet ___.", ["dieses Jahr", "heute", "im Sommer"], "This year we're going to Carinthia.", "Austrian Standard German: <b>heuer</b> = this year"]
  ],

  build: [
    ["Ich weiß nicht, ob ich das hätte tun sollen.", "I don't know whether I should have done that."],
    ["Wie dem auch sei, wir müssen eine Lösung finden.", "Be that as it may, we have to find a solution."],
    ["Ungeachtet aller Warnungen fuhr er weiter.", "Regardless of all the warnings, he drove on."],
    ["Da liegt also der Hund begraben.", "So that's where the real problem lies."],
    ["Er ist alles andere als begeistert von der Idee.", "He's anything but enthusiastic about the idea."],
    ["Sei es im Beruf oder im Privatleben, Ehrlichkeit zahlt sich aus.", "Whether at work or in private life, honesty pays off."],
    ["Dass ausgerechnet er den Preis gewonnen hat, wundert mich.", "It surprises me that he of all people won the prize."],
    ["Ich bin gestern den ganzen Abend vor dem Fernseher gesessen.", "I sat in front of the TV all evening yesterday (Austrian Perfekt)."]
  ],

  tf: [
    ["„Ich verstehe nur Bahnhof“ bedeutet: Ich verstehe gar nichts.", true, "'I only understand train station' means: I don't understand anything."],
    ["„Das ist mir wurscht“ bedeutet: Das ist mir sehr wichtig.", false, "'That's sausage to me' means it's very important to me. (It means I don't care!)"],
    ["Schadenfreude ist die Freude über das Unglück anderer.", true, "Schadenfreude is joy at other people's misfortune."],
    ["„Grant“ ist ein österreichisches Wort für schlechte Laune.", true, "'Grant' is an Austrian word for a bad mood."],
    ["Ein Sündenbock ist jemand, der für alles gelobt wird.", false, "A scapegoat is someone who gets praised for everything."],
    ["„Fernweh“ ist sozusagen das Gegenteil von „Heimweh“.", true, "'Fernweh' (wanderlust) is more or less the opposite of 'Heimweh' (homesickness)."],
    ["Eine Eselsbrücke hilft beim Merken.", true, "A 'donkey bridge' (mnemonic) helps you remember things."],
    ["Wer „Sitzfleisch“ hat, kann nicht lange still sitzen.", false, "Someone with 'sitting flesh' can't sit still for long. (They have staying power!)"],
    ["„Da steppt der Bär“ bedeutet, dass irgendwo viel los ist.", true, "'The bear is tap-dancing there' means there's a lot going on."],
    ["In Österreich sagt man „Obers“ statt „Sahne“.", true, "In Austria people say 'Obers' instead of 'Sahne' (cream)."]
  ],

  odd: [
    ["Gemütlichkeit", "Wehmut", "Weltschmerz", "Heimweh", "The others are melancholic feelings – Gemütlichkeit is cosiness."],
    ["dessen", "denn", "doch", "halt", "The others are modal particles – dessen is a relative pronoun."],
    ["Auto", "Drahtesel", "Fahrrad", "Rad", "The others all mean bicycle – Drahtesel is slang for a bike."],
    ["Lösung", "Zwickmühle", "Dilemma", "Zwiespalt", "The others describe a difficult choice – a Lösung is a solution."],
    ["wegen", "ungeachtet", "trotz", "unbeschadet", "The others mean 'despite / regardless of' – wegen means 'because of'."],
    ["Sahne", "Obers", "Topfen", "Paradeiser", "The others are Austrian words – Sahne is what Germans say for Obers."]
  ],

  grammar: [
    { e: "🧂", t: "doch, ja, halt",
      rule: "Modal particles add attitude: <b>doch</b> (reminder / encouragement), <b>ja</b> (surprise / shared knowledge), <b>halt</b> (resignation).",
      ex: ["Komm <mark>doch</mark> mit!", "Das ist <mark>halt</mark> so."],
      q: "Du bist ___ schon da! (surprised)", o: ["ja", "halt", "denn"],
      why: "Surprise → <b>ja</b>." },
    { e: "🧱", t: "Double infinitive in subordinate clauses",
      rule: "In a subordinate clause with a double infinitive, the conjugated verb (<b>hätte, hat, wird</b>) goes <b>before</b> the two infinitives – not to the very end.",
      ex: ["…, weil er nicht <mark>hat</mark> kommen können.", "…, ob ich das <mark>hätte</mark> tun sollen."],
      q: "Ich weiß nicht, ob er das ___.", o: ["hätte machen dürfen", "machen dürfen hätte", "dürfen hätte machen"],
      why: "The conjugated verb comes before the double infinitive: <b>hätte machen dürfen</b>." },
    { e: "📜", t: "Fixed Konjunktiv I phrases",
      rule: "Some fixed phrases keep the old Konjunktiv I: <b>Es lebe …!</b>, <b>Gott sei Dank</b>, <b>wie dem auch sei</b>, <b>sei es … sei es</b>, <b>es sei denn</b>.",
      ex: ["<mark>Wie dem auch sei</mark>, wir fangen an.", "Ich komme, <mark>es sei denn</mark>, es regnet."],
      q: "Ich komme mit, ___ denn, ich muss arbeiten.", o: ["es sei", "es ist", "es wäre"],
      why: "Fixed phrase: <b>es sei denn</b> = unless." },
    { e: "🇦🇹", t: "heuer, Jänner, gesessen",
      rule: "Austrian Standard German has its own words and forms: <b>heuer</b> (this year), <b>Jänner</b>, and <b>ich bin gesessen / gestanden / gelegen</b>.",
      ex: ["<mark>Heuer</mark> fahren wir nach Kärnten.", "Ich <mark>bin</mark> lange im Stau <mark>gestanden</mark>."],
      q: "In Austria: Ich ___ den ganzen Tag gesessen.", o: ["bin", "habe", "wurde"],
      why: "Austrian Standard German: <b>ich bin gesessen</b>." },
    { e: "🎯", t: "ausgerechnet, sogar, erst",
      rule: "Focus particles change the emphasis: <b>ausgerechnet</b> (of all …), <b>sogar</b> (even), <b>erst</b> (only / not until), <b>bloß / nur</b> (only).",
      ex: ["<mark>Ausgerechnet</mark> heute regnet es!", "Er kommt <mark>erst</mark> um zehn."],
      q: "Der Zug kommt ___ um 23 Uhr – so spät!", o: ["erst", "sogar", "ausgerechnet"],
      why: "Not until → <b>erst</b>." }
  ],

  reads: [
    { kind: "story", title: "Glosse: Der Wiener Grant",
      text: "Wer zum ersten Mal ein Wiener Kaffeehaus betritt, mag den Kellner für unhöflich halten. Doch weit gefehlt: Was Außenstehende als Unfreundlichkeit missdeuten, ist in Wahrheit gepflegter Grant – eine Kunstform, die über Generationen verfeinert wurde.\nDer echte Wiener Kellner bedient nicht, er gewährt Audienz. Wer nach fünf Minuten ungeduldig winkt, hat die Gepflogenheiten schlichtweg nicht verstanden.\nUnd doch: Hat man sich erst einmal das Wohlwollen des Herrn Ober erarbeitet, wird man mit einer Herzlichkeit belohnt, die ihresgleichen sucht.",
      gloss: { "betritt": "enters", "mag": "may", "unhöflich": "rude", "weit gefehlt": "far from it", "Außenstehende": "outsiders",
               "missdeuten": "misinterpret", "gepflegter": "cultivated", "Grant": "grumpiness (Viennese)", "verfeinert": "refined",
               "gewährt Audienz": "grants an audience", "Gepflogenheiten": "customs", "schlichtweg": "simply", "Wohlwollen": "goodwill",
               "Herrn Ober": "the head waiter", "erarbeitet": "earned", "ihresgleichen sucht": "is unparalleled" },
      qs: [["Wie beschreibt der Autor das Verhalten der Kellner?", ["Als gepflegten Grant, eine Kunstform", "Als echte Unhöflichkeit", "Als schlechten Service"]],
           ["Welchen Ton hat der Text?", ["Ironisch und liebevoll", "Wütend", "Neutral und wissenschaftlich"]],
           ["Was passiert, wenn man das Wohlwollen des Kellners gewinnt?", ["Man wird sehr herzlich behandelt", "Man bekommt Rabatt", "Man muss nicht mehr zahlen"]]] },
    { kind: "story", title: "Literarischer Auszug",
      text: "Es war einer jener Novemberabende, an denen die Stadt den Atem anzuhalten schien. Der Nebel kroch die Gassen hinauf, legte sich über die Laternen und verschluckte das Geräusch der letzten Straßenbahn.\nMarie stand am Fenster und fragte sich, ob sie ihm je verzeihen könnte. Nicht, dass er gelogen hatte, kränkte sie – sondern dass er es mit einer solchen Selbstverständlichkeit getan hatte.\nSie zog den Vorhang zu, als könne sie damit auch die Erinnerung aussperren.",
      gloss: { "jener": "those", "den Atem anzuhalten": "to hold its breath", "schien": "seemed", "Nebel": "fog", "kroch": "crept", "Gassen": "alleys",
               "verschluckte": "swallowed", "verzeihen": "forgive", "kränkte": "hurt (offended)", "Selbstverständlichkeit": "matter-of-factness",
               "Vorhang": "curtain", "als könne": "as if she could", "aussperren": "lock out" },
      qs: [["Was verletzt Marie am meisten?", ["Wie selbstverständlich er gelogen hat", "Dass er gegangen ist", "Das schlechte Wetter"]],
           ["Welche Stimmung hat der Text?", ["Melancholisch", "Fröhlich", "Spannend und actionreich"]],
           ["Warum zieht sie den Vorhang zu?", ["Sie möchte die Erinnerung aussperren", "Es ist zu hell", "Sie will schlafen gehen"]]] },
    { kind: "chat", title: "Wienerisch im Chat", who: "🍺 Flo",
      msgs: [["them", "Servus! Gemma heute auf a Bier? Ich hab an Grant, die Arbeit war a Wahnsinn."],
             ["me", "Leiwand, bin dabei! Wo treff ma uns?"],
             ["them", "Beim Würstelstand am Schwedenplatz, um sieben. Und bring a Sackerl mit, i hab no a Packerl für di."],
             ["me", "Passt, bis später! Und reg di ned auf, des is es ned wert 😄"]],
      gloss: { "Servus": "hi / bye (AT)", "Gemma": "shall we go (gehen wir)", "auf a Bier": "for a beer", "an Grant": "a bad mood", "a Wahnsinn": "crazy",
               "Leiwand": "great (Viennese)", "treff ma uns": "do we meet (treffen wir uns)", "Würstelstand": "sausage stand", "Sackerl": "bag (AT)",
               "Packerl": "parcel (AT)", "Passt": "OK / fine", "reg di ned auf": "don't get upset (reg dich nicht auf)", "des is es ned wert": "it's not worth it" },
      qs: [["Warum hat Flo schlechte Laune?", ["Die Arbeit war anstrengend", "Er hat kein Geld", "Es regnet"]],
           ["Wo treffen sie sich?", ["Beim Würstelstand am Schwedenplatz", "Im Kaffeehaus", "Bei Flo zu Hause"]],
           ["Was soll man mitbringen?", ["Ein Sackerl", "Ein Bier", "Ein Packerl"]]] }
  ],

  lessons: [
    { e: "🧂", t: "Modal particles",
      slides: [
        { h: "The salt of spoken German", p: "Small words like <b>doch, ja, mal, halt, eben, denn, eh, wohl</b> don't change the facts – they add <b>attitude</b>. Native speakers use them all the time.",
          ex: ["Komm doch mit! – Come along! (friendly push)", "Das ist ja toll! – That's great! (surprise)"] },
        { h: "What they add", table: { head: ["Particle", "Adds", "Example"], rows: [["doch", "reminder / encouragement", "Das weißt du doch!"],
          ["ja", "shared knowledge / surprise", "Du bist ja schon da!"], ["mal", "softens a request", "Schau mal!"], ["halt / eben", "that's how it is", "Das ist halt so."],
          ["denn", "interest in questions", "Was machst du denn?"], ["eh (AT)", "anyway", "Das wissen wir eh."], ["wohl", "assumption", "Er ist wohl krank."]] } },
        { h: "Combinations", ex: ["Komm doch mal vorbei!", "Das ist halt einfach so.", "Du hast ja eh recht."] }
      ],
      quiz: [["Wo bist du ___? Ich warte schon!", ["denn", "halt", "eh"]], ["„Das ist halt so.“ expresses …", ["acceptance: that's how it is", "anger", "surprise"]]] },

    { e: "🇦🇹", t: "Austrian German",
      slides: [
        { h: "Standard, but Austrian", p: "Austrian German is an official standard variety. These words are correct in writing too.",
          table: { head: ["Austria", "Germany", "English"], rows: [["Jänner", "Januar", "January"], ["heuer", "dieses Jahr", "this year"], ["Paradeiser", "Tomate", "tomato"],
            ["Erdäpfel", "Kartoffeln", "potatoes"], ["Sackerl", "Tüte", "bag"], ["Matura", "Abitur", "school-leaving exam"], ["Topfen", "Quark", "curd cheese"], ["Obers", "Sahne", "cream"]] } },
        { h: "Grammar differences", p: "Austrians use <b>sein</b> in the Perfekt with sitzen, stehen and liegen: <b>ich bin gesessen</b>. Some genders differ: <b>das</b> Cola, <b>das</b> E-Mail.",
          ex: ["Ich bin den ganzen Tag im Büro gesessen.", "Hast du mein E-Mail bekommen?"] },
        { h: "Viennese everyday speech", ex: ["Servus! – Hi! / Bye!", "Leiwand! – Great!", "Oida! – Dude! / Wow!", "Gemma! – Let's go!"] }
      ],
      quiz: [["„heuer“ means …", ["this year", "today", "yesterday"]], ["„Ich bin gestern lange gesessen.“ is …", ["correct Austrian German", "always wrong", "only used in Germany"]]] },

    { e: "🎭", t: "Idioms and register",
      slides: [
        { h: "Don't translate word by word", p: "Idioms (Redewendungen) are fixed images. Learn them as a whole, together with the situation they're used in.",
          table: { head: ["Idiom", "Meaning"], rows: [["Ich verstehe nur Bahnhof.", "I don't understand a thing."], ["Da liegt der Hund begraben.", "That's the real problem."],
            ["um den heißen Brei herumreden", "to beat around the bush"], ["Das ist mir wurscht.", "I couldn't care less."], ["Jetzt haben wir den Salat!", "Now we're in a mess!"]] } },
        { h: "Register matters", p: "Some idioms are fine in an email to your boss (<b>den Nagel auf den Kopf treffen</b>), others only among friends (<b>Das geht mir auf den Keks</b>). When in doubt, try them out in conversation first." }
      ],
      quiz: [["A friend explains quantum physics to you. You say:", ["Ich verstehe nur Bahnhof.", "Da steppt der Bär.", "Das ist nicht mein Bier."]],
             ["„Jetzt haben wir den Salat!“ means:", ["Now we're in a mess!", "Dinner is ready!", "Let's eat healthily!"]]] }
  ],

  idioms: [
    ["Da liegt der Hund begraben.", "That's the crux of the matter.", "The dog has died.", "Everything is fine.", "That's where the dog is buried."],
    ["um den heißen Brei herumreden", "to beat around the bush", "to cook for too long", "to complain about food", "to talk around the hot porridge"],
    ["Ich verstehe nur Bahnhof.", "I don't understand a thing.", "I'm waiting for the train.", "I only speak a little.", "I only understand train station."],
    ["Ihm ist eine Laus über die Leber gelaufen.", "He's in a bad mood.", "He's ill.", "He's lucky.", "A louse ran over his liver."],
    ["Das ist mir wurscht.", "I couldn't care less.", "I'm hungry.", "That's too expensive.", "That's sausage to me."],
    ["Da steppt der Bär.", "There's a lot going on there.", "It's dangerous there.", "It's very cold there.", "The bear tap-dances there."],
    ["jemandem auf den Keks gehen", "to get on someone's nerves", "to bake for someone", "to flatter someone", "to go on someone's biscuit"],
    ["Es ist höchste Eisenbahn.", "It's high time.", "The train is late.", "It's very expensive.", "It's the highest railway."],
    ["sich wie ein Schneekönig freuen", "to be over the moon", "to feel cold", "to be arrogant", "to be as happy as a snow king"],
    ["jemandem die Leviten lesen", "to give someone a stern talking-to", "to read to someone", "to teach religion", "to read someone the Levites"],
    ["Jetzt haben wir den Salat!", "Now we're in a mess!", "Dinner is ready!", "Now we're healthy!", "Now we have the salad!"],
    ["seinen Senf dazugeben", "to give your two cents", "to cook spicy food", "to agree quickly", "to add your mustard"],
    ["Das Leben ist kein Ponyhof.", "Life isn't always easy.", "Life is boring.", "Animals deserve better.", "Life is not a pony farm."]
  ]
});
