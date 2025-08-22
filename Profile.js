// ======= เคอร์เซอร์ดาว =======
const cursor = document.createElement("div");
cursor.classList.add("cursor-star");
cursor.innerText = "★";
document.body.appendChild(cursor);

document.addEventListener("mousemove", e=>{
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";

  // ดาวเล็กตามเคอร์เซอร์
  const trail = document.createElement("div");
  trail.classList.add("trail-star");
  trail.style.left = e.clientX + "px";
  trail.style.top = e.clientY + "px";
  trail.innerText = "★";
  document.body.appendChild(trail);
  setTimeout(()=>trail.remove(),800);
});

// ======= คลิกสร้างรูป =======
document.querySelectorAll(".img-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const src = btn.dataset.src;
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("pop-image");
    img.style.left = Math.random()*(window.innerWidth-100)+"px";
    img.style.top = Math.random()*(window.innerHeight-100)+"px";
    document.body.appendChild(img);
    setTimeout(()=>img.remove(),1500);
  });
});
/* ---------- Snow Canvas (อยู่หน้าข้อความทั้งหมด) ---------- */
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