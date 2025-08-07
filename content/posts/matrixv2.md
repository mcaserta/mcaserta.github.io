---
title: "The Matrix Screensaver for Commodore 64, version 2"
date: 2021-05-20T12:19:00Z
tags:
  - c64
  - programming
  - software development
---

After trying to implement the
[digital rain](https://en.wikipedia.org/wiki/Matrix_digital_rain) algorithm in
6502 assembly and [failing miserably](matrix.html), I decided to try the
[cc65](https://cc65.github.io/) toolkit and write some C code.

Once it's loaded, the following commands are available through the keyboard:

| key | use                         |
| --- | --------------------------- |
| `A` | amber mode                  |
| `B` | binary mode                 |
| `D` | dna mode                    |
| `F` | full charset mode (default) |
| `G` | green mode (default)        |
| `H` | hex mode                    |
| `L` | lgbtq mode                  |
| `Q` | quit                        |

You can take a look at the source code in my
[C64 Playground](https://github.com/mcaserta/c64-playground) repository on
github and download the [prg image](../c64/matrix.prg) for your retro emulation
enjoyment.

If you run the screensaver on the real thing and send me a video of it, you are
my hero.

Speaking of heroes, this was obviously heavily inspired by the
[xmatrix](https://www.jwz.org/xscreensaver/) screensaver by the legendary
[Jamie Zawinski](https://www.jwz.org/).

## Update 20210524

Here's a video of the software running on a real C64, courtesy Jordan McGee.

<iframe width="560" height="315" src="https://www.youtube.com/embed/P01GWeBhYPc" title="Screensaver running on a real C64" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Update 20211029

Here's another video of the software running on a real C64, courtesy my friend
Marco.

<iframe width="560" height="315" src="https://www.youtube.com/embed/O93npyzDnUU" title="Screensaver running on a real C64" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
