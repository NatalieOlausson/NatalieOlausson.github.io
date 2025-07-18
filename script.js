document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navOverlay = document.querySelector('.nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    let isNavOpen = false;

    function toggleNav() {
        isNavOpen = !isNavOpen;
        navOverlay.style.display = isNavOpen ? 'block' : 'none';
        document.body.style.overflow = isNavOpen ? 'hidden' : 'auto';
        
        // Animate hamburger
        const spans = navToggle.querySelectorAll('span');
        if (isNavOpen) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    navToggle.addEventListener('click', toggleNav);

    // Close mobile nav when clicking on a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleNav();
        });
    });

    // Close mobile nav when clicking outside
    navOverlay.addEventListener('click', function(e) {
        if (e.target === navOverlay) {
            toggleNav();
        }
    });

    // Navigation Active State Management
    const navLinks = document.querySelectorAll('.nav-list a, .mobile-nav a');
    const sections = document.querySelectorAll('section');

    function updateActiveNav() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Smooth Scrolling for Navigation Links
    const allNavLinks = document.querySelectorAll('a[href^="#"]');
    
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header Scroll Effect
    const header = document.querySelector('.header');

    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(115, 111, 95, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(115, 111, 95, 0.95)';
            header.style.boxShadow = 'none';
        }
    }

    // Combined scroll event listener
    window.addEventListener('scroll', function() {
        updateHeader();
        updateActiveNav();
    });

    // Initial call to set correct active state
    updateActiveNav();

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    function openLightbox(imageSrc, imageAlt) {
        lightboxImg.src = imageSrc;
        lightboxImg.alt = imageAlt;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Fade in animation
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.transition = 'opacity 0.3s ease';
            lightbox.style.opacity = '1';
        }, 10);
    }

    function closeLightbox() {
        lightbox.style.transition = 'opacity 0.3s ease';
        lightbox.style.opacity = '0';
        
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    // Add click listeners to gallery items
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                openLightbox(img.src, img.alt);
            }
        });
    });

    // Add click listeners to reel image containers
    const reelImageContainers = document.querySelectorAll('.reel-image-container');
    reelImageContainers.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                openLightbox(img.src, img.alt);
            }
        });
    });

    // Close lightbox events
    lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            closeLightbox();
        }
    });

    // Reels Video Interaction
    const phoneMockups = document.querySelectorAll('.phone-mockup');
    const reelVideos = document.querySelectorAll('.reel-video');

    // Video hover and click interactions
    phoneMockups.forEach((mockup, index) => {
        const video = mockup.querySelector('.reel-video');
        const overlay = mockup.querySelector('.reel-overlay');
        
        if (video) {
            // Set video to start from beginning when loaded
            video.currentTime = 0;
            
            // Hover to play preview
            mockup.addEventListener('mouseenter', function() {
                video.play().catch(e => {
                    console.log('Video play failed:', e);
                });
            });

            // Mouse leave to pause and reset
            mockup.addEventListener('mouseleave', function() {
                video.pause();
                video.currentTime = 0;
            });

            // Click to toggle full play/pause
            mockup.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (video.paused) {
                    // Pause all other videos first
                    reelVideos.forEach(otherVideo => {
                        if (otherVideo !== video) {
                            otherVideo.pause();
                            otherVideo.currentTime = 0;
                        }
                    });
                    
                    video.play().catch(e => {
                        console.log('Video play failed:', e);
                    });
                } else {
                    video.pause();
                }
            });

            // Reset video when it ends
            video.addEventListener('ended', function() {
                this.currentTime = 0;
                this.pause();
            });

            // Video error handling
            video.addEventListener('error', function() {
                console.log('Video failed to load, showing fallback image');
                const img = this.nextElementSibling;
                if (img && img.tagName === 'IMG') {
                    img.style.display = 'block';
                    this.style.display = 'none';
                }
            });
        }
    });

    // Pause all videos when scrolling away from reels section
    let reelsSection = document.getElementById('reels');
    if (reelsSection) {
        const reelsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    // Pause all videos when reels section is not visible
                    reelVideos.forEach(video => {
                        video.pause();
                        video.currentTime = 0;
                    });
                }
            });
        }, { threshold: 0.1 });

        reelsObserver.observe(reelsSection);
    }

    // Touch device handling for reels
    if ('ontouchstart' in window) {
        phoneMockups.forEach(mockup => {
            const video = mockup.querySelector('.reel-video');
            
            // On touch devices, tap to play/pause
            mockup.addEventListener('touchstart', function(e) {
                e.preventDefault();
                
                if (video) {
                    if (video.paused) {
                        // Pause all other videos
                        reelVideos.forEach(otherVideo => {
                            if (otherVideo !== video) {
                                otherVideo.pause();
                                otherVideo.currentTime = 0;
                            }
                        });
                        
                        video.play().catch(e => {
                            console.log('Video play failed:', e);
                        });
                    } else {
                        video.pause();
                    }
                }
            });
        });
    }

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.gallery-item, .contact-info, .phone-mockup, .reel-image-container');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Subtle Parallax Effect for Hero Image
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image img');
        
        if (heroImage && window.innerWidth > 768) {
            const speed = 0.3;
            const yPos = -(scrolled * speed);
            heroImage.style.transform = `translateY(${yPos}px)`;
        }
    }

    // Only apply parallax on desktop
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', handleParallax);
    }

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close mobile nav if window becomes desktop size
            if (window.innerWidth > 768 && isNavOpen) {
                toggleNav();
            }
        }, 250);
    });

    // Preload images and videos for better performance
    function preloadAssets() {
        const imageUrls = [
            'images/hero-main.jpg',
            'images/gallery-1.jpg',
            'images/gallery-2.jpg',
            'images/gallery-3.jpg',
            'images/gallery-4.jpg',
            'images/gallery-5.jpg',
            'images/gallery-6.jpg',
            'images/reel-1-poster.jpg',
            'images/reel-2-poster.jpg',
            'images/reel-3-poster.jpg'
        ];

        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });

        // Preload video posters and set up lazy loading for videos
        const videoSources = [
            'images/reel-1.mp4',
            'images/reel-2.mp4',
            'images/reel-3.mp4'
        ];

        // Only preload video metadata to save bandwidth
        videoSources.forEach(src => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.src = src;
        });
    }

    // Call preload after a short delay
    setTimeout(preloadAssets, 1000);

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
}); 