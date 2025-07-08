document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.createElement("div");
  overlay.classList.add("slide-sidebar-overlay");

  const sidebar = document.createElement("aside");
  sidebar.classList.add("slide-sidebar");
  sidebar.innerHTML = `
    <button class="close-sidebar">&times;</button>
    <div class="sidebar-content">
      <div class="sidebar-user-info"></div>
      <nav class="sidebar-nav-links">
        <a href="/index.html#home">Home</a>
        <a href="/index.html#about">About</a>
        <a href="/index.html#category">Categories</a>
        <a href="/index.html#spotlight">Creator Spotlight</a>
      </nav>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(sidebar);

  const hamburger = document.querySelector('.hamburger');
  hamburger.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('active');
  });

  const closeBtn = sidebar.querySelector('.close-sidebar');
  closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });

  // ✅ Close sidebar and highlight active link
  sidebar.querySelectorAll('.sidebar-nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      // Close sidebar
      sidebar.classList.remove('open');
      overlay.classList.remove('active');

      // Remove active from all links
      sidebar.querySelectorAll('.sidebar-nav-links a').forEach(l => l.classList.remove('active'));

      // Add active to clicked link
      link.classList.add('active');
    });
  });

  // ✅ Highlight based on current hash on page load
  const highlightActiveLink = () => {
    const currentHash = window.location.hash || '#home';
    sidebar.querySelectorAll('.sidebar-nav-links a').forEach(link => {
      const hrefHash = link.getAttribute('href').split('#')[1];
      if (`#${hrefHash}` === currentHash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  highlightActiveLink();

  window.addEventListener('hashchange', highlightActiveLink);
});
