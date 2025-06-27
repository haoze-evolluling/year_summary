// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 通过UA检测设备类型，更准确地识别移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    if (!isMobile) {
        // 获取所有图片容器、标题、段落、引用和月份容器
        const imageContainers = document.querySelectorAll('.image-container');
        const sectionHeadings = document.querySelectorAll('h2');
        const paragraphs = document.querySelectorAll('.text-content p');
        const quotes = document.querySelectorAll('.quote');
        const monthContainers = document.querySelectorAll('.month-container');
        
        // 存储容器状态
        const elementStates = new Map();
        
        // 为图片容器添加初始类和状态
        imageContainers.forEach((container) => {
            // 判断图片容器在屏幕中的相对位置（左侧/右侧）
            const rect = container.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const isOnLeftSide = rect.left + rect.width / 2 < windowWidth / 2;
            
            // 根据相对位置决定滑入方向：左侧从左滑入，右侧从右滑入
            if (isOnLeftSide) {
                container.classList.add('slide-from-left');
                elementStates.set(container, {
                    direction: 'left',
                    visible: false,
                    type: 'image'
                });
            } else {
                container.classList.add('slide-from-right');
                elementStates.set(container, {
                    direction: 'right',
                    visible: false,
                    type: 'image'
                });
            }
        });
        
        // 为月份容器设置初始状态
        monthContainers.forEach(container => {
            elementStates.set(container, {
                visible: false,
                type: 'month-container'
            });
        });
        
        // 为标题、段落和引用设置初始状态
        sectionHeadings.forEach(heading => {
            elementStates.set(heading, {
                visible: false,
                type: 'heading'
            });
        });
        
        paragraphs.forEach(paragraph => {
            elementStates.set(paragraph, {
                visible: false,
                type: 'paragraph'
            });
        });
        
        quotes.forEach(quote => {
            elementStates.set(quote, {
                visible: false,
                type: 'quote'
            });
        });
        
        // 创建Intersection Observer来检测元素是否在视口中
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const state = elementStates.get(element);
                
                if (!state) return; // 如果没有状态信息，直接返回
                
                // 获取当前滚动方向
                const currentScrollDirection = getCurrentScrollDirection();
                
                // 根据滚动方向和可见性更新状态
                if (entry.isIntersecting) {
                    // 向下滚动或初始显示时，显示元素
                    element.classList.add('visible');
                    state.visible = true;
                } else if (state.visible) { 
                    // 元素离开视口，且之前是可见的才执行滑出效果
                    element.classList.remove('visible');
                    state.visible = false;
                    
                    // 特别处理图片的滑出效果
                    if (state.type === 'image' && currentScrollDirection === 'up') {
                        // 增强向上滚动时的滑出效果
                        element.style.transition = 'none';
                        setTimeout(() => {
                            if (state.direction === 'left') {
                                element.classList.remove('slide-from-right');
                                element.classList.add('slide-from-left');
                            } else {
                                element.classList.remove('slide-from-left');
                                element.classList.add('slide-from-right');
                            }
                            // 恢复过渡效果
                            setTimeout(() => {
                                element.style.transition = '';
                            }, 10);
                        }, 0);
                    }
                }
            });
        }, {
            root: null,
            rootMargin: '-20px', // 稍微收缩检测范围，使效果更明显
            threshold: [0.1, 0.5] // 多阈值检测，使过渡更平滑
        });
        
        // 观察所有需要动画的元素
        imageContainers.forEach(container => observer.observe(container));
        sectionHeadings.forEach(heading => observer.observe(heading));
        paragraphs.forEach(paragraph => observer.observe(paragraph));
        quotes.forEach(quote => observer.observe(quote));
        monthContainers.forEach(container => observer.observe(container));
        
        // 监听滚动方向
        let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let scrollDirection = 'down'; // 默认向下滚动
        
        window.addEventListener('scroll', () => {
            scrollDirection = getCurrentScrollDirection();
        });
        
        // 获取当前滚动方向的函数
        function getCurrentScrollDirection() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const currentDirection = scrollTop > lastScrollTop ? 'down' : 'up';
            lastScrollTop = scrollTop;
            return currentDirection;
        }
        
        // 窗口大小改变时重新计算位置和效果
        window.addEventListener('resize', () => {
            const newIsMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
            
            // 如果设备类型改变，刷新页面以应用正确的动画效果
            if (isMobile !== newIsMobile) {
                location.reload();
            }
            
            // 重新计算每个图片容器的相对位置
            imageContainers.forEach((container) => {
                const state = elementStates.get(container);
                if (!state || state.type !== 'image') return;
                
                const rect = container.getBoundingClientRect();
                const windowWidth = window.innerWidth;
                const isOnLeftSide = rect.left + rect.width / 2 < windowWidth / 2;
                
                // 更新方向状态
                if (isOnLeftSide && state.direction !== 'left') {
                    container.classList.remove('slide-from-right');
                    container.classList.add('slide-from-left');
                    state.direction = 'left';
                } else if (!isOnLeftSide && state.direction !== 'right') {
                    container.classList.remove('slide-from-left');
                    container.classList.add('slide-from-right');
                    state.direction = 'right';
                }
            });
        });
        
        // 首次加载时检查元素是否在视口内
        setTimeout(() => {
            const elementsToCheck = [
                ...imageContainers, 
                ...sectionHeadings, 
                ...paragraphs, 
                ...quotes,
                ...monthContainers
            ];
            
            elementsToCheck.forEach(element => {
                const rect = element.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                if (rect.top < windowHeight && rect.bottom > 0) {
                    // 元素在视口内，直接显示
                    element.classList.add('visible');
                    const state = elementStates.get(element);
                    if (state) state.visible = true;
                }
            });
        }, 200); // 短暂延迟确保页面已加载
    }
}); 