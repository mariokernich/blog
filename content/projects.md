---
title: "Projects"
url: "/projects/"
layout: "single"
summary: "A selection of my projects and open-source contributions."
ShowReadingTime: false
ShowWordCount: false
ShowBreadCrumbs: true
ShowPostNavLinks: false
ShowToc: false
hideMeta: true
disableShare: true
---

On this page you’ll find a selection of my projects. Each project includes a brief description and is accessible via GitHub, allowing you to explore the functionality and code directly. Discover what I’m currently working on and the solutions I’m developing.

---

<style>
.main {
    max-width: 1000px;
}
.project-container {
    display: flex;
    flex-wrap: wrap;
    gap: 32px;
    margin: 48px 0;
    align-items: center;
}
.project-container:nth-of-type(even) {
    flex-direction: row-reverse;
}
.project-text {
    flex: 1.2;
    min-width: 280px;
}
.project-image {
    flex: 1;
    min-width: 280px;
}
.project-image img {
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: auto;
    display: block;
}
hr.project-divider {
    margin: 40px 0;
    opacity: 0.15;
}

</style>

<div class="project-container">
    <div class="project-text">
        <h2>ODAPU</h2>
        <p>A solution for SAP On-Premise and Cloud for easy testing of OData (SEGW & RAP) and ABAP Push Channel (APC). It unifies classic and modern technologies in one central place. Multiple projects can be tested in parallel using tabs. Scenarios can be assembled via UI without code and saved for later use.</p>
        <a href="https://github.com/mariokernich/odapu-abap" title="Go to ODAPU GitHub Repository" class="btn" target="_blank" rel="noopener"><span class="btn-inner">GitHub Repository</span></a>
    </div>
    <div class="project-image">
        <img src="/images/projects/odapu.png" alt="Screenshot of ODAPU">
    </div>
</div>

<hr class="project-divider">

<div class="project-container">
    <div class="project-text">
        <h2>N8N ABAP AI DOCUMENTATION</h2>
        <p>Using the tech stack n8n, Pandoc, Markdown, Mermaid, and OpenAI, a workflow was implemented that automatically documents development objects from SAP packages.</p>
        <a href="https://github.com/SWANGmbH/abap-ai-documentation" title="Go to N8N AI Documentation GitHub Repository" class="btn" target="_blank" rel="noopener"><span class="btn-inner">GitHub Repository</span></a>
    </div>
    <div class="project-image">
        <img src="/images/projects/n8n-workflow.png" alt="Screenshot of n8n Workflow">
    </div>
</div>

<hr class="project-divider">

<div class="project-container">
    <div class="project-text">
        <h2>T-CODE FINDER</h2>
        <p>User-friendly overview with search functionality to quickly find SAP transactions, featuring various click options like clipboard or WebGUI. Live version: <a href="https://tcodes.kernich.de/" target="_blank" rel="noopener">tcodes.kernich.de</a></p>
        <a href="https://github.com/mariokernich/ui5-tcode-finder" title="Go to T-Code Finder GitHub Repository" class="btn" target="_blank" rel="noopener"><span class="btn-inner">GitHub Repository</span></a>
    </div>
    <div class="project-image">
        <img src="/images/projects/tcode-finder.png" alt="Screenshot of T-Code Finder">
    </div>
</div>

<hr class="project-divider">

<div class="project-container">
    <div class="project-text">
        <h2>UI5 FONT AWESOME LIBRARY</h2>
        <p>A UI5 library that provides all free Font Awesome icons. The library can be easily installed as an NPM package.</p>
        <a href="https://github.com/ui5-community/ui5-fontawesome-lib" title="Go to UI5 Font Awesome Library GitHub Repository" class="btn" target="_blank" rel="noopener"><span class="btn-inner">GitHub Repository</span></a>
    </div>
    <div class="project-image">
        <img src="/images/projects/font-awesome-lib.png" alt="Screenshot of Font Awesome Library Repository">
    </div>
</div>

<hr class="project-divider">

<div class="project-container">
    <div class="project-text">
        <h2>EXTENDED ICON EXPLORER</h2>
        <p>An extension of the classic UI5 Icon Explorer featuring icons from the UI5 Font Awesome Library project.</p>
        <a href="https://github.com/ui5-community/ui5-icon-explorer" title="Go to Extended Icon Explorer GitHub Repository" class="btn" target="_blank" rel="noopener"><span class="btn-inner">GitHub Repository</span></a>
    </div>
    <div class="project-image">
        <img src="/images/projects/icon-explorer.jpg" alt="Screenshot of Extended Icon Explorer">
    </div>
</div>

<hr class="project-divider">

<div class="project-container">
    <div class="project-text">
        <h2>TYPESCRIPT FIORI PLUGIN</h2>
        <p>A simple example of implementing a Fiori Launchpad plugin using the new <a href="https://ui5.sap.com/#/api/sap.ushell.services.Extension%23methods/Summary" target="_blank" rel="noopener">Extension API</a> available from UI5 1.120.0.</p>
        <a href="https://github.com/mariokernich/fiori-fullscreen-plugin/tree/main" title="Go to TypeScript Fiori Plugin GitHub Repository" class="btn" target="_blank" rel="noopener"><span class="btn-inner">GitHub Repository</span></a>
    </div>
    <div class="project-image">
        <img src="/images/projects/fiori-plugin.png" alt="Fiori Plugin Example">
    </div>
</div>
