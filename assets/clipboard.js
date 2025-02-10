(function () {
  function select(element) {
    const selection = window.getSelection();

    const range = document.createRange();
    range.selectNodeContents(element);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Expose showToast globally
  window.showToast = function(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    // Create and append new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<div class="toast-message">${message}</div>`;
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove toast after delay
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  document.querySelectorAll("pre code").forEach(code => {
    code.addEventListener("click", function (event) {
      if (window.getSelection().toString()) {
        return;
      }
      select(code.parentElement);

      if (navigator.clipboard) {
        navigator.clipboard.writeText(code.parentElement.textContent)
          .then(() => {
            showToast('Copied to clipboard!', true);
          })
          .catch(() => {
            showToast('Failed to copy to clipboard');
          });
      }
    });
  });
})();
