// 搜索功能
function searchTools() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        showAllTools();
        return;
    }
    
    const toolCards = document.querySelectorAll('.tool-card');
    const categories = document.querySelectorAll('.category');
    let hasResults = false;
    
    categories.forEach(category => {
        let hasVisibleCards = false;
        const cards = category.querySelectorAll('.tool-card');
        
        cards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                card.classList.add('highlight');
                hasVisibleCards = true;
                hasResults = true;
            } else {
                card.style.display = 'none';
                card.classList.remove('highlight');
            }
        });
        
        // 显示或隐藏整个分类
        if (hasVisibleCards) {
            category.style.display = 'block';
        } else {
            category.style.display = 'none';
        }
    });
    
    // 显示无结果提示
    if (!hasResults) {
        showNoResults();
    } else {
        hideNoResults();
    }
}

// 显示所有工具
function showAllTools() {
    const toolCards = document.querySelectorAll('.tool-card');
    const categories = document.querySelectorAll('.category');
    
    toolCards.forEach(card => {
        card.style.display = 'block';
        card.classList.remove('highlight');
    });
    
    categories.forEach(category => {
        category.style.display = 'block';
    });
    
    hideNoResults();
}

// 显示无结果提示
function showNoResults() {
    let noResults = document.querySelector('.no-results');
    if (!noResults) {
        noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <i class="fas fa-search"></i>
            <h3>未找到相关工具</h3>
            <p>尝试使用其他关键词搜索</p>
        `;
        document.querySelector('.tools-section .container').appendChild(noResults);
    }
    noResults.style.display = 'block';
}

// 隐藏无结果提示
function hideNoResults() {
    const noResults = document.querySelector('.no-results');
    if (noResults) {
        noResults.style.display = 'none';
    }
}

// 实时搜索
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    
    // 实时搜索
    searchInput.addEventListener('input', function() {
        searchTools();
    });
    
    // 回车搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchTools();
        }
    });
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 工具卡片动画延迟
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach((card, index) => {
        card.style.setProperty('--i', index % 6);
    });
    
    // 添加加载动画
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // 滚动时导航栏效果
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 点击工具链接时的反馈
    document.querySelectorAll('.tool-link').forEach(link => {
        link.addEventListener('click', function(e) {
            // 添加点击效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // 分类过滤功能
    addCategoryFilter();
});

// 添加分类过滤器
function addCategoryFilter() {
    const container = document.querySelector('.tools-section .container');
    const filterContainer = document.createElement('div');
    filterContainer.className = 'category-filter';
    
    const categories = [
        { id: 'all', name: '全部' },
        { id: 'research', name: '需求调研' },
        { id: 'essential', name: '必备工具' },
        { id: 'ai-tools', name: 'AI工具' },
        { id: 'research-tools', name: '竞品调研' },
        { id: 'keyword-tools', name: '关键词工具' },
        { id: 'monetization', name: '变现工具' },
        { id: 'donation', name: '赞赏工具' },
        { id: 'payment', name: '收款工具' },
        { id: 'analytics', name: '数据分析' }
    ];
    
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.textContent = category.name;
        btn.onclick = () => filterByCategory(category.id);
        
        if (category.id === 'all') {
            btn.classList.add('active');
        }
        
        filterContainer.appendChild(btn);
    });
    
    container.insertBefore(filterContainer, container.firstChild);
}

// 按分类过滤
function filterByCategory(categoryId) {
    const categories = document.querySelectorAll('.category');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // 更新按钮状态
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === getCategoryName(categoryId)) {
            btn.classList.add('active');
        }
    });
    
    // 显示/隐藏分类
    categories.forEach(category => {
        if (categoryId === 'all' || category.dataset.category === categoryId) {
            category.style.display = 'block';
            // 添加动画效果
            category.style.opacity = '0';
            category.style.transform = 'translateY(20px)';
            setTimeout(() => {
                category.style.transition = 'all 0.3s ease';
                category.style.opacity = '1';
                category.style.transform = 'translateY(0)';
            }, 50);
        } else {
            category.style.display = 'none';
        }
    });
    
    hideNoResults();
}

// 获取分类名称
function getCategoryName(categoryId) {
    const categoryNames = {
        'all': '全部',
        'research': '需求调研',
        'essential': '必备工具',
        'ai-tools': 'AI工具',
        'research-tools': '竞品调研',
        'keyword-tools': '关键词工具',
        'monetization': '变现工具',
        'donation': '赞赏工具',
        'payment': '收款工具',
        'analytics': '数据分析'
    };
    return categoryNames[categoryId] || '全部';
}

// 工具统计
function updateToolStats() {
    const totalTools = document.querySelectorAll('.tool-card').length;
    const categories = document.querySelectorAll('.category').length;
    
    console.log(`总共 ${totalTools} 个工具，分为 ${categories} 个分类`);
}

// 添加收藏功能
function addFavoriteFeature() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        favoriteBtn.onclick = function(e) {
            e.preventDefault();
            toggleFavorite(this, card);
        };
        
        card.querySelector('.tool-icon').appendChild(favoriteBtn);
    });
}

// 切换收藏状态
function toggleFavorite(btn, card) {
    const icon = btn.querySelector('i');
    const toolTitle = card.querySelector('h4').textContent;
    
    if (icon.classList.contains('far')) {
        icon.className = 'fas fa-heart';
        btn.style.color = '#ef4444';
        saveFavorite(toolTitle, true);
        showToast('已添加到收藏');
    } else {
        icon.className = 'far fa-heart';
        btn.style.color = '';
        saveFavorite(toolTitle, false);
        showToast('已取消收藏');
    }
}

// 保存收藏到本地存储
function saveFavorite(toolTitle, isFavorite) {
    let favorites = JSON.parse(localStorage.getItem('toolFavorites') || '[]');
    
    if (isFavorite && !favorites.includes(toolTitle)) {
        favorites.push(toolTitle);
    } else if (!isFavorite) {
        favorites = favorites.filter(fav => fav !== toolTitle);
    }
    
    localStorage.setItem('toolFavorites', JSON.stringify(favorites));
}

// 显示提示消息
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 页面性能监控
function monitorPerformance() {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`页面加载时间: ${pageLoadTime}ms`);
        }, 0);
    });
}

// 初始化性能监控
monitorPerformance();

// 添加键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // ESC 清空搜索
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        searchInput.value = '';
        searchInput.blur();
        showAllTools();
    }
});

// 添加暗色模式切换功能
function addDarkModeToggle() {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'dark-mode-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    toggleBtn.onclick = toggleDarkMode;
    toggleBtn.title = '切换暗色模式';
    document.body.appendChild(toggleBtn);
}

// 切换暗色模式
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    localStorage.setItem('darkMode', isDark);
    
    const btn = document.querySelector('.dark-mode-toggle i');
    const toggleBtn = document.querySelector('.dark-mode-toggle');
    
    if (isDark) {
        btn.className = 'fas fa-sun';
        toggleBtn.title = '切换到亮色模式';
    } else {
        btn.className = 'fas fa-moon';
        toggleBtn.title = '切换到暗色模式';
    }
}

// 加载暗色模式偏好
function loadDarkModePreference() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
    }
    
    // 根据当前模式设置按钮图标
    setTimeout(() => {
        const btn = document.querySelector('.dark-mode-toggle i');
        const toggleBtn = document.querySelector('.dark-mode-toggle');
        
        if (btn && toggleBtn) {
            if (isDark) {
                btn.className = 'fas fa-sun';
                toggleBtn.title = '切换到亮色模式';
            } else {
                btn.className = 'fas fa-moon';
                toggleBtn.title = '切换到暗色模式';
            }
        }
    }, 100);
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    loadDarkModePreference();
    addDarkModeToggle();
    updateToolStats();
}); 