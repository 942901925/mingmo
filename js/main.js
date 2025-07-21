// WUCHANG: Fallen Feathers - 主要JavaScript功能

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initScrollAnimations();
    initLazyLoading();
    initMediaGallery();
    initSEOOptimizations();
    initGoogleAds();
});

// 导航栏功能
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.createElement('button');
    navToggle.className = 'nav-toggle';
    navToggle.innerHTML = '☰';
    navToggle.style.display = 'none';
    
    // 移动端导航切换
    if (window.innerWidth <= 768) {
        navToggle.style.display = 'block';
        navToggle.style.background = 'none';
        navToggle.style.border = 'none';
        navToggle.style.color = 'var(--accent-gold)';
        navToggle.style.fontSize = '1.5rem';
        navToggle.style.cursor = 'pointer';
        
        const navContainer = document.querySelector('.nav-container');
        navContainer.appendChild(navToggle);
        
        navToggle.addEventListener('click', function() {
            const navMenu = document.querySelector('.nav-menu');
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // 滚动时导航栏效果
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(26, 26, 26, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(26, 26, 26, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // 平滑滚动到锚点
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察所有需要动画的元素
    const animatedElements = document.querySelectorAll('.feature-card, .news-card, .media-item, .section-title');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// 懒加载图片
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-load');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            img.classList.add('lazy-load');
            imageObserver.observe(img);
        });
    } else {
        // 回退方案：直接加载所有图片
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// 媒体画廊功能
function initMediaGallery() {
    const mediaItems = document.querySelectorAll('.media-item');
    
    mediaItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const title = this.querySelector('.media-title')?.textContent || '游戏截图';
            
            // 创建模态框
            const modal = createModal(imgSrc, title);
            document.body.appendChild(modal);
            
            // 显示模态框
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
            
            // 点击外部关闭
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
            
            // ESC键关闭
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeModal(modal);
                }
            });
        });
    });
}

// 创建模态框
function createModal(imgSrc, title) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
        cursor: pointer;
    `;
    
    const container = document.createElement('div');
    container.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        text-align: center;
        cursor: default;
    `;
    
    const img = document.createElement('img');
    img.src = imgSrc;
    img.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        border-radius: 10px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
    `;
    
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    titleEl.style.cssText = `
        color: var(--accent-gold);
        margin-top: 20px;
        font-size: 1.5rem;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: var(--accent-gold);
        font-size: 3rem;
        cursor: pointer;
        line-height: 1;
        z-index: 2001;
    `;
    
    closeBtn.addEventListener('click', () => closeModal(modal));
    
    container.appendChild(img);
    container.appendChild(titleEl);
    modal.appendChild(container);
    modal.appendChild(closeBtn);
    
    return modal;
}

// 关闭模态框
function closeModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

// SEO优化
function initSEOOptimizations() {
    // 动态设置页面标题
    updatePageTitle();
    
    // 结构化数据
    addStructuredData();
    
    // Open Graph 标签
    updateOpenGraphTags();
    
    // 性能监控
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('页面加载时间:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
}

// 更新页面标题
function updatePageTitle() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const titles = {
        'index.html': 'WUCHANG: Fallen Feathers - 明末渊虚之羽 | 类魂动作RPG游戏',
        'game-intro.html': '游戏介绍 - WUCHANG: Fallen Feathers | 黑暗奇幻动作RPG',
        'news.html': '最新资讯 - WUCHANG: Fallen Feathers | 游戏新闻动态',
        'media.html': '媒体画廊 - WUCHANG: Fallen Feathers | 游戏截图视频',
        'release-info.html': '发布信息 - WUCHANG: Fallen Feathers | 预购平台信息'
    };
    
    if (titles[currentPage]) {
        document.title = titles[currentPage];
    }
}

// 添加结构化数据
function addStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        "name": "WUCHANG: Fallen Feathers",
        "alternateName": "明末：渊虚之羽",
        "description": "一款以明末历史为背景的黑暗奇幻类魂动作RPG游戏，融合中国古蜀文明与克苏鲁元素。",
        "genre": ["Action RPG", "Souls-like", "Dark Fantasy"],
        "gameLocation": "明末巴蜀之地",
        "publisher": {
            "@type": "Organization",
            "name": "505 Games"
        },
        "developer": {
            "@type": "Organization",
            "name": "Leenzee Games"
        },
        "datePublished": "2025-07-24",
        "gamePlatform": ["PC", "PlayStation 5", "Xbox Series X/S"],
        "inLanguage": ["zh-CN", "en-US"],
        "operatingSystem": ["Windows", "PlayStation 5", "Xbox Series X/S"],
        "applicationCategory": "Game",
        "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/PreOrder",
            "price": "TBD",
            "priceCurrency": "USD"
        }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

// 更新Open Graph标签
function updateOpenGraphTags() {
    const ogTags = {
        'og:title': 'WUCHANG: Fallen Feathers - 明末渊虚之羽',
        'og:description': '探索明末乱世的黑暗奇幻世界，体验独特的类魂动作RPG游戏。融合中国古蜀文明与克苏鲁元素的史诗冒险。',
        'og:type': 'website',
        'og:url': window.location.href,
        'og:image': window.location.origin + '/images/wuchang_screenshot.jpg',
        'og:site_name': 'WUCHANG: Fallen Feathers Official Site',
        'og:locale': 'zh_CN'
    };
    
    Object.entries(ogTags).forEach(([property, content]) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    });
}

// Google Ads初始化
function initGoogleAds() {
    // 只有在生产环境才加载真实广告
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        // 异步加载AdSense
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.setAttribute('data-ad-client', 'ca-pub-XXXXXXXXXXXXXXXX'); // 需要替换为真实的AdSense ID
        document.head.appendChild(script);
        
        // 初始化广告
        script.onload = function() {
            (adsbygoogle = window.adsbygoogle || []).push({});
        };
    }
    
    // 设置广告位置的占位符
    setupAdPlaceholders();
}

// 设置广告占位符
function setupAdPlaceholders() {
    const adContainers = document.querySelectorAll('.ad-container');
    adContainers.forEach(container => {
        const placeholder = container.querySelector('.ad-placeholder');
        if (placeholder) {
            placeholder.innerHTML = `
                <div style="text-align: center; color: #666;">
                    <div style="margin-bottom: 10px;">🎮 游戏广告位 🎮</div>
                    <div style="font-size: 0.9rem;">AdSense广告将在此处显示</div>
                </div>
            `;
        }
    });
}

// 性能优化：防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 窗口调整大小处理
window.addEventListener('resize', debounce(function() {
    // 重新计算布局
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
        if (window.innerWidth > 768) {
            navToggle.style.display = 'none';
            document.querySelector('.nav-menu').style.display = 'flex';
        } else {
            navToggle.style.display = 'block';
        }
    }
}, 250));

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
    // 在生产环境中可以发送错误报告
});

// 页面可见性API - 用于优化性能
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时暂停动画等
        console.log('页面隐藏');
    } else {
        // 页面显示时恢复
        console.log('页面显示');
    }
});

// 导出函数供其他脚本使用
window.WuchangSite = {
    initNavigation,
    initScrollAnimations,
    initLazyLoading,
    initMediaGallery,
    createModal,
    closeModal
};
