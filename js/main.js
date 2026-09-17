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
  const words = ['Full STack Web Developer'];

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

