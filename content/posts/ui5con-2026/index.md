---
title: "UI5con 2026: My Highlights and Takeaways"
seoTitle: "UI5con 2026 Recap: UI5 CLI v5, New Debug Tools & New FLP Sandbox"
description: "My takeaways from UI5con 2026 — UI5 CLI v5 with less middleware and monorepo support, new built-in debugging tools, AI tooling around the Fiori MCP, a new launchpad sandbox, and why UI5 2.0 is not coming anytime soon."
date: 2026-07-15
draft: false
tags: ["UI5", "SAPUI5", "UI5con", "Fiori", "TypeScript", "AI"]
categories: ["UI5"]
ShowToc: true
cover:
  image: "thumbnail.png"
  alt: "Mario Kernich at UI5con 2026"
  caption: "At UI5con 2026"
  hiddenInSingle: false
---

**UI5con 2026** took place on July 14th, and as every year it was the best place to find out where the framework and its tooling are actually heading — straight from the teams that build them.

Before diving into the announcements: I'm genuinely grateful I could be part of it again this year. UI5con is as much about the people as it is about the content — catching up with familiar faces from the community, putting faces to GitHub handles, and talking shop between the sessions is what makes this conference special. Thanks to everyone who organized it and everyone I got to chat with!

The keynote opened with some numbers that show how alive the framework is. Since the last UI5con: **12 minor releases**, **22 patches**, and roughly **6,800 commits from around 140 contributors** — and that is OpenUI5 alone. That covers releases **1.138 through 1.150**, the latter freshly published.

This is my personal recap: the announcements I consider relevant for day-to-day UI5 development, plus a few opinions. If you want the full picture, the complete main stage was recorded and is available on YouTube — I've embedded it at the [end of this post](#the-recording).

## UI5 CLI v5: Less Middleware, Built-In Monorepo Support

The biggest tooling announcement for me: **UI5 CLI v5** is on the way, and it addresses exactly the pain points that today require a zoo of third-party extensions:

- **Less custom middleware required.** Capabilities that almost every project bolts on today via `ui5.yaml` are moving into the core. Fewer third-party dependencies, fewer configuration blocks that every project copies from the last one.
- **Better live reload — via WebSocket, without extra middleware.** Today you need something like `ui5-middleware-livereload` to get a decent edit-save-reload cycle. With CLI v5, the dev server handles this out of the box.
- **Monorepo support.** The tooling gets first-class support for multi-package repositories. If you have read my post on [UI5 monorepos with pnpm workspaces](/posts/ui5-monorepo-with-pnpm-workspaces), you know that this works well today — but it relies on the tooling *happening* to follow symlinks and on options like `transpileDependencies`. Native support is very welcome.
- **A build cache.** Repeated builds get faster because unchanged resources are not processed again — noticeable in exactly the monorepo and CI scenarios above.
- **Third-party npm modules.** Consuming plain npm packages in UI5 apps — what the community solves today with `ui5-tooling-modules` — is also becoming a core tooling concern instead of a third-party add-on.

The direction is clear: the standard project of the future should need a **much thinner `ui5.yaml`**, because transpiling, live reload, third-party modules and workspace resolution are simply *there*.

## New Built-In Debugging Tools (Since UI5 1.149)

Quietly shipped with **UI5 1.149**: a new set of debugging tools that live directly in the framework — no browser extension required.

Getting to them is a two-step affair:

1. Add the URL parameter **`sap-ui-debug-tools=true`** to your app. Alternatively, the classic **`sap-ui-debug=true`** now enables the debug sources *and* the new tools in one go.
2. Open the browser console and run:

```js
ui5.help()
```

