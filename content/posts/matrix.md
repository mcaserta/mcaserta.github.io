---
title: "The Matrix Screensaver for Commodore 64"
date: 2021-05-11T12:19:00Z
tags:
  - c64
  - programming
  - software development
---

I am trying to learn some 6502 assembly and this is the result of one of my
first experiments.

Once it's loaded, the following commands are available through the keyboard:

| key | use                           |
| --- | ----------------------------- |
| `B` | binary display mode           |
| `X` | hex display mode              |
| `R` | random display mode (default) |
| `N` | increments border color       |
| `M` | increments background color   |
| `Q` | quit                          |

You can take a look at the source code in my
[C64 Playground](https://github.com/mcaserta/c64-playground) repository on
github and download the [D64 image](../c64/the-matrix.d64) for your retro
emulation enjoyment.

If you run the screensaver on the real thing and send me a video of it, you are
my hero.

Speaking of heroes, this was obviously heavily inspired by the
[xmatrix](https://www.jwz.org/xscreensaver/) screensaver by the legendary
[Jamie Zawinski](https://www.jwz.org/).
