---
title: Searching and visualizing Pathfinder 2e data
published: 2026-11-01
excerpt: How many browser tabs does it take to answer a rules question in Pathfinder?
---

How many browser tabs does it take to answer a rules question in Pathfinder? In my experience, about four. One for the feat, one for the trait the feat mentions, one for the condition the trait mentions, and one for the Reddit thread where someone already argued about it five years ago.

I wanted something better, so I built [pf2e.fyi](https://pf2e.fyi). Primarily, I wanted a better user experience when searching. As I built it out, I also realized just how connected every piece of content is for a tabletop game. This gave me an idea for an [Obsidian-like](https://obsidian.md) interface to navigate the rules. The graph visualization is cool, but most importantly, I wanted a "backlinks" pane to quickly find adjacent relevant information.

## Throwing things away

The first version used a search server, [Typesense](https://typesense.org/), which I admittedly really enjoyed working with and which was feature-rich. It also pulled its data from the [pf2etools project](https://pf2etools.com/). Both worked, but I needed both more and less.

The search server went first. It turns out a browser is perfectly capable of searching tens of thousands of entries on its own if you hand it the right files. Search now runs in a Web Worker with MiniSearch, splits its index by source book, and loads only what you have turned on.

The data went next, and that one hurt a little more. In October I migrated everything to the [Foundry VTT pf2e](https://github.com/foundryvtt/pf2e) packs, which, thanks to the community, are the most complete machine-readable copy of the rules that exists. That meant rewriting every loader, one entity type at a time: equipment, spells, class features, actions, backgrounds, deities, heritages, and finally the bestiaries, all 64 of them. Ten phases. Luckily, Claude made short work of this.

## The graph

Somewhere along the way I noticed that the rules text was already a network. Feats reference actions, actions reference conditions, spells reference traits, creatures reference half the book, and on and on.

[/graph](https://pf2e.fyi/graph) shows every entry as a node and every link as an edge, laid out with [ForceAtlas2](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0098679) via [sigma.js](https://www.sigmajs.org/). Click a node and you drill into its neighborhood. Every detail page carries its own small graph too. I won't pretend this is the most efficient way to look up Grapple, but it is pretty fun, and occasionally it shows you a connection you didn't know was there.

The links themselves took more work than the drawing. Foundry's own `@UUID` references were a start, but plenty of rules text names things in plain English: "you Step," "you become frightened 2."

## Making it fast, then making it work on a phone

Every entry is prerendered to static HTML and served from Cloudflare's edge. A crawler sees the full article, and so does your browser before any JavaScript runs. A small Worker handles the feedback form.

Then I opened it on my phone, which was humbling. A two-column desktop layout with a force-directed graph is not a phone layout. A couple of passes later there's a bottom tab bar (Search, Graph, Entry, Connections), panes that keep their state when you switch between them, and a switch to turn the graph off entirely if you'd rather not download it.

## Feedback

At some point you have to stop polishing and let other people see it. So I [posted it to r/Pathfinder2eCreations](https://www.reddit.com/r/Pathfinder2eCreations/comments/1x5qpru/pf2efyi_pathfinder_2e_search_and_graph/).

Immediately, I was met with "I love the Obsidian graph thing, but...", along with a few other pieces of feedback:

- Search only matched names, so unless you already knew the creature, you couldn't narrow by level, trait, or rarity.
- The Druid page listed the four feats its own text mentions. Every other druid feat links *to* Druid, so they sat in a small "Referenced By" box off to the side.
- There was no Flourish page. Traits weren't entries at all.
- Finding creatures that cast Fireball worked, but it couldn't filter by level, and checking each result meant hovering over nodes one by one, slowly.

The verdict: "I'd much rather have a good content display format or a better query syntax than the graph view."

Fair enough. I had built the thing for "what does Prone do again?" and never really tried it for anything else. The same commenter then found a real data problem: Elf Step uses the Step action but its entry didn't link to it, and Step had only 8 references in total. The Foundry data links rules terms by hand, and mostly it doesn't bother for the basic ones. Strike is mentioned about 6,700 times and linked about 30.

There were also a few positive comments. One person had been looking for a way to find every item and ability that mentions Step. A GM who started out doubtful found it "actually very useful" for finding every creature that can make a party slowed. And someone searched for "mimic", got nothing, and pointed out that Monster Core 2 wasn't on by default.

So I took some time to make a few changes:

- Monster Core 2 and NPC Core are now on by default.
- Rules terms named in plain text ("you Step", "frightened 2") are linked automatically at build time.
- Every trait has its own page, listing the entries that carry it.
- References and Referenced By are now one Connections list, the default on every entry, so the druid feats are front and center.
- Search grew a query language, plus a new Browse page that shows the results as a filterable table (more on that below).
- Hovering a node in a neighborhood now shows its preview right away.

## Search, but more

The feedback also led to some solid feature improvements, namely a neat little query syntax. E.g. `trait:undead level:5-7 -rarity:common` finds every entry with trait Undead, levels 5 through 7, that isn't common.

The same syntax drives the search palette, a new `/browse` page with faceted filters over a sortable table, and the graph explorer's filters. For example, `linksto:spell/fireball` finds everything that references Fireball. Hopefully this lets people answer more complex questions.

## How it was built

Nearly all of this was co-authored by Claude Code. Every non-trivial feature started as a design spec (there are 44 of them in the repo now), became a plan, and was executed by agents working in separate git worktrees while I reviewed, poked at the UI, and changed my mind. A lot.

It changed what felt possible for a side project. Migrating ten categories of data to a new source in a week is not something I would have started on my own. Neither is a boolean query language for a hobby site.

Ten years as a software engineer mostly taught me that I'll design something confidently, show it to one person, and immediately have a full backlog. No plan survives first contact with the enemy.

## Hindsight

If I started again, I'd skip the search server and go straight to the Foundry data. Both detours taught me something, but mostly they taught me what I didn't need.

The site is live at [pf2e.fyi](https://pf2e.fyi). If you have thoughts, please share them via the feedback form; I'd love to have more features to build!

## Acknowledgments

Community Pathfinder 2e projects really make the ecosystem worth investing in. I would be remiss not to mention the community projects that directly enabled or inspired pf2e.fyi:

- [Foundry VTT PF2e system](https://github.com/foundryvtt/pf2e): the volunteer-maintained game system whose data every entry on this site comes from.
- [Archives of Nethys](https://2e.aonprd.com/): the official online rules reference for Pathfinder Second Edition.
- [Pf2eTools](https://pf2etools.com/).
