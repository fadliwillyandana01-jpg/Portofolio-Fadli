document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navbar = document.querySelector('.navbar');

  // Navbar transparan saat di posisi paling atas, lalu jadi putih
  // semi transparan begitu halaman di-scroll agar link tetap nyaman dibaca
  const syncNavbarBackground = () => {
    const isMenuOpen = navLinks.classList.contains('active');
    navbar.classList.toggle('scrolled', window.scrollY > 40 || isMenuOpen);
  };

  // Buka / Tutup Menu saat ikon garis 3 diklik
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    syncNavbarBackground();
  });

  // Otomatis tutup menu setelah pengguna memilih salah satu link
  // (termasuk saat klik logo FW di kiri navbar)
  document.querySelectorAll('.nav-links a, .nav-brand').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      syncNavbarBackground();
    });
  });

  window.addEventListener('scroll', syncNavbarBackground);
  window.addEventListener('resize', syncNavbarBackground);
  syncNavbarBackground();
});

// Animasi reveal per huruf pada judul hero (dipanggil di bagian bawah file ini)
const initHeroTitleReveal = () => {
  const heroTitle = document.querySelector('.hero-title');

  if (!heroTitle) return;

  // Kalau pengguna mengaktifkan "kurangi gerakan" di sistemnya,
  // judul dibiarkan tampil apa adanya tanpa animasi
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const titleText = heroTitle.textContent.trim();

  // Kosongkan judul, lalu bangun ulang jadi per kata & per huruf
  heroTitle.textContent = '';

  titleText.split(' ').forEach((word, index, words) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'hero-title-word';

    [...word].forEach((char) => {
      const letterSpan = document.createElement('span');
      letterSpan.className = 'hero-title-letter';
      letterSpan.textContent = char;
      wordSpan.appendChild(letterSpan);
    });

    heroTitle.appendChild(wordSpan);

    // Spasi antar kata dikembalikan sebagai text node supaya teks tetap bisa wrap
    if (index < words.length - 1) {
      heroTitle.appendChild(document.createTextNode(' '));
    }
  });

  // --letter-index dipakai CSS untuk menghitung jeda kemunculan tiap huruf
  heroTitle.querySelectorAll('.hero-title-letter').forEach((letter, index) => {
    letter.style.setProperty('--letter-index', index);
  });
};

// Skrip ini dimuat di akhir <body>, jadi elemen judul sudah ada saat baris ini jalan.
// Dijalankan langsung supaya judul tidak sempat tampil utuh lalu "berkedip"
// sebelum animasinya mulai.
if (document.querySelector('.hero-title')) {
  initHeroTitleReveal();
} else {
  document.addEventListener('DOMContentLoaded', initHeroTitleReveal);
}

