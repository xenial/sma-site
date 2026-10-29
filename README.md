# SMA website

Static site for SMA: home page, Terms of Service and Privacy Policy, live at **https://smagency.site/**. Plain HTML and CSS with self-hosted fonts, no build step. It is served by GitHub Pages and made for the TikTok for Developers app review, which asks for a website with visible Terms and Privacy links.

| File | Page |
| --- | --- |
| `index.html` | Home: what SMA is, how it works, how SMA uses TikTok, Discord link |
| `terms.html` | Terms of Service |
| `privacy.html` | Privacy Policy |
| `404.html` | Not-found page |
| `CNAME` | Custom domain for GitHub Pages (`smagency.site`). Change the domain in the repo's Pages settings, not by hand |
| `assets/app-icon-1024.png` | 1024 x 1024 app icon. Source: `assets/app-icon-source.html`, rendered at a 1024 x 1024 viewport |

## Publishing

Pages deploys `main` from the repo root. A push to `main` is live within a minute or two.

DNS for `smagency.site` points at GitHub Pages (A records `185.199.108.153` to `185.199.111.153`). For `www.smagency.site`, add a CNAME record `www` pointing to `xenial.github.io`; GitHub then redirects it to the main domain.

## TikTok for Developers

| Field | Value |
| --- | --- |
| Website URL | `https://smagency.site/` |
| Terms of Service URL | `https://smagency.site/terms.html` |
| Privacy Policy URL | `https://smagency.site/privacy.html` |
| App icon | `assets/app-icon-1024.png` |

Verify ownership of the whole domain: in the developer portal, open URL properties, choose **Domain**, enter `smagency.site` and add the TXT record TikTok shows to the domain's DNS. A verified domain also covers subdomains such as a future `bot.smagency.site` for the bot's TikTok sign-in.

## Editing

Every page repeats the same header and footer. When you change a link there, change it in all four HTML files. The Discord invite is `https://discord.gg/ChyZTUXSPB` (permanent, to #start-here).
