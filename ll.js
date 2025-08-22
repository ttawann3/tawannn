(function () {
  const MAX_STARS = 100; // จำกัดจำนวนดาวเล็ก
  let starCount = 0;

  // === เคอร์เซอร์หลัก (ดาวใหญ่แทนเมาส์) ===
  const cursor = document.createElement("div");
  cursor.style.position = "fixed";
  cursor.style.width = "24px";
  cursor.style.height = "24px";
  cursor.style.background = "yellow";
  cursor.style.clipPath =
    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
  cursor.style.pointerEvents = "none";
  cursor.style.zIndex = "9999";
  document.body.appendChild(cursor);

  // === อัพเดตตำแหน่งดาวหลัก ===
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX - 12 + "px";
    cursor.style.top = e.clientY - 12 + "px";
    createTrailStar(e.clientX, e.clientY);
  });

  // === สร้างดาวเล็กตามหลัง ===
  function createTrailStar(x, y) {
    if (starCount > MAX_STARS) return;

    const star = document.createElement("div");
    star.className = "trail-star";
    star.style.left = x + "px";
    star.style.top = y + "px";

    document.body.appendChild(star);
    starCount++;

    star.addEventListener("animationend", () => {
      star.remove();
      starCount--;
    });
  }
})();
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'snow-canvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w, h, dpr, flakes = [];
  const FLAKE_COUNT_BASE = 120; // ปรับจำนวนหิมะพื้นฐาน
  let flakeCount = FLAKE_COUNT_BASE;

  function resize() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // สเกลจำนวนเกล็ดตามขนาดหน้าจอ
    flakeCount = Math.floor(FLAKE_COUNT_BASE * (w * h) / (1280 * 720));
    flakeCount = Math.min(400, Math.max(80, flakeCount));

    if (flakes.length < flakeCount) {
      for (let i = flakes.length; i < flakeCount; i++) {
        flakes.push(makeFlake(true));
      }
    } else if (flakes.length > flakeCount) {
      flakes.length = flakeCount;
    }
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function makeFlake(spawnTop = false) {
    return {
      x: rand(0, w),
      y: spawnTop ? rand(-h, 0) : rand(0, h),
      r: rand(8.8, 2.2),           // รัศมีเกล็ด
      sp: rand(1.35, 1.2),         // ความเร็วตก
      drift: rand(-0.6, 0.6),      // ลมพัดด้านข้าง
      phase: rand(0, Math.PI * 2), // โคลงเคลง
      alpha: rand(0.35, 0.85)
    };
  }

  function update() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];

      // อัปเดตตำแหน่ง
      f.phase += 0.01;
      f.x += Math.sin(f.phase) * 0.5 + f.drift;
      f.y += f.sp;

      // วนกลับด้านบนถ้าหลุดจอ
      if (f.y - f.r > h) {
        flakes[i] = makeFlake(true);
        continue;
      }
      if (f.x < -10) f.x = w + 10;
      if (f.x > w + 10) f.x = -10;

      // วาด
      ctx.globalAlpha = f.alpha;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(update);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  update();
})();