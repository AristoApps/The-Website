document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.getAttribute('href').substring(1);
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    });
});
document.addEventListener("DOMContentLoaded", () => {
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: Stop observing after animation
        observer.unobserve(entry.target);
    }
    });
}, {
    threshold: 0.1
});

fadeElements.forEach(el => observer.observe(el));
});