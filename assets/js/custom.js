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

  // Function to update all elements with hardcoded colors
  function updateElementStyles(newTheme) {
    // For auto theme, determine the actual theme based on system preference
    let effectiveTheme = newTheme;
    if (newTheme === 'theme-auto') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'theme-dark' : 'theme-light';
    }
    
    // Root elements
    if (effectiveTheme === 'theme-light') {
      document.documentElement.style.backgroundColor = '#eff1f5';
      document.documentElement.style.color = '#4c4f69';
      document.body.style.backgroundColor = '#eff1f5';
      document.body.style.color = '#4c4f69';
    } else {
      document.documentElement.style.backgroundColor = '#1e1e2e';
      document.documentElement.style.color = '#cdd6f4';
      document.body.style.backgroundColor = '#1e1e2e';
      document.body.style.color = '#cdd6f4';
    }
    
    // Update content elements that may have internal styles
    const articleContent = document.querySelector('.book-article-content');
    if (articleContent) {
      if (effectiveTheme === 'theme-light') {
        articleContent.style.backgroundColor = '#eff1f5';
        articleContent.style.color = '#4c4f69';
      } else {
        articleContent.style.backgroundColor = '#1e1e2e';
        articleContent.style.color = '#cdd6f4';
      }
    }
    
    // Update all section elements
    const sections = document.querySelectorAll('section, article, div.book-page, aside');
    sections.forEach(section => {
      if (effectiveTheme === 'theme-light') {
        section.style.backgroundColor = '#eff1f5';
        section.style.color = '#4c4f69';
      } else {
        section.style.backgroundColor = '#1e1e2e';
        section.style.color = '#cdd6f4';
      }
    });
    
    // Force CSS variables update by toggling a class
    document.body.classList.add('theme-update');
    setTimeout(() => {
      document.body.classList.remove('theme-update');
    }, 10);
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
      // User has a saved preference, apply it
      document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-auto');
      document.documentElement.classList.add(savedTheme);
      document.documentElement.className = savedTheme; // Ensure className is fully replaced
      
      // Apply direct styles to all elements
      updateElementStyles(savedTheme);
      
      updateThemeToggleIcon(savedTheme);
    } else {
      // No saved preference - use auto theme which follows system preference
      document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-auto');
      document.documentElement.classList.add('theme-auto');
      document.documentElement.className = 'theme-auto';
      
      // Apply direct styles to all elements based on auto theme
      updateElementStyles('theme-auto');
      
      // Update toggle icon to show auto mode
      updateThemeToggleIcon('theme-auto');
    }
    
    // Add click event
    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.className;
      let newTheme;
      
      // Cycle through the themes: light → dark → auto → light
      if (currentTheme.includes('theme-light')) {
        newTheme = 'theme-dark';
      } else if (currentTheme.includes('theme-dark')) {
        newTheme = 'theme-auto';
      } else {
        newTheme = 'theme-light';
      }
      
      // Update class on root html element
      document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-auto');
      document.documentElement.classList.add(newTheme);
      document.documentElement.className = newTheme;
      
      // Apply direct styles to all relevant elements
      updateElementStyles(newTheme);
      
      // Save preference, or remove it if using auto mode
      if (newTheme === 'theme-auto') {
        localStorage.removeItem('theme-preference'); // Remove saved preference to follow system
      } else {
        localStorage.setItem('theme-preference', newTheme);
      }
      
      // Update icon
      updateThemeToggleIcon(newTheme);
      
      // Force update syntax highlighting
      if (typeof updateSyntaxCSS === 'function') {
        updateSyntaxCSS();
      }
    });
    
    function updateThemeToggleIcon(theme) {
      if (theme === 'theme-auto') {
        // Icon for auto/system mode
        themeToggle.innerHTML = '<i class="ms-Icon ms-Icon--PowerApps2019" aria-hidden="true"></i>';
        themeToggle.style.color = 'var(--color-link)';
        themeToggle.title = 'Currently following system preference. Click to switch to light mode.';
      } else if (theme.includes('theme-dark')) {
        themeToggle.innerHTML = '<i class="ms-Icon ms-Icon--Sunny" aria-hidden="true"></i>';
        themeToggle.style.color = 'var(--color-link)';
        themeToggle.title = 'Currently using dark mode. Click to switch to auto mode.';
      } else {
        themeToggle.innerHTML = '<i class="ms-Icon ms-Icon--ClearNight" aria-hidden="true"></i>';
        themeToggle.style.color = 'var(--color-link)';
        themeToggle.title = 'Currently using light mode. Click to switch to dark mode.';
      }
    }
  }
  
  // Initialize theme toggle
  initThemeToggle();
  
  // Add event listener for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    // Apply the system preference if we're in auto mode or don't have a saved preference
    const savedTheme = localStorage.getItem('theme-preference');
    const currentTheme = document.documentElement.className;
    
    if (!savedTheme || currentTheme === 'theme-auto') {
      // We're in auto mode, follow system preference
      // We don't change the theme-auto class, just apply the visual changes
      updateElementStyles('theme-auto');
      
      // Update icon if theme toggle exists and we're in auto mode
      const themeToggle = document.getElementById('theme-toggle');
      if (themeToggle && currentTheme === 'theme-auto') {
        updateThemeToggleIcon('theme-auto');
      }
      
      // Force update syntax highlighting
      if (typeof updateSyntaxCSS === 'function') {
        updateSyntaxCSS();
      }
    }
  });
}); 