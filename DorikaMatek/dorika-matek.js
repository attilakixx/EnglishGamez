(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  function setMathText(element, value) {
    const source = String(value);
    const marker = '\\overline{';
    let from = 0;
    element.replaceChildren();
    while (true) {
      const start = source.indexOf(marker, from);
      if (start < 0) break;
      const end = source.indexOf('}', start + marker.length);
      if (end < 0) break;
      element.append(document.createTextNode(source.slice(from, start)));
      const expression = source.slice(start + marker.length, end);
      const overline = document.createElement('span');
      overline.className = 'math-overline';
      overline.setAttribute('role', 'math');
      overline.setAttribute('aria-label', expression === 'A' ? 'A komplementere' : expression === 'B' ? 'B komplementere' : `${expression} komplementere`);
      overline.textContent = expression;
      element.append(overline);
      from = end + 1;
    }
    element.append(document.createTextNode(source.slice(from)));
  }
  const U = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const toSorted = set => [...set].sort((a, b) => a - b);
  const formatSet = set => set.size ? `{${toSorted(set).join(', ')}}` : '∅';
  const union = (...sets) => new Set(sets.flatMap(set => [...set]));
  const intersection = (...sets) => new Set([...sets[0]].filter(n => sets.every(set => set.has(n))));
  const difference = (left, right) => new Set([...left].filter(n => !right.has(n)));
  const complement = (set, universe) => difference(universe, set);
  const shuffle = list => {
    const items = [...list];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  };

  // A négy Venn-régió bitje: kívül=1, csak A=2, közös=4, csak B=8.
  const diagrams = [
    { id: 'a', label: 'A', mask: 6, meaning: 'A minden eleme' },
    { id: 'b', label: 'B', mask: 12, meaning: 'B minden eleme' },
    { id: 'union', label: 'A ∪ B', mask: 14, meaning: 'A-ban vagy B-ben van' },
    { id: 'intersection', label: 'A ∩ B', mask: 4, meaning: 'A-ban és B-ben is van' },
    { id: 'aMinusB', label: 'A ∖ B', mask: 2, meaning: 'A-ban van, B-ben nincs' },
    { id: 'bMinusA', label: 'B ∖ A', mask: 8, meaning: 'B-ben van, A-ban nincs' },
    { id: 'compA', label: '\\overline{A}', mask: 9, meaning: 'Az alaphalmaz A-n kívüli része' },
    { id: 'compB', label: '\\overline{B}', mask: 3, meaning: 'Az alaphalmaz B-n kívüli része' },
    { id: 'compUnion', label: '\\overline{A ∪ B}', mask: 1, meaning: 'Egyik halmazban sincs' },
    { id: 'compIntersection', label: '\\overline{A ∩ B}', mask: 11, meaning: 'Nincs benne egyszerre mindkét halmazban' },
    { id: 'universe', label: 'U', mask: 15, meaning: 'Az egész alaphalmaz' },
    { id: 'empty', label: '∅', mask: 0, meaning: 'Egyetlen elem sem' }
  ];

  const setOperations = [
    { id: 'union', label: 'A ∪ B', hint: 'Mindazok a számok, amelyek A-ban vagy B-ben vannak. A közös elemeket egyszer írd le.', solve: s => union(s.A, s.B) },
    { id: 'intersection', label: 'A ∩ B', hint: 'Csak a mindkét halmazban szereplő számokat keresd.', solve: s => intersection(s.A, s.B) },
    { id: 'aMinusB', label: 'A ∖ B', hint: 'Indulj A-ból, és húzd ki a B-ben is szereplő számokat.', solve: s => difference(s.A, s.B) },
    { id: 'bMinusA', label: 'B ∖ A', hint: 'Indulj B-ből, és húzd ki az A-ban is szereplő számokat.', solve: s => difference(s.B, s.A) },
    { id: 'compA', label: '\\overline{A} = U ∖ A', hint: 'A teljes U-ból hagyd el az A elemeit.', solve: s => complement(s.A, s.U) },
    { id: 'compB', label: '\\overline{B} = U ∖ B', hint: 'A teljes U-ból hagyd el a B elemeit.', solve: s => complement(s.B, s.U) },
    { id: 'compUnion', label: '\\overline{A ∪ B}', hint: 'Azokat keresd, amelyek sem A-ban, sem B-ben nincsenek.', solve: s => complement(union(s.A, s.B), s.U) },
    { id: 'compIntersection', label: '\\overline{A ∩ B}', hint: 'Az U-ból hagyd el az A és B közös elemeit.', solve: s => complement(intersection(s.A, s.B), s.U) },
    { id: 'tripleUnion', label: 'A ∪ B ∪ C', hint: 'Minden szám kell, amely legalább az egyik halmazban szerepel.', solve: s => union(s.A, s.B, s.C) },
    { id: 'tripleIntersection', label: 'A ∩ B ∩ C', hint: 'Csak azokat írd le, amelyek mindhárom halmazban megtalálhatók.', solve: s => intersection(s.A, s.B, s.C) },
    { id: 'interMinusC', label: '(A ∩ B) ∖ C', hint: 'Először A és B közös elemeit keresd, aztán hagyd el közülük a C-ben lévőket.', solve: s => difference(intersection(s.A, s.B), s.C) },
    { id: 'emptyIntersect', label: 'A ∩ \\overline{A}', hint: 'Egy szám nem lehet egyszerre A-ban és A-n kívül.', solve: s => intersection(s.A, complement(s.A, s.U)) },
    { id: 'unionEmpty', label: 'A ∪ ∅', hint: 'Az üres halmaz nem tesz hozzá új elemet.', solve: s => union(s.A, new Set()) }
  ];

  const setHelp = {
    a: { read: 'Az A halmaz.', rule: 'A körön belüli összes elem A-hoz tartozik, a B-vel közös rész is.', method: 'Az A kör teljes belsejét keresd.' },
    b: { read: 'A B halmaz.', rule: 'A körön belüli összes elem B-hez tartozik, az A-val közös rész is.', method: 'A B kör teljes belsejét keresd.' },
    union: { read: 'A és B uniója.', rule: 'Az ∪ az unió jele. A ∪ B mindent tartalmaz, ami legalább az egyik halmazban benne van; a közös elemeket csak egyszer vesszük.', method: 'Vedd A és B összes elemét, majd az ismétlődő számokat csak egyszer írd le. A Venn-ábrán mindkét kör színes.' },
    intersection: { read: 'A és B metszete.', rule: 'Az ∩ a metszet jele. A ∩ B csak azokat az elemeket tartalmazza, amelyek egyszerre A-ban és B-ben is benne vannak.', method: 'Egyenként nézd meg A elemeit, és csak azt tartsd meg, amely B-ben is szerepel. Az ábrán a két kör közös része színes.' },
    aMinusB: { read: 'A különbség B; vagy: az A-ból elvesszük B-t.', rule: 'A ∖ B azokból az A-beli elemekből áll, amelyek B-ben nincsenek. A különbségnél a sorrend számít.', method: 'Indulj A elemeiből; húzd ki mindazt, ami B-ben is benne van. Az ábrán csak az A kör B-n kívüli része színes.' },
    bMinusA: { read: 'B különbség A; vagy: a B-ből elvesszük A-t.', rule: 'B ∖ A azokból a B-beli elemekből áll, amelyek A-ban nincsenek. Ez általában eltér az A ∖ B-től.', method: 'Indulj B elemeiből; húzd ki mindazt, ami A-ban is benne van. Az ábrán csak a B kör A-n kívüli része színes.' },
    compA: { read: 'A komplementere; ugyanaz, mint U különbség A.', rule: 'Az A fölötti vonás a komplementert jelöli. \\overline{A} az alaphalmaz (U) minden olyan eleme, amely nincs A-ban.', method: 'Az U számaiból húzd ki A számait. A Venn-ábrán az A körön kívüli rész színes.' },
    compB: { read: 'B komplementere; ugyanaz, mint U különbség B.', rule: 'A B fölötti vonás a komplementert jelöli. \\overline{B} az alaphalmaz (U) minden olyan eleme, amely nincs B-ben.', method: 'Az U számaiból húzd ki B számait. A Venn-ábrán a B körön kívüli rész színes.' },
    compUnion: { read: 'A és B uniójának komplementere.', rule: 'Az ∪ unió: legalább az egyik halmazban benne van. A teljes A ∪ B kifejezés fölötti vonás az unió komplementerét jelöli. Így \\overline{A ∪ B} azokból áll, amelyek egyik halmazban sincsenek.', method: 'Előbb egyesítsd A-t és B-t, aztán az eredményt vedd el U-ból. A Venn-ábrán csak a két körön kívüli rész színes. De Morgan szerint ez \\overline{A} ∩ \\overline{B}.' },
    compIntersection: { read: 'A és B metszetének komplementere.', rule: 'Az ∩ metszet: mindkét halmazban benne van. A teljes A ∩ B kifejezés fölötti vonás a metszet komplementerét jelöli. Így \\overline{A ∩ B} minden U-beli elem, amely nem közös eleme A-nak és B-nek.', method: 'Előbb keresd meg az A és B közös számait, aztán ezeket hagyd ki U-ból. A Venn-ábrán minden színes a közös részen kívül. De Morgan szerint ez \\overline{A} ∪ \\overline{B}.' },
    universe: { read: 'Az U alaphalmaz.', rule: 'U jelöli a feladatban vizsgált összes lehetséges elemet. A Venn-ábrán a teljes téglalap az alaphalmaz.', method: 'A teljes téglalapot keresd, a körök belsejével és külsejével együtt.' },
    empty: { read: 'Az üres halmaz.', rule: 'A ∅ jel azt jelenti: a halmaznak egyetlen eleme sincs.', method: 'Olyan ábrát keress, amelyen nincs színezett terület.' },
    tripleUnion: { read: 'A, B és C uniója.', rule: 'A ∪ B ∪ C minden olyan elemet tartalmaz, amely legalább az egyik halmazban szerepel.', method: 'Gyűjtsd össze A, B és C számait; minden szám csak egyszer kerüljön az eredménybe.' },
    tripleIntersection: { read: 'A, B és C metszete.', rule: 'A ∩ B ∩ C csak azokat az elemeket tartalmazza, amelyek mindhárom halmazban szerepelnek.', method: 'Először keresd A és B közös számait, majd csak azokat tartsd meg, amelyek C-ben is benne vannak.' },
    interMinusC: { read: 'A és B metszetéből elvesszük C-t.', rule: 'A zárójel miatt előbb A ∩ B-t kell kiszámolni. A ∖ jel ezután azt kéri, hogy a közös elemek közül hagyd el a C-ben szereplőket.', method: 'Írd fel A és B közös számait, majd húzd ki közülük azokat, amelyek C-ben is megtalálhatók.' },
    emptyIntersect: { read: 'A és A komplementerének metszete.', rule: '\\overline{A} az U A-n kívüli része. Egy elem nem lehet egyszerre A-ban és A-n kívül, ezért A ∩ \\overline{A} mindig ∅.', method: 'Gondold végig, lehet-e olyan szám, amely A-ban van és ugyanakkor nincs A-ban.' },
    unionEmpty: { read: 'A és az üres halmaz uniója.', rule: 'Az ∪ unió minden elemet összegyűjt. Az ∅-nek nincs eleme, ezért A ∪ ∅ ugyanaz, mint A.', method: 'Másold le A elemeit; az üres halmazból nem kerül hozzá új szám.' }
  };

  const logicHelp = {
    statement: { read: 'Azt vizsgáljuk, hogy a mondat kijelentés-e.', rule: 'A kijelentésnek egyértelmű igazságértéke van: igaz vagy hamis. Egy hamis állító mondat is kijelentés. A kérdés és a felszólítás nem az.', method: 'Előbb azt kérdezd: a mondatról el lehet-e dönteni, hogy igaz vagy hamis? Ne azt, hogy ténylegesen igaz-e.' },
    not: { read: 'Nem p; p tagadása.', rule: 'A ¬ a tagadás jele. A ¬p igazságértéke mindig az ellenkezője p igazságértékének.', method: 'Nézd meg p értékét, majd fordítsd át: igazból hamis, hamisból igaz lesz.' },
    doubleNot: { read: 'Nem igaz, hogy nem p; p kettős tagadása.', rule: 'Két tagadás kioltja egymást: ¬¬p ≡ p.', method: 'A két ¬ jelet párként elhagyhatod; ezután csak p értékét kell megnézned.' },
    and: { read: 'p és q; p és q konjunkciója.', rule: 'A p ∧ q pontosan akkor igaz, ha p és q is igaz. Ha bármelyik hamis, az egész állítás hamis.', method: 'Ellenőrizd külön p-t és q-t. Csak két igaz értéknél válassz igazat.' },
    or: { read: 'p vagy q; megengedő vagy, más néven diszjunkció.', rule: 'A p ∨ q igaz, ha legalább az egyik állítás igaz. Akkor is igaz, ha mindkettő igaz.', method: 'Csak akkor válassz hamisat, ha p és q is hamis.' },
    xor: { read: 'p kizáró vagy q.', rule: 'A p ⊕ q pontosan akkor igaz, ha p és q közül csak az egyik igaz. Két igaz vagy két hamis értéknél hamis.', method: 'Hasonlítsd össze p és q értékét: ha különböznek, igaz; ha azonosak, hamis.' },
    implies: { read: 'Ha p, akkor q; p-ből következik q.', rule: 'A p → q csak akkor hamis, ha p igaz, de q hamis. Hamis előtag esetén a formális implikáció igaz.', method: 'Keresd az egyetlen cáfoló esetet: p igaz és q hamis. Minden más esetben igaz.' },
    iff: { read: 'p akkor és csak akkor, ha q; p és q ekvivalens.', rule: 'A p ↔ q pontosan akkor igaz, ha p és q igazságértéke megegyezik.', method: 'Hasonlítsd össze az értékeket: két igaz vagy két hamis esetén igaz.' },
    demorganAnd: { read: 'A p és q konjunkciójának tagadása.', rule: 'A p ∧ q pontosan akkor igaz, ha p és q is igaz; ha bármelyik hamis, hamis. A ¬ az egész zárójelet tagadja. De Morgan szerint ¬(p ∧ q) ≡ ¬p ∨ ¬q.', method: 'Előbb számold ki p ∧ q értékét, aztán fordítsd meg. Másik út: nézd meg, hogy p vagy q közül legalább az egyik hamis-e.' },
    demorganOr: { read: 'A p és q diszjunkciójának tagadása.', rule: 'A p ∨ q igaz, ha legalább az egyik igaz. A ¬ az egész zárójelet tagadja. De Morgan szerint ¬(p ∨ q) ≡ ¬p ∧ ¬q.', method: 'Előbb számold ki p ∨ q értékét, aztán fordítsd meg. Csak akkor lesz igaz, ha p és q is hamis.' },
    member: { read: 'A megadott szám eleme-e A-nak?', rule: 'Az ∈ jelet „eleme” szóval olvassuk. Egy számot hasonlítunk össze egy halmazzal.', method: 'Keresd meg a kérdésben szereplő számot A felsorolásában.' },
    subset: { read: 'X részhalmaza-e A-nak?', rule: 'Az ⊆ jelet „részhalmaza” szóval olvassuk. X ⊆ A akkor igaz, ha X minden eleme A-ban is szerepel.', method: 'Vizsgáld meg X elemeit egyenként. Egyetlen A-ból hiányzó elem már hamissá teszi az állítást.' },
    notAll: { read: 'Nem igaz, hogy A minden eleme páros.', rule: 'A ∀ jelentése „minden”; a ¬ ezt a teljes állítást tagadja. A „nem minden páros” azt jelenti, hogy van legalább egy páratlan elem: ∃x∈A, amely páratlan.', method: 'Keress egyetlen páratlan számot A-ban. Ha találsz, az állítás igaz; ha minden szám páros, hamis.' }
  };

  const glossary = [
    ['p, q', 'Kijelentések: olyan állító mondatok, amelyek igazak vagy hamisak.'],
    ['i, h', 'Az igazságtáblában i = igaz, h = hamis.'],
    ['¬', 'Tagadás: ¬p = „nem p”; megfordítja az igazságértéket.'],
    ['∧', 'Konjunkció, „és”: csak akkor igaz, ha mindkét rész igaz.'],
    ['∨', 'Megengedő „vagy”: akkor igaz, ha legalább az egyik rész igaz.'],
    ['⊕', 'Kizáró „vagy”: akkor igaz, ha pontosan az egyik rész igaz.'],
    ['→', 'Implikáció, „ha…, akkor…”: csak igaz előtag és hamis utótag esetén hamis.'],
    ['↔', 'Ekvivalencia, „akkor és csak akkor”: a két rész igazságértéke azonos.'],
    ['≡', 'Logikai azonosság: a két kifejezés minden esetben ugyanazt az igazságértéket adja.'],
    ['∀, ∃', '∀ = „minden”; ∃ = „van olyan”. A „minden” tagadása: „van olyan, amely nem”.'],
    ['∈', '„Eleme”: például 2 ∈ A azt jelenti, hogy 2 szerepel A-ban.'],
    ['⊆', '„Részhalmaza”: B ⊆ A azt jelenti, hogy B minden eleme A-ban is benne van.'],
    ['U, ∅', 'U az alaphalmaz, ∅ az üres halmaz, amelynek nincs eleme.'],
    ['\\overline{A}', 'Komplementer: \\overline{A} az U minden olyan eleme, amely nincs A-ban.'],
    ['∩', 'Metszet: A ∩ B az A és B közös elemei.'],
    ['∪', 'Unió: A ∪ B az A-ban vagy B-ben szereplő elemek.'],
    ['∖', 'Halmazkülönbség: A ∖ B az A-ban lévő, de B-ben nem szereplő elemek.'],
    ['( )', 'Zárójel: a benne lévő műveletet számoljuk ki először.']
  ];

  const lessons = [
    { section: 'Kijelentéslogika', symbol: 'p', title: 'Mi a kijelentés?', explain: 'A kijelentés olyan állító mondat, amelynek egy adott helyzetben egyértelmű igazságértéke van: igaz vagy hamis. Egy kérdés vagy szubjektív vélemény önmagában nem ilyen.', example: 'p: „2 páros szám.” → igaz.\nq: „3 páros szám.” → hamis.', question: 'Kijelentés-e az, hogy „Mennyi 2 + 2?”', answer: 'Nem. Ez kérdés, ezért nincs saját igazságértéke.' },
    { section: 'Kijelentéslogika', symbol: '¬', title: 'Tagadás', explain: 'A ¬p az eredeti állítás ellenkező igazságértékét jelenti. Ha p igaz, ¬p hamis; ha p hamis, ¬p igaz.', example: 'p: „Esik az eső.”\n¬p: „Nem esik az eső.”', question: 'Ha p igaz, mi ¬p igazságértéke?', answer: 'Hamis.' },
    { section: 'Kijelentéslogika', symbol: '∀ ∃', title: 'Minden és létezik', explain: 'A „minden” jele ∀, a „van olyan” jele ∃. Egy mindenre vonatkozó állítást már egyetlen ellenpélda is cáfol. Tagadáskor a mindenből „van olyan” lesz, és fordítva.', example: '¬(∀x P(x)) ≡ ∃x ¬P(x)\n„Nem minden fiú szereti a focit” = „Van olyan fiú, aki nem szereti a focit.”', question: 'Mi a „Van olyan fiú, aki szereti a focit” tagadása?', answer: '„Egyetlen fiú sem szereti a focit”, vagyis minden fiúra igaz, hogy nem szereti.' },
    { section: 'Kijelentéslogika', symbol: '¬¬', title: 'Többszörös tagadás', explain: 'Két tagadás kioltja egymást. Páros számú tagadás visszavezet az eredeti kijelentéshez, páratlan számú pedig annak tagadásához.', example: '¬¬p ≡ p\n¬¬¬p ≡ ¬p', question: 'Mivel egyenértékű a ¬¬¬¬p?', answer: 'p-vel, mert négy tagadás páros számú.' },
    { section: 'Kijelentéslogika', symbol: '∧', title: 'Konjunkció: és', explain: 'A p ∧ q pontosan akkor igaz, ha p és q is igaz. Ha bármelyik hamis, az egész állítás hamis.', example: 'p: „Esik.”, q: „Fúj a szél.”\np ∧ q: „Esik és fúj a szél.”', truth: 'and', question: 'Ha p igaz és q hamis, igaz-e p ∧ q?', answer: 'Nem, az „és” mindkét oldalán igaz állítás kell.' },
    { section: 'Kijelentéslogika', symbol: '∨', title: 'Megengedő vagy', explain: 'A p ∨ q akkor igaz, ha legalább az egyik állítás igaz. Akkor is igaz, ha mindkettő igaz. A matematikai „vagy” alapértelmezésben ilyen.', example: 'p ∨ q csak akkor hamis, ha p és q is hamis.', truth: 'or', question: 'Igaz-e p ∨ q, ha mindkét állítás igaz?', answer: 'Igen. A megengedő „vagy” megengedi, hogy mindkettő igaz legyen.' },
    { section: 'Kijelentéslogika', symbol: '⊕', title: 'Kizáró vagy', explain: 'A p ⊕ q pontosan akkor igaz, ha a két állítás közül csak az egyik igaz. Ha mindkettő igaz vagy mindkettő hamis, az eredmény hamis.', example: 'A hétköznapi „vagy” néha kizáró választást jelent. Matematikában ezt külön jellel, ⊕-szal írjuk.', truth: 'xor', question: 'Mi p ⊕ q, ha p és q is igaz?', answer: 'Hamis, mert nem pontosan az egyik igaz.' },
    { section: 'Kijelentéslogika', symbol: '→', title: 'Implikáció: ha…, akkor…', explain: 'A p → q csak akkor hamis, amikor p igaz, de q hamis. Ha az előfeltétel nem teljesül, a logikai implikáció igaznak számít; ez a formális szabály, nem a hétköznapi ok-okozat.', example: '„Ha esik az eső, akkor vizes az út.”\nAz állítást az cáfolja, ha esik, de az út nem vizes.', truth: 'implies', question: 'Mi p → q értéke, ha p hamis és q hamis?', answer: 'Igaz. Az implikáció csak igaz előtag és hamis utótag esetén hamis.' },
    { section: 'Kijelentéslogika', symbol: '↔', title: 'Ekvivalencia', explain: 'A p ↔ q akkor igaz, ha p és q igazságértéke megegyezik. Jelentése: „p akkor és csak akkor, ha q”. Két ellentétes irányú implikáció együtt.', example: 'p ↔ q ≡ (p → q) ∧ (q → p)', truth: 'iff', question: 'Igaz-e p ↔ q, ha mindkettő hamis?', answer: 'Igen, mert az igazságértékük megegyezik.' },
    { section: 'Kijelentéslogika', symbol: 'i h', title: 'Igazságtábla és zárójelek', explain: 'Az i az igaz, a h a hamis rövidítése. Összetett kifejezésnél a zárójeles részt számoljuk először. A táblázat minden lehetséges p és q értéket végigvesz.', example: '„Ha esik és fúj a szél, akkor kabátot veszek fel.”\n(p ∧ q) → r', truth: 'all', question: 'Melyik rész a feltétel a (p ∧ q) → r kifejezésben?', answer: 'A teljes (p ∧ q) kifejezés: az eső és a szél együtt.' },
    { section: 'Halmazok', symbol: '{ }', title: 'Halmaz és felsorolás', explain: 'A halmaz jól meghatározott elemek összessége. Felsoroláskor kapcsos zárójelet használunk. A sorrend és az ismétlés nem számít.', example: 'A = {2, 3, 5, 7}: az egyjegyű prímszámok.\n{2, 3, 2} = {2, 3}.', question: 'Egyenlő-e {1, 2, 3} és {3, 1, 2}?', answer: 'Igen, ugyanazok az elemeik.' },
    { section: 'Halmazok', symbol: '∈ ⊆', title: 'Elem és részhalmaz', explain: 'A 2 ∈ A azt jelenti, hogy a 2 elem szerepel A-ban. A B ⊆ A azt jelenti, hogy B minden eleme A-ban is szerepel. A ∈ elemet, a ⊆ halmazt hasonlít halmazhoz.', example: 'A = {a, b, c}, B = {a, b}\na ∈ A és B ⊆ A.', question: 'Ha B = {a, b}, igaz-e B ∈ A az adott A = {a, b, c} mellett?', answer: 'Nem. B részhalmaza A-nak (B ⊆ A), de maga a {a, b} halmaz nem eleme A-nak.' },
    { section: 'Halmazok', symbol: 'U ∅', title: 'Alaphalmaz és üres halmaz', explain: 'Az U az összes számot tartalmazza, amellyel az adott feladatban foglalkozunk. Az ∅-nek nincs eleme; minden halmaz részhalmaza, még önmagának is.', example: 'U = {1, 2, …, 10}\n∅ ⊆ A; A ∪ ∅ = A; A ∩ ∅ = ∅.', venn: 0, question: 'Mennyi A ∩ ∅?', answer: '∅, mert nincs olyan elem, amely az üres halmazban szerepel.' },
    { section: 'Halmazműveletek', symbol: '\\overline{A}', title: 'Komplementer', explain: 'Az A fölötti vonás a komplementert jelöli. \\overline{A} az U azon elemeiből áll, amelyek nincsenek A-ban. A komplementer mindig a megadott U-hoz képest értendő.', example: 'U = {1,…,10}, A = {2,4,5,8,9}\n\\overline{A} = {1,3,6,7,10}.', venn: 9, question: 'Benne van-e 3 a \\overline{A} halmazban?', answer: 'Igen. A 3 az U-ban van, de A-ban nincs.' },
    { section: 'Halmazműveletek', symbol: '∩', title: 'Metszet', explain: 'A ∩ B csak a közös elemeket tartalmazza. A Venn-diagramon a két kör átfedő részét színezzük.', example: 'A = {2,4,5,8,9}, B = {1,2,5,6,7}\nA ∩ B = {2,5}.', venn: 4, question: 'Miért nincs benne 4 az A ∩ B-ben?', answer: 'Mert a 4 csak A-ban van, B-ben nincs.' },
    { section: 'Halmazműveletek', symbol: '∪', title: 'Unió', explain: 'A ∪ B minden olyan elemet tartalmaz, amely legalább az egyik halmazban szerepel. A közös elemeket csak egyszer írjuk le.', example: 'A ∪ B = {1,2,4,5,6,7,8,9}.', venn: 14, question: 'Benne van-e 6 az A ∪ B-ben?', answer: 'Igen, mert B-ben szerepel; nem kell A-ban is szerepelnie.' },
    { section: 'Halmazműveletek', symbol: '∖', title: 'Halmazkülönbség', explain: 'A ∖ B az A-ban lévő, de B-ben nem szereplő elemeket tartalmazza. A sorrend számít: általában A ∖ B és B ∖ A különbözik.', example: 'A ∖ B = {4,8,9}\nB ∖ A = {1,6,7}.', venn: 2, question: 'Benne van-e 2 az A ∖ B-ben?', answer: 'Nem, mert 2 B-ben is szerepel.' },
    { section: 'Halmazműveletek', symbol: 'A B C', title: 'Három halmaz és a zárójelek', explain: 'A műveleteket három halmazon is elvégezhetjük. A ∩ B ∩ C mindhárom közös részét jelöli. A zárójel megmondja, melyik műveletet végezzük előbb.', example: 'A ∩ B ∩ C = {2}\n(A ∩ B) ∖ C = {5}.', question: 'Miért lesz (A ∩ B) ∖ C = {5} a példában?', answer: 'A ∩ B = {2,5}; ezek közül 2 C-ben is benne van, így csak 5 marad.' },
    { section: 'Szabályok', symbol: '≡', title: 'Felcserélhetőség és társai', explain: 'A metszet és az unió felcserélhető és csoportosítható. Önmagunkkal metszve vagy egyesítve ugyanazt a halmazt kapjuk. Halmazkülönbségnél a sorrend nem cserélhető fel.', example: 'A ∩ B = B ∩ A; A ∪ B = B ∪ A.\n(A ∩ B) ∩ C = A ∩ (B ∩ C).\nA ∩ A = A; A ∪ A = A.', question: 'Igaz-e általában A ∖ B = B ∖ A?', answer: 'Nem. A különbségnél a sorrend számít.' },
    { section: 'Szabályok', symbol: '∩ ∪', title: 'De Morgan: halmazok', explain: 'Egy metszet komplementere a komplementerek uniója. Egy unió komplementere a komplementerek metszete. A teljes kifejezés fölötti vonás „átfordítja” az ∩ és ∪ jelet.', example: '\\overline{A ∩ B} = \\overline{A} ∪ \\overline{B}\n\\overline{A ∪ B} = \\overline{A} ∩ \\overline{B}.', venn: 11, question: 'Mi a párja a \\overline{A ∪ B} kifejezésnek?', answer: '\\overline{A} ∩ \\overline{B}: sem A-ban, sem B-ben nem szereplő elemek.' },
    { section: 'Szabályok', symbol: '¬∧', title: 'De Morgan: logikai állítások', explain: 'Ugyanez a szabály igaz a kijelentéslogikában is. Az „és” tagadása „vagy” lesz két tagadott állítással; a „vagy” tagadása „és” lesz.', example: '¬(p ∧ q) ≡ ¬p ∨ ¬q\n¬(p ∨ q) ≡ ¬p ∧ ¬q.', truth: 'demorgan', question: 'A „Nem igaz, hogy esik és fúj” azt jelenti-e, hogy sem eső, sem szél nincs?', answer: 'Nem feltétlenül. Elég, ha legalább az egyik nem igaz: ¬p ∨ ¬q.' }
  ];

  let svgSerial = 0;
  function venn(mask) {
    const id = `dm-venn-${++svgSerial}`;
    const outside = mask & 1 ? `<rect x="7" y="7" width="306" height="178" fill="#78d6bc" mask="url(#${id}-outside)"/>` : '';
    const aOnly = mask & 2 ? `<circle cx="125" cy="98" r="64" fill="#78d6bc" mask="url(#${id}-a-only)"/>` : '';
    const both = mask & 4 ? `<circle cx="195" cy="98" r="64" fill="#78d6bc" clip-path="url(#${id}-a-clip)"/>` : '';
    const bOnly = mask & 8 ? `<circle cx="195" cy="98" r="64" fill="#78d6bc" mask="url(#${id}-b-only)"/>` : '';
    return `<div class="venn-wrap"><svg viewBox="0 0 320 200" role="img" aria-label="Venn-diagram: ${diagrams.find(d => d.mask === mask)?.meaning || 'kijelölt részek'}">
      <defs>
        <mask id="${id}-outside" maskUnits="userSpaceOnUse" x="0" y="0" width="320" height="200"><rect width="320" height="200" fill="white"/><circle cx="125" cy="98" r="64" fill="black"/><circle cx="195" cy="98" r="64" fill="black"/></mask>
        <mask id="${id}-a-only" maskUnits="userSpaceOnUse" x="0" y="0" width="320" height="200"><rect width="320" height="200" fill="black"/><circle cx="125" cy="98" r="64" fill="white"/><circle cx="195" cy="98" r="64" fill="black"/></mask>
        <mask id="${id}-b-only" maskUnits="userSpaceOnUse" x="0" y="0" width="320" height="200"><rect width="320" height="200" fill="black"/><circle cx="195" cy="98" r="64" fill="white"/><circle cx="125" cy="98" r="64" fill="black"/></mask>
        <clipPath id="${id}-a-clip"><circle cx="125" cy="98" r="64"/></clipPath>
      </defs>
      <rect x="7" y="7" width="306" height="178" rx="11" fill="#f9f8ff" stroke="#bdb7d8" stroke-width="2"/>
      ${outside}${aOnly}${bOnly}${both}
      <circle cx="125" cy="98" r="64" fill="none" stroke="#6151ad" stroke-width="2.5"/>
      <circle cx="195" cy="98" r="64" fill="none" stroke="#6151ad" stroke-width="2.5"/>
      <text x="73" y="40" fill="#44378a" font-size="19" font-weight="800">A</text>
      <text x="230" y="40" fill="#44378a" font-size="19" font-weight="800">B</text>
      <text x="289" y="175" fill="#44378a" font-size="17" font-weight="800">U</text>
    </svg></div>`;
  }

  function truthValue(kind, p, q) {
    switch (kind) {
      case 'not': return !p;
      case 'doubleNot': return !!p;
      case 'and': return p && q;
      case 'or': return p || q;
      case 'xor': return p !== q;
      case 'implies': return !p || q;
      case 'iff': return p === q;
      case 'demorganAnd': return !(p && q);
      case 'demorganOr': return !(p || q);
      default: throw new Error('Ismeretlen logikai művelet');
    }
  }
  const ih = value => value ? 'i' : 'h';
  function truthTable(kind) {
    const columns = kind === 'all' ? [
      ['p ∧ q', (p, q) => p && q], ['p ∨ q', (p, q) => p || q],
      ['p ⊕ q', (p, q) => p !== q], ['p → q', (p, q) => !p || q],
      ['p ↔ q', (p, q) => p === q]
    ] : kind === 'demorgan' ? [
      ['¬(p ∧ q)', (p, q) => !(p && q)], ['¬p ∨ ¬q', (p, q) => !p || !q],
      ['¬(p ∨ q)', (p, q) => !(p || q)], ['¬p ∧ ¬q', (p, q) => !p && !q]
    ] : [[({and:'p ∧ q',or:'p ∨ q',xor:'p ⊕ q',implies:'p → q',iff:'p ↔ q'})[kind], (p,q) => truthValue(kind,p,q)]];
    const heads = columns.map(([name]) => `<th scope="col">${name}</th>`).join('');
    const rows = [[true,true],[true,false],[false,true],[false,false]].map(([p,q]) => `<tr><td>${ih(p)}</td><td>${ih(q)}</td>${columns.map(([,fn]) => `<td>${ih(fn(p,q))}</td>`).join('')}</tr>`).join('');
    return `<table class="truth-table"><thead><tr><th scope="col">p</th><th scope="col">q</th>${heads}</tr></thead><tbody>${rows}</tbody></table>`;
  }

  let lessonIndex = 0;
  let mode = '';
  let deck = [];
  let round = 0;
  let score = 0;
  let attempts = 0;
  let answered = false;
  let task = null;
  const exampleSets = {
    U: new Set([1, 2, 3, 4]),
    A: new Set([1, 2]),
    B: new Set([2, 3]),
    C: new Set([2, 4])
  };

  function currentHelp() {
    return mode === 'logic' ? logicHelp[task.id] : setHelp[task.op.id];
  }
  function exampleForOperation(op) {
    const parts = [];
    if (op.id.startsWith('comp') || op.id === 'emptyIntersect') parts.push(`U = ${formatSet(exampleSets.U)}`);
    if (op.id !== 'compB') parts.push(`A = ${formatSet(exampleSets.A)}`);
    if (!['compA', 'emptyIntersect', 'unionEmpty'].includes(op.id)) parts.push(`B = ${formatSet(exampleSets.B)}`);
    if (op.id.startsWith('triple') || op.id === 'interMinusC') parts.push(`C = ${formatSet(exampleSets.C)}`);
    return `Másik példa: ${parts.join('; ')}. ${op.label} = ${formatSet(op.solve(exampleSets))}.`;
  }
  function renderHelp() {
    const info = currentHelp();
    setMathText($('quiz-help-read'), info.read);
    setMathText($('quiz-help-rule'), info.rule);
    setMathText($('quiz-help-method'), info.method);
    const exampleOp = mode === 'logic' ? null : setOperations.find(op => op.id === task.op.id);
    setMathText($('quiz-help-example'), exampleOp ? exampleForOperation(exampleOp) : '');
  }
  function toggleHelp() {
    const panel = $('quiz-help-panel');
    panel.hidden = !panel.hidden;
    $('quiz-help-button').setAttribute('aria-expanded', String(!panel.hidden));
    $('quiz-help-button').textContent = panel.hidden ? '💡 Segítséget kérek' : '💡 Segítség elrejtése';
  }
  function renderGlossary() {
    for (const [symbol, meaning] of glossary) {
      const item = document.createElement('div');
      item.className = 'glossary-item';
      const mark = document.createElement('span');
      mark.className = 'glossary-symbol';
      setMathText(mark, symbol);
      const description = document.createElement('p');
      setMathText(description, meaning);
      item.append(mark, description);
      $('glossary-list').append(item);
    }
  }

  function showScreen(id) {
    for (const el of document.querySelectorAll('.screen')) el.hidden = el.id !== id;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
  function showLesson() {
    const item = lessons[lessonIndex];
    $('lesson-count').textContent = `${lessonIndex + 1}. lépés / ${lessons.length}`;
    $('lesson-section').textContent = item.section;
    $('lesson-progress').style.width = `${(lessonIndex + 1) / lessons.length * 100}%`;
    setMathText($('lesson-symbol'), item.symbol);
    $('lesson-title').textContent = item.title;
    setMathText($('lesson-explain'), item.explain);
    setMathText($('lesson-example'), item.example);
    setMathText($('lesson-question'), item.question);
    setMathText($('lesson-answer'), item.answer);
    $('lesson-answer').hidden = true;
    $('reveal-lesson').hidden = false;
    $('lesson-visual').innerHTML = item.venn !== undefined ? `${venn(item.venn)}<p class="venn-caption">A zöld területet jelöli a kifejezés.</p>` : item.truth ? truthTable(item.truth) : '';
    $('lesson-prev').disabled = lessonIndex === 0;
    $('lesson-next').textContent = lessonIndex === lessons.length - 1 ? 'Kész, irány a játékok →' : 'Következő →';
  }
  function startLesson() { lessonIndex = 0; showScreen('lesson-screen'); showLesson(); }

  function makeSets() {
    // Mind a négy Venn-régióban van elem; a C-vel képzett közös és különbségi példák sem üresek.
    const pool = shuffle(U);
    const outside = pool.slice(0, 2);
    const onlyA = pool.slice(2, 4);
    const both = pool.slice(4, 6);
    const onlyB = pool.slice(6, 8);
    for (const n of pool.slice(8)) [outside, onlyA, both, onlyB][Math.floor(Math.random() * 4)].push(n);
    const A = new Set([...onlyA, ...both]);
    const B = new Set([...onlyB, ...both]);
    const C = new Set([both[0]]);
    for (const n of U) if (n !== both[0] && n !== both[1] && Math.random() < .48) C.add(n);
    return { U: new Set(U), A, B, C };
  }

  function makeTask() {
    const id = deck[round];
    if (mode === 'diagram') return { op: diagrams.find(op => op.id === id) };
    if (mode === 'logic') {
      if (id === 'member') {
        const sets = makeSets();
        const number = U[Math.floor(Math.random() * U.length)];
        return { id, sets, number, expected: sets.A.has(number) };
      }
      if (id === 'subset') {
        const sets = makeSets();
        const X = new Set(shuffle([...sets.A]).slice(0, 2));
        if (Math.random() < .5) X.add(shuffle([...difference(sets.U, sets.A)])[0]);
        return { id, sets, X, expected: [...X].every(n => sets.A.has(n)) };
      }
      if (id === 'notAll') {
        const even = shuffle([2, 4, 6, 8, 10]).slice(0, 3);
        if (Math.random() < .5) even.push(shuffle([1, 3, 5, 7, 9])[0]);
        return { id, values: new Set(even), expected: even.some(n => n % 2 !== 0) };
      }
      if (id === 'statement') {
        const sentence = shuffle([
          { text: '2 + 2 = 4.', expected: true },
          { text: '3 páros szám.', expected: true },
          { text: 'Mennyi 2 + 2?', expected: false },
          { text: 'Csukd be az ajtót!', expected: false }
        ])[0];
        return { id, ...sentence };
      }
      const p = Math.random() < .5, q = Math.random() < .5;
      return { id, p, q, expected: truthValue(id, p, q) };
    }
    const op = setOperations.find(op => op.id === id);
    const sets = makeSets();
    return { op, sets, expected: op.solve(sets) };
  }

  function setFeedback(message = '', type = '') {
    const el = $('quiz-feedback');
    setMathText(el, message);
    el.className = `feedback${type ? ` ${type}` : ''}`;
  }
  function addChip(name, value) {
    const chip = document.createElement('div');
    chip.className = 'set-chip';
    const strong = document.createElement('strong');
    strong.textContent = `${name} = `;
    chip.append(strong, document.createTextNode(formatSet(value)));
    $('quiz-data').append(chip);
  }
  function makeOption(label, isCorrect, extraClass = '') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `answer-option ${extraClass}`.trim();
    button.dataset.correct = String(isCorrect);
    if (extraClass === 'diagram-option') button.innerHTML = venn(label);
    else button.textContent = label;
    button.addEventListener('click', () => checkChoice(button));
    $('quiz-options').append(button);
  }
  function setChoices(expected, sets) {
    const choices = new Map([[formatSet(expected), expected]]);
    for (const op of shuffle(setOperations)) {
      const result = op.solve(sets);
      choices.set(formatSet(result), result);
      if (choices.size >= 7) break;
    }
    // Ritka egybeeséseknél egyetlen elem ki/be kapcsolásával készül további téves válasz.
    for (const n of shuffle(U)) {
      if (choices.size >= 4) break;
      const changed = new Set(expected);
      if (changed.has(n)) changed.delete(n); else changed.add(n);
      choices.set(formatSet(changed), changed);
    }
    const wrong = shuffle([...choices.keys()].filter(key => key !== formatSet(expected))).slice(0, 3);
    return shuffle([formatSet(expected), ...wrong]);
  }
  function renderTask() {
    task = makeTask();
    attempts = 0;
    answered = false;
    $('quiz-count').textContent = `${round + 1}. feladat / ${deck.length}`;
    $('quiz-score').textContent = `⭐ ${score}`;
    $('quiz-progress').style.width = `${round / deck.length * 100}%`;
    $('quiz-data').replaceChildren();
    $('quiz-options').replaceChildren();
    $('answer-form').hidden = mode !== 'write';
    $('answer-input').value = '';
    $('answer-input').disabled = false;
    $('answer-form').querySelector('button').disabled = false;
    $('quiz-next').hidden = true;
    $('quiz-next').textContent = round === deck.length - 1 ? 'Eredmény →' : 'Következő feladat →';
    $('quiz-help-panel').hidden = true;
    $('quiz-help-button').setAttribute('aria-expanded', 'false');
    $('quiz-help-button').textContent = '💡 Segítséget kérek';
    setFeedback();

    if (mode === 'diagram') {
      $('quiz-type').textContent = 'JELÖLÉSFELISMERÉS';
      $('quiz-title').textContent = `Melyik ábra: ${task.op.label}?`;
      $('quiz-instruction').textContent = 'A zöld rész mutatja a keresett halmazt. Válaszd ki a helyes Venn-diagramot!';
      const otherMasks = shuffle(diagrams.filter(d => d.mask !== task.op.mask)).slice(0, 3).map(d => d.mask);
      for (const mask of shuffle([task.op.mask, ...otherMasks])) makeOption(mask, mask === task.op.mask, 'diagram-option');
    } else if (mode === 'logic') {
      const names = { not: '¬p', doubleNot: '¬¬p', and: 'p ∧ q', or: 'p ∨ q', xor: 'p ⊕ q', implies: 'p → q', iff: 'p ↔ q', demorganAnd: '¬(p ∧ q)', demorganOr: '¬(p ∨ q)' };
      $('quiz-type').textContent = 'KIJELENTÉSLOGIKA';
      if (task.id === 'member') {
        $('quiz-title').textContent = `Igaz-e ${task.number} ∈ A?`;
        $('quiz-instruction').textContent = 'Az ∈ egy elem és egy halmaz kapcsolatát jelöli.';
        addChip('A', task.sets.A);
      } else if (task.id === 'subset') {
        $('quiz-title').textContent = 'Igaz-e X ⊆ A?';
        $('quiz-instruction').textContent = 'A részhalmaz minden elemének szerepelnie kell A-ban.';
        addChip('A', task.sets.A);
        addChip('X', task.X);
      } else if (task.id === 'notAll') {
        $('quiz-title').textContent = 'Igaz-e ¬(∀x∈A: x páros)?';
        $('quiz-instruction').textContent = 'Olvasata: „Nem igaz, hogy A minden eleme páros.”';
        addChip('A', task.values);
      } else if (task.id === 'statement') {
        $('quiz-title').textContent = 'Matematikai kijelentés ez?';
        $('quiz-instruction').textContent = `„${task.text}”`;
      } else {
        $('quiz-title').textContent = `Igaz vagy hamis: ${names[task.id]}?`;
        $('quiz-instruction').textContent = 'Számold ki a kifejezés igazságértékét a megadott p és q mellett.';
        for (const [name, value] of [['p', task.p], ['q', task.q]]) {
          const chip = document.createElement('div');
          chip.className = 'set-chip';
          chip.textContent = `${name} = ${value ? 'igaz' : 'hamis'}`;
          $('quiz-data').append(chip);
        }
      }
      makeOption(task.id === 'statement' ? 'Igen, kijelentés' : 'Igaz', task.expected);
      makeOption(task.id === 'statement' ? 'Nem kijelentés' : 'Hamis', !task.expected);
    } else {
      $('quiz-type').textContent = mode === 'write' ? 'ÖNÁLLÓ MEGOLDÁS' : 'SZÁMHALMAZOK';
      $('quiz-title').textContent = `Mennyi ${task.op.label}?`;
      $('quiz-instruction').textContent = mode === 'write' ? 'Számold ki, és sorold fel a kapott halmaz minden elemét.' : 'Válaszd ki a helyes eredményt!';
      addChip('U', task.sets.U);
      addChip('A', task.sets.A);
      if (!['emptyIntersect', 'unionEmpty'].includes(task.op.id)) addChip('B', task.sets.B);
      if (task.op.id.startsWith('triple') || task.op.id === 'interMinusC') addChip('C', task.sets.C);
      if (mode === 'choice') for (const label of setChoices(task.expected, task.sets)) makeOption(label, label === formatSet(task.expected));
      else $('answer-input').focus();
    }
    setMathText($('quiz-title'), $('quiz-title').textContent);
    renderHelp();
  }

  function startQuiz(selectedMode) {
    mode = selectedMode;
    const names = { diagram: 'VENN-DETEKTÍV', choice: 'HALMAZKVÍZ', write: 'ÍRD LE!', logic: 'IGAZ VAGY HAMIS?' };
    $('quiz-mode-tag').textContent = names[mode];
    deck = shuffle(mode === 'diagram' ? diagrams.map(op => op.id) : mode === 'logic' ? ['statement','not','doubleNot','and','or','xor','implies','iff','demorganAnd','demorganOr','member','subset','notAll'] : setOperations.map(op => op.id));
    round = 0;
    score = 0;
    showScreen('quiz-screen');
    renderTask();
  }

  function explanation() {
    const info = currentHelp();
    return `${info.read} ${info.rule}`;
  }
  function correctAnswerText() {
    if (mode === 'diagram') return task.op.label;
    if (mode === 'logic') return task.id === 'statement' ? (task.expected ? 'Igen, kijelentés' : 'Nem kijelentés') : task.expected ? 'Igaz' : 'Hamis';
    return formatSet(task.expected);
  }
  function finishAnswer(correct) {
    answered = true;
    if (correct && attempts === 0) score++;
    $('quiz-score').textContent = `⭐ ${score}`;
    $('quiz-progress').style.width = `${(round + 1) / deck.length * 100}%`;
    $('quiz-next').hidden = false;
    $('answer-input').disabled = true;
    $('answer-form').querySelector('button').disabled = true;
    for (const option of $('quiz-options').children) {
      option.disabled = true;
      if (option.dataset.correct === 'true') option.classList.add('correct');
    }
    if (correct) setFeedback(`Helyes! ${explanation()}`, 'good');
    else setFeedback(`A helyes válasz: ${correctAnswerText()}. ${explanation()}`, 'reveal');
  }
  function checkChoice(button) {
    if (answered) return;
    if (button.dataset.correct === 'true') { finishAnswer(true); return; }
    attempts++;
    button.classList.add('wrong');
    button.disabled = true;
    if (attempts >= 2 || mode === 'logic') finishAnswer(false);
    else setFeedback(`Még egy próbát! ${explanation()}`, 'try-again');
  }
  function parseSetAnswer(raw) {
    let value = raw.trim();
    if (!value) return { valid: false, reason: 'Írj be számokat, vagy az üres halmaz jelét: ∅.' };
    if (value === '∅' || value === '{}') return { valid: true, value: new Set() };
    if (value.startsWith('{') && value.endsWith('}')) value = value.slice(1, -1).trim();
    if (!value || !/^\d+(?:[\s,;]+\d+)*$/.test(value)) return { valid: false, reason: 'Csak egész számokat írj, vesszővel vagy szóközzel elválasztva.' };
    const numbers = value.split(/[\s,;]+/).map(Number);
    if (numbers.some(n => !U.includes(n))) return { valid: false, reason: 'Csak az U alaphalmaz 1 és 10 közötti számai szerepelhetnek.' };
    return { valid: true, value: new Set(numbers) };
  }
  function sameSet(a, b) { return a.size === b.size && [...a].every(n => b.has(n)); }
  function checkWritten(event) {
    event.preventDefault();
    if (answered || mode !== 'write') return;
    const parsed = parseSetAnswer($('answer-input').value);
    if (!parsed.valid) { setFeedback(parsed.reason, 'try-again'); return; }
    if (sameSet(parsed.value, task.expected)) { finishAnswer(true); return; }
    attempts++;
    if (attempts >= 2) finishAnswer(false);
    else setFeedback(`Még egy próbát! ${explanation()}`, 'try-again');
  }
  function nextTask() {
    round++;
    if (round === deck.length) {
      $('result-summary').textContent = `${deck.length} feladatból ${score} sikerült elsőre.`;
      $('result-detail').textContent = mode === 'diagram' ? 'Minden Venn-jelölést gyakoroltál. Próbáld ki a számhalmazos feladatokat is!' : mode === 'logic' ? 'A kijelentések, logikai műveletek és halmazjelölések is sorra kerültek.' : 'Minden művelettípussal találkoztál. Új körben új számhalmazokat kapsz.';
      showScreen('result-screen');
    } else renderTask();
  }

  document.querySelectorAll('[data-start]').forEach(button => button.addEventListener('click', () => button.dataset.start === 'lesson' ? startLesson() : startQuiz(button.dataset.start)));
  document.querySelectorAll('[data-home]').forEach(button => button.addEventListener('click', () => showScreen('menu-screen')));
  $('quiz-help-button').addEventListener('click', toggleHelp);
  $('glossary-button').addEventListener('click', () => $('glossary-dialog').showModal());
  $('glossary-close').addEventListener('click', () => $('glossary-dialog').close());
  $('lesson-prev').addEventListener('click', () => { if (lessonIndex > 0) { lessonIndex--; showLesson(); } });
  $('lesson-next').addEventListener('click', () => { if (lessonIndex < lessons.length - 1) { lessonIndex++; showLesson(); } else showScreen('menu-screen'); });
  $('reveal-lesson').addEventListener('click', () => { $('lesson-answer').hidden = false; $('reveal-lesson').hidden = true; });
  $('answer-form').addEventListener('submit', checkWritten);
  $('quiz-next').addEventListener('click', nextTask);
  $('play-again').addEventListener('click', () => startQuiz(mode));
  renderGlossary();
})();
