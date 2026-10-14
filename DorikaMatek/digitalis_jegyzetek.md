# Matematikai logika és halmazműveletek

Digitalizált jegyzet a `DorikaMatek/matek/` mappában található hét fényképezett oldal alapján.

## Forrásoldalak

| Oldal | Kép |
|---:|---|
| 1 | [31284.jpg](matek/31284.jpg) |
| 2 | [31285.jpg](matek/31285.jpg) |
| 3 | [31286.jpg](matek/31286.jpg) |
| 4 | [31287.jpg](matek/31287.jpg) |
| 5 | [31288.jpg](matek/31288.jpg) |
| 6 | [31289.jpg](matek/31289.jpg) |
| 7 | [31290.jpg](matek/31290.jpg) |

Az átírás a kézírás tartalmát egységesíti: a mondatokat helyesírásilag rendeztem, a képleteket egységes, számítógépen olvasható matematikai jelöléssel írtam le. Ahol a fénykép alapján nem lehetett biztosan olvasni egy szót, azt külön jelöltem. A fejlécben látható e-mail-címet adatvédelmi okból nem másoltam át.

## 1. oldal – bevezetés és tagadás

### Órai követelmények

Az oldal tetején szereplő jegyzet tartalma:

- zárthelyi dolgozat: **11. 27.**, témája: kijelentés és tagadás;
- matematikai alapozás;
- logika és halmazelmélet, a jegyzet szerint a 3–29. oldalak;
- relációk és sorozatok számítása, a jegyzet szerint a 45. oldalig;
- a lapon oktatói/nevek és egy feladatra vonatkozó megjegyzés is szerepel, de ezek egy része nem olvasható biztosan.

### Matematikai logika

A matematikai logika matematikai kijelentéseket vizsgál. A matematikai kijelentés olyan kijelentő mondat, amelyről eldönthető, hogy **igaz** vagy **hamis**.

A jegyzet lényege szerint a matematikai megfogalmazásnak pontosnak és egyértelműnek kell lennie. Nem minden hétköznapi mondat alkalmas logikai kijelentésnek; kérdések, felszólítások és szubjektív vélemények általában nem rendelkeznek egyértelmű igazságértékkel.

### Tagadás

A kijelentés tagadása az eredeti kijelentés igazságértékét megfordítja. A tagadás jele: `¬`.

Ha

```text
p: Esik az eső.
```

akkor

```text
¬p: Nem esik az eső.
```

A jegyzet egyik példája a „minden fiú szereti a focit” állítás tagadására utal. Ennek helyes logikai tagadása:

```text
Nem igaz, hogy minden fiú szereti a focit.
vagy ekvivalensen:
Van olyan fiú, aki nem szereti a focit.
```

Fontos: a „nem minden fiú szereti a focit” nem ugyanaz, mint „egy fiú sem szereti a focit”.

### Többszörös tagadás

Legyen

```text
p: A feladat megoldható.
```

Ekkor:

- `¬p`: A feladat nem oldható meg.
- `¬¬p`: A feladat nem igaz, hogy nem oldható meg; ez `p`-vel ekvivalens.
- `¬¬¬p`: `¬p`-vel ekvivalens.

Általánosan a páros számú tagadás visszaadja az eredeti kijelentést, a páratlan számú tagadás pedig annak tagadásával ekvivalens:

```text
¬¬p ≡ p
¬¬¬p ≡ ¬p
```

## 2. oldal – konjunkció

### Két kijelentés művelete: „és”

Két kijelentés konjunkciója az `és` kapcsolattal képzett összetett kijelentés:

```text
p ∧ q
```

Az `p ∧ q` akkor és csak akkor igaz, ha **mindkét** kijelentés igaz.

Példa:

```text
p: Esik az eső.
q: Fúj a szél.
p ∧ q: Esik az eső és fúj a szél.
```

### Kommutativitás – felcserélhetőség

Az „és” művelet felcserélhető:

```text
p ∧ q ≡ q ∧ p
```

A kijelentések sorrendje megváltozhat, az igazságérték nem változik.

Jelölések a jegyzetben:

```text
p: kijelentés
q: kijelentés
¬p: p tagadása
1: igaz
0: hamis
```

## 3. oldal – diszjunkció és implikáció

### „Vagy” – diszjunkció

A megengedő vagy, vagyis a diszjunkció jele:

```text
p ∨ q
```

