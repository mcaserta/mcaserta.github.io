---
title: "Posting to Mastodon"
date: 2022-12-26T00:00:00Z
tags:
  - mastodon
  - software development
---

Since the latest twitter issues due to
[Space Karen](https://knowyourmeme.com/memes/space-karen), I got myself a
[Mastodon account](https://mastodon.online/@mcaserta) and I must say that, so
far, the experience has been extremely positive, possibly due to the fact that
most of the people I follow are well behaved nerds who care about sharing good
vibes. If you also feel like joining, please take a look at
[Join Mastodon](https://joinmastodon.org/) and see for yourself.

Anyway, I found myself pretty soon in the need to automate my posts. I have a
[telegram channel](https://t.me/mirkolovesmusic) where I post music I like and I
wanted to automate cross posting from there to my Mastodon account and I did it
with [IFTTT](https://ifttt.com) using a WebHook component for Mastodon.

For now, I just want to document how easy it is to post to Mastodon. All you
need is an http client. I'll be using [curl](https://curl.se/) in my examples
but you can of course use anything you see fit.

```bash
curl --request POST  \
  --header 'Authorization: Bearer your-auth-token-here' \
  --form 'status="The Crusaders: \"And Then There Was The Blues\" https://youtu.be/F-EAazr0j78 #music"' \
  https://mastodon.online/api/v1/statuses
```

This is the general form of the request. In other words, we're making an http
POST request where the body is the equivalent of submitting an html form with a
`status` field whose value is the actual text we want posted on our timeline.
Just be careful with the quoting going on inside the `status` field.

As for the authorization header, you need to get an authentication token from
your Mastodon server instance. In my server, it's under Preferences ->
Development. I just have to select _New Application_, fill a little info about
my app, select only `write:statuses` as the permissions I'm granting and, once
created, the token will be visible in the app info under _Your access token_.

You will also need to replace `mastodon.online` with your server's hostname.

This is it. You're welcome.
