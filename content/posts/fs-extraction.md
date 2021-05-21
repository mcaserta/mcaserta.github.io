---
title: "🇺🇸 How to extract a filesystem from a disk image"
date: 2009-04-18T17:10:00Z
toc: true
tags:
 - linux
 - unix
 - sysadm
categories:
 - system administration
draft: false
type: post
---

You need to backup an entire hard disk to a single file. Supposing your disk is
at `/dev/hda` and the backup file is `image-file`, you’d do:

```bash
# cat /dev/hda > image-file
```

or

```bash
# dd if=/dev/hda of=image-file
```

The file backup you get will hold a copy of every single bit from the hard
disk. This means that you also have a copy of the MBR in the first 512 bytes of
the file.

Because of this, you can see the partition table on the backup file:

```bash
# sfdisk -l -uS image-file
Disk image-file: 0 cylinders, 0 heads, 0 sectors/track
Warning: The partition table looks like it was made
for C/H/S=*/255/32 (instead of 0/0/0).
For this listing I'll assume that geometry.
Units = sectors of 512 bytes, counting from 0
Device Boot Start End #sectors Id System
image-filep1 32 261119 261088 83 Linux
image-filep2 261120 4267679 4006560 82 Linux swap / Solaris
image-filep3 4267680 142253279 137985600 83 Linux
image-filep4 0 - 0 0 Empty
```

Suppose you want to extract partition number 3. You can see that it starts
at block 4267680 and is 137985600 blocks long. This translates to:

```bash
# dd if=image-file of=partition3-file skip=4267680 count=137985600
```

Peeking into the contents of the partition is as easy as:

```bash
# mount -t ext3 -o loop partition3-file /mnt/hack
```

Also, you can avoid using dd to extract the partition file by passing the `offset`
option to mount.
