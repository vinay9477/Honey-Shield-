/* ===== THEME TOGGLER (Light/Dark Mode) ===== */

(function() {
  // Check local storage for preference
  const savedTheme = localStorage.getItem('hs_theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  // Initialize theme
  if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
    document.body.classList.add('light-mode');
  }

  // Setup DOM elements when loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Look for toggle buttons (could be mobile menu or sidebar)
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    
    function updateIcon() {
      const isLight = document.body.classList.contains('light-mode');
      toggleBtns.forEach(btn => {
        btn.innerHTML = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
        // If it's just an icon toggle
        if (btn.classList.contains('icon-only')) {
          btn.innerHTML = isLight ? '🌙' : '☀️';
        }
      });
    }

    updateIcon();

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isLight = document.body.classList.toggle('light-mode');
        
        // Save preference
        localStorage.setItem('hs_theme', isLight ? 'light' : 'dark');
        
        // Update icons
        updateIcon();
      });
    });
  });
})();
