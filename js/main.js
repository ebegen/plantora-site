document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize logic
    initLanguage();
    initLanguageSelector();
});

// Supported languages
const supportedLangs = ['en', 'tr', 'de', 'fr', 'es', 'it', 'pt', 'ja', 'ko', 'zh'];
const langNames = {
    en: '🇺🇸 English',
    tr: '🇹🇷 Türkçe',
    de: '🇩🇪 Deutsch',
    fr: '🇫🇷 Français',
    es: '🇪🇸 Español',
    it: '🇮🇹 Italiano',
    pt: '🇵🇹 Português',
    ja: '🇯🇵 日本語',
    ko: '🇰🇷 한국어',
    zh: '🇨🇳 中文'
};

function initLanguage() {
    // 1. Check Query Parameter (?lang=xx)
    const urlParams = new URLSearchParams(window.location.search);
    const queryLang = urlParams.get('lang');

    // 2. Check Local Storage
    const localLang = localStorage.getItem('plantora_lang');

    // 3. Check Browser Language
    const browserLang = navigator.language.split('-')[0];

    // Priority: Query > LocalStorage > Browser > Default(en)
    let lang = 'en';
    if (queryLang && supportedLangs.includes(queryLang)) {
        lang = queryLang;
    } else if (localLang && supportedLangs.includes(localLang)) {
        lang = localLang;
    } else if (supportedLangs.includes(browserLang)) {
        lang = browserLang;
    }

    setLanguage(lang);
}

function setLanguage(lang) {
    if (!translations[lang]) return;

    // Update active state in selector if exists
    localStorage.setItem('plantora_lang', lang);
    document.documentElement.lang = lang;

    // Apply translations
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            // Preserve HTML tags if needed (using innerHTML)
            element.innerHTML = translations[lang][key];
        }
    });

    // Update Dropdown Button Text if it exists
    const btn = document.getElementById('lang-btn-text');
    if (btn) {
        btn.textContent = langNames[lang].split(' ')[0]; // Just the flag
    }
}

function initLanguageSelector() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    // Create container
    const langContainer = document.createElement('div');
    langContainer.className = 'lang-dropdown';
    langContainer.style.display = 'inline-block';
    langContainer.style.marginLeft = '20px';
    langContainer.style.position = 'relative';

    // Current lang
    const currentLang = localStorage.getItem('plantora_lang') || 'en';

    // Button
    const btn = document.createElement('button');
    btn.className = 'lang-btn';
    btn.innerHTML = `<span id="lang-btn-text">${langNames[currentLang].split(' ')[0]}</span> ▾`;
    // Styles for button
    btn.style.background = 'transparent';
    btn.style.border = '1px solid currentColor';
    btn.style.borderRadius = '20px';
    btn.style.padding = '6px 12px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '1rem';
    btn.style.color = 'var(--text-primary)';

    // Dropdown List
    const list = document.createElement('div');
    list.className = 'lang-list';
    list.style.display = 'none';
    list.style.position = 'absolute';
    list.style.top = '100%';
    list.style.right = '0';
    list.style.background = 'var(--sand-bg)';
    list.style.border = '1px solid rgba(0,0,0,0.1)';
    list.style.borderRadius = '12px';
    list.style.padding = '8px 0';
    list.style.minWidth = '140px';
    list.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
    list.style.zIndex = '1000';

    // Populate list
    supportedLangs.forEach(code => {
        const item = document.createElement('div');
        item.textContent = langNames[code];
        item.style.padding = '8px 16px';
        item.style.cursor = 'pointer';
        item.style.fontSize = '0.9rem';
        item.style.color = 'var(--text-primary)';

        item.onmouseover = () => item.style.background = 'rgba(0,0,0,0.05)';
        item.onmouseout = () => item.style.background = 'transparent';

        item.onclick = () => {
            setLanguage(code);
            list.style.display = 'none';
        };
        list.appendChild(item);
    });

    // Toggle
    btn.onclick = (e) => {
        e.stopPropagation();
        list.style.display = list.style.display === 'none' ? 'block' : 'none';
    };

    // Close on click outside
    document.addEventListener('click', () => {
        list.style.display = 'none';
    });

    langContainer.appendChild(btn);
    langContainer.appendChild(list);
    nav.appendChild(langContainer);
}
