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
    if (savedTheme) {
      document.documentElement.className = savedTheme;
      updateThemeToggleIcon(savedTheme);
    } else {
      // No saved preference, use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.className = prefersDark ? 'theme-dark' : 'theme-light';
      updateThemeToggleIcon(prefersDark ? 'theme-dark' : 'theme-light');
    }
    
    // Add click event
    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.className;
      const newTheme = currentTheme === 'theme-dark' ? 'theme-light' : 'theme-dark';
      
      // Update class on root html element
      document.documentElement.className = newTheme;
      
      // Save preference
      localStorage.setItem('theme-preference', newTheme);
      
      // Update icon
      updateThemeToggleIcon(newTheme);
    });
    
    function updateThemeToggleIcon(theme) {
      if (theme === 'theme-dark') {
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
}); 