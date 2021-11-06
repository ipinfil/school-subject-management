# school-subject-management
Školský projekt na predmet Deduktívne databázy.

Umožňuje študentom zápis predmetov pre ich vyžiadaný ročník, pričom automaticky im zapíše povinné predmety pre ich ročník. Kontroluje prerekvizity predmetov, umožňuje im označiť si ľubovoľné predmety ako absolvované, čím môžu splniť požiadavky prerekvizít. Nakoniec umožňuje spomenutý zápis predmetov.

Ukážka práce s užívateľským rozhraním:
https://user-images.githubusercontent.com/20513861/140618470-26ce3284-9ead-4d59-81b5-a57b5fe1f749.mov

# Požiadavky na beh projektu
Na beh je potrebné mať prístup k `MongoDB` databáze + `NodeJS` (odporúčam min. verziu 14) s `npm`.

# Setup projektu
1. V root adresári projektu zavolajte príkaz `npm install` na inštaláciu potrebných packagov na beh backendu projektu.
2. Následne zavolajte príkaz `npm run client-install` na inštaláciu potrebných packagov na beh frontendu projektu.
3. Upravte súbor `src/db.config.js.default`, ktorý obsahuje placeholder na adresu MongoDB servera. 
4. Následne zavolajte príkaz `npm run dev`, ktorý spustí aj backend server, aj frontend server.
5. V konzole by sa mal objaviť proces buildu frontendu a takisto notifikačné hlášky backend serveru o pripojení na databázu a začatí servovania obsahu.
6. Projekt je nakonfigurovaný tak, že backend beží na porte 8000 a frontend na porte 3400. Teda na obsluhu aplikácie vo svojom browseri zadajte adresu `localhost:3400`.
7. Pri prvom spustení aplikácie a po "prihlásení" kliknite na tlačidlo Inicializácia databázy, čo zabezpečí nahranie aktuálnych dát priamo z repozitára AISu. Tento proces môže chvíľu trvať, preto prosím sledujte Network tab vášho developerského rozhrania v prehliadači, ktorý vás informuje okrem iného o bežiacich requestoch.
8. Po inicializácií môžete pracovať s aplikáciou, keďže dáta by mali byť nahraté v databáze.
