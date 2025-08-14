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
  const fontSize = 26;
  const spacing = 1.8; // vertical spacing multiplier between glyphs
  const lineHeight = Math.round(fontSize * spacing); // pixels per row
  const rowsPerSecond = 2.6; // rows per second (time-based)
  const decayRate = 2; // trail decay per second (for consistent fade)
  let columns = Math.floor(canvas.width / fontSize);
  let drops = [];
  let lastTime = null;

  function resetDrops() {
    columns = Math.floor(canvas.width / fontSize);
    const maxRows = Math.ceil(canvas.height / lineHeight);
    drops = Array.from({ length: columns }, () => Math.random() * maxRows);
  }

  resetDrops();
  window.addEventListener('resize', resetDrops);

  function draw(now) {
    if (lastTime === null) lastTime = now;
    const dt = Math.max(0, (now - lastTime) / 1000); // seconds since last frame
    lastTime = now;

    // Time-based fade to create consistent trails across refresh rates
    const alpha = 1 - Math.exp(-decayRate * dt);
    ctx.fillStyle = 'rgba(0, 0, 0, ' + alpha.toFixed(4) + ')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    for (let i = 0; i < drops.length; i++) {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      const x = i * fontSize;
      const y = Math.floor(drops[i]) * lineHeight;
      ctx.fillText(text, x, y);

      // advance by time-based amount
      drops[i] += rowsPerSecond * dt;

      if (y > canvas.height + lineHeight) {
        // ~50% chance per second to restart
        const p = Math.min(1, 0.5 * dt);
        if (Math.random() < p) drops[i] = 0;
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
