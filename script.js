// Custom cursor glow
document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
});

// Mobile menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'rgba(10, 10, 15, 0.95)';
                navLinks.style.backdropFilter = 'blur(12px)';
                navLinks.style.padding = '1rem 0';
                navLinks.style.gap = '1rem';
                navLinks.style.textAlign = 'center';
            } else {
                navLinks.style.display = '';
            }
        }
    });
}

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        faqItem.classList.toggle('active');
    });
});

// Download modal
const downloadBtn = document.getElementById('downloadBtn');
const modal = document.getElementById('downloadModal');
const closeModal = document.querySelector('.close-modal');

if (downloadBtn && modal) {
    downloadBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });
}

if (closeModal && modal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (modal && e.target === modal) {
        modal.style.display = 'none';
    }
});

// Image logo handling
const logoImg = document.getElementById('site-logo');
const logoText = document.getElementById('logo-text');
if (logoImg) {
    logoImg.onload = () => {
        logoImg.style.display = 'block';
        if (logoText) logoText.style.display = 'none';
    };
    logoImg.onerror = () => {
        console.log('Logo image not found, using text logo');
    };
}

// Version display
const versionElements = document.querySelectorAll('.version-badge, .version-display');
versionElements.forEach(el => {
    if (el) el.textContent = 'v0.0.1';
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .about-card, .credit-card, .faq-item, .key-input-card, .info-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
