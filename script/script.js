// Ensure dataLayer exists
window.dataLayer = window.dataLayer || [];

// Delegated click listener for elements with data-gtm-button
document.addEventListener('click', function (e) {
    var button = e.target.closest('[data-gtm-button]');
    if (!button) return;

    var payload = {
        event: 'portfolio_button_click',          // Custom event name used in GTM
        button_id: button.id || null,             // optional
        button_role: button.getAttribute('data-gtm-button') || null,
        button_text: (button.innerText || button.textContent || '').trim(),
        page_location: window.location.pathname   // optional helpful context
    };

    // If this is an anchor that goes to an external URL (and doesn't open in a new tab),
    // prevent immediate navigation so the dataLayer push + GTM tag has time to fire.
    var isAnchor = button.tagName === 'A' && button.getAttribute('href');
    var href = isAnchor ? button.getAttribute('href') : null;
    var isSpecialScheme = href && (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0);
    var isHash = href && href.indexOf('#') === 0;

    var isExternal = false;
    if (isAnchor && href && !isSpecialScheme && !isHash) {
        try {
            var linkUrl = new URL(href, window.location.href);
            isExternal = linkUrl.origin !== window.location.origin;
        } catch (err) {
            // If URL parsing fails, treat it as non-external to avoid breaking navigation
            isExternal = false;
        }
    }

    if (isAnchor && isExternal && (button.target === null || button.target === '' || button.target === undefined) && !isSpecialScheme && !isHash) {
        // stop navigation, push event, then navigate after a short delay
        e.preventDefault();
        window.dataLayer.push(payload);

        if (window.location.hostname === 'localhost' || /debug|dev/.test(window.location.href)) {
            console.log('GTM push (external link):', payload);
        }

        // Wait briefly so GTM/analytics tags have time to fire. 250ms is usually enough.
        setTimeout(function () {
            window.location.href = href;
        }, 250);

        return;
    }

    // Non-external links or links that open in a new tab: just push and continue
    window.dataLayer.push(payload);

    // Optional: also log to console during dev
    if (window.location.hostname === 'localhost' || /debug|dev/.test(window.location.href)) {
        console.log('GTM push:', payload);
    }
});

// add class navbarDark on navbar scroll
const header = document.querySelector('.navbar');
window.onscroll = function () {
    const top = window.scrollY;
    if (top >= 100) {
        header.classList.add('navbarDark');
    }
    else {
        header.classList.remove('navbarDark');
    }
}
// collapse navbar after click on small devices
const navLinks = document.querySelectorAll('.nav-item')
const menuToggle = document.getElementById('navbarSupportedContent')

navLinks.forEach((l) => {
    l.addEventListener('click', () => { new bootstrap.Collapse(menuToggle).toggle() })
})