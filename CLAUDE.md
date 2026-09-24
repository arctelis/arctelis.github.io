# CLAUDE.md — kalkulator nadpłaty kredytu

## Kontekst

To jest projekt do nauki, nie produkt. Pracuję z Jakubem, który zna finanse na wylot (matematykę kredytową, Excel), zna podstawy Pythona i HTML/CSS, ale nie zna JavaScriptu, TypeScriptu ani Reacta i nigdy nie postawił aplikacji webowej od zera do deployu.

Celem jest, żeby po tym projekcie Jakub rozumiał każdy plik w repo, a nie tylko miał działającą aplikację.

Pełny plan: `plan.md`. Pracujemy krok po kroku według niego.

## Język

- Rozmawiasz ze mną po polsku.
- Kod, nazwy zmiennych, funkcji, plików i commity — po angielsku.
- Teksty w interfejsie aplikacji — po polsku.

## Zasady pracy

1. Jeden krok z `plan.md` na raz. Nie wybiegaj do przodu, nawet jeśli następny krok wydaje się oczywisty.
2. Zanim napiszesz kod, opisz w 3–5 zdaniach, co zamierzasz zrobić i dlaczego tak. Poczekaj na moje „ok”.
3. Po napisaniu kodu wytłumacz każdą nową koncepcję JS/TS/React, która się pojawiła (np. `const` vs `let`, typy, `map`, komponent, `useState`, props). Nie tłumacz linijek oczywistych ani finansów — finanse znam lepiej niż Ty.
4. Gdzie to naturalne, porównuj do Pythona (np. `array.map()` ≈ list comprehension, `interface` ≈ dataclass z typami).
5. Na koniec każdego kroku zadaj mi 2–3 pytania sprawdzające zrozumienie (np. „co by się stało, gdyby usunąć tę linijkę?”) i poczekaj na odpowiedzi, zanim pójdziemy dalej. Jeśli odpowiem źle — wytłumacz jeszcze raz, inaczej.
6. Małe zmiany. Wolę 5 małych kroków, które rozumiem, niż jeden duży, który działa.
7. Nie instaluj żadnej paczki bez pytania. Powiedz, co to jest i po co.
8. Nie dodawaj funkcji spoza zakresu (lista „Poza zakresem” w `plan.md`). Jeśli masz pomysł — dopisz go do `IDEAS.md` i wróć do zadania.
9. Nigdy nie zmieniaj testów po to, żeby przeszły. Jeśli test nie przechodzi, najpierw ustal, czy błąd jest w kodzie, czy w teście, i zapytaj mnie.
10. Po każdym kroku: uruchom `npm run test` i `npm run build`, pokaż wynik, zaproponuj commit message. Commit robię ja.

## Konwencje kodu

- TypeScript w trybie `strict`. Żadnego `any`.
- Logika finansowa wyłącznie w `src/lib/`. Komponenty Reacta tylko wyświetlają i zbierają dane — żadnych obliczeń w komponentach.
- Funkcje w `src/lib/` są czyste: te same dane wejściowe → ten sam wynik, zero efektów ubocznych.
- Kwoty liczone w pełnej precyzji (`number`), zaokrąglane tylko przy wyświetlaniu.
- Formatowanie kwot: `Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' })`.
- Komponenty funkcyjne, jeden komponent na plik.

## Komendy

- `npm run dev` — serwer deweloperski
- `npm run test` — testy (Vitest)
- `npm run build` — build produkcyjny

## Środowisko

- Node.js i `gh` są zainstalowane w `~/.local/opt` (bez Homebrew), PATH ustawiony w `~/.zshrc`.
- Deploy: GitHub Pages, repo typu `<login>.github.io` (strona pod główną domeną, więc `base: '/'` w Vite).
