// Dark Mode Toggle
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

// Check for saved theme preference or default to system preference
const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const currentTheme = getPreferredTheme();
document.documentElement.setAttribute('data-theme', currentTheme);

// Update icon based on current theme
if (currentTheme === 'dark') {
    themeIcon.textContent = '☀️';
} else {
    themeIcon.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    
    // Update header background immediately
    updateHeaderBackground();
});

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links with URL updates
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        // If clicking on brand link (#), go to top and clear hash
        if (targetId === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            history.pushState(null, null, window.location.pathname);
            return;
        }
        
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Update URL without triggering page reload
            history.pushState(null, null, targetId);
        }
    });
});

// Handle direct navigation to anchors on page load
window.addEventListener('load', () => {
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100); // Small delay to ensure page is fully loaded
    }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    } else {
        // If no hash, scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Header scroll effect
const updateHeaderBackground = () => {
    const header = document.querySelector('.header');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (window.scrollY > 100) {
        header.style.background = isDark ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = isDark ? '#1a1a1a' : '#fff';
        header.style.backdropFilter = 'none';
    }
};

window.addEventListener('scroll', updateHeaderBackground);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.challenge-card, .achievement, .package').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Stats counter animation
const animateStats = () => {
    const stats = document.querySelectorAll('.stat h3');
    stats.forEach(stat => {
        const originalText = stat.textContent;
        const target = parseFloat(originalText.replace(/[^\d.]/g, ''));
        const hasK = originalText.includes('K');
        const hasM = originalText.includes('M');
        const hasPlus = originalText.includes('+');
        let current = 0;
        const increment = target / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current * 10) / 10; // one decimal place
            let finalText = displayValue.toString();
            
            if (hasM) {
                finalText += 'M';
            } else if (hasK) {
                finalText += 'K';
            }
            
            if (hasPlus) {
                finalText += '+';
            }
            
            stat.textContent = finalText;
        }, 20);
    });
};

// Trigger stats animation when section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Form handling for contact section (if needed later)
const handleContactForm = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log('Form submitted');
};

// Add loading states and error handling
const addLoadingState = (element) => {
    element.style.opacity = '0.7';
    element.style.pointerEvents = 'none';
};

const removeLoadingState = (element) => {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
};

// Challenges carousel functionality
const challengesGrid = document.querySelector('.challenges-grid');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (challengesGrid && prevBtn && nextBtn) {
    // Calculate scroll amount to center next card in viewport
    const getScrollAmount = () => {
        const firstCard = challengesGrid.querySelector('.challenge-card');
        if (firstCard) {
            const cardRect = firstCard.getBoundingClientRect();
            const style = window.getComputedStyle(challengesGrid);
            const gap = parseInt(style.gap) || 32;
            return cardRect.width + gap;
        }
        return 432; // fallback: 400px + 32px gap
    };
    
    prevBtn.addEventListener('click', () => {
        const scrollAmount = getScrollAmount();
        challengesGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
        const scrollAmount = getScrollAmount();
        challengesGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    
    // Update button states based on scroll position
    const updateNavButtons = () => {
        const scrollLeft = challengesGrid.scrollLeft;
        const maxScroll = challengesGrid.scrollWidth - challengesGrid.clientWidth;
        
        prevBtn.disabled = scrollLeft <= 0;
        nextBtn.disabled = scrollLeft >= maxScroll - 1;
    };
    
    challengesGrid.addEventListener('scroll', updateNavButtons);
    updateNavButtons(); // Initial check
    
    // Update on window resize
    window.addEventListener('resize', updateNavButtons);
}

// Enhanced mobile menu behavior
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
});

// Performance optimization: throttle scroll events
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// Apply throttling to scroll events
const throttledScroll = throttle(updateHeaderBackground, 16);

window.addEventListener('scroll', throttledScroll);