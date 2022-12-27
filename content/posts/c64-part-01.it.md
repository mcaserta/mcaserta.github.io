---
title: "🇮🇹 Introduzione al Commodore 64, parte 1"
date: 2021-05-03T12:19:00Z
toc: true
tags:
  - c64
  - programming
  - software development
categories:
  - software development
draft: true
type: post
---

# Il Commodore 64

Il primo computer che molte persone della mia età hanno potuto permettersi di
avere a casa è stato il Commodore 64.

La prima cosa che un utente C64 vedeva dopo aver collegato il computer alla tv
ed averlo acceso era questa schermata.

![READY](/images/posts/c64-ready.png)

L'interprete basic ci informa di essere pronto ad accettare i comandi.

Puoi seguire e riprodurre facilmente tutti gli esempi usando un emulatore. Ad
esempio [VICE](https://vice-emu.sourceforge.io/) funziona molto bene su tutti i
sistemi operativi.

Alcune funzionalità del C64 sono disponibili tramite accesso diretto alla
memoria. In altre parole, conoscendo l'indirizzo in memoria della funzionalità e
il tipo di valore che possiamo inserire in quella posizione, possiamo modificare
in maniera diretta e immediata la funzionalità.

Ad esempio, all'indirizzo `$d020` (valori preceduti da un dollaro indicano una
rappresantazione esadecimale), corrispondente a `53280` in decimale, c'è il
registro del colore del bordo dello schermo.

Facendo riferimento alla
[tabella dei colori](https://www.c64-wiki.com/wiki/Color) del C64, usiamo il
comando `POKE` e andiamo a scrivere il valore `0` (che corrisponde al nero)
nella locazione di memoria `53280`:

```basic
POKE 53280, 0
```

![bordo nero](/images/posts/c64-border.png)

Come avrai intuito, la sintassi del comando `POKE` è:
`POKE <INDIRIZZO>, <VALORE>`.

All'indirizzo `$d021`, ovvero `53281` in decimale, abbiamo il colore dello
sfondo. Proviamo a cambiare anche questo in nero:

```basic
POKE 53281, 0
```

![sfondo nero](/images/posts/c64-background.png)

Alla locazione `$0268`, ovvero 646 in decimale, c'è il colore dei caratteri.
Cambiamolo in verde con il valore `5`:

```basic
POKE 646, 5
```

![hacker mode](/images/posts/c64-hacker.png)

Prima di proseguire facciamo un soft reset dell'emulatore tramite il comando nel
menu File.

![soft reset](/images/posts/c64-soft-reset.png)

# Giochiamo con la CPU

Il microprocessore del C64 è il
[MOS 6510](https://en.wikipedia.org/wiki/MOS_Technology_6510). Il 6510 usa lo
stesso set di istruzioni del 6502, il chip usato ad esempio
nell'[Apple II](https://en.wikipedia.org/wiki/Apple_II).

È possibile programmare il 6510 attraverso un set d'istruzioni e i registri.
Parliamo prima dei registri che useremo nei prossimi esempi:

| sigla | dimensione | significato     | descrizione                                                                |
| ----- | ---------- | --------------- | -------------------------------------------------------------------------- |
| `PC`  | 2 byte     | Program Counter | contiene l'indirizzo di memoria della prossima istruzione da eseguire      |
| `A`   | 1 byte     | Accumulator     | è un registro generico che funziona principalmente da accumulatore         |
| `X`   | 1 byte     |                 | è un registro generico e può essere usato anche per indirizzare la memoria |
| `Y`   | 1 byte     |                 | come il registro `X` ma si chiama `Y`                                      |

Questo elenco non è esaustivo ma per il momento è sufficiente per i nostri
scopi.

Attiviamo il monitor del VICE tramite la voce di menu sotto File.

![activate monitor](/images/posts/c64-activate-monitor.png)

La finestra del monitor si apre, bloccando temporaneamente l'esecuzione
dell'emulatore.

![activate monitor](/images/posts/c64-monitor-pc.png)

Il monitor ci sta dicendo che il registro `C` (counter, abbreviazione di `PC`)
sta puntando all'indirizzo `$e5d4`.

Possiamo farci stampare il contenuto di tutti i registri tramite il comando `r`.

![activate monitor](/images/posts/c64-monitor-registers.png)

Il monitor ci dice che il program counter (`ADDR`) sta puntando a `$e5d4`, come
ci aveva appena indicato nel prompt. I registri `A` e `X` contengono il valore
`00` ed il registro `Y` contiene il valore `0a`.

Se i tuoi valori sono diversi è normale. Anche quando il computer emulato sembra
essere fermo e vedi il cursore lampeggiare, fino al momento prima di entrare nel
monitor ed effettivamente fermare l'emulazione, il contenuto dei registri cambia
continuamente. Di certo il program counter gira come una trottola perché
normalmente il processore esegue un loop per gestire tutta una serie di eventi,
come la pressione di un tasto.

```
a $c000 lda #$00
sta $d020
sta $d021
lda #$05
sta $0286
jmp $a714
```
