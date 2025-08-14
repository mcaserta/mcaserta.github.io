// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = prefersDark ? 'dark' : 'dark'; // Matrix defaults to dark
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = theme === 'light' ? '🟢' : '⚪';
    }
}

// Listen for OS theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const theme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
    }
});

// Initialize theme on page load
initTheme();

// Digital rain moved to separate asset: rain.js

// Mobile menu functionality
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('show');
    }
}

// TOC toggle for smaller screens
function toggleToc() {
    const tocSidebar = document.getElementById('toc-sidebar');
    if (tocSidebar) {
        tocSidebar.classList.toggle('show');
    }
}

// Close mobile menu when clicking outside or on a link
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    
    if (mobileMenu && hamburgerBtn) {
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('show');
            });
        });
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && !hamburgerBtn.contains(event.target)) {
                mobileMenu.classList.remove('show');
            }
        });
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                mobileMenu.classList.remove('show');
            }
        });
    }
});

// Scroll to top functionality
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (!scrollToTopBtn) return;

    function toggleScrollToTopButton() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.addEventListener('scroll', toggleScrollToTopButton);
    scrollToTopBtn.addEventListener('click', scrollToTop);
    toggleScrollToTopButton();
});

// Digital rain-inspired left-to-right text reveal on sidebar links
(function initSidebarRainHover() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const GLYPHS = 'アァカサタナハマヤャラワガ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function runRainReveal(anchor) {
        if (prefersReduced.matches) return;
        if (!anchor || anchor.dataset.rainAnimating === '1') return;
        const original = anchor.textContent || '';
        if (!original.trim()) return;

        anchor.dataset.rainAnimating = '1';
        anchor.dataset.rainOriginal = original;
        anchor.classList.add('link-rain-anim');

        const length = original.length;
        const durationMs = Math.max(280, Math.min(520, Math.round(length * 22)));
        const start = performance.now();

        function frame(now) {
            const t = Math.min(1, (now - start) / durationMs);
            const threshold = t; // 0..1
            let out = '';
            for (let i = 0; i < length; i++) {
                const revealAt = i / Math.max(1, (length - 1));
                if (threshold >= revealAt) {
                    out += original[i];
                } else {
                    out += GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
                }
            }
            anchor.textContent = out;

            if (t < 1) {
                requestAnimationFrame(frame);
            } else {
                anchor.textContent = original;
                anchor.classList.remove('link-rain-anim');
                anchor.dataset.rainAnimating = '0';
            }
        }

        requestAnimationFrame(frame);
    }

    function bindLinks() {
        const selectors = ['.page-links a', '.toc-sidebar .toc a'];
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(a => {
                if (a.dataset.rainBound === '1') return;
                a.dataset.rainBound = '1';
                a.addEventListener('mouseenter', () => runRainReveal(a));
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindLinks);
    } else {
        bindLinks();
    }
})();
