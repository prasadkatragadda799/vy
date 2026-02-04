// VIBHUTI YOGA - SMART MOBILE & DESKTOP NAVIGATION

function getScrollContainer() {
    // On mobile (<768px), we use the whole screen (window)
    // On desktop, we use the specific scroll container
    return (window.innerWidth <= 768) ? window : document.getElementById('scroll-container');
}

function getScrollTop() {
    const container = getScrollContainer();
    return (container === window) ? window.pageYOffset : container.scrollTop;
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    if (window.innerWidth <= 768) {
        // Mobile smooth scroll
        const headerOffset = 120;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    } else {
        // Desktop smooth scroll
        const scrollContainer = document.getElementById('scroll-container');
        const sectionTop = section.offsetTop - 100;
        scrollContainer.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

function initScrollSpy() {
    const sections = document.querySelectorAll('.section-full');
    const navLinks = document.querySelectorAll('.nav-link');

    // We listen to whichever container is active
    const scrollTarget = (window.innerWidth <= 768) ? window : document.getElementById('scroll-container');

    if (!scrollTarget) return;

    scrollTarget.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = getScrollTop() + 150;

        sections.forEach(section => {
            const sectionTop = (scrollTarget === window) ?
                (section.getBoundingClientRect().top + window.pageYOffset) :
                section.offsetTop;

            const sectionHeight = section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
                // On mobile, scroll the nav bar to keep the active link visible
                // [DISABLED] causing scroll issues on some browsers
                /*
                if (window.innerWidth <= 768) {
                    link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
                */
            }
        });
    });
}

// ... COPY UPI and other functions remain the same ...
function copyUPI() {
    const upiId = 'sacredseva@upi';
    navigator.clipboard.writeText(upiId).then(() => {
        showCopyNotification();
    });
}

function showCopyNotification() {
    const notification = document.createElement('div');
    notification.textContent = '✓ UPI ID Copied!';
    notification.className = 'copy-notification';
    document.body.appendChild(notification);
    setTimeout(() => { document.body.removeChild(notification); }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    initScrollSpy();

    // Navigation link click handlers
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSection(link.getAttribute('href').substring(1));
        });
    });

    // Add toast CSS
    const style = document.createElement('style');
    style.textContent = `
        .copy-notification {
            position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
            background: #f5d794; color: #1a1442; padding: 12px 24px;
            border-radius: 30px; font-weight: bold; z-index: 10001;
            box-shadow: 0 10px 20px rgba(0,0,0,0.3); animation: slideUp 0.3s ease;
        }
        @keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
    `;
    document.head.appendChild(style);
});

window.scrollToSection = scrollToSection;
window.copyUPI = copyUPI;
