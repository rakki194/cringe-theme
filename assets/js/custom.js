// OS Instructions Tabs
document.addEventListener('DOMContentLoaded', function() {
  // The OS instructions are now fully handled by the shortcode script
  // No additional initialization needed here
  
  // OS detection function - still useful for other purposes
  function detectOS() {
    const userAgent = window.navigator.userAgent;
    
    if (userAgent.indexOf('Windows') !== -1) return 'windows';
    if (userAgent.indexOf('Linux') !== -1) return 'linux';
    if (userAgent.indexOf('Mac') !== -1) return 'mac';
    
    return null;
  }

  // Theme Toggle Functionality
  function initThemeToggle() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark/light mode');
    themeToggle.innerHTML = '<i class="ms-Icon ms-Icon--PowerButton" aria-hidden="true"></i>';
    
    // Style the button
    themeToggle.style.position = 'fixed';
    themeToggle.style.top = '1rem';
    themeToggle.style.right = '1rem';
    themeToggle.style.zIndex = '1000';
    themeToggle.style.background = 'var(--gray-200)';
    themeToggle.style.border = 'none';
    themeToggle.style.borderRadius = '50%';
    themeToggle.style.width = '2.5rem';
    themeToggle.style.height = '2.5rem';
    themeToggle.style.display = 'flex';
    themeToggle.style.alignItems = 'center';
    themeToggle.style.justifyContent = 'center';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    themeToggle.style.transition = 'background-color 0.3s ease';
    
    // Add to body
    document.body.appendChild(themeToggle);
    
    // Apply saved theme or detect from system
    const savedTheme = localStorage.getItem('theme-preference');
    
    // First, ensure HTML doesn't have the auto class that might interfere
    document.documentElement.classList.remove('theme-auto');
    
    if (savedTheme) {
      // Explicitly set the theme class
      document.documentElement.classList.remove('theme-light', 'theme-dark');
      document.documentElement.classList.add(savedTheme);
      document.documentElement.className = savedTheme; // Ensure className is fully replaced
      updateThemeToggleIcon(savedTheme);
    } else {
      // No saved preference, use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const newTheme = prefersDark ? 'theme-dark' : 'theme-light';
      document.documentElement.classList.remove('theme-light', 'theme-dark');
      document.documentElement.classList.add(newTheme);
      document.documentElement.className = newTheme; // Ensure className is fully replaced
      updateThemeToggleIcon(newTheme);
      
      // Save the initial system preference
      localStorage.setItem('theme-preference', newTheme);
    }
    
    // Add click event
    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.className;
      const newTheme = currentTheme.includes('theme-dark') ? 'theme-light' : 'theme-dark';
      
      // Update class on root html element - both ways to ensure it works
      document.documentElement.classList.remove('theme-light', 'theme-dark');
      document.documentElement.classList.add(newTheme);
      document.documentElement.className = newTheme;
      
      // Save preference
      localStorage.setItem('theme-preference', newTheme);
      
      // Update icon
      updateThemeToggleIcon(newTheme);
      
      // Force update syntax highlighting
      if (typeof updateSyntaxCSS === 'function') {
        updateSyntaxCSS();
      }
    });
    
    function updateThemeToggleIcon(theme) {
      if (theme.includes('theme-dark')) {
        themeToggle.innerHTML = '<i class="ms-Icon ms-Icon--Sunny" aria-hidden="true"></i>';
        themeToggle.style.color = 'var(--color-link)';
      } else {
        themeToggle.innerHTML = '<i class="ms-Icon ms-Icon--ClearNight" aria-hidden="true"></i>';
        themeToggle.style.color = 'var(--color-link)';
      }
    }
  }
  
  // Initialize theme toggle
  initThemeToggle();
  
  // Add event listener for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    // Only apply if no saved preference exists
    if (!localStorage.getItem('theme-preference')) {
      const newTheme = e.matches ? 'theme-dark' : 'theme-light';
      document.documentElement.classList.remove('theme-light', 'theme-dark');
      document.documentElement.classList.add(newTheme);
      document.documentElement.className = newTheme;
      
      // Update icon if theme toggle exists
      const themeToggle = document.getElementById('theme-toggle');
      if (themeToggle) {
        if (newTheme === 'theme-dark') {
          themeToggle.innerHTML = '<i class="ms-Icon ms-Icon--Sunny" aria-hidden="true"></i>';
        } else {
          themeToggle.innerHTML = '<i class="ms-Icon ms-Icon--ClearNight" aria-hidden="true"></i>';
        }
      }
      
      // Force update syntax highlighting
      if (typeof updateSyntaxCSS === 'function') {
        updateSyntaxCSS();
      }
    }
  });
}); 