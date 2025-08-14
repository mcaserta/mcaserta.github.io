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
  const fontSize = 16;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = [];

  // 3D-like tilt settings (subtle, slow oscillation)
  const tiltMaxDeg = 3; // maximum tilt angle in degrees
  const tiltPeriodSec = 24; // full oscillation period in seconds
  const tiltMaxShear = Math.tan((tiltMaxDeg * Math.PI) / 180);

  function resetDrops() {
    columns = Math.floor(canvas.width / fontSize);
    drops = Array.from({ length: columns }, () => Math.random() * canvas.height / fontSize);
  }

  resetDrops();
  window.addEventListener('resize', resetDrops);

  function draw(now) {
    // Theme-aware faintness
    const themeAttr = document.documentElement.getAttribute('data-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = (themeAttr ? themeAttr === 'dark' : prefersDark);
    const fadeAlpha = isDark ? 0.10 : 0.16; // stronger fade on light to keep background subtle
    const glyphAlpha = isDark ? 0.50 : 0.32; // dimmer in light mode

    // Fade the canvas slightly to create trailing effect
    ctx.fillStyle = 'rgba(0, 0, 0, ' + fadeAlpha + ')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Compute current tilt shear factor based on time
    const t = (now || performance.now()) / 1000; // seconds
    const shear = tiltMaxShear * Math.sin((2 * Math.PI * t) / tiltPeriodSec);

    // Apply shear transform for text drawing only
    ctx.save();
    ctx.setTransform(1, 0, shear, 1, 0, 0); // x' = x + shear * y

    ctx.fillStyle = 'rgba(0, 255, 65, ' + glyphAlpha + ')';
    ctx.font = fontSize + 'px "JetBrains Mono", monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillText(text, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    ctx.restore();

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
