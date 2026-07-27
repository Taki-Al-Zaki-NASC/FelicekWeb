/**
 * Felicek — Shared JavaScript
 * Version: 2.1.0
 * Description: Shared utilities for all pages (index, app, privacy, terms)
 */

(function() {
    'use strict';

    // ─── DOM Ready Check ──────────────────────────────────────────────
    function domReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    // ─── Mobile Menu Toggle ───────────────────────────────────────────
    function initMobileMenu() {
        const toggle = document.getElementById('menuToggle');
        const nav = document.getElementById('navLinks');

        if (!toggle || !nav) return;

        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            nav.classList.toggle('open');
            const isOpen = nav.classList.contains('open');
            toggle.innerHTML = isOpen ?
                '<i class="fas fa-times"></i>' :
                '<i class="fas fa-bars"></i>';
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== toggle) {
                nav.classList.remove('open');
                toggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        // Close menu on link click (for single-page nav)
        nav.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                nav.classList.remove('open');
                toggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // ─── APK Modal ────────────────────────────────────────────────────
    function initApkModal() {
        const modal = document.getElementById('apkModal');
        if (!modal) return;

        const closeBtn = document.getElementById('apkModalClose');
        const cancelBtn = document.getElementById('apkModalCancel');
        const downloadLink = document.getElementById('apkDownloadLink');

        // Find all download buttons (hero, header, CTA, etc.)
        const downloadBtns = document.querySelectorAll(
            '#downloadApkBtn, #downloadApkBtn2, .download-apk-btn, .btn-download'
        );

        // ── Open modal ──
        function openModal(e) {
            if (e) e.preventDefault();
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        // ── Close modal ──
        function closeModal(e) {
            if (e) e.preventDefault();
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }

        // ── Bind download buttons ──
        downloadBtns.forEach(function(btn) {
            btn.addEventListener('click', openModal);
        });

        // ── Bind close buttons ──
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

        // ── Close on overlay click ──
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });

        // ── Close on Escape key ──
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeModal();
            }
        });

        // ── Download link ──
        if (downloadLink) {
            downloadLink.addEventListener('click', function(e) {
                e.preventDefault();
                alert('📱 APK download would start here.\n\nBuild: v2.1.0 · 12 MB\nSHA-256: 5f4d…a9c2');
                closeModal();
            });
        }

        // ── Also bind any button with class .apk-trigger ──
        document.querySelectorAll('.apk-trigger').forEach(function(btn) {
            btn.addEventListener('click', openModal);
        });

        // ── Expose open/close globally for other scripts ──
        window.__felicekModal = {
            open: openModal,
            close: closeModal,
            isOpen: function() { return modal.classList.contains('open'); }
        };

        console.log('📱 APK Modal initialized.');
    }

    // ─── Smooth Scroll for Anchor Links ──────────────────────────────
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            // Skip if it's a TOC link that already has its own handler
            if (anchor.closest('.toc-grid')) return;
            if (anchor.getAttribute('href') === '#') return;

            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();

                const offset = 80; // Fixed header offset
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // ─── Back to Top Button ──────────────────────────────────────────
    function initBackToTop() {
        const backTop = document.getElementById('backTop');
        if (!backTop) return;

        let isVisible = false;

        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY || window.pageYOffset;
            if (scrollY > 400 && !isVisible) {
                backTop.classList.add('visible');
                isVisible = true;
            } else if (scrollY <= 400 && isVisible) {
                backTop.classList.remove('visible');
                isVisible = false;
            }
        });

        backTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ─── Table of Contents Smooth Scroll ─────────────────────────────
    function initTocScroll() {
        document.querySelectorAll('.toc-grid a, .toc a').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const target = document.querySelector(targetId);
                if (!target) return;

                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // ─── Nav CTA Active State ────────────────────────────────────────
    function initNavState() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-links a');

        navLinks.forEach(function(link) {
            const href = link.getAttribute('href');
            if (href && href !== '#' && href !== 'index.html') {
                // Check if current page matches the link
                if (currentPath.endsWith(href) || currentPath === href) {
                    link.classList.add('active');
                }
            }
        });
    }

    // ─── Keyboard Shortcuts ──────────────────────────────────────────
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl+Shift+D → open APK modal (for testing)
            if (e.ctrlKey && e.shiftKey && (e.key === 'd' || e.key === 'D')) {
                e.preventDefault();
                if (window.__felicekModal) {
                    window.__felicekModal.open();
                }
            }

            // Ctrl+Shift+H → go home (for testing)
            if (e.ctrlKey && e.shiftKey && (e.key === 'h' || e.key === 'H')) {
                e.preventDefault();
                window.location.href = 'index.html';
            }
        });
    }

    // ─── Print Button (for legal pages) ─────────────────────────────
    function initPrintButton() {
        const printBtn = document.getElementById('printBtn');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                window.print();
            });
        }
    }

    // ─── Theme Toggle (optional – for future dark mode) ──────────────
    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        // Check saved preference
        const savedTheme = localStorage.getItem('felicek_theme') || 'light';
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        themeToggle.addEventListener('click', function() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('felicek_theme', newTheme);
        });
    }

    // ─── Scroll Progress (for legal pages) ───────────────────────────
    function initScrollProgress() {
        const progressBar = document.getElementById('scrollProgress');
        if (!progressBar) return;

        window.addEventListener('scroll', function() {
            const scrollTop = window.scrollY || window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = progress + '%';
        });
    }

    // ─── Lazy Load Images (optional) ─────────────────────────────────
    function initLazyLoad() {
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[data-src]');
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(function(img) {
                observer.observe(img);
            });
        }
    }

    // ─── Detect if user is on mobile (for responsive tweaks) ────────
    function isMobile() {
        return window.innerWidth < 768;
    }

    // ─── Expose utilities globally ──────────────────────────────────
    window.__felicek = {
        isMobile: isMobile,
        version: '2.1.0',
        init: function() {
            console.log('🍳 Felicek v2.1.0 — Shared scripts loaded.');
        }
    };

    // ─── Initialize Everything ──────────────────────────────────────
    domReady(function() {
        initMobileMenu();
        initApkModal();
        initSmoothScroll();
        initBackToTop();
        initTocScroll();
        initNavState();
        initKeyboardShortcuts();
        initPrintButton();
        initThemeToggle();
        initScrollProgress();
        initLazyLoad();

        console.log('✅ Felicek shared scripts initialized.');
    });

})();