document.addEventListener('DOMContentLoaded', () => {
    setupOpeningAnimation();
    setupRevealOnScroll();
    setupShortMessagePicker();

    document.querySelectorAll('[data-action]').forEach((button) => {
        button.addEventListener('click', async () => {
            const action = button.getAttribute('data-action');
            if (action === 'share') {
                await sharePage();
                return;
            }
            if (action === 'certificate') {
                scrollToCertificate();
                return;
            }
            if (action === 'slideshow') {
                window.location.href = 'slideshow.html';
                return;
            }
            if (action === 'message') {
                openMessage(getSelectedShortMessage());
                return;
            }
            if (action === 'copy-message') {
                await copyShortMessage();
            }
        });
    });
});

const SHORT_MESSAGES = {
    sweet: 'Happy 6th Monthsarry, my love. You make my world softer, kinder, and sweeter every day.',
    heart: 'Six months with you has been one of the kindest gifts in my life. I will always choose you.',
    forever: 'I love you gently, honestly, and with a heart that keeps choosing you every day.',
    home: 'You feel like home to me. Thank you for six beautiful months of love, peace, and care.'
};

function setupOpeningAnimation() {
    const overlay = document.getElementById('intro-overlay');
    const shell = document.getElementById('page-shell');

    if (!overlay || !shell) return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion) {
        overlay.classList.add('is-hidden');
        shell.classList.add('is-visible');
        return;
    }

    window.setTimeout(() => {
        shell.classList.add('is-visible');
    }, 120);

    window.setTimeout(() => {
        overlay.classList.add('is-hidden');
    }, 1700);
}

function setupShortMessagePicker() {
    const select = document.getElementById('short-message-select');
    const preview = document.getElementById('short-message-preview');

    if (!select || !preview) return;

    const syncPreview = () => {
        preview.textContent = SHORT_MESSAGES[select.value] ?? SHORT_MESSAGES.sweet;
    };

    select.addEventListener('change', syncPreview);
    syncPreview();
}

function getSelectedShortMessage() {
    const select = document.getElementById('short-message-select');
    if (!select) return SHORT_MESSAGES.sweet;

    return SHORT_MESSAGES[select.value] ?? SHORT_MESSAGES.sweet;
}

async function copyShortMessage() {
    const message = getSelectedShortMessage();

    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(message);
            showToast('Message copied ✨');
            return;
        }
    } catch {
        // ignore
    }

    showToast('Copy not supported here');
}

function setupRevealOnScroll() {
    const revealItems = Array.from(document.querySelectorAll('.reveal'));
    if (revealItems.length === 0) return;

    // Small stagger for a more premium feel.
    revealItems.forEach((el, index) => {
        const delayMs = Math.min(index * 70, 280);
        el.style.transitionDelay = `${delayMs}ms`;
    });

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach((el) => el.classList.add('reveal-in'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('reveal-in');
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.12 }
    );

    revealItems.forEach((el) => observer.observe(el));
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.setAttribute('role', 'status');
    toast.className = [
        'fixed',
        'left-1/2',
        'top-6',
        '-translate-x-1/2',
        'z-50',
        'rounded-2xl',
        'bg-white/90',
        'backdrop-blur',
        'px-4',
        'py-3',
        'text-sm',
        'font-medium',
        'text-slate-700',
        'shadow-lg',
        'shadow-black/5',
        'ring-1',
        'ring-black/5',
        'transition',
        'duration-200',
        'opacity-0'
    ].join(' ');
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.remove('opacity-0'));
    window.setTimeout(() => {
        toast.classList.add('opacity-0');
        window.setTimeout(() => toast.remove(), 220);
    }, 1800);
}

async function sharePage() {
    const title = 'Happy 6th Monthsarry From Kent';
    const text = 'Celebrating 6 beautiful months of love, kindness, and sweet memories from Kent.';
    const url = window.location.href;

    try {
        if (navigator.share) {
            await navigator.share({ title, text, url });
            return;
        }
    } catch {
        // User cancelled or share failed; fall back below.
    }

    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(url);
            showToast('Link copied ✨');
            return;
        }
    } catch {
        // ignore
    }

    showToast('Sharing not supported here');
}

function scrollToCertificate() {
    const certificate = document.getElementById('certificate');
    if (!certificate) return;

    certificate.scrollIntoView({ behavior: 'smooth', block: 'start' });

    window.setTimeout(() => {
        certificate.classList.add('shadow-lg', 'shadow-blush-200/70');
        window.setTimeout(() => {
            certificate.classList.remove('shadow-lg', 'shadow-blush-200/70');
        }, 900);
    }, 450);
}

function openMessage(messageText) {
    const subject = encodeURIComponent('Happy 6th Monthsarry, my love');
    const body = encodeURIComponent(`${messageText}\n\n— Kent`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}
