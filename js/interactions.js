// 交互效果增强脚本 - 轻量级实现
document.addEventListener('DOMContentLoaded', function() {
    // 检测设备类型，移动设备上减少部分动画效果
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    // 点击波纹效果 - 仅在非移动设备上启用
    if (!isMobile) {
        // 为所有链接和可点击元素添加点击涟漪效果
        const clickableElements = document.querySelectorAll('.nav-links a, .logo');
        
        clickableElements.forEach(element => {
            element.addEventListener('click', createRippleEffect);
        });
    }
    
    // 点击波纹效果函数
    function createRippleEffect(event) {
        // 只在非移动设备上添加波纹效果
        if (isMobile) return;
        
        const button = event.currentTarget;
        
        // 防止重复创建
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        // 创建波纹元素
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        // 计算波纹大小
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        ripple.style.width = ripple.style.height = `${diameter}px`;
        
        // 定位波纹
        const rect = button.getBoundingClientRect();
        ripple.style.left = `${event.clientX - rect.left - diameter / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - diameter / 2}px`;
        
        // 添加到按钮
        button.appendChild(ripple);
        
        // 清理波纹
        setTimeout(() => {
            if (ripple && ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    // 为部分元素添加悬停互动效果
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        // 鼠标移入时轻微缩放
        section.addEventListener('mouseenter', function() {
            if (isMobile) return;
            this.style.transform = 'scale(1.003)';
            this.style.transition = 'transform 0.7s cubic-bezier(0.165, 0.84, 0.44, 1)';
        });
        
        // 鼠标移出时恢复
        section.addEventListener('mouseleave', function() {
            if (isMobile) return;
            this.style.transform = 'scale(1)';
        });
    });
    
    // 性能优化：防止不必要的重绘和回流
    // 使用requestAnimationFrame进行动画优化
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                // 根据滚动方向添加效果
                const scrollingDown = scrollTop > lastScrollTop;
                const header = document.querySelector('header');
                
                // 滚动时导航栏微妙变化
                if (scrollingDown && scrollTop > 50) {
                    header.style.transform = 'translateY(-2px)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                
                lastScrollTop = scrollTop;
                ticking = false;
            });
            
            ticking = true;
        }
    });
    
    // 添加对浏览器"减少动画"设置的支持
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // 禁用或减少所有非必要动画
        document.documentElement.classList.add('reduced-motion');
    }
}); 