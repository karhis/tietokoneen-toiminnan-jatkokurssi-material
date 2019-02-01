---
path: '/luku-2/4-tiedon-sijainti'
title: 'Tiedon sijainti suoritusaikana'
---

<div><lead>
Tässä aliluvussa tarkastelemme tiedon eri sijaintipaikkoja suoritusaikana. Tiedon sijainnilla on huomattava merkitys ohjelman suoritusnopeuteen.
</lead></div>

## Tiedon sijaintipaikat

Ohjelman suoritusaikana viittaama tieto voi sijaita kolmessa eri paikassa. Ensinnäkin, se voi sijaita suorittimen rekisterissä. Tuolloin se voi olla joko konekäskyssä nimetty rekisteri (esim. R3), joku oletusarvoinen sisäinen rekisteri (esim. PC tai SR) tai käskyrekisterin (IR) joku kenttä (esim. vakiokenttä tai operaatiokoodi). Käskyrekisterin kentät ovat hyvin helposti saatavilla suorittimella ja niiden lukeminen on ainakin yhtä nopeata kuin konekäskyssä viitattavien rekistereiden viittaukset. Rekistereitä on korkeintaan muutama kymmen, joten kovin moni tieto ei sinne mahdu. Lisäksi rekistereihin mahtuu vain ns. skalaarimuotoinen tieto, mikä tarkoittaa yksinkertaista korkeintaan yhden tai kahden sanan mittaista tietoa. Esimerkkejä ovat eri kokoiset kokonaisluvut ja liukuvut. Rekistereihin ei voi tallettaa esimerkiksi 1000-alkioista taulukkoa, vaan sen alkiot pitää käsitellä rekisterissä yksi kerrallaan. On tosin erikoistapauksia, joissa esim. 64 alkioisiin _vektorirekistereihin_ voi tallettaa usean data-alkion, joita kaikkia pystyy operoimaan yhdellä kertaa _vektorikäskyillä_. Emme käsittele tällaisia _vektorisuorittimia_ tällä kurssilla.

Toiseksi, tieto voi olla välimuistissa. Välimuisteja voi olla useita tasoja, joista suoritinta lähempänä olevat ovat pienempia ja nopeampia. Välimuisteja voi olla erikseen koodille ja datalle, koska näin niistä voi saada tehokkaampia. Tällöin konekäskyt haetaan omasta _käskyvälimuistista_ ja normaalit dataviitteet koetetaan löytää _datavälimuistista_. Välimuistien toimintalogiikka on täysin automaattista, eikä siihen voi mitenkään vaikuttaa suoritusaikana.

Kolmanneksi, tieto voi olla muistissa. Kaikki tieto mahtuu tänne, mutta välttämättä kaikki ohjelman tarvitsema tieto ei silti ole aina paikalla. Pääosa ohjelman käyttämästä tiedosta on muistissa, josta se haetaan tarvittaessa rekistereihin ja välimuistiin. Usein välimuistiin haetaan tietoa myös spekulatiivisesti arvaamalla, että kohta tuotakin tietoa varmaan käytetään. Esimerkiksi, kun viittaat taulukon ensimmäiseen alkioon, niin siinä yhteydessä välimuistiin voidaan hakea saman taulukon toinen, kolmas ja neljäskin alkio.

Suoritusaikainen tieto ei voi olla massamuistissa, koska tiedon hakemiseen sieltä kuluu liikaa aikaa. Jos ohjelma haluaa viitata massamuistissa olevaan tietoon, ohjelman suoritus keskeytetään ja tarvittava tieto kopioidaan muistiin. Tämän jälkeen suoritus voi jatkua, mutta nyt viitattu tieto löytyykin muistista. Tiedon siirron aikana suoritin suorittaa muita ohjelmia.

