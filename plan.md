# Plan — kalkulator nadpłaty kredytu

## Cel aplikacji

Użytkownik wpisuje parametry kredytu i planowane nadpłaty, a aplikacja pokazuje, ile zaoszczędzi na odsetkach i o ile skróci się kredyt (albo spadnie rata) — w porównaniu z wariantem bez nadpłat.

## Zakres (wersja 1)

**Dane wejściowe**
- kwota kredytu (kapitał do spłaty)
- oprocentowanie roczne (stałe przez cały okres)
- okres kredytu w miesiącach
- rodzaj rat: równe (annuitetowe) lub malejące
- nadpłaty:
  - jednorazowe (miesiąc + kwota), dowolnie wiele
  - cykliczne (stała kwota co miesiąc, od miesiąca X)
- efekt nadpłaty: skrócenie okresu **albo** zmniejszenie raty

**Wyniki**
- podsumowanie: suma odsetek bez nadpłat vs z nadpłatami, oszczędność, liczba miesięcy krócej, nowa rata
- harmonogram spłat (tabela: miesiąc, rata, część kapitałowa, część odsetkowa, nadpłata, saldo)

**Technicznie**
- Vite + React + TypeScript (strict) + Vitest
- deploy automatyczny na GitHub Pages (`<login>.github.io`) przez GitHub Actions po każdym pushu na `main`

## Założenia obliczeniowe

- Odsetki miesięczne = saldo × (oprocentowanie roczne / 12). Uproszczenie 30/360; banki często liczą dniami (ACT/365).
- Nadpłata w danym miesiącu wpływa zaraz po racie z tego miesiąca; odsetki od niej naliczają się już od następnego.
- „Niższa rata”: po każdej nadpłacie rata (albo część kapitałowa przy ratach malejących) jest liczona od nowa na pozostałą liczbę miesięcy.
- Nadpłata większa niż saldo jest przycinana do salda i kończy kredyt.

## Poza zakresem

- zmienne oprocentowanie / zmiany WIBOR/WIRON w trakcie
- prowizje za wcześniejszą spłatę, ubezpieczenia, RRSO
- wykresy
- zapisywanie danych (konto, baza, localStorage), backend
- eksport do PDF/Excel
- wiele walut, inne języki interfejsu
- porównywanie kilku kredytów naraz

Pomysły spoza zakresu lądują w `IDEAS.md`.

## Kroki

Każdy krok kończy się: `npm run test` + `npm run build` + pytania sprawdzające + commit.

### Etap 0 — środowisko
0. ✅ **Narzędzia i repo** — Node.js, `gh`, git, repozytorium `<login>.github.io` na GitHubie, pliki `CLAUDE.md`, `plan.md`, `IDEAS.md`. *(zrobione przez Claude'a na starcie)*

### Etap 1 — szkielet i deploy („hello world” w internecie)
1. ✅ **Szkielet Vite + React + TS** — wygenerowanie projektu, przejście plik po pliku (`package.json`, `index.html`, `main.tsx`, `App.tsx`, `tsconfig`), `npm run dev`.
2. ✅ **Sprzątanie** — usunięcie demo z szablonu, własny `App.tsx` z nagłówkiem po polsku.
3. ✅ **Deploy na GitHub Pages** — workflow GitHub Actions, pierwszy publiczny URL. Od teraz każdy push = nowa wersja online.
4. ✅ **Vitest** — instalacja, skrypt `npm run test`, pierwszy trywialny test, żeby zobaczyć czerwone → zielone.

### Etap 2 — logika finansowa w `src/lib/` (bez UI, same testy)
5. ✅ **Typy danych** — `interface` dla parametrów kredytu, wiersza harmonogramu, nadpłaty.
6. ✅ **Rata annuitetowa** — funkcja liczenia raty + testy z wartościami z Excela (`PMT`).
7. ✅ **Harmonogram rat równych** — pełna tabela bez nadpłat, testy (saldo końcowe = 0, suma kapitału = kwota kredytu).
8. ✅ **Harmonogram rat malejących** — analogicznie.
9. ✅ **Nadpłata jednorazowa** — oba warianty: skrócenie okresu / niższa rata.
10. ✅ **Nadpłaty cykliczne** — połączenie z jednorazowymi.
11. ✅ **Podsumowanie** — funkcja porównująca harmonogram z nadpłatami i bez (oszczędność odsetek, miesiące krócej).
12. ✅ **Formatowanie** — `formatPLN`, formatowanie procentów, testy.

### Etap 3 — interfejs (React)
13. ✅ **Formularz parametrów kredytu** — pierwszy komponent, `useState`, kontrolowane inputy.
14. ✅ **Lista nadpłat** — dodawanie/usuwanie nadpłat jednorazowych, pole nadpłaty cyklicznej.
15. **Podsumowanie wyników** — komponent przyjmujący dane przez props.
16. **Tabela harmonogramu** — renderowanie listy przez `map`, klucze (`key`).
17. **Walidacja** — błędne/puste dane, komunikaty po polsku, logika walidacji w `src/lib/`.

### Etap 4 — wykończenie
18. **Style i widok mobilny** — CSS, czytelność na telefonie.
19. **README** — opis projektu, jak uruchomić, link do aplikacji.
20. **Przegląd końcowy** — Jakub tłumaczy Claude'owi każdy plik w repo; co niejasne — wracamy.