Az `p ∨ q` akkor igaz, ha legalább az egyik kijelentés igaz. Mindkettő is lehet igaz.

Példák:

- „Holnap kirándulás vagy mozizás lesz” – a hétköznapi értelmezésben többnyire kizáró választásként használjuk.
- „Péter elmegy vagy itthon marad” – a két lehetőség egymást kizárja.

### Kizáró vagy

Ha pontosan az egyik kijelentés lehet igaz, akkor kizáró vagy műveletről beszélünk. Jele:

```text
p ⊕ q
```

Ez akkor igaz, ha `p` és `q` közül pontosan az egyik igaz.

Példák a jegyzetből:

- „A Ferencváros vagy a Videoton lesz a bajnok.” Ez kizáró választásként értelmezhető, de csak akkor teljes felsorolás, ha valóban csak ez a két csapat indulhat a döntőben.
- „Péter elmegy vagy itthon marad.”

A jegyzet különbséget tesz a megengedő és a kizáró „vagy” között. A logikai jelölésben ezt érdemes mindig egyértelműsíteni: `∨` vagy `⊕`.

### Implikáció

Az implikáció jele:

```text
p → q
```

Olvasata: „ha `p`, akkor `q`”.

A jegyzet példája lényegében:

```text
p: Milliomos leszel.
q: Elveszed feleségül.
p → q: Ha milliomos leszel, elveszed feleségül.
```

Az implikáció csak abban az esetben hamis, amikor az előtag igaz, a következmény pedig hamis.

## 4. oldal – igazságtáblák és ekvivalencia

### Az implikáció igazságtáblája

Az eredeti jegyzetben az `i` az igaz, a `h` a hamis értéket jelöli.

| `p` | `q` | `p → q` |
|:---:|:---:|:---:|
| i | i | i |
| i | h | h |
| h | i | i |
| h | h | i |

### Ekvivalencia

Az ekvivalencia jele:

```text
p ↔ q
```

Olvasata: „`p` akkor és csak akkor, ha `q`”. Az ekvivalencia akkor igaz, ha a két kijelentés igazságértéke megegyezik.

| `p` | `q` | `p ↔ q` |
|:---:|:---:|:---:|
| i | i | i |
| i | h | h |
| h | i | h |
| h | h | i |

### Összetett kijelentés

A lap alján szereplő minta:

```text
p: Esik az eső.
q: Fúj a szél.
r: Esőkabátot veszünk fel.
```

Az „ha esik az eső és fúj a szél, akkor esőkabátot veszünk fel” alakja:

```text
(p ∧ q) → r
```

## 5. oldal – halmazok és komplementer

### Halmaz

A halmaz dolgok, objektumok vagy elemek jól meghatározott összessége. A halmaz elemei között nem számít a sorrend, és egy elem egy halmazban legfeljebb egyszer szerepel.

Halmaz megadása felsorolással:

```text
A = {2, 3, 5, 7}
```

Ez az egyjegyű prímszámok halmaza.

Leíró megadás példája:

```text
A = {x | x egyjegyű prímszám}
```

Részhalmaz példa:

```text
A = {a, b, c}
B = {a, b}
B ⊆ A
```

Az üres halmaz jele `∅`; nincs eleme, és minden halmaz részhalmaza:

```text
∅ ⊆ A
```

### Alaphalmaz és komplementer

Az alaphalmaz vagy univerzum jele `U`. A jegyzetben:

```text
U = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
A = {2, 4, 5, 8, 9}
B = {1, 2, 5, 6, 7}
C = {2, 4, 6, 8}
```

Az `A` komplementere az alaphalmaz azon elemeiből áll, amelyek nem elemei `A`-nak:

```text
\overline{A} = U \setminus A = {1, 3, 6, 7, 10}
```

## 6. oldal – metszet, unió és De Morgan-azonosságok

### Komplementerek

```text
\overline{B} = U \setminus B = {3, 4, 8, 9, 10}
\overline{C} = U \setminus C = {1, 3, 5, 7, 9, 10}
```

### Metszet

A metszet jele `∩`; azok az elemek tartoznak bele, amelyek mindkét halmazban benne vannak.

```text
A ∩ B = {2, 5}
A ∩ C = {2, 4, 8}
B ∩ C = {2, 6}
A ∩ B ∩ C = {2}
```

Tulajdonságok:

```text
A ∩ B = B ∩ A                         (kommutativitás)
(A ∩ B) ∩ C = A ∩ (B ∩ C)             (asszociativitás)
A ∩ A = A                             (idempotencia)
```

### Unió

Az unió jele `∪`; azok az elemek tartoznak bele, amelyek legalább az egyik halmazban benne vannak.

```text
A ∪ B = {1, 2, 4, 5, 6, 7, 8, 9}
A ∪ C = {2, 4, 5, 6, 8, 9}
B ∪ C = {1, 2, 4, 5, 6, 7, 8}
```

### De Morgan-azonosságok

```text
\overline{A \cap B} = \overline{A} \cup \overline{B}
\overline{A \cup B} = \overline{A} \cap \overline{B}
```

A konkrét halmazokkal:

```text
\overline{A \cap B} = {1, 3, 4, 6, 7, 8, 9, 10}
\overline{A} \cup \overline{B} = {1, 3, 4, 6, 7, 8, 9, 10}

\overline{A \cup B} = {3, 10}
\overline{A} \cap \overline{B} = {3, 10}
```

## 7. oldal – halmazkülönbség és De Morgan igazságtáblával

### Halmazkülönbség

Az `A \setminus B` azoknak az elemeknek a halmaza, amelyek `A`-ban benne vannak, `B`-ben viszont nincsenek.

```text
A \setminus B = {4, 8, 9}
B \setminus A = {1, 6, 7}
A \setminus C = {5, 9}
B \setminus C = {1, 5, 7}
C \setminus A = {6}
C \setminus B = {4, 8}
```

További, a lapon szereplő művelet:

```text
\overline{A \cap B} \setminus C = {1, 3, 7, 9, 10}
```

### De Morgan szabálya logikai igazságtáblával

A lap alján az alábbi összetett kijelentések szerepelnek:

```text
p ∧ q
¬(p ∧ q)
¬p
¬q
¬p ∨ ¬q
¬p ∧ ¬q
```

Az első De Morgan-azonosság:

```text
¬(p ∧ q) ↔ (¬p ∨ ¬q)
```

Igazságtábla (`i` = igaz, `h` = hamis):

| `p` | `q` | `p ∧ q` | `¬(p ∧ q)` | `¬p` | `¬q` | `¬p ∨ ¬q` | `¬p ∧ ¬q` |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| i | i | i | h | h | h | h | h |
| i | h | h | i | h | i | i | h |
| h | i | h | i | i | h | i | h |
| h | h | h | i | i | i | i | i |

Az `¬(p ∧ q)` és az `¬p ∨ ¬q` oszlopai azonosak, ezért a két kijelentés ekvivalens. A `¬p ∧ ¬q` oszlop ettől eltér; ez a másik De Morgan-azonosság megfelelő párja:

```text
¬(p ∨ q) ↔ (¬p ∧ ¬q)
```

## Ellenőrzési eredmény

### Matematikailag helyes vagy javítható részek

- Az implikáció és az ekvivalencia igazságtáblájának szabálya helyes.
- A `p ∧ q`, `p ∨ q`, `p → q` és `p ↔ q` jelölések helyesen használhatók a fenti értelemben.
- Az `A`, `B`, `C` halmazokkal számolt metszetek és a legtöbb unió helyes.
- Az oldalon szereplő `B ∪ C` felsorolása hiányosnak tűnik: helyesen `{1, 2, 4, 5, 6, 7, 8}`; az 5-ös elemnek szerepelnie kell, mert `5 ∈ B`.
- `C` komplementere az adott `U` mellett `{1, 3, 5, 7, 9, 10}`. A fényképen ez a sor hiányos vagy nehezen olvasható.
- A „vagy” hétköznapi használata kétértelmű lehet; matematikában külön kell választani a megengedő `∨` és a kizáró `⊕` jelentést.
- A „minden fiú szereti a focit” tagadása nem „egy fiú sem szereti a focit”, hanem „van olyan fiú, aki nem szereti a focit”.

### Bizonytalanul olvasható eredeti részek

- Az 1. oldal fejlécében szereplő név-/oktatói információ egy része nem olvasható biztosan.
- Az 1–3. oldalon több hétköznapi példa kézírása elmosódott; ezeknél a matematikai szabályt rögzítettem, nem egészítettem ki találomra a neveket vagy mondatokat.
- A 7. oldal tetején és alján néhány kísérőmondat nem olvasható teljes bizonyossággal, de a képletek és az igazságtábla rekonstruálhatók.

