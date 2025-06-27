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
    }
});