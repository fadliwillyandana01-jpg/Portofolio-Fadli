/* =========================================================================
   PORTFOLIO FADLI WILLYANDANA - js/main.js
   Isi file:
     1. NAVBAR ......... tombol menu HP + efek latar navbar saat di-scroll
     2. HERO ........... animasi mengetik pada judul "Full-Stack Web Developer"
     3. BAHASA ......... tombol ID / EN di navbar yang mengendalikan mesin
                         penerjemah GTranslate (posisi baca Anda tetap dijaga)
     4. ZOOM GAMBAR .... klik screenshot di kartu project untuk membukanya besar
                         (overlay .img-zoom, gaya tampilannya ada di CSS bagian 6)
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

  /* =====================================================================
     3. PENGATURAN BAHASA: TOMBOL ID / EN (CSS: 2. NAVBAR & 10)
     Mesin penerjemahnya tetap widget GTranslate (script di index.html), tetapi
     tombol bawaannya disembunyikan lewat CSS dan diganti tombol ID / EN di navbar.
     Widget menyediakan fungsi window.doGTranslate("bahasaAsal|bahasaTujuan"),
     yaitu fungsi yang sama dengan yang dipakai tombol bawaannya:
       - pilih English  : halaman langsung diterjemahkan (tanpa muat ulang);
       - pilih Indonesia: catatan bahasa dibersihkan lalu halaman dimuat ulang,
                          cara paling pasti supaya semua teks kembali aslinya.
     Teks halaman diterjemahkan otomatis oleh GTranslate, jadi teks baru
     (mis. kartu project tambahan) TIDAK perlu didaftarkan di bagian ini.
     PENTING: tulis teks baru dalam Bahasa Indonesia (bahasa asli halaman).
     Teks yang sudah berbahasa Inggris akan "diterjemahkan" ulang oleh mesin
     Google dengan hasil rancu. Contoh nyata pada label tombol kartu project:
       "Repository" -> "Repositories" dan "Document" -> "Documents" (jadi jamak),
     sehingga label itu tidak pernah berubah/terasa "tidak ikut diterjemahkan".
     Karena itu label tombol ditulis dalam Bahasa Indonesia di HTML
     ("Demo Langsung", "Repositori", "Pratinjau", "Dokumentasi"), supaya versi
     EN-nya benar: "Live Demo", "Repository", "Preview", "Documentation".
     ===================================================================== */
  const PAGE_LANGUAGE = 'id';              // Bahasa asli halaman
  const LANGUAGE_CODES = ['id', 'en'];     // Bahasa yang bisa dipilih pengunjung
  const LANG_STORAGE_KEY = 'fadli-portfolio-lang'; // Catatan pilihan milik kita
  const langButtons = document.querySelectorAll('[data-lang-btn]');

  // Setelah tombol diklik, mesin terjemahan butuh waktu sebentar. Selama itu
  // pengecekan otomatis di bawah diberi jeda supaya tombol tidak "berkedip".
  let pauseButtonSyncUntil = 0;

  // Catatan bahasa milik widget GTranslate di localStorage. Nama kuncinya tidak
  // ditulis langsung (bisa berubah di versi baru), cukup dikenali dari isinya
  // yang berbentuk {"srcLang":"id","tgtLang":"en"}.
  const readWidgetLanguage = () => {
    try {
      const keys = Object.keys(window.localStorage);
      for (let i = 0; i < keys.length; i += 1) {
        const value = window.localStorage.getItem(keys[i]) || '';
        const found = value.match(/"tgtLang"\s*:\s*"([a-zA-Z-]+)"/);
        if (found) return found[1].slice(0, 2).toLowerCase();
      }
    } catch (error) {
      // localStorage bisa diblokir (mis. mode privat): abaikan saja.
    }
    return '';
  };

  // Pilihan bahasa yang kita simpan sendiri saat tombol ID / EN diklik.
  const readSavedLanguage = () => {
    try {
      const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
      return LANGUAGE_CODES.indexOf(saved) !== -1 ? saved : '';
    } catch (error) {
      return '';
    }
  };

  // Bahasa yang paling mungkin sedang tampil, diambil berurutan dari:
  // (1) atribut lang di <html> yang diisi mesin GTranslate saat menerjemahkan,
  // (2) pilihan yang kita simpan sendiri,
  // (3) catatan bahasa milik widget.
  const readActiveLanguage = () => {
    const htmlLang = (document.documentElement.getAttribute('lang') || '').slice(0, 2).toLowerCase();
    const candidates = [htmlLang, readSavedLanguage(), readWidgetLanguage()];
    for (let i = 0; i < candidates.length; i += 1) {
      const code = candidates[i];
      if (code && code !== PAGE_LANGUAGE && LANGUAGE_CODES.indexOf(code) !== -1) return code;
    }
    return PAGE_LANGUAGE;
  };

  // Tandai tombol bahasa yang sedang dipakai (aria-pressed dibaca pembaca layar).
  const markActiveLanguage = (lang) => {
    langButtons.forEach((btn) => {
      const isActive = btn.getAttribute('data-lang-btn') === lang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  };

  // Hapus catatan bahasa (milik kita & milik widget) supaya halaman berikutnya
  // tampil dalam bahasa asli.
  const clearLanguageMemory = () => {
    try {
      window.localStorage.removeItem(LANG_STORAGE_KEY);
      Object.keys(window.localStorage).forEach((key) => {
        const value = window.localStorage.getItem(key) || '';
        if (value.indexOf('"tgtLang"') !== -1) window.localStorage.removeItem(key);
      });
    } catch (error) {
      // Diabaikan bila localStorage tidak tersedia.
    }
  };

  /* ---------------------------------------------------------------------
     Posisi baca dijaga: mengganti bahasa membuat panjang teks berubah, sehingga
     peramban bisa menggeser tampilan (melompat ke atas maupun ke bawah). Karena
     itu posisi scroll diingat sebentar, lalu dikembalikan dengan animasi halus.
     --------------------------------------------------------------------- */
  const SCROLL_MEMO_KEY = 'fadli-scroll-y';

  // Penanda waktu untuk membedakan gulir yang dilakukan pengunjung sendiri
  // dengan gulir otomatis milik script ini (supaya tidak saling menimpa).
  let visitorScrolledAt = 0;
  let ourScrollUntil = 0;

  window.addEventListener('scroll', () => {
    if (Date.now() > ourScrollUntil) visitorScrolledAt = Date.now();
  });

  // Simpan posisi baca saat ini.
  const rememberScrollPosition = () => {
    try {
      window.sessionStorage.setItem(SCROLL_MEMO_KEY, String(Math.round(window.scrollY || 0)));
    } catch (error) {
      // Diabaikan bila sessionStorage tidak tersedia.
    }
  };

  // Ambil posisi tersimpan lalu hapus catatannya (dipakai sekali saja).
  const takeScrollPosition = () => {
    try {
      const saved = window.sessionStorage.getItem(SCROLL_MEMO_KEY);
      if (saved === null) return null;
      window.sessionStorage.removeItem(SCROLL_MEMO_KEY);
      const position = parseInt(saved, 10);
      return isNaN(position) ? null : position;
    } catch (error) {
      return null;
    }
  };

  // Pindah ke posisi baca tertentu. smooth = true membuat perpindahannya halus;
  // peramban lawas yang belum mendukung opsi tersebut otomatis memakai cara biasa.
  const goToScrollPosition = (position, smooth) => {
    ourScrollUntil = Date.now() + 600; // sebentar, gulir ini milik script
    if (smooth) {
      try {
        window.scrollTo({ top: position, behavior: 'smooth' });
        return;
      } catch (error) {
        // Lanjut ke cara biasa di bawah.
      }
    }
    window.scrollTo(0, position);
  };

  // Dipanggil saat halaman dibuka (kasus tombol ID): kembalikan posisi baca
  // sebelumnya, bukan melompat ke section dari tautan lama atau ke paling atas.
  const restoreScrollAfterLoad = () => {
    const position = takeScrollPosition();
    if (position === null) return;

    // Pemulihan posisi bawaan peramban dimatikan supaya tidak menimpa posisi kita.
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, position);                                          // sebelum halaman terlihat
    window.addEventListener('load', () => window.scrollTo(0, position));   // setelah gambar/font termuat
  };

  restoreScrollAfterLoad();

  // Buka ulang halaman dalam bahasa asli dengan aman:
  // - posisi baca diingat lebih dulu supaya bisa dikembalikan setelah halaman terbuka;
  // - bagian #section dibuang dari alamat memakai history.replaceState (tidak
  //   memicu navigasi apa pun) agar peramban tidak melompat ke section terakhir;
  // - lalu halaman dimuat ulang dari awal (bukan navigasi fragmen).
  const reopenPageKeepingPosition = () => {
    rememberScrollPosition();

    try {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch (error) {
      // Diabaikan bila URL tidak boleh diubah.
    }

    window.location.reload();
  };

  // Ganti bahasa halaman memakai mesin GTranslate.
  const changeLanguage = (lang, attempt) => {
    const tries = attempt || 0;
    pauseButtonSyncUntil = Date.now() + 2500; // Tahan pengecekan otomatis sebentar
    markActiveLanguage(lang);

    // Script widget dimuat dari internet, jadi bisa belum siap saat tombol diklik.
    if (typeof window.doGTranslate !== 'function') {
      if (tries < 12) {
        window.setTimeout(() => changeLanguage(lang, tries + 1), 250);
        return;
      }
      console.warn('[Bahasa] Mesin terjemahan GTranslate belum siap (script gagal dimuat atau diblokir).');
      pauseButtonSyncUntil = 0;
      markActiveLanguage(readActiveLanguage());
      return;
    }

    // Kembali ke bahasa asli: bersihkan catatan bahasa lalu buka ulang halaman
    // (cara paling pasti supaya semua teks kembali aslinya). Posisi baca yang
    // sedang dibuka diingat dulu, jadi setelah halaman terbuka pengunjung tetap
    // berada di bagian yang sama (tidak melompat ke atas/bawah).
    if (lang === PAGE_LANGUAGE) {
      clearLanguageMemory();
      reopenPageKeepingPosition();
      return;
    }

    // Pindah ke bahasa lain: terjemahkan langsung tanpa memuat ulang halaman.
    // Ingat pilihannya & posisi bacanya lebih dulu, lalu kembalikan posisi itu
    // beberapa kali (dengan animasi halus) karena proses terjemahan mengubah
    // panjang teks halaman beberapa saat setelah tombol diklik.
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (error) {
      // Diabaikan bila localStorage tidak tersedia.
    }

    const readingPosition = Math.round(window.scrollY || 0);
    const requestedAt = Date.now();
    window.doGTranslate(`${PAGE_LANGUAGE}|${lang}`);

    [150, 700, 1300].forEach((delay) => {
      window.setTimeout(() => {
        // Lewati bila pengunjung sudah menggulir sendiri: jangan ditarik balik.
        if (visitorScrolledAt > requestedAt) return;
        goToScrollPosition(readingPosition, true);
      }, delay);
    });
  };

  // Klik tombol ID / EN di navbar.
  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => changeLanguage(btn.getAttribute('data-lang-btn')));
  });

  // Samakan tampilan tombol dengan bahasa yang benar-benar tampil. Diperiksa
  // berkala selama ~6 detik pertama, karena terjemahan otomatis "ikut bahasa
  // browser" dari widget berjalan beberapa saat setelah halaman terbuka.
  let languageCheckCount = 0;
  const syncLanguageButtons = () => {
    if (Date.now() >= pauseButtonSyncUntil) markActiveLanguage(readActiveLanguage());
    if (languageCheckCount >= 20) return;
    languageCheckCount += 1;
    window.setTimeout(syncLanguageButtons, 300);
  };

  syncLanguageButtons();

  /* =====================================================================
     4. PRATINJAU GAMBAR PROJECT (CSS: 6. SKILLS & PROJECTS GRID)
     Screenshot di kartu project berisi tulisan kecil, jadi gambarnya bisa
     diklik untuk dibuka dalam ukuran besar (overlay .img-zoom). Overlay-nya
     dibuat otomatis dari sini, sehingga HTML kartu project tidak perlu diubah
     walau jumlah project bertambah. Menutupnya: klik tombol silang, klik
     latar gelap, atau tekan tombol Esc.
     ===================================================================== */
  const zoomableImages = document.querySelectorAll('.project-img-wrapper img');

  if (zoomableImages.length > 0) {
    // Overlay besar: dibuat sekali, lalu dipakai ulang oleh semua gambar.
    const zoomBox = document.createElement('div');
    zoomBox.className = 'img-zoom';
    zoomBox.setAttribute('role', 'dialog');
    zoomBox.setAttribute('aria-modal', 'true');
    zoomBox.setAttribute('aria-label', 'Pratinjau gambar project');

    const zoomImage = document.createElement('img');
    zoomImage.alt = '';

    const zoomCloseButton = document.createElement('button');
    zoomCloseButton.type = 'button';
    zoomCloseButton.className = 'img-zoom-close';
    zoomCloseButton.setAttribute('aria-label', 'Tutup pratinjau gambar');
    zoomCloseButton.textContent = '\u00d7'; // tanda silang (×)

    zoomBox.appendChild(zoomImage);
    zoomBox.appendChild(zoomCloseButton);
    document.body.appendChild(zoomBox);

    // Elemen yang fokus sebelum pratinjau dibuka (dikembalikan lagi saat ditutup).
    let lastFocusedElement = null;

    const closeZoom = () => {
      zoomBox.classList.remove('is-open');
      document.body.classList.remove('img-zoom-open');
      zoomImage.removeAttribute('src');
      if (lastFocusedElement) lastFocusedElement.focus();
    };

    const openZoom = (image) => {
      // Gambar dibuka dari file aslinya (ukuran penuh), bukan versi kecil di kartu.
      zoomImage.src = image.currentSrc || image.src;
      zoomImage.alt = image.alt || 'Gambar project';
      lastFocusedElement = document.activeElement;
      zoomBox.classList.add('is-open');
      document.body.classList.add('img-zoom-open');
      zoomCloseButton.focus();
    };

    zoomableImages.forEach((image) => {
      // Supaya gambar juga bisa dibuka pengguna keyboard (Tab lalu Enter / Spasi).
      image.setAttribute('tabindex', '0');
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', `Perbesar gambar: ${image.alt || 'project'}`);

      image.addEventListener('click', () => openZoom(image));

      image.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openZoom(image);
      });
    });

    // Menutup pratinjau dari beberapa cara yang wajar.
    zoomCloseButton.addEventListener('click', closeZoom);

    zoomBox.addEventListener('click', (event) => {
      // Klik pada latar gelap (bukan pada gambarnya) juga menutup pratinjau.
      if (event.target === zoomBox) closeZoom();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && zoomBox.classList.contains('is-open')) closeZoom();
    });
  }
});