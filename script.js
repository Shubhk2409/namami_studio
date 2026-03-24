/* script.js */

document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const hoverTargets = document.querySelectorAll('.hover-target');

    // Only enable custom cursor if not on a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            // Dot moves instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            // Ring follows with a tiny delay (using requestAnimationFrame for smoothness or simple CSS transition)
            cursorRing.style.left = `${posX}px`;
            cursorRing.style.top = `${posY}px`;
        });

        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            target.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });
    } else {
        cursorDot.style.display = 'none';
        cursorRing.style.display = 'none';
        document.body.style.cursor = 'auto'; // ensure fallback
    }

    // --- Navigation Blur & Mobile Menu ---
    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // --- Intersection Observer for Fade-Ups ---
    const fadeElements = document.querySelectorAll('.fade-up');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // --- Hero Mouse Parallax ---
    const heroBg = document.getElementById('hero-bg');
    const heroSection = document.getElementById('hero');
    
    if (!isTouchDevice && heroBg) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 30;
            const y = (window.innerHeight / 2 - e.pageY) / 30;
            heroBg.style.transform = `translate(${x}px, ${y}px)`;
        });
        heroSection.addEventListener('mouseleave', () => {
            heroBg.style.transform = `translate(0px, 0px)`;
        });
    }

    // --- Portfolio Filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portCards = document.querySelectorAll('.port-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active Class Toggle
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            portCards.forEach(card => {
                // Remove tilt transforms to prevent glitches during scale
                card.style.transform = '';
                
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });

    // --- 3D Hover Tilt Effect (Vanilla JS) ---
    const tiltElements = document.querySelectorAll('.glass-panel, .port-card');
    
    if (!isTouchDevice) {
        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation (max 5 degrees)
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                
                // Glossy reflection mapping
                const glareX = (x / rect.width) * 100;
                const glareY = (y / rect.height) * 100;
                
                // Add temporary class or style property for glare 
                el.style.setProperty('--glare-x', `${glareX}%`);
                el.style.setProperty('--glare-y', `${glareY}%`);
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }

    // --- Portfolio Fullscreen Modal ---
    const fsModal = document.getElementById('fs-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaptionH3 = document.getElementById('modal-h3');
    const modalCaptionP = document.getElementById('modal-p');
    const modalClose = document.getElementById('modal-close');
    const modalBg = document.getElementById('modal-bg');

    portCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img').src;
            const title = card.querySelector('h3').innerText;
            const desc = card.querySelector('p').innerText;
            
            modalImg.src = img;
            modalCaptionH3.innerText = title;
            modalCaptionP.innerText = desc;
            
            fsModal.classList.add('active');
            if(!isTouchDevice) document.body.style.overflow = 'hidden';
            
            // Cursor adjustment for modal
            if(cursorRing) cursorRing.style.borderColor = 'rgba(255,255,255,0.5)';
        });
    });

    const closeFsModal = () => {
        fsModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        if(cursorRing) cursorRing.style.borderColor = 'var(--gold)';
    };

    modalClose.addEventListener('click', closeFsModal);
    modalBg.addEventListener('click', closeFsModal);

    // --- Video Modal ---
    const playBtn = document.getElementById('play-video-btn');
    playBtn.addEventListener('click', () => {
        // Just reusing the FS modal for simplicity in template
        modalImg.src = "https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&q=80&w=1600";
        modalCaptionH3.innerText = "Namami Studio Highlight Reel";
        modalCaptionP.innerText = "Play functionality requires an embedded iframe.";
        fsModal.classList.add('active');
        if(!isTouchDevice) document.body.style.overflow = 'hidden';
    });

    // --- Testimonials Carousel ---
    const testCarousel = document.getElementById('test-carousel');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    let currentSlide = 0;
    const totalSlides = dots.length;
    let autoSlideInterval;

    const goToSlide = (index) => {
        testCarousel.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');
        currentSlide = index;
    };

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetInterval();
        });
    });

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    };

    const startInterval = () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    };

    const resetInterval = () => {
        clearInterval(autoSlideInterval);
        startInterval();
    };

    startInterval();

    // Input animation handling for Labels
    const inputs = document.querySelectorAll('.input-group input, .input-group textarea, .input-group select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            if(!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    // --- Number Counter Animation (Why Us Section) ---
    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-target'));
      if (isNaN(target)) return;
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = el.getAttribute('data-suffix')
            ? target + el.getAttribute('data-suffix')
            : target + '+';
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current) + (el.getAttribute('data-suffix') || '+');
        }
      }, 16);
    }

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.why-num').forEach(el => counterObserver.observe(el));
});
