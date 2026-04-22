(function() {
  var sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  var btn = document.createElement('button');
  btn.className = 'mobile-menu-btn';
  btn.id = 'mobileMenuBtn';
  btn.innerHTML = '<span class="menu-icon">&#9776;</span>';
  btn.setAttribute('aria-label', 'Toggle menu');
  document.body.appendChild(btn);

  var overlay = document.createElement('div');
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
    btn.innerHTML = sidebar.classList.contains('open')
      ? '<span class="menu-icon">&times;</span>'
      : '<span class="menu-icon">&#9776;</span>';
  }

  btn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  var navItems = sidebar.querySelectorAll('.sb-nav li');
  for (var i = 0; i < navItems.length; i++) {
    navItems[i].addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        btn.innerHTML = '<span class="menu-icon">&#9776;</span>';
      }
    });
  }

  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
      btn.innerHTML = '<span class="menu-icon">&#9776;</span>';
    }
  });
})();
