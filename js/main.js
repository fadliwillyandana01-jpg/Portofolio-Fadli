/* =========================================================================
   PORTFOLIO FADLI WILLYANDANA - js/main.js
   Isi file:
     1. NAVBAR ......... tombol menu HP + efek latar navbar saat di-scroll
     2. HERO ........... animasi mengetik pada judul "Full-Stack Web Developer"
   Semua kode dijalankan setelah HTML siap (event DOMContentLoaded).
   Jika ada error di console, lihat nomor bagian pada komentar di bawah.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  /* =====================================================================
     1. NAVBAR (CSS: 2. NAVBAR)
     Mengatur tombol menu di HP (.menu-toggle) dan latar navbar (.scrolled).
     ===================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navbar = document.querySelector('.navbar');

  // Beri latar putih pada navbar saat halaman di-scroll atau saat menu HP terbuka.
  // Semua elemen bisa null bila ID/class di HTML berubah, jadi selalu dicek dulu.
  const syncNavbarBackground = () => {
    if (!navbar) return;
    const isMenuOpen = navLinks && navLinks.classList.contains('active');
    navbar.classList.toggle('scrolled', window.scrollY > 40 || isMenuOpen);
  };

  // Klik tombol menu: buka/tutup daftar link (menambah/menghapus class .active).
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      syncNavbarBackground();
    });

    // Setelah memilih menu atau logo, tutup kembali daftar link di HP.
    document.querySelectorAll('.nav-links a, .nav-brand').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        syncNavbarBackground();
      });
    });
  }

  // Dipanggil saat scroll, saat ukuran jendela berubah, dan sekali di awal
  // agar kondisi navbar selalu sinkron dengan posisi halaman.
  window.addEventListener('scroll', syncNavbarBackground);
  window.addEventListener('resize', syncNavbarBackground);
  syncNavbarBackground();

  /* =====================================================================
     2. HERO: ANIMASI TEKS KETIK (CSS: 4. HERO SECTION)
     Judul di HTML sudah berisi teks lengkap agar tetap tampil tanpa JS (baik
     untuk SEO); JS hanya "mengetik ulang" teks itu sekali sebagai animasi.
     Bila elemen judul tidak ada, script dihentikan agar tidak error.
     ===================================================================== */
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;

  const fullText = 'Full-Stack Web Developer';

  // Aksesibilitas: bila pengguna mematikan animasi di sistemnya
  // (prefers-reduced-motion), animasi ketik tidak dijalankan.
  const isReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isReducedMotion) {
    // Tanpa animasi: judul langsung ditampilkan utuh.
    heroTitle.textContent = fullText;
    heroTitle.style.minHeight = '';
  } else {
    // Dengan animasi: kosongkan judul, lalu kunci tingginya dulu supaya
    // layout di bawahnya tidak meloncat saat teks sedang diketik.
    heroTitle.textContent = '';
    heroTitle.style.minHeight = `${heroTitle.getBoundingClientRect().height || 92}px`;

    let charIndex = 0;
    const typeSpeed = 100; // Kecepatan mengetik per huruf (ms)

    // Fungsi rekursif: menambah 1 huruf, lalu memanggil dirinya lagi tiap typeSpeed.
    function typeWriter() {
      if (charIndex < fullText.length) {
        heroTitle.textContent += fullText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, typeSpeed);
      } else {
        // Selesai mengetik: lepas kuncian tinggi agar layout kembali mengikuti teks.
        heroTitle.style.minHeight = '';
      }
    }

    typeWriter();
  }
});