The `ui5` console object lists everything the tools can do. The feature is documented in the [SAPUI5 SDK — Demo Kit](https://ui5.sap.com/), and it is worth ten minutes of exploration — being able to inspect a running app on *any* system just by appending a URL parameter is a big deal for support situations, where installing the UI5 Inspector extension is often not an option.

## Best Practices: TypeScript, UI5 Linter — and AI

One session walked through the current recommended setup for UI5 development, and the reassuring news is: if you are on **TypeScript** with **UI5 linter** in your pipeline, you are already exactly where SAP wants you to be.

One caveat worth knowing: **UI5 linter focuses on the latest UI5 versions**. Its rules are geared toward flagging deprecated APIs and preparing your code for what comes next — so the older the UI5 version you target at runtime, the more its findings describe your *future* migration rather than your current reality. Still: running it early means fewer surprises later.

## AI Tooling: Fiori MCP and Claude Plugins

AI had a prominent spot on the main stage this year — and unlike a lot of AI conference content, some of it was genuinely practical:

- The **Fiori MCP server** gets a dedicated **modernization skill**, trained on real modernization scenarios. The idea: point an AI agent at a legacy app and let it propose the migration steps toward current best practices.
- **Claude plugins** that integrate with the Fiori MCP were shown, with an emphasis on **feedback loops**: the agent doesn't just generate code, it runs **UI5 linter** on its own output and iterates until the findings are gone. That loop — generate, lint, fix, repeat — is exactly how AI-assisted UI5 development becomes trustworthy instead of a gamble.

And one AI session was so remarkable that it deserves its own section.

## UI5 Has Entered the Chat: AI, MCP Apps and UI5

The talk *"UI5 has entered the chat – AI, MCP Apps and UI5"* by **Marian Zeis** and **Mike Zaschka** was one of the most impressive contributions of the conference — a real showcase of what is already possible with AI today.

The project they presented builds **UI5 apps in real time while you interact with the AI**: you chat, and the assistant doesn't just answer in text — it assembles a live UI5 app on the fly, renders it directly in the conversation, and lets you **interact with it** right there. Not a mockup, not generated code you still have to run somewhere — a working app, materializing mid-chat via MCP Apps.

The source code is available on GitHub: [marianfoo/UI5con_2026_MCPApps](https://github.com/marianfoo/UI5con_2026_MCPApps).

My take: **mega interesting**, and technically genuinely impressive. Where exactly this will land in everyday business scenarios is still an open question — but that's the nature of every technology this new, and honestly part of what makes it exciting. It's demos like this that explore the territory *before* the use cases are obvious, and someone has to do that pioneering work. Marian and Mike showed what's already possible when AI and UI5 meet through MCP Apps — and I'm curious to see where they and the community take it from here. This talk alone was worth the trip.

## JSX: Type-Safe Views on the Horizon?

An interesting signal rather than an announcement: **JSX** for UI5 views might get more focus in the future.

Why does that matter? Because typed views are the **last big gap** in the TypeScript story. TypeScript has covered controllers, custom controls, and models for years now — but XML views remain plain strings to the compiler. A typo in a control name, a wrong property, a binding to a non-existent event handler: none of it surfaces before runtime. JSX views would close exactly that gap, with the compiler checking every control, property and handler reference.

According to **Peter Müßig**, this is going to be an interesting topic in the near future and one to keep an eye on — there is still quite a bit happening in this area.

Nothing concrete to use yet — but it's the part of the roadmap I'm personally most excited about.

## A New Fiori Launchpad Sandbox

If you have ever set up a local launchpad sandbox, you know the dirty secret: the classic local sandbox is based on an **old launchpad version** that new customer systems don't even run anymore. You develop against a shell that behaves differently from what your users get.

That finally changes:

- A **new launchpad sandbox** was presented, aligned with what current systems actually run.
- Configuration happens via **simple config files or a middleware** — no more hand-crafted sandbox HTML pages.
- It ships as **experimental with UI5 1.150**.

{{< alert type="info" title="Experimental for now" >}}
As with all experimental features, expect the configuration format to change before it stabilizes. For production-like testing today, the classic sandbox (pinned to a fixed patch version) remains the pragmatic choice — like in my [monorepo setup](/posts/ui5-monorepo-with-pnpm-workspaces).
{{< /alert >}}

For everyone building [launchpad plugins](/posts/developing-fiori-launchpad-plugins-with-typescript) or testing tile navigation locally, this is one of the most practically relevant announcements of the whole conference.

## Rapid-Fire Notes

A few more items from the main stage that deserve at least a mention:

- **Custom Fiori Elements apps**: it was shown how to take a Fiori Elements app and **redefine the main and detail views** — keeping the FE foundation while replacing exactly the pages that need custom behavior. A nice middle ground between "pure FE" and "rewrite as freestyle".
- **RAP dump fix**: the well-known dump problem when working with RAP services is getting fixed. Anyone who has hit it knows why this got applause.

## Bonus: A UI5con Neovim Theme

My favorite detail of the whole conference had nothing to do with roadmaps: Nico Schönteich built a **custom Neovim theme just for this year's UI5con** — and presented his demos live on stage in a terminal dressed head to toe in UI5con colors, phoenix included.

{{< figure src="neovim-theme.png" alt="Nico Schönteich presenting on stage with his custom UI5con Neovim theme" caption="Nico Schönteich's custom UI5con Neovim theme in action on the main stage" >}}

The setup is open source and part of his dotfiles: [github.com/nicoschoenteich/dotfiles](https://github.com/nicoschoenteich/dotfiles).

And for the real hardcore programmers among you: I can only recommend giving Neovim a try 😄

## No UI5 2.0 — For Now

And the elephant in the room: **UI5 2.0 will not happen for the time being.** The 1.x line continues.

I consider this good news, not bad news. The framework team keeps modernizing *within* 1.x — TypeScript, the new debug tools, the new sandbox, CLI v5 — while UI5 linter tells you today which APIs to leave behind. That is a much healthier migration path than a big-bang major release. When (if) a 2.0 eventually comes, projects that follow the linter will already be there.

## The Recording

The full main stage — *UI5con 2026: Live from the Main Stage!* — is available on YouTube:

{{< youtube CMPudw4scSE >}}

## Conclusion

UI5con 2026 was less about flashy reinventions and more about **removing friction**: a CLI that needs fewer plugins, debugging that needs no extension, a sandbox that matches reality, and AI tooling that checks its own work with the linter. Combined with the clear commitment to the 1.x line, the message to UI5 teams is: **the stack you build on today is the stack that gets better** — no rewrite required.

---

{{< faq title="Frequently Asked Questions" >}}
  {{< faq-item question="Where can I watch the UI5con 2026 sessions?" >}}
  The complete main stage was streamed and recorded — the video <a href="https://www.youtube.com/watch?v=CMPudw4scSE">UI5con 2026: Live from the Main Stage!</a> is available on the official UI5 YouTube channel.
  {{< /faq-item >}}

  {{< faq-item question="How do I try the new debugging tools?" >}}
  You need UI5 <strong>1.149 or later</strong>. Append <code>sap-ui-debug-tools=true</code> to your app's URL (or <code>sap-ui-debug=true</code> to also load the debug sources), then run <code>ui5.help()</code> in the browser console to see what's available.
  {{< /faq-item >}}

  {{< faq-item question="When can I use the new launchpad sandbox?" >}}
  It ships as an <strong>experimental</strong> feature with UI5 <strong>1.150</strong>, configured via simple config files or a middleware. Experimental means the API and configuration may still change — fine for trying out, not yet for team-wide standardization.
  {{< /faq-item >}}

  {{< faq-item question="Is UI5 2.0 cancelled?" >}}
  Not cancelled — but it will not happen for now. Development continues on the 1.x line, and modernization arrives incrementally (TypeScript, new tooling, new sandbox). The best preparation for whatever comes later is running <strong>UI5 linter</strong> today and staying off deprecated APIs.
  {{< /faq-item >}}
{{< /faq >}}