## Eri paikoissa olevaan tietoon viittaaminen
Suorittimen normaalissa rekisterissä olevaan tietoon viitataan konekäskyissä nimeämällä kyseinen rekisteri. Samoin käskyrekisterissä (IR) olevaan vakioon tai osoitteeseen viittaaminen on nopeata, koska tieto on jo valmiiksi suorittimella. Sama pätee paikanlaskuriin (PC) viittaamiseen. Molemmat rekisterit löytyvät suorittimen kontrolliyksiköstä ja IR:n eri kentät ovat siellä valmiiksi eroteltu lukemista varten. PC:n arvoa pitää joissakin konekielissä pystyä lukemaan myös konekäskyn suorituksen aikana, koska hyppy- tai haarautumiskäskyn osoite olla määriteltynä suhteellisena osoitteena PC:n suhteen. Nämä ovat nopeimmat tavat viitata tietoon.

Välimuistissa olevaan tietoon ei voi suoraan viitata, koska suoritusaikana ei voi tietää, löytyykö tieto välimuistista vai ei. Muistissa olevaan tietoon viitatessa aina tarkistetaan ensin, josko tieto löytyisikin välimuistista. Jos se löytyy, niin hyvä niin ja tieto on nopeasti saatavilla. Ohjelmakoodissa voi lisätä todennäköisyyttä tiedon löytymiseen välimuistista, jos koodin kirjoittaja ymmärtää välimuistin toimintapaa. Välimuistit pyrkivät pitämään saatavilla viime aikoina viitattuja ja niiden lähellä olevia muistialueita. Hyvä koodaaja pystyy hyödyntämään tätä tietoa ohjelman toiminnnan nopeuttamiseksi.

Muistissa olevaan tietoon viitataan käyttäen suorittimen ymmärtämiä muistinosoitusmuotoja, joista suora (indeksoitu) muistiviite on yleisimmin käytetty. Epäsuoria muistiviitteitä ei nykyään useinkaan enää käytetä, koska ne kestävät niin kauan aikaa. Sen sijaan epäsuorat muistiviitteet toteutetaan yleensä kahdella suoraa muistinosoitusta käyttävällä konekäskyllä, joista ensimmäinen hakee tiedon osoitteen muistista ja toinen sitten käyttää tätä osoitetta tiedon lukemiseen tai kirjoittamiseen.

```
ptrX dc 453828            -- symbolin ptrX arvo on (osoitin)muuttujan ptrX osoite
                             (osoitin)muuttujan ptrX arvo on muistissa olevan tiedon osoite
Tbl  ds 200               -- symbolin Tbl arvo on 200-alkioisen taulukon ensimmäisen alkion osoite

    load  r1, =80         -- r1 on rekisterissä, nro 80 on IR:n vakio-osassa
    load  r2, Tbl(r5)     -- Tbl(r5) on suora muistinosoitusviite keskusmuistiin, osoite 280,
                             Luku 200 löytyy IR:n vakio-osasta, luku 80 rekisteristä r1
    add   r5, =1          -- nro 1 löytyy IR:n vakio-osasta
    load  r3, Tbl(r5)     -- alkio Tbl(r5) osoitteesta 281 löytyisi luultavasti välimuistista,
                             koska sen viereiseen alkioon osoitteessa 280 viitattiin juuri äsken
    load r2, @ptrX        -- epäsuora muistiviite, ptrX arvo löytyy IR:n vakio-osasta,
                             tiedon osoite 453828 löytyy muistista (osoitteesta ptrX),
                             tieto löytyy muistista ptrX:n osoittamasta osoitteesta 453828
```


## Tiedon sijainnin vaikutus suoritusnopeuteen
Yleisesti ottaen kaikki tieto sijaitsee muistissa ja juuri nyt käsiteltävänä oleva tieto sijaitsee suorittimen rekistereissä. Tästä on se seuraus, että jokin tietty tieto (esim. muuttujan X arvo) voi sijaita sekä muistissa että rekisterissä. On ohjelmoijan vastuulla, että X:n arvon muuttuessa se tarvittaessa talletetaan myös muistiin. Muistissa sijaitseva tieto voi olla myös välimuistissa, mutta laitteisto huolehtii automaattisesti sen kirjoittamisesta muistiin tarvittaessa.

