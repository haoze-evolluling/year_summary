// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 跟踪上一次滚动位置，用于确定滚动方向
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollDirection = 'down'; // 默认向下滚动
    
    // 存储元素的可见状态
    const elementVisibility = new Map();
    
    // 进度条功能
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.clientHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        // 确定滚动方向
        if (scrollTop > lastScrollTop) {
            scrollDirection = 'down';
        } else {
            scrollDirection = 'up';
        }
        lastScrollTop = scrollTop;
        
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
        
        // 处理3D滚动效果
        handle3DScrollEffect();
        
        // 处理滚动方向相关动画
        handleScrollDirectionAnimations();
        
        // 检测元素是否进入或离开视口
        checkElementsInViewport();
    });
    
    // 检测元素是否在视口中，并根据它们的位置和滚动方向更新状态
    function checkElementsInViewport() {
        document.querySelectorAll('.month-container, .rotate-in, .float-image, .stagger-item').forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // 元素是否在视口中（稍微往上偏移以提前触发）
            const isInView = rect.top < windowHeight * 0.85 && rect.bottom > 0;
            
            // 元素是否已经离开视口底部
            const hasExitedBottom = rect.top > windowHeight;
            
            // 元素是否已经离开视口顶部
            const hasExitedTop = rect.bottom < 0;
            
            // 获取元素之前的可见状态
            const wasInView = elementVisibility.get(element) || false;
            
            // 更新元素的可见状态
            elementVisibility.set(element, isInView);
            
            // 处理元素进入或离开视口的情况
            if (isInView && !wasInView) {
                // 元素刚进入视口
                if (scrollDirection === 'down') {
                    applyEnterAnimation(element);
                } else {
                    applyReverseEnterAnimation(element);
                }
            } else if (!isInView && wasInView) {
                // 元素刚离开视口
                if (hasExitedBottom && scrollDirection === 'up') {
                    // 从底部离开，向上滚动
                    resetElement(element);
                } else if (hasExitedTop && scrollDirection === 'down') {
                    // 从顶部离开，向下滚动
                    resetElement(element);
                }
            } else if (!isInView) {
                // 元素不在视口内，重置状态以便再次触发动画
                if (
                    (hasExitedBottom && scrollDirection === 'down') || 
                    (hasExitedTop && scrollDirection === 'up')
                ) {
                    resetElement(element);
                }
            }
        });
    }
    
    // 应用元素进入动画
    function applyEnterAnimation(element) {
        if (element.classList.contains('month-container')) {
            element.classList.add('active');
            element.classList.remove('reverse-active');
            
            // 找到图片容器
            const imgContainer = element.querySelector('.image-container');
            if (imgContainer) {
                // 动画结束后添加浮动效果
                setTimeout(() => {
                    imgContainer.classList.add('animation-complete');
                }, 1300);
            }
        } else {
            element.classList.add('active');
            element.classList.remove('reverse-active');
        }
    }
    
    // 应用元素反向进入动画
    function applyReverseEnterAnimation(element) {
        if (element.classList.contains('month-container')) {
            element.classList.add('reverse-active');
            element.classList.remove('active');
            
            // 找到图片容器
            const imgContainer = element.querySelector('.image-container');
            if (imgContainer) {
                imgContainer.classList.remove('animation-complete');
            }
        } else {
            element.classList.add('reverse-active');
            element.classList.remove('active');
        }
    }
    
    // 重置元素状态以便重新触发动画
    function resetElement(element) {
        element.classList.remove('active', 'reverse-active');
        
        // 如果是月份容器，也需要重置图片容器状态
        if (element.classList.contains('month-container')) {
            const imgContainer = element.querySelector('.image-container');
            if (imgContainer) {
                imgContainer.classList.remove('animation-complete');
            }
        }
    }
    
    // 处理滚动方向相关动画
    function handleScrollDirectionAnimations() {
        document.querySelectorAll('.section').forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionBottom = section.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // 判断区块是否在视口内
            const isInView = sectionTop < windowHeight * 0.75 && sectionBottom > 0;
            
            if (isInView) {
                // 向下滚动时应用正向动画
                if (scrollDirection === 'down') {
                    section.classList.add('scroll-down');
                    section.classList.remove('scroll-up');
                } 
                // 向上滚动时应用反向动画
                else {
                    section.classList.add('scroll-up');
                    section.classList.remove('scroll-down');
                }
            }
        });
    }
    
    // 创建视差背景点
    createParallaxDots();
    
    // 添加光效
    addShineEffect();
    
    // 为图片添加倾斜效果（但不使用鼠标跟随）
    addTiltEffect();
    
    // 视差滚动效果处理
    function handleParallaxEffect() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        
        // 处理每个部分的视差效果
        document.querySelectorAll('.parallax-bg').forEach(bg => {
            const dots = bg.querySelectorAll('.parallax-dot');
            dots.forEach(dot => {
                const speed = parseFloat(dot.getAttribute('data-speed'));
                // 根据滚动方向调整视差效果
                const direction = scrollDirection === 'down' ? -1 : 1;
                const yPos = direction * (scrollTop * speed);
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
    
    // 3D滚动效果处理
    function handle3DScrollEffect() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        
        // 处理视差滚动标题效果
        document.querySelectorAll('.parallax-title').forEach(title => {
            const section = title.closest('.section');
            const sectionTop = section.getBoundingClientRect().top;
            const scrollProgress = (windowHeight - sectionTop) / (windowHeight + section.offsetHeight);
            
            if (scrollProgress > 0 && scrollProgress < 1) {
                const moveDistance = 50; // 移动距离
                // 根据滚动方向调整视差效果
                const direction = scrollDirection === 'down' ? 1 : -1;
                const yPos = direction * moveDistance * (0.5 - scrollProgress);
                title.style.transform = `translateY(${yPos}px) translateZ(0)`;
            }
        });
        
        // 处理视差滚动图片效果
        document.querySelectorAll('.image-container').forEach(container => {
            const section = container.closest('.section');
            if (!section) return;
            
            const sectionTop = section.getBoundingClientRect().top;
            const scrollProgress = (windowHeight - sectionTop) / (windowHeight + section.offsetHeight);
            
            if (scrollProgress > 0 && scrollProgress < 1) {
                const moveDistance = 80; // 移动距离
                // 根据滚动方向调整视差效果
                const direction = scrollDirection === 'down' ? 1 : -1;
                const zPos = direction * moveDistance * Math.sin(scrollProgress * Math.PI);
                container.style.transform = `translateZ(${zPos}px)`;
            }
        });
        
        // 处理3D图层效果
        document.querySelectorAll('.image-layer').forEach(layer => {
            const speedFactor = parseFloat(layer.getAttribute('data-speed') || 0.2);
            const container = layer.closest('.image-layers');
            if (!container) return;
            
            const section = container.closest('.section');
            if (!section) return;
            
            const sectionTop = section.getBoundingClientRect().top;
            const scrollProgress = (windowHeight - sectionTop) / (windowHeight + section.offsetHeight);
            
            if (scrollProgress > 0 && scrollProgress < 1) {
                const moveDistance = 50 * speedFactor;
                const zPos = moveDistance * Math.sin(scrollProgress * Math.PI);
                const scale = 1 + 0.1 * Math.sin(scrollProgress * Math.PI);
                layer.style.transform = `translateZ(${zPos}px) scale(${scale})`;
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
    
    // 添加光效效果
    function addShineEffect() {
        const imageContainers = document.querySelectorAll('.image-container');
        
        imageContainers.forEach(container => {
            const shine = document.createElement('div');
            shine.className = 'shine-effect';
            container.appendChild(shine);
        });
    }
    
    // 添加倾斜效果（静态效果，不随鼠标移动）
    function addTiltEffect() {
        const images = document.querySelectorAll('.image-container');
        
        images.forEach(container => {
            container.classList.add('tilt-card');
            
            // 移除鼠标移动事件监听器，只保留静态的3D效果
            container.style.transform = 'translateZ(20px)';
        });
    }
    
    // 修复图片显示问题 - 移除3D图层创建，直接显示原始图像
    document.querySelectorAll('.image-container img').forEach(img => {
        img.style.opacity = '1';
        img.style.visibility = 'visible';
    });
    
    // 初始化监听器，用于首次加载时触发可见元素的动画
    window.addEventListener('load', function() {
        checkElementsInViewport();
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
    
    // 为所有标题添加视差效果
    document.querySelectorAll('h2').forEach(heading => {
        heading.classList.add('parallax-title');
    });
    
    // 为所有图片添加浮出效果
    document.querySelectorAll('.image-container img').forEach(img => {
        img.classList.add('float-image');
    });
    
    // 为段落添加交错动画效果
    document.querySelectorAll('.text-content p').forEach(paragraph => {
        paragraph.classList.add('stagger-item');
    });
    
    // 初始化
    updateActiveNavLink();
}); 