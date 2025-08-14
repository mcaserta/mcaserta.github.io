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

// Digital rain effect
(function initDigitalRain() {
    const container = document.getElementById('digital-rain');
    if (!container) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロゴゾドボポヴ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 17.6; // 10% larger than 16px
    const rowsPerSecond = 3; // moderate, time-based speed
    const decayRate = 3; // for trail fade; ~0.08 alpha at 60 FPS
    let columns = Math.floor(canvas.width / fontSize);
    let drops = [];
    let seeds = [];
    let trailLengths = [];
    const minTrailRows = 8;
    const maxTrailRows = 28;
    let lastTime = null;

    function resetDrops() {
        columns = Math.floor(canvas.width / fontSize);
        drops = Array.from({ length: columns }, () => Math.random() * canvas.height / fontSize);
        seeds = Array.from({ length: columns }, () => (Math.random() * 4294967296) >>> 0);
        trailLengths = Array.from(
            { length: columns },
            () => Math.floor(minTrailRows + Math.random() * (maxTrailRows - minTrailRows + 1))
        );
    }

    function nextRand(index) {
        // LCG parameters from Numerical Recipes
        let s = seeds[index] >>> 0;
        s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
        seeds[index] = s;
        return (s >>> 0) / 4294967296;
    }

    resetDrops();
    window.addEventListener('resize', resetDrops);

    function draw(now) {
        if (lastTime === null) lastTime = now;
        const dt = Math.max(0, (now - lastTime) / 1000); // seconds
        lastTime = now;

        // Time-based fade to get consistent trail length across refresh rates
        const alpha = 1 - Math.exp(-decayRate * dt);
        ctx.fillStyle = 'rgba(0, 0, 0, ' + alpha.toFixed(4) + ')';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = fontSize + 'px "JetBrains Mono", monospace';

        for (let i = 0; i < drops.length; i++) {
            const x = i * fontSize;
            const yPx = drops[i] * fontSize;

            // Draw head + trail with per-column randomized length
            const length = trailLengths[i] || minTrailRows;
            for (let k = 0; k <= length; k++) {
                const yk = yPx - k * fontSize;
                if (yk < -fontSize) break; // off top; remaining will be off-screen too
                if (yk > canvas.height) continue; // off bottom; still need to advance head

                const ch = characters.charAt(Math.floor(nextRand(i) * characters.length));
                if (k === 0) {
                    // brighter head
                    ctx.fillStyle = 'rgba(184, 255, 206, 1)';
                } else {
                    const alphaTail = Math.max(0, 1 - k / (length + 1));
                    ctx.fillStyle = 'rgba(0, 255, 65, ' + (alphaTail * 0.9).toFixed(3) + ')';
                }
                ctx.fillText(ch, x, yk);
            }

            // Advance by rows per second scaled by dt
            drops[i] += rowsPerSecond * dt;

            // Time-based reset probability once off-screen
            if (yPx > canvas.height) {
                // ~50% chance per second to restart a stream
                const p = Math.min(1, 0.5 * dt);
                if (Math.random() < p) {
                    drops[i] = 0;
                    // Reseed this column so its sequence changes on restart
                    seeds[i] = (Math.random() * 4294967296) >>> 0;
                    // Randomize trail length on restart
                    trailLengths[i] = Math.floor(
                        minTrailRows + Math.random() * (maxTrailRows - minTrailRows + 1)
                    );
                }
            }
        }

        requestAnimationFrame(draw);
    }

    // Ensure canvas sits behind content
    Object.assign(container.style, {
        position: 'fixed',
        left: '0',
        top: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '0'
    });
    Object.assign(canvas.style, { display: 'block', width: '100%', height: '100%' });

    requestAnimationFrame(draw);
})();

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
