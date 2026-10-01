document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu');
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('header .navbar ul li a');
    const sections = document.querySelectorAll('section');
    const topBtn = document.querySelector('.top');
    const contactForm = document.getElementById('contactForm');

    // Toggle mobile sidebar menu
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('fa-times');
            header.classList.toggle('toggle');
        });
    }

    // Handle scroll events (ScrollSpy + Top button + close mobile menu)
    window.addEventListener('scroll', () => {
        if (menuBtn && menuBtn.classList.contains('fa-times')) {
            menuBtn.classList.remove('fa-times');
            header.classList.remove('toggle');
        }

        // Show/Hide top button
        if (window.scrollY > 300) {
            topBtn.style.display = 'flex';
        } else {
            topBtn.style.display = 'none';
        }

        // Active section spy
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll for nav links & mobile menu close
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
                if (header.classList.contains('toggle')) {
                    header.classList.remove('toggle');
                    if (menuBtn) menuBtn.classList.remove('fa-times');
                }
            }
        });
    });

    // Counter animation when in view
    let animated = false;
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                const counters = document.querySelectorAll('.counter .box span');
                counters.forEach(counter => {
                    const targetText = counter.innerText.trim();
                    const numMatch = targetText.match(/\d+/);
                    if (numMatch) {
                        const targetNum = parseInt(numMatch[0], 10);
                        const suffix = targetText.replace(numMatch[0], '');
                        let count = 0;
                        const duration = 1500;
                        const stepTime = Math.max(20, Math.floor(duration / targetNum));
                        const timer = setInterval(() => {
                            count += Math.ceil(targetNum / 50) || 1;
                            if (count >= targetNum) {
                                counter.innerText = `${targetNum}${suffix}`;
                                clearInterval(timer);
                            } else {
                                counter.innerText = `${count}${suffix}`;
                            }
                        }, stepTime);
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    const counterSection = document.querySelector('.about .counter');
    if (counterSection) {
        counterObserver.observe(counterSection);
    }

    // Contact form submit handling
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('nameInput')?.value || '';
            const email = document.getElementById('emailInput')?.value || '';
            const subject = document.getElementById('subjectInput')?.value || 'Portfolio Contact';
            const message = document.getElementById('messageInput')?.value || '';

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Open mailto client fallback
                const mailtoUrl = `mailto:subhasis.dev@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Subhasis,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
                window.location.href = mailtoUrl;

                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Ready!';
                submitBtn.style.background = '#2ecc71';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 3000);
            }, 800);
        });
    }
});
