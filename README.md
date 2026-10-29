# SMA website

Static site for SMA: home page, Terms of Service and Privacy Policy. Plain HTML and CSS with self-hosted fonts, no build step. It is made for GitHub Pages and for the TikTok for Developers app review, which asks for a website with visible Terms and Privacy links.

| File | Page |
| --- | --- |
| `index.html` | Home: what SMA is, how it works, how SMA uses TikTok, Discord link |
| `terms.html` | Terms of Service |
| `privacy.html` | Privacy Policy |
| `404.html` | Not-found page (paths assume the repo is named `sma-site`) |

## Publish on GitHub Pages

The repo must be public on a free GitHub plan.

```
gh repo create sma-site --public --source . --push
gh api -X POST repos/{owner}/sma-site/pages -f "source[branch]=main" -f "source[path]=/"
```

The site appears at `https://<github user>.github.io/sma-site/` within a minute or two.

## TikTok for Developers

| Field | Value |
| --- | --- |
| Website URL | `https://<github user>.github.io/sma-site/` |
| Terms of Service URL | `https://<github user>.github.io/sma-site/terms.html` |
| Privacy Policy URL | `https://<github user>.github.io/sma-site/privacy.html` |

To verify URL ownership:

1. In the developer portal, open URL properties, choose **URL prefix** and enter `https://<github user>.github.io/sma-site/`.
2. Download the signature file TikTok gives you and put it in the root of this repo.
3. Push, wait for Pages to update, then press Verify. The file must load directly (HTTP 200, no redirect) at `https://<github user>.github.io/sma-site/<file name>`.

## Editing

Every page repeats the same header and footer. When you change a link there, change it in all four HTML files. The Discord invite is `https://discord.gg/ChyZTUXSPB` (permanent, to #start-here).
