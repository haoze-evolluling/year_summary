// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 进度条功能
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.clientHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        const progressBar = document.getElementById('progress-bar');
        progressBar.style.width = scrollPercentage + '%';
        
        // 导航栏背景变化
        const header = document.querySelector('header');
        if (scrollTop > 10) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        // 更新当前活动导航项
        updateActiveNavLink();
    });
    
    // 平滑滚动导航
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 简单滚动到目标位置
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // 更新URL但不刷新页面
                history.pushState(null, null, targetId);
                
                // 更新活动导航项
                document.querySelectorAll('.nav-links a').forEach(a => {
                    a.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // 滚动指示器点击事件
    document.querySelector('.scroll-down-indicator').addEventListener('click', function() {
        const nextSection = document.getElementById('feb');
        if (nextSection) {
            window.scrollTo({
                top: nextSection.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
    
    // 更新当前活动导航项
    function updateActiveNavLink() {
        const scrollPosition = window.pageYOffset + 100;
        
        document.querySelectorAll('.section').forEach(section => {
            const sectionId = section.getAttribute('id');
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${sectionId}`) {
                        a.classList.add('active');
                    }
                });
            }
        });
    }
    
    // 初始化
    updateActiveNavLink();
}); 