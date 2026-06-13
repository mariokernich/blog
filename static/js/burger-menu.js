// Mobile burger menu toggle for the main navigation.
// Adds/removes `.menu-open` on the <header class="header"> element
// when the burger button is clicked. CSS handles the actual show/hide
// and the X-animation of the bars.
(function () {
    const init = () => {
        const btn = document.getElementById("burger-toggle");
        const header = document.querySelector("header.header");
        if (!btn || !header) return;

        const close = () => {
            header.classList.remove("menu-open");
            btn.setAttribute("aria-expanded", "false");
        };

        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = header.classList.toggle("menu-open");
            btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        // Close when clicking any menu link
        header.querySelectorAll("#menu a").forEach((a) => {
            a.addEventListener("click", close);
        });

        // Close when clicking outside the header
        document.addEventListener("click", (e) => {
            if (!header.contains(e.target)) close();
        });

        // Close on Escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") close();
        });

        // Reset on resize above the mobile breakpoint
        const mq = window.matchMedia("(min-width: 800px)");
        const onChange = (ev) => {
            if (ev.matches) close();
        };
        if (mq.addEventListener) mq.addEventListener("change", onChange);
        else mq.addListener(onChange); // Safari < 14 fallback
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
