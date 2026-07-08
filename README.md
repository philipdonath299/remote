# LG webOS Remote Web App

En modern, premium 100% klientbaserad webbapp-fjärrkontroll (PWA) för LG webOS TV byggd med Next.js, Tailwind CSS och Zustand.

## Funktioner
- **PWA (Progressive Web App):** Installera direkt på startskärmen (iPhone/Android).
- **Ingen Server/Bridge Krävs:** Appen ansluter direkt via WebSocket från din webbläsare till TV:n.
- **Premium Design:** OLED Black-tema med glaseffekter inspirerat av Apple och Sonos.
- **D-Pad & Touchpad:** Styr menyer och muspekare (Magic Remote).
- **Snabbstart:** Öppna Netflix, YouTube m.fl. med ett knapptryck.
- **Auto-reconnect:** Kommer automatiskt ihåg din TV och Client Key.

## Begränsningar

Eftersom detta är en ren webbapp (PWA) som körs i webbläsaren finns det vissa nätverksbegränsningar jämfört med en Native App:
1. **Samma Nätverk:** Din telefon/dator och TV måste vara anslutna till samma lokala Wi-Fi.
2. **Wake-on-LAN:** Webbläsare har inte stöd för att skicka UDP "Magic Packets". Det betyder att appen inte kan "väcka" en helt avstängd TV över nätverket på egen hand. TV:n måste antingen vara på, eller ha nätverks-standby aktiverat på ett sätt som tillåter WebSocket-uppkoppling.
3. **Mixed Content (Vercel):** Om du hostar på Vercel (`https://`) måste din LG TV stödja säker WebSocket (`wss://` på port 3001), annars kan moderna webbläsare blockera anslutningen pga Mixed Content. Appen försöker i första hand använda `wss://` och faller tillbaka till `ws://`.

## Installation (Lokalt)

1. Klona/kopiera repot.
2. Kör `npm install`.
3. Kör `npm run dev`.
4. Öppna `http://localhost:3000` i webbläsaren.

## Parkoppling
1. Första gången du anger din TV:s IP-adress och klickar anslut kommer TV:n att visa en prompt: **"En ny enhet vill ansluta"**.
2. Godkänn detta på TV:n (med den vanliga fjärrkontrollen).
3. Appen sparar sedan automatiskt en godkänd "Client Key" och kopplar upp direkt i framtiden.

## Deployment (Vercel)
Projektet är byggt i Next.js 15 med "App Router" och kan rullas ut till Vercel direkt (inga miljövariabler krävs då all state är lokal i klienten).
Mata bara in ditt repo i Vercel-dashboarden och klicka "Deploy".
