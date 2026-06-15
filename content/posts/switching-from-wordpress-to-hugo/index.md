---
title: "Switching After 11 Years From WordPress to Hugo"
date: 2026-06-13
lastmod: 2026-06-15
draft: false
tags: ["Hugo", "WordPress", "Static Site", "Markdown", "Open Source"]
categories: ["Web"]
ShowToc: true
cover:
  image: "cover.svg"
  alt: "Switching from WordPress to Hugo"
  caption: "From PHP monolith to a blazing-fast static site"
  hiddenInSingle: false
---

For over a decade, **WordPress** was my default answer to *"I need a website."* Whether it was a small business page, a portfolio, a landing page, or even a fully featured shop — WordPress and PHP were where I started my journey into web development. Over the years, I built **more than a dozen sites** on it as part of my side business.

But the longer I worked with it, the more its cracks started to show. Eventually, I made the switch to **[Hugo](https://gohugo.io/)** — and I haven't looked back since.

Here is why.

## My WordPress Story

I started my web journey the way many of us did: a PHP file here, a WordPress install there. It felt empowering. You could spin up a site in minutes, install a theme, add a few plugins, and you were online.

For small clients, this was perfect — at first. But as soon as the requirements grew beyond "a few pages and a contact form," the cracks appeared.

## The Problems with WordPress

After years of building sites on WordPress, the same pain points kept coming back:

### 1. The Plugin Mess

WordPress is essentially **a core platform held together by plugins**. Need SEO? Plugin. Need caching? Plugin. Need a form? Plugin. Need a slightly different button style? You guessed it — plugin.

The result:

- An **endless amount of plugins** for even the most basic features
- **Incompatibilities** between plugins, themes, and WordPress core
- **Performance issues** that grow proportionally with every plugin you install
- Constant updates — and the fear that one of them will break the site

### 2. PHP as a Foundation

PHP got me started, and I'm grateful for it. But coming from modern languages and tooling, working with PHP increasingly felt like stepping back in time. It is a **primitive scripting language** for what we expect from modern web development — and the ecosystem around it on WordPress reflects that.

### 3. Page Builders That Hate Developers

Then came the era of **Gutenberg**, **Elementor**, **WPBakery** and friends. Great for non-technical users, painful for developers:

- HTML output that is **bloated and hard to control**
- Styling overrides on top of overrides on top of `!important`
- No clean separation between **content** and **presentation**
- Version control? Forget it — your content lives in a MySQL database

If you actually enjoy writing HTML, CSS, and clean templates, WordPress page builders feel like working against the tool, not with it.

### 4. The Server Overhead

Every request hits PHP. Every PHP request hits the database. Every page needs caching plugins to feel fast. You need a hosting plan that can handle it, and you need to keep PHP, MySQL, and WordPress itself patched constantly.

For a **blog**, that is a lot of moving parts for what is essentially "show me some text and images."

## Enter Hugo

When I started this blog, I decided to try something completely different: a **static site generator**. After looking at the usual suspects (Jekyll, Eleventy, Astro, Next.js), I went with **Hugo** — and I am very happy I did.

### Why Hugo Just Clicks

Here is what convinced me:

#### ✅ Effortless Project Setup

Installing Hugo is one command. Scaffolding a new site is another. Adding a theme is a `git submodule`. You can have a working blog in minutes — locally, in your editor, with hot reload.

```bash
brew install hugo
hugo new site my-blog
cd my-blog
hugo server
```

That's it. No database. No PHP. No `wp-config.php`.

#### ✅ Static Output

Hugo produces **plain HTML, CSS, and JavaScript**. That means:

- **No runtime on the server** — no PHP, no Node, no database
- Deploy to **GitHub Pages, Cloudflare Pages, Netlify, S3** — basically anywhere
- **Insanely fast** page loads, because there is nothing to compute at request time
- A much **smaller attack surface** — there is no admin panel to hack

#### ✅ Markdown All the Way

This is the killer feature for me as a developer: **content is just Markdown files**.

- Write posts in your favorite editor (hello, VS Code 👋)
- Version everything in **Git**
- Diff, branch, and pull-request your content like code
- Copy/paste posts across projects in seconds

No more "logging into the admin panel to fix a typo." Just edit, commit, push.

#### ✅ A Real Developer Experience

Hugo gives you a serious templating engine, layouts, partials, shortcodes, taxonomies, and a clean content model. You can:

- Start from an **existing theme** like [PaperMod](https://github.com/adityatelange/hugo-PaperMod)
- **Modify it** to fit your style, fonts, and layout
- Build **custom shortcodes** for things like talks, projects, or galleries
- Extend it with **custom JS** and CSS without fighting a framework

The amount of freedom — without giving up speed — is what makes it so enjoyable.

### 🔧 Things I Adjusted in My Hugo Setup

Since hosting this blog on Hugo, I have customized a few features to perfectly tailor the site to my needs. Here is what I adjusted:

- **Custom "Kernich" Styling:** Added personalized CSS tweaks to match my custom branding and typography system.
- **Local Mermaid Integration:** Embedded Mermaid support locally to render clear, text-based architecture diagrams with the convenience of simple Markdown.
- **Local Fancybox Support:** Integrated Fancybox locally to enable smooth, user-friendly lightbox transitions when clicking any blog post images.
- **Static Pages:** Built structured static pages for my [About Me](/about/) section and [Public Talks](/talks/).
- **Automatic External Link Target:** Configured a custom render-link hook and global JavaScript fallback so all external links automatically open safely in a new tab.
- **GDPR-Compatible Google Analytics:** Added opt-in consent tracking with Google Analytics 4 — no analytics scripts load until visitors explicitly accept.
- **Alert Shortcodes:** Built custom shortcodes for styled info, warning, and error messages directly in Markdown posts.

{{< alert type="info" title="📖 Note" >}}
You can see the whole source code of this blog in this repo: [github.com/mariokernich/blog](https://github.com/mariokernich/blog)
{{< /alert >}}

## What I Lose (and Don't Miss)

To be fair, switching to Hugo does mean giving up a few things:

- ❌ A graphical admin UI for non-technical editors
- ❌ Out-of-the-box ecommerce (but for a blog: irrelevant)
- ❌ Dynamic features like comments or forms — you need third-party services

For a **personal/technical blog**, none of these matter. For client projects with non-technical editors, WordPress (or a headless CMS) may still be the right call. But for me, on this blog, the tradeoff is overwhelmingly worth it.

## Conclusion

After **11 years of WordPress**, switching to Hugo felt less like a migration and more like a **liberation**. No more plugin hell, no more PHP, no more database. Just Markdown, Git, and a fast static site that I fully understand and control.

If you are a developer running a blog or a content-heavy site on WordPress, I genuinely recommend giving Hugo a try. Even just for one weekend project. You might never go back either. 🚀
