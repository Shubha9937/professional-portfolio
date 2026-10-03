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

    // Contact form submit handling (Direct email delivery via FormSubmit - NEVER launches Outlook)
    if (contactForm) {
        const formStatus = document.getElementById('formStatus');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('nameInput')?.value.trim() || '';
            const email = document.getElementById('emailInput')?.value.trim() || '';
            const subject = document.getElementById('subjectInput')?.value.trim() || 'Portfolio Contact';
            const message = document.getElementById('messageInput')?.value.trim() || '';

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            if (formStatus) {
                formStatus.className = 'form-status';
                formStatus.style.display = 'none';
                formStatus.innerText = '';
            }

            try {
                const response = await fetch('https://formsubmit.co/ajax/spsubhasis1998@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        _subject: `Portfolio Inquiry: ${subject}`,
                        message: message,
                        _captcha: 'false',
                        _template: 'table'
                    })
                });

                const data = await response.json();

                if (response.ok && (data.success === 'true' || data.success === true)) {
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
                    submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                    
                    if (formStatus) {
                        formStatus.className = 'form-status success';
                        formStatus.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent directly to Subhasis\'s inbox.';
                    }
                    contactForm.reset();
                } else if (data.message && data.message.toLowerCase().includes('activation')) {
                    submitBtn.innerHTML = '<i class="fas fa-info-circle"></i> Sent (Activation)';
                    submitBtn.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                    if (formStatus) {
                        formStatus.className = 'form-status info';
                        formStatus.innerHTML = '<i class="fas fa-info-circle"></i> Form submitted! Please click the one-time activation link in your Gmail.';
                    }
                    contactForm.reset();
                } else {
                    throw new Error(data.message || 'Submission failed');
                }
            } catch (err) {
                console.error('Form submission error:', err);
                
                if (formStatus) {
                    formStatus.className = 'form-status error';
                    formStatus.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${err.message || 'Failed to deliver message. Please try again or email directly at spsubhasis1998@gmail.com'}`;
                }

                submitBtn.innerHTML = '<i class="fas fa-times-circle"></i> Failed to Send';
                submitBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            } finally {
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 5000);
            }
        });
    }

    // Theme Switcher
    const themeDots = document.querySelectorAll('.theme-dot');
    const savedTheme = localStorage.getItem('portfolio-theme') || 'indigo';
    
    function applyTheme(theme) {
        if (theme === 'indigo') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        themeDots.forEach(dot => {
            if (dot.getAttribute('data-set') === theme) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        localStorage.setItem('portfolio-theme', theme);
    }

    applyTheme(savedTheme);

    themeDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const theme = dot.getAttribute('data-set');
            applyTheme(theme);
        });
    });
});

