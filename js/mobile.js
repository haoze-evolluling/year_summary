// mobile.js - 移动端适配脚本

// 检测是否为移动设备
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
}

// 移动端适配初始化
function initMobileAdaptation() {
    // 只有在移动设备上执行
    if (!isMobileDevice()) return;

    // 添加移动设备类到body
    document.body.classList.add('mobile-device');
    
    // 创建汉堡菜单按钮
    createHamburgerMenu();
    
    // 添加触摸事件支持
    addTouchEventSupport();
    
    // 优化视差效果
    optimizeParallaxForMobile();
    
    // 优化滚动行为
    optimizeScrolling();
    
    // 调整导航栏行为
    setupMobileNavigation();
}

// 创建汉堡菜单按钮
function createHamburgerMenu() {
    const header = document.querySelector('header nav');
    const navLinks = document.querySelector('.nav-links');
    
    // 创建汉堡菜单按钮
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger';
    
    // 添加三条线
    for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');
        hamburger.appendChild(span);
    }
    
    // 添加到导航栏
    header.appendChild(hamburger);
    
    // 添加点击事件
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('mobile-open');
        
        // 汉堡菜单动画
        this.classList.toggle('open');
        
        // 点击汉堡菜单时变成X形状
        if (this.classList.contains('open')) {
            this.children[0].style.transform = 'rotate(45deg) translate(7px, 6px)';
            this.children[1].style.opacity = '0';
            this.children[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            this.children[0].style.transform = 'rotate(0)';
            this.children[1].style.opacity = '1';
            this.children[2].style.transform = 'rotate(0)';
        }
    });
    
    // 导航链接点击关闭菜单
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('mobile-open');
            hamburger.classList.remove('open');
            hamburger.children[0].style.transform = 'rotate(0)';
            hamburger.children[1].style.opacity = '1';
            hamburger.children[2].style.transform = 'rotate(0)';
        });
    });
}

// 添加触摸事件支持
function addTouchEventSupport() {
    // 替换鼠标悬停效果为触摸效果
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('touchstart', function(e) {
            this.classList.add('touch-active');
        });
        
        card.addEventListener('touchend', function(e) {
            this.classList.remove('touch-active');
        });
    });
    
    // 优化链接的触摸体验
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('touchstart', function(e) {
            this.classList.add('touch-active');
        });
        
        link.addEventListener('touchend', function(e) {
            this.classList.remove('touch-active');
        });
    });
}

// 优化视差效果 - 在移动设备上使用轻量级替代方案
function optimizeParallaxForMobile() {
    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    
    // 移动端滚动时的视差效果
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.querySelector('header').classList.add('scrolled');
        } else {
            document.querySelector('header').classList.remove('scrolled');
        }
        
        // 为每个视差背景应用轻量级效果
        parallaxBgs.forEach(bg => {
            const section = bg.parentElement;
            const rect = section.getBoundingClientRect();
            const isVisible = (
                rect.top < window.innerHeight && 
                rect.bottom > 0
            );
            
            if (isVisible) {
                // 计算可见度百分比
                const visiblePercent = Math.min(
                    Math.max(
                        (window.innerHeight - rect.top) / (window.innerHeight + rect.height),
                        0
                    ),
                    1
                );
                
                // 应用轻量级视差
                bg.style.transform = `translateY(${visiblePercent * 20}px)`;
                bg.style.opacity = 0.5 + (visiblePercent * 0.5);
            }
        });
    });
}

// 优化滚动行为
function optimizeScrolling() {
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 设置移动端导航
function setupMobileNavigation() {
    // 监听滚动以高亮当前节点
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let currentSectionId = '';
        let minDistance = Infinity;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top);
            
            if (distance < minDistance) {
                minDistance = distance;
                currentSectionId = section.id;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', initMobileAdaptation);

// 处理屏幕方向变化
window.addEventListener('orientationchange', function() {
    // 延迟执行以确保新的尺寸已经计算完成
    setTimeout(() => {
        // 重新初始化移动端适配
        initMobileAdaptation();
        // 刷新页面布局
        window.dispatchEvent(new Event('resize'));
    }, 200);
});

// 处理窗口大小改变
window.addEventListener('resize', function() {
    // 检测设备类型变化（例如，从桌面视图调整到移动视图）
    if (window.innerWidth < 768 && !document.body.classList.contains('mobile-device')) {
        document.body.classList.add('mobile-device');
        initMobileAdaptation();
    } else if (window.innerWidth >= 768 && document.body.classList.contains('mobile-device')) {
        document.body.classList.remove('mobile-device');
        // 这里可以添加移除移动端特有元素的代码，比如汉堡菜单
    }
});