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
        
        // 视差滚动效果
        handleParallaxEffect();
    });
    
    // 创建视差背景点
    createParallaxDots();
    
    // 视差滚动效果处理
    function handleParallaxEffect() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 处理每个部分的视差效果
        document.querySelectorAll('.parallax-bg').forEach(bg => {
            const dots = bg.querySelectorAll('.parallax-dot');
            dots.forEach(dot => {
                const speed = parseFloat(dot.getAttribute('data-speed'));
                const yPos = -(scrollTop * speed);
                const xPos = parseFloat(dot.getAttribute('data-x'));
                dot.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
            });
        });
        
        // 处理部分的进入动画
        document.querySelectorAll('.section').forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionBottom = section.getBoundingClientRect().bottom;
            
            if (sectionTop < windowHeight * 0.75 && sectionBottom > 0) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }
    
    // 创建视差背景点
    function createParallaxDots() {
        const parallaxBgs = document.querySelectorAll('.parallax-bg');
        
        parallaxBgs.forEach((bg, index) => {
            // 为每个背景创建不同数量的点
            const dotsCount = 15 + Math.floor(Math.random() * 10);
            
            for (let i = 0; i < dotsCount; i++) {
                const dot = document.createElement('div');
                dot.className = 'parallax-dot';
                
                // 随机大小
                const size = 5 + Math.random() * 15;
                dot.style.width = `${size}px`;
                dot.style.height = `${size}px`;
                
                // 随机位置
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                dot.style.left = `${x}%`;
                dot.style.top = `${y}%`;
                
                // 随机透明度
                const opacity = 0.05 + Math.random() * 0.1;
                dot.style.opacity = opacity;
                
                // 随机速度
                const speed = 0.03 + Math.random() * 0.07;
                dot.setAttribute('data-speed', speed);
                dot.setAttribute('data-x', 0);
                
                bg.appendChild(dot);
            }
        });
    }
    
    // 监听滚动来触发元素动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 当元素可见时
            if (entry.isIntersecting) {
                // 添加动画类
                if (entry.target.classList.contains('month-container')) {
                    entry.target.classList.add('active');
                }
                
                // 查找并激活图片动画
                const imgs = entry.target.querySelectorAll('.fade-in');
                imgs.forEach((img, index) => {
                    // 为图片添加延迟，创造连续动画效果
                    setTimeout(() => {
                        img.classList.add('active');
                    }, 300 + index * 100);
                });
            }
        });
    }, {
        root: null, // 使用视口作为根元素
        threshold: 0.1, // 当元素有10%进入视口时触发
        rootMargin: '-50px' // 提前50px触发
    });
    
    // 监测所有月份容器
    document.querySelectorAll('.month-container').forEach(container => {
        observer.observe(container);
    });
    
    // 平滑滚动导航
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 添加平滑滚动效果
                smoothScrollTo(targetElement.offsetTop - 70);
                
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
            smoothScrollTo(nextSection.offsetTop - 70);
        }
    });
    
    // 平滑滚动函数
    function smoothScrollTo(targetY) {
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        const duration = 1000;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easeInOutCubic = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startY + distance * easeInOutCubic);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }
    
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
    
    // 图片hover效果增强
    const imageContainers = document.querySelectorAll('.image-container');
    imageContainers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
        });
        
        container.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // 优化的图片加载
    const images = document.querySelectorAll('img');
    
    // 图片懒加载
    const lazyLoadImages = () => {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // 图片加载完成后的回调
                    img.onload = function() {
                        this.classList.add('loaded');
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    };
    
    // 启动懒加载
    lazyLoadImages();
    
    // 初始化
    updateActiveNavLink();
}); 