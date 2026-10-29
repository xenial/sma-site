// TikTok sign-in pages. The Discord bot gives each applicant a link to /connect/?s=<state>.
// start(): asks the bot for the TikTok authorize URL and shows "Continue with TikTok".
// finish(): TikTok redirects to /connect/callback/?code=&state=; the code goes to the bot, which
// exchanges it (the client secret never reaches the browser) and returns what it read.
window.SMAConnect = (function () {
  var api = (window.SMA_API || '').replace(/\/+$/, '');
  var el = function (id) { return document.getElementById(id); };
  var fmt = function (n) { return Math.round(n).toLocaleString('en-US'); };
  var date = function (unix) {
    return new Date(unix * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  var RETRY = 'Run /link-tiktok in Discord to get a new link.';

  function node(tag, props, children) {
    var n = document.createElement(tag);
    if (props) Object.keys(props).forEach(function (k) { n[k] = props[k]; });
    (children || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }

  async function start() {
    var status = el('status');
    var say = function (text) { status.textContent = text; status.hidden = !text; };
    var state = new URLSearchParams(location.search).get('s');
    if (!state) return say('Open this page from the sign-in link the SMA bot gives you in Discord.');
    if (!api) return say('TikTok sign-in is switched off right now. Please try again later.');
    try {
      var res = await fetch(api + '/api/tiktok/authorize?s=' + encodeURIComponent(state));
      var body = await res.json();
      if (!res.ok) return say(body.error || 'This sign-in link no longer works. ' + RETRY);
      var go = el('go');
      go.href = body.url;
      go.hidden = false;
      say('');
    } catch (e) {
      say('Could not reach the SMA bot. Please try again in a minute.');
    }
  }

  function showError(title, text) {
    el('title').textContent = title;
    el('message').textContent = text;
  }

  function outcomeText(o) {
    if (o.kind === 'approved') {
      var rate = (o.multiplier * o.countryFactor).toFixed(2);
      var lines = [
        'Tier multiplier ' + o.multiplier + '×, country factor ' + o.countryFactor +
          '. On a campaign paying $1.00 per 1,000 views you earn $' + rate + ' per 1,000 views.',
      ];
      if (o.countryStatus === 'none') {
        lines.push('Next: in Discord, upload a screenshot of TikTok Analytics > Viewers > Locations with /analytics. It sets your country factor.');
      }
      return { title: "You're in: " + o.tier + ' tier', lines: lines };
    }
    if (o.kind === 'review') {
      return {
        title: 'Thanks, your application is with staff',
        lines: ['You will get a Discord DM when it is decided. Meanwhile, upload a screenshot of TikTok Analytics > Viewers > Locations with /analytics in Discord.'],
      };
    }
    if (o.kind === 'waitlisted') {
      return {
        title: 'Not quite yet',
        lines: ["Your account doesn't meet the minimum yet: " + o.reason.toLowerCase() + '. You can apply again on ' +
          new Date(o.reapplyOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + '.'],
      };
    }
    return { title: 'TikTok connected', lines: ['Your TikTok account is linked to SMA.'] };
  }

  function summaryBlock(s) {
    var block = node('section', { className: 'read' });
    var who = node('div', { className: 'who' });
    if (s.avatarUrl) who.appendChild(node('img', { src: s.avatarUrl, alt: '', referrerPolicy: 'no-referrer' }));
    who.appendChild(node('div', null, [
      node('strong', null, [s.displayName || s.username || 'Your TikTok account']),
      s.username ? node('span', { className: 'note' }, ['@' + s.username]) : null,
    ]));
    block.appendChild(node('h2', null, ['Signed in with TikTok as']));
    block.appendChild(who);

    var facts = [];
    if (s.followers != null) facts.push(['Followers', fmt(s.followers)]);
    if (s.likes != null) facts.push(['Likes', fmt(s.likes)]);
    if (s.publicVideos != null) facts.push(['Public videos', fmt(s.publicVideos)]);
    if (s.medianViews != null) facts.push(['Median views', fmt(s.medianViews)]);
    if (s.engagementRate != null) facts.push(['Engagement', (s.engagementRate * 100).toFixed(1) + '%']);
    if (facts.length) {
      block.appendChild(node('h2', null, ['What SMA read from TikTok']));
      block.appendChild(node('dl', { className: 'facts' }, facts.map(function (f) {
        return node('div', null, [node('dt', null, [f[0]]), node('dd', null, [f[1]])]);
      })));
      if (s.videosRead) block.appendChild(node('p', { className: 'note' }, ['Median views and engagement come from your last ' + s.videosRead + ' public videos.']));
    }
    if (s.recentVideos && s.recentVideos.length) {
      block.appendChild(node('h2', null, ['Your latest public videos']));
      block.appendChild(node('ul', { className: 'recent' }, s.recentVideos.map(function (v) {
        var label = fmt(v.views) + ' views, posted ' + date(v.createTime);
        return node('li', null, [v.shareUrl ? node('a', { href: v.shareUrl, rel: 'noopener', target: '_blank' }, [label]) : label]);
      })));
    }
    return block;
  }

  async function finish() {
    var q = new URLSearchParams(location.search);
    var error = q.get('error');
    var code = q.get('code');
    var state = q.get('state');
    // keep the one-time code out of the address bar, history and screenshots
    history.replaceState(null, '', location.pathname);

    if (error) {
      return showError("TikTok sign-in didn't finish",
        (error === 'access_denied' ? 'You cancelled the TikTok sign-in.' : (q.get('error_description') || error)) + ' ' + RETRY);
    }
    if (!code || !state) return showError("TikTok sign-in didn't finish", 'TikTok did not send a sign-in code. ' + RETRY);
    if (!api) return showError('TikTok sign-in is switched off', 'Please try again later.');

    try {
      var res = await fetch(api + '/api/tiktok/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: state, code: code }),
      });
      var body = await res.json();
      if (!res.ok) return showError('Could not connect your TikTok', body.error || RETRY);

      var t = outcomeText(body.outcome);
      el('title').textContent = t.title;
      var message = el('message');
      message.textContent = t.lines[0];
      var result = el('result');
      t.lines.slice(1).forEach(function (line) { result.appendChild(node('p', { className: 'note' }, [line])); });
      if (body.summary) result.appendChild(summaryBlock(body.summary));
      result.appendChild(node('p', { className: 'note' }, ['You can close this tab and go back to Discord.']));
    } catch (e) {
      showError('Could not reach the SMA bot', 'Please try again in a minute. ' + RETRY);
    }
  }

  return { start: start, finish: finish };
})();