Korkean tason kieliä käytettäessä kääntäjä päättää, milloin jokin tieto pidetään missäkin rekisterissä. Se on itse asiassa hyvin vaikea ns. [rekistereiden allokointiongelma](https://en.wikipedia.org/wiki/Register_allocation), koska rekistereitä on hyvin vähän ja kuitenkin kaikki laskenta tapahtuu rekistereissä olevan tiedon varassa.

Esimerkiksi, kaikkialla näkyvän laskuri Count olisi hyvä pitää rekisterissä silmukan koko suoritusajan, jos Count'iin viitataan vähän väliä. Jos ohjelman suorituksessa on sitten pitkä tauko, jolloin Count'iin ei tule lainkaan viittauksia, niin silloin sen arvoa ei kannata pitää rekisterissä. Ohjelmakoodissa tiedon sijainti näkyy siinä, että viitataaanko suoraan rekisteriin vai haetaanko tieto ensin johonkin rekisteriin muistista.
```-- Count rekisterissä r1, Limit rekisterissä r2
    add  r1, =1       -- lisää muuntelumuuttujaa
    comp r1, r2       -- testaa loopin loppuminen
    jless loop

vai

-- Count ja Limit molemmat muistissa
    load r4, Count    -- lisää muuntelumuuttujaa
    add r4, =1
    store r4, Count
    load r3, Count    -- testaa loopin loppuminen
    comp r3, Limit
    jless loop
```

Toinen esimerkki. For-silmukan muuntelumuuttuja kannattaa ehkä pitää rekisterissä silmukan suoritusajan ja sitten lopulta tallettaa muistiin. Toisaalta taas, joissakin korkean tason kielissä muuntelumuuttujan arvoa ei ole määritelty silmukan päättyessä, joten sitä ei tarvitse tallettaa muistiin missään vaiheessa. Kyseinen muuntelumuuttujalla on tuolloin olemassa arvo vain silmukan suoritusaikana ja tällöinkin vain jossain rekisterissä.
```
      load  r1, =0    -- alusta muuntelumuuttuja i (r1:ssä)

loop  comp  r1, =50   -- testaa loopin loppuminen
      jnles done

      ...             -- itse for-silmukan runko

      add   r1, =1    -- i:n lisäys ja paluu silmukkaan
      jump  loop

done  store  r1, i    -- talleta i:n loppuarvo (jos ohjelmointikielen semantiikka vaatii)
```

On siis tapauksia, joissa ohjelmassa nimetty tieto ei sijaitse missään tällä hetkellä. Äsken mainittu silmukan muuntelumuuttujan lisäksi tällaisia tietoja ovat aliohjelmien paikalliset muuttujat ja muut tietorakenteet, jotka varataan muistista vasta aliohjelmaa kutsuttaessa ja vapautetaan aliohjelmista poistuttaessa.

Käskyrekisterin (IR) vakio-osan suhteen kääntäjällä on kaksi mahdollisuutta. Sinne laitettava tieto (esim. vakio N=1000) voidaan replikoida jokaiseen konekäskyyn, joka käyttää kyseistä vakiota. Toinen vaihtoehto on tallettaa vakio muistiin ja laittaa jokaiseen siihen viittaaviin konekäskyyn vakion osoite muistissa. Molemmilla lähestymistavoilla on etunsa ja haittansa. Konekäskyssä oleva vakiolla voi olla koko- tai tyyppirajoitus, mutta sen käyttö on nopeata. Muistissa olevaan vakioon on hitaampi viitata, mutta sitä voi tarvittaessa muokata.

Välimuistin käyttö on tuuripeliä, mutta siihen voi vaikuttaa. On aina tehokkaampaa käydä läpi mitä tahansa suurempaa tietomassaa samassa järjestyksessä kuin se on talletettu muistiin. Ohjelmakoodin tasolla tämä tarkoittaa hyppyjen ja haarautumisten välttämistä, mikä ei käytännössä ole lainkaan helppoa. Datan osalta se tarkoittaa, että esimerkiksi 2-ulotteisia taulukoita voi olla parempi käydä läpi riveittäin kuin sarakettain. Usein ohjelmalogiikka valitettavasti vaatii tiedon läpikäyntiä välimuistin kannalta "tehottomassa" järjestyksessä.

-- Quiz 2.4.1-10 Väitteet tiedon sijainnin vaikutuksesta suoritusnopeuteen
<div><quiznator id="5c503c5fc41ed4148d96ac32"></quiznator></div>
<div><quiznator id="5c503cb3ddb6b814af3216b0"></quiznator></div>
<div><quiznator id="5c503d25ddb6b814af3216b1"></quiznator></div>
<div><quiznator id="5c503dba99236814c5bb83e3"></quiznator></div>
<div><quiznator id="5c503e8e99236814c5bb83e8"></quiznator></div>
<div><quiznator id="5c503f07017ffc13eddc9871"></quiznator></div>
<div><quiznator id="5c504a41c41ed4148d96ac79"></quiznator></div>
<div><quiznator id="5c504b1499236814c5bb842e"></quiznator></div>
<div><quiznator id="5c504b79c41ed4148d96ac81"></quiznator></div>
<div><quiznator id="5c504bdcddb6b814af321701"></quiznator></div>


<div>
  <part-summary chapter="2" heading="Käytyäsi nyt läpi luvun 2 sinun pitäisi osata karkealla tasolla selittää,"
listitems='[
  {"content":"Miksi rekistereitä on niin vähän? "},
  {"content":"Mitä konekäskyssä viitattavia rekistereitä ttk-91:ssä on? "},
  {"content":"Mikä on ALU:n tehtävä suorittimella? "},
  {"content":"Mikä on kontrolliyksikön tehtävä suorittimella? Mitä rekistereitä siinä on? "},
  {"content":"Miksi välimuisti on olemassa ja mitä hyötyä siitä on? "},
  {"content":"Minkä ongelman käskyjen nouto- ja suoritussykli ratkaisee? "},
  {"content":"Mitä tapahtuu käskyn nouto- ja suoritussyklin eri vaiheissa? "},
  {"content":"Missä kaikkialla tapahtuu muistiviitteitä käskyjen nouto- ja suoritussyklissä? "},
  {"content":"Miten on toteutettu muistin suojaus siten, että suoritettava ohjelma ei pääse sotkemaan muiden ohjelmien tai käyttöjärjestelmän tietoja? "},
  {"content":"Minkä tyyppisiä konekäskyjä on olemassa? "},
  {"content":"Moneenko eri tietoon yhdessä konekäskyssä voi viitata? "},
  {"content":"Miten aritmeettiset lausekkeet toteutetaan konekielellä? "},
  {"content":"Miten for-silmukka toteutetaan konekielellä? "},
  {"content":"Miten käyttöjärjestelmäpalvelun kutsu toteutetaan konekielellä? "},
  {"content":"Mitä hyötyä on etuoikeutetusta suoritustilasta? "},
  {"content":"Miten etuoikeutettuun suoritustilaan pääsee ja miten sieltä pääsee pois? "},
  {"content":"Miksi keskeytyksiä tarvitaan ja minkälaisia keskeytyksiä on olemassa? "},
  {"content":"Miten keskeytykset käsitellään käskyjen nouto- ja suoritussyklissä? "},
  {"content":"Miten keskeytykset käsitellään käyttöjärjestelmän tasolla? "},
  {"content":"Mitä tapahtuu, jos tulee jokin yllättävä keskeytys? "},
  {"content":"Missä kaikkialla tieto voi sijaita yhden konekäskyn suorituksen aikana? "},
  {"content":"Kuka päättää, missä konekäskyssä viitattava tieto sijaitsee? "},
  {"content":"Miksi konekäskyssä viitattava tieto ei voi sijaita massamuistissa tai verkossa? "}
    ]'>
  </part-summary>
</div>