// OS Instructions Tabs
document.addEventListener('DOMContentLoaded', function() {
  const osInstructions = document.querySelectorAll('.os-instructions');
  
  osInstructions.forEach(container => {
    const buttons = container.querySelectorAll('.os-btn');
    const contents = container.querySelectorAll('.os-content > div');
    
    // Detect OS and auto-select tab
    const userOS = detectOS();
    if (userOS) {
      // Remove active class from all buttons and content
      buttons.forEach(btn => btn.classList.remove('active'));
      contents.forEach(content => content.classList.remove('active'));
      
      // Add active class to detected OS
      const osButton = container.querySelector(`.os-btn-${userOS}`);
      const osContent = container.querySelector(`.os-${userOS}`);
      
      if (osButton && osContent) {
        osButton.classList.add('active');
        osContent.classList.add('active');
      } else {
        // Fallback to Windows if OS detection fails or OS not supported
        container.querySelector('.os-btn-win').classList.add('active');
        container.querySelector('.os-windows').classList.add('active');
      }
    }
    
    // Add click handlers
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const os = this.getAttribute('data-os');
        
        // Remove active class from all buttons and content
        buttons.forEach(btn => btn.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        this.classList.add('active');
        container.querySelector(`.os-${os}`).classList.add('active');
      });
    });
  });
  
  // OS detection function
  function detectOS() {
    const userAgent = window.navigator.userAgent;
    
    if (userAgent.indexOf('Windows') !== -1) return 'windows';
    if (userAgent.indexOf('Linux') !== -1) return 'linux';
    if (userAgent.indexOf('Mac') !== -1) return 'mac';
    
    return null;
  }
}); 