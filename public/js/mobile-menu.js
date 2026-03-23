// Mobile menu toggle for sidebar pages
(function() {
  // Only run on pages with a sidebar
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  // Create hamburger button
  const btn = document.createElement('button');
  btn.className = 'mobile-menu-btn';
  btn.id = 'mobileMenuBtn';
  btn.innerHTML = '☰';
  btn.setAttribute('aria-label', 'Toggle menu');
  document.body.appendChild(btn);

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'mobile-overlay';
  overlay.id = 'mobileOverlay';
  if (sidebar.parentElement) {
    sidebar.parentElement.appendChild(overlay);
  } else {
    document.body.appendChild(overlay);
  }

  function toggleMenu() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
    btn.innerHTML = sidebar.classList.contains('open') ? '✕' : '☰';
  }

  btn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  // Close on nav click
  sidebar.querySelectorAll('.sb-nav li').forEach(function(li) {
    li.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        btn.innerHTML = '☰';
      }
    });
  });

  // Close on resize to desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
      btn.innerHTML = '☰';
    }
  });
})();
