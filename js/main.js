document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  // Buka / Tutup Menu saat ikon garis 3 diklik
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Otomatis tutup menu setelah pengguna memilih salah satu link
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const typingElement = document.getElementById('typing-text');

  // HANYA 1 KALIMAT UTAMA
  const words = ['Welcome Portofolio Fadli'];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      // MENGHAPUS TEKS
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // MENGETIK TEKS
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    // Kecepatan Mengetik & Menghapus
    let typeSpeed = isDeleting ? 60 : 100;

    // Jika teks sudah selesai diketik penuh
    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2500; // Diam/tampil selama 2.5 detik sebelum mulai terhapus
      isDeleting = true;
    }
    // Jika teks sudah terhapus total
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      typeSpeed = 500; // Jeda sebentar sebelum mulai mengetik lagi dari awal
    }

    setTimeout(typeEffect, typeSpeed);
  }

  if (typingElement) {
    typeEffect();
  }
});

// canvas background animation
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 60; // Jumlah titik melayang

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1; // Ukuran bervariasi (1px - 4px)
      this.speedX = (Math.random() - 0.5) * 0.4; // Gerakan sangat halus
      this.speedY = (Math.random() - 0.5) * 0.4;

      // Variasi warna soft blue & cyan
      const colors = ['rgba(37, 99, 235, 0.25)' /* Blue */, 'rgba(147, 51, 234, 0.25)' /* Purple */, 'rgba(6, 182, 212, 0.3)' /* Cyan */];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Memantul saat menyentuh pinggir layar
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();
});

// Interaktivitas Video Reels (Hover / Click to Play & Unmute)
document.addEventListener('DOMContentLoaded', () => {
  const reelCards = document.querySelectorAll('.reel-card');

  reelCards.forEach((card) => {
    const video = card.querySelector('video');

    // Play saat kursor mengarah ke video (Hover)
    card.addEventListener('mouseenter', () => {
      video.play();
      card.classList.add('playing');
    });

    // Pause saat kursor keluar dari video
    card.addEventListener('mouseleave', () => {
      video.pause();
      card.classList.remove('playing');
    });

    // Toggle Mute / Unmute saat kartu video diklik
    card.addEventListener('click', () => {
      video.muted = !video.muted;
    });
  });
});
