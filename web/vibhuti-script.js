// VIBHUTI YOGA - ENHANCED NAVIGATION WITH FIXED HEADER & SCROLL SPY

let scrollSpyHandler = null;
let currentScrollTarget = null;

function getScrollContainer() {
    return (window.innerWidth <= 768) ? window : document.getElementById('scroll-container');
}

function getScrollTop() {
    const container = getScrollContainer();
    return (container === window) ? window.pageYOffset : container.scrollTop;
}

function getHeaderHeight() {
    const header = document.getElementById('main-header');
    return header ? header.offsetHeight : 120;
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const headerOffset = getHeaderHeight() + 20;

    if (window.innerWidth <= 768) {
        // Mobile smooth scroll
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    } else {
        // Desktop smooth scroll
        const scrollContainer = document.getElementById('scroll-container');
        if (scrollContainer) {
            const sectionTop = section.offsetTop - headerOffset;
            scrollContainer.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
        }
    }
}

function updateActiveNav() {
    const sections = document.querySelectorAll('.section-full');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = getHeaderHeight();
    const scrollPos = getScrollTop() + headerHeight + 50;

    let current = '';

    sections.forEach(section => {
        let sectionTop;
        if (window.innerWidth <= 768) {
            sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
        } else {
            sectionTop = section.offsetTop;
        }
        const sectionHeight = section.offsetHeight;

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    // If no section is detected, default to first section if at top
    if (!current && scrollPos < 300) {
        current = 'home';
    }

    navLinks.forEach(link => {
        const linkSection = link.getAttribute('data-section') || link.getAttribute('href')?.replace('#', '');
        link.classList.remove('active');
        if (linkSection === current) {
            link.classList.add('active');
        }
    });
}

function initScrollSpy() {
    // Remove previous listener if exists
    if (scrollSpyHandler && currentScrollTarget) {
        currentScrollTarget.removeEventListener('scroll', scrollSpyHandler);
    }

    const scrollTarget = getScrollContainer();
    if (!scrollTarget) return;

    currentScrollTarget = scrollTarget;
    scrollSpyHandler = () => {
        requestAnimationFrame(updateActiveNav);
    };

    scrollTarget.addEventListener('scroll', scrollSpyHandler, { passive: true });

    // Initial update
    updateActiveNav();
}

// Debounce function for resize
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Re-initialize on resize (handles mobile <-> desktop transition)
const handleResize = debounce(() => {
    initScrollSpy();
}, 250);

function copyUPI() {
    const upiId = 'srivsn@icici';
    navigator.clipboard.writeText(upiId).then(() => {
        showCopyNotification();
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = upiId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyNotification();
    });
}

function showCopyNotification() {
    const notification = document.createElement('div');
    notification.textContent = '✓ UPI ID Copied!';
    notification.className = 'copy-notification';
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentNode) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    initScrollSpy();

    // Navigation link click handlers
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href) {
                scrollToSection(href.substring(1));
            }
        });
    });

    // Handle resize for responsive scroll spy
    window.addEventListener('resize', handleResize);

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
