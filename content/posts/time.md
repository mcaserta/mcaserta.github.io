---
title: "🇺🇸 An Introduction to Time Representation, Serialization and Management in Software"
date: 2013-04-15T14:19:00Z
toc: true
tags:
 - time
 - software development
categories:
 - software development
draft: false
type: post
---

Most issues in software development usually arise from poor,
inconsistent knowledge of the domain at hand. A topic apparently as
simple as time representation, serialization and management can easily
cause a number of problems both to the neophyte and to the experienced
programmer.

In this post, we'll see that there's no need to be a 
[Time Lord](http://en.wikipedia.org/wiki/Time_Lord) to grasp the
very simple few concepts needed not to incur into time management hell.

![Time doesn't exist. Clocks exist.](/images/posts/time.jpg)

## Representation

A question as simple as *"What time is it?"* assumes a number of
contextual subleties that are obvious to the human brain, but become
absolute nonsense for a computer.

For instance, if you were asking to me what time is it right now, I
might say: *"It's 3:39"* and, if you were a colleague in my office,
that'd be enough information to infer that it's 3:39pm CEST. That's
because you would already be in possession of some bits of important
contextual information such as 

* it's an afternoon because we've already had lunch
* we're in Rome, therefore our timezone is Central European Time (CET)
  or Central European Summer Time (CEST)
* we've switched to daylight savings time a few weeks earlier, so the
  current timezone must be Central European Summer Time

*3:39* only happens to be a convenient representation of time as long as
we're in possession of the contextual bits.  In order to represent time
in an universal way, you should have an idea what
[UTC](http://en.wikipedia.org/wiki/Coordinated_Universal_Time) and
[timezones](http://en.wikipedia.org/wiki/Time_zone) are. 

Please do not confuse UTC with GMT: although their time matches, they are *two
different things*: one is an universal standard while the other is a timezone.
When someone says they're using GMT, unless that person has a funny scottish
accent, what they really mean is UTC.

As an amateur radio operator, I have contacts with people from all over the
world. Every operator is required to keep a log of his contacts and we usually
exchange so called QSL cards, which are a written confirmation of the contact.
Of course a QSL card must report the exact time of the radio contact and by
convention it's in UTC. I know that when I receive a QSL card from any fellow
amateur radio operator, no matter where he is located across the whole wide
world, I can look up the contact in my logbook and the date and time info is
going to match, as we are both adhering to the same standard: UTC.

Now, suppose I have to schedule a skype chat with a fellow software
developer in the US. I could write him an email and say something along
the lines of *"see you on 2/3"*. In Italy, that would be the second day
in the month of march, but to an US person, that would be the third day
in the month of february. As you can see, how our chat is never going to
happen.

These are only a few examples of the kind of issues that might arise
when representing date and time information. Luckily enough, there is a
solution to the representation conundrums, namely the 
[ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) standard.

Just to give you an example, in ISO 8601, `1994-11-05T08:15:30-05:00`
corresponds to November 5, 1994, 8:15:30 am, US Eastern Standard Time.
`1994-11-05T13:15:30Z` corresponds to the same instant (the `Z` stands
for UTC). Same instant, different representations.

The ISO 8601 standard also has the nice side effect of providing natural
sorting in systems that use lexicographical order (such as filesystems)
because information is organized from most to least significant, i.e.
year, month, day, hour, minute, second, fraction of a second.

Even if you're only dealing with local times in your software, you
should know that, unless you also display the time zone, you can never
be sure of the time. I cannot remember how many times a developer has
asked me to *fix the time* on the server, only to discover that his
software was printing time in UTC.

At display time, it is okay to deal with partial representation of time
because the user experience requires so. Just make sure, when debugging,
to print out the whole set of information, including the time zone,
otherwise you can never be sure what you're looking at is what you
actually think it is.

Although a given moment in time is immutable, there is an arbitrary
number of ways to express it. And we've not even talked about the Julian or
Indian calendars or stuff like expressing durations!

Let me summarize a few key points to bring home so far:

* get to know [time zones](http://en.wikipedia.org/wiki/Time_zone) and
  [UTC](http://en.wikipedia.org/wiki/Coordinated_Universal_Time)
* do not confuse UTC and GMT
* [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) is your friend
* always print the time zone while debugging

![Back to the future clock](/images/posts/bttf-clock.png)

## Serialization

Speaking of software, serialization is a process where you take an object's
status and spell it out in such a way that it can be later entirely rebuilt,
exactly like the original, by using the spelt out (serialized) information.
Think of an xml or json file:

```json
{
  "person": {
    "name": "Mirko",
    "surname": "Caserta",
    "class": "nerd"
  }
}
```

This is the serialized form of a peculiar imaginary person class instance.

In the binary world of computers, time is usually serialized and stored
by using the [Unix time](http://en.wikipedia.org/wiki/Unix_time)
convention. As I'm writing this, my Unix time is `1366191727`. That
is: `1366191727` seconds have passed since January 1st, 1970 at 00:00
UTC. Isn't that a pretty clever, consistent and compact way of
representing a plethora of information, such as `April 17 2013 @
11:42:07am CEST`?

Unix time is only another arbitrary representation of a given moment in time,
although a not very human readable one. But you can take that number, write it
on a piece of paper, stick it onto a carrier pigeon, and your recipient would
be able to decipher your vital message by simply turning to the Internet and
visiting a site such as [unixtimestamp.com](http://www.unixtimestamp.com/) or
[currentmillis.com](https://currentmillis.com/).

If you're a command line junkie like me, on Linux systems you can use:

```bash
$ date -d @1366191727
Wed Apr 17 11:42:07 CEST 2013
```

However, on BSD derived systems such as Mac OS X, date -d won’t work so you have to used instead:

```bash
$ date -r 1366191727
Wed Apr 17 11:42:07 CEST 2013
```

Just like you can write that number on a piece of paper and later get
back the full instant back to life, you can store it in a file or a
row in your favorite RDBMS. Although you might want to talk to your
RDBMS using a proper driver and handing it a plain date instance; your
driver will then take care of the conversion to the underlying database
serialization format for native time instances. 

By storing time using a native format, you get the nice time formatting,
sorting, querying, etc features of your RDBMS for free, so you might want to
think twice before storing plain Unix timestamps in, say, Oracle.

Just make sure you know what timezone your Unix timestamp refers to, or you
might get confused later at deserialization time. By default, a Unix timestamp
is in UTC. If you use your system's libraries, you should be okay.

When working with databases, use the most appropriate data types. For instance
in Oracle, there's [four different data
types](https://www.infobloom.com/why-does-china-have-only-one-time-zone.htm):
`DATE`, `TIMESTAMP`, `TIMESTAMP WITH TIME ZONE` and `TIMESTAMP WITH LOCAL TIME
ZONE`. Also databases usually have a concept of database timezone and session
timezone, so make sure you understand how your specific database is using
those. A user that opens a session with timezone `A` is going to see different
values than a user connecting with timezone `B`.

ISO 8601 is also a serialization favorite. In fact, it is used in the [XML
Schema](http://www.w3.org/TR/xmlschema-2/#isoformats) standard.  Most xml
frameworks are natively able to serialize and deserialize back and forth from
`xs:date`, `xs:time` and `xs:dateTime` to your programming language's native
format (and viceversa). The same is true for json. Just be careful when dealing
with partial representations: for instance, if you omit the time zone, make
sure you agree beforehand on a default one with your communicating party
(usually UTC or your local time zone if you're both in the same one). 

![Elon Musk: "I'm putting people on Mars!", Developers: "Fantastic, more
timezones to support".](/images/posts/mars-timezone.png)

## Management

First of all, if you think you can write your own time management
software library, or even write a little routine that adds or subtracts
arbitrary values from the time of the day,
please allow me to show you the source code for the
[java.util.Date](http://www.docjar.com/html/api/java/util/Date.java.html)
and
[java.util.GregorianCalendar](http://www.docjar.com/html/api/java/util/GregorianCalendar.java.html)
classes from JDK 7, respectively weighting 1331 and 3179 lines of code. 

Okay, these are probably not the best examples of software routines that
deal with time, I agree. That's why Java libraries like 
[Joda Time](http://joda-time.sourceforge.net/) were written.
In fact, Joda Time has become so popular that it gave birth to
[JSR-310](http://jcp.org/en/jsr/detail?id=310) and is
[now](http://www.h-online.com/open/news/item/JSR-310-s-Date-and-Time-API-added-to-JDK-8-1708647.html)
[part](http://www.infoq.com/news/2013/02/java-time-api-jdk-8) of JDK 8.

Use of popular, well designed and implemented time frameworks will save your
life. Seriously. Take your time to get familiar with the API of your choosing. 

![Friend: "What happened?", Me: "I had to work with timezones
today".](/images/posts/timezones-meme.png)

## Common Time Tasks in Java

Let's see how all this translates into java code. Any language will of course
be different but everything I'm doing here should be possible in your language
of choice.

Please do not use `java.util.Date` or `java.util.Calendar`. We don't use that
classes any more. The new time api is in the `java.time` package. 

```java
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;

public class JavaTimeExample {

    public static void main(String[] args) {
        ZoneId systemDefault = ZoneId.systemDefault();
        System.out.println("systemDefault = " + systemDefault);

        long now = System.currentTimeMillis();
        System.out.println("now = " + now);

        LocalDate localDate = LocalDate.now();
        System.out.println("localDate = " + localDate);

        LocalDateTime localDateTime = LocalDateTime.now();
        System.out.println("localDateTime = " + localDateTime);

        LocalDateTime utc = LocalDateTime.now(ZoneId.of("UTC"));
        System.out.println("utc = " + utc);

        ZonedDateTime zonedDateTime1 = ZonedDateTime.now();
        System.out.println("zonedDateTime1 = " + zonedDateTime1);

        ZonedDateTime zonedDateTime2 = ZonedDateTime.now(ZoneId.of("UTC"));
        System.out.println("zonedDateTime2 = " + zonedDateTime2);

        String iso8601 = zonedDateTime2.format(DateTimeFormatter.ISO_INSTANT);
        System.out.println("iso8601 = " + iso8601);

        ZonedDateTime zonedDateTime3 = zonedDateTime2.plus(Duration.ofDays(7));
        System.out.println("zonedDateTime3 = " + zonedDateTime3);

        Instant nowAsInstant = Instant.ofEpochMilli(now);
        System.out.println("nowAsInstant = " + nowAsInstant);

        ZonedDateTime nowAsInstantInRome = nowAsInstant.atZone(ZoneId.of("Europe/Rome"));
        System.out.println("nowAsInstantInRome = " + nowAsInstantInRome);

        LocalDateTime romeLocalTime = nowAsInstantInRome.toLocalDateTime();
        System.out.println("romeLocalTime = " + romeLocalTime);

        LocalDate localDateInRome = nowAsInstantInRome.toLocalDate();
        System.out.println("localDateInRome = " + localDateInRome);

        LocalTime localTimeInRome = nowAsInstantInRome.toLocalTime();
        System.out.println("localTimeInRome = " + localTimeInRome);

        String shortTimeInRome = nowAsInstantInRome.format(DateTimeFormatter.ofLocalizedTime(FormatStyle.SHORT));
        System.out.println("shortTimeInRome = " + shortTimeInRome);

        String evenShorterTimeInRome = nowAsInstantInRome.format(DateTimeFormatter.ofPattern("HH:mm"));
        System.out.println("evenShorterTimeInRome = " + evenShorterTimeInRome);
    }
}
```

When I run the program above, I get the following output:

```
systemDefault = Europe/Rome
now = 1619116057439
localDate = 2021-04-22
localDateTime = 2021-04-22T20:27:37.462421
utc = 2021-04-22T18:27:37.463329
zonedDateTime1 = 2021-04-22T20:27:37.464133+02:00[Europe/Rome]
zonedDateTime2 = 2021-04-22T18:27:37.464528Z[UTC]
iso8601 = 2021-04-22T18:27:37.464528Z
zonedDateTime3 = 2021-04-29T18:27:37.464528Z[UTC]
nowAsInstant = 2021-04-22T18:27:37.439Z
nowAsInstantInRome = 2021-04-22T20:27:37.439+02:00[Europe/Rome]
romeLocalTime = 2021-04-22T20:27:37.439
localDateInRome = 2021-04-22
localTimeInRome = 20:27:37.439
shortTimeInRome = 8:27 PM
evenShorterTimeInRome = 20:27
```

## Further Resources

Here are a few useful links I've accumulated over time:

* [UTC is enough for everyone... right?](https://zachholman.com/talk/utc-is-enough-for-everyone-right)
* [The Problem with Time & Timezones - Computerphile](https://youtu.be/-5wpm-gesOY)
* [Falsehoods programmers believe about time](http://infiniteundo.com/post/25326999628/falsehoods-programmers-believe-about-time)
* [The 5 laws of API dates and times](http://apiux.com/2013/03/20/5-laws-api-dates-and-times/)
* [Storing Date/Times in Databases](http://derickrethans.nl/storing-date-time-in-database.html)
* [5 Levels of Handling Date and Time in Python](https://medium.com/techtofreedom/5-levels-of-handling-date-and-time-in-python-46b601e47f65)
* [Timezone Bullshit](https://blog.wesleyac.com/posts/timezone-bullshit)
* [ISO 8601: the better date format](https://kirby.kevinson.org/blog/iso-8601-the-better-date-format/)
* [A Short History of the Modern Calendar](http://youtu.be/kzprsR2SvrQ)
* [Should We 'Heed the Science and Abolish Daylight Saving Time'?](https://yro.slashdot.org/story/21/03/14/014233/should-we-heed-the-science-and-abolish-daylight-saving-time)
* [Converting world timezones with DuckDuckGo and Wolfram Alpha from the browser address bar](http://opensourcehacker.com/2013/03/28/converting-world-timezones-with-duckduckgo-and-wolfram-alpha/)
* [When a Calendar Defeated Russia in the 1908 Olympics](https://www.si.com/extra-mustard/2013/12/30/the-extra-mustard-trivia-hour-when-a-calendar-defeated-russia-in-the-1908-olympics)
* [Why does China Have Only One Time Zone?](https://www.infobloom.com/why-does-china-have-only-one-time-zone.htm)
* [First day meme](https://www.reddit.com/r/ProgrammerHumor/comments/l99ip9/or_is_it_0th/)
* [Glory to ISO8601 Subreddit](https://www.reddit.com/r/ISO8601/)
* [TIME:ENNA Timezone Converter](https://timeenna.com/)
* [How Ancient Romans Kept Time](https://www.amusingplanet.com/2021/05/how-ancient-romans-kept-time.html)

