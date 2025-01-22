// 课程页面交互功能
document.addEventListener('DOMContentLoaded', () => {
    // 章节展开/收起功能
    const chapterItems = document.querySelectorAll('.chapter-item');
    
    chapterItems.forEach(item => {
        const header = item.querySelector('.chapter-header');
        const content = item.querySelector('.chapter-content');
        
        // 初始状态：只显示第一个章节的内容
        if (item !== chapterItems[0]) {
            content.style.display = 'none';
        }
        
        header.addEventListener('click', () => {
            const isOpen = content.style.display !== 'none';
            
            // 关闭所有其他章节
            chapterItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherContent = otherItem.querySelector('.chapter-content');
                    otherContent.style.display = 'none';
                    otherItem.classList.remove('active');
                }
            });
            
            // 切换当前章节的显示状态
            content.style.display = isOpen ? 'none' : 'grid';
            item.classList.toggle('active', !isOpen);
            
            // 平滑滚动到当前章节
            if (!isOpen) {
                item.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 项目卡片悬停效果
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        });
    });

    // 技巧卡片动画效果
    const tipCards = document.querySelectorAll('.tip-card');
    
    tipCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.tip-icon');
            icon.style.transform = 'scale(1.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.tip-icon');
            icon.style.transform = 'scale(1)';
        });
    });

    // 进度追踪
    const lessonItems = document.querySelectorAll('.lesson-list li');
    
    lessonItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('completed');
            updateProgress();
        });
    });

    function updateProgress() {
        const totalLessons = lessonItems.length;
        const completedLessons = document.querySelectorAll('.lesson-list li.completed').length;
        const progress = (completedLessons / totalLessons) * 100;
        
        // 这里可以添加进度显示的相关代码
        console.log(`课程进度：${progress.toFixed(1)}%`);
    }

    // 页面滚动效果
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('fade-in');
        sectionObserver.observe(section);
    });
});

// 添加CSS动画类
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .visible {
        opacity: 1;
        transform: translateY(0);
    }

    .completed {
        color: var(--color-primary);
        text-decoration: line-through;
    }

    .completed::before {
        content: "✓" !important;
    }

    .chapter-item {
        transition: all 0.3s ease;
    }

    .chapter-item.active {
        border-left: 4px solid var(--color-primary);
    }

    .tip-icon {
        transition: transform 0.3s ease;
    }
`; 