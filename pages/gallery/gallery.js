// 作品展示页面交互脚本

document.addEventListener('DOMContentLoaded', function() {
    // 初始化存储管理器
    const workStorage = new WorkStorage();

    // 获取DOM元素
    const categoryTabs = document.querySelectorAll('.category-tab');
    const worksGrid = document.querySelector('.works-grid');
    const featuredGrid = document.querySelector('.featured-grid');
    const latestGrid = document.querySelector('.latest-grid');

    // 渲染作品卡片
    function renderWorkCard(work, template = 'normal') {
        const categoryText = {
            'traditional': '传统纹样',
            'modern': '现代创意',
            '3d': '立体作品'
        }[work.category] || '其他';

        if (template === 'featured') {
            return `
                <div class="featured-card">
                    <div class="work-preview">
                        <img src="${work.images[0]}" alt="${work.title}" class="work-svg">
                    </div>
                    <div class="work-info">
                        <h3>${work.title}</h3>
                        <p class="work-desc">${work.description}</p>
                        <div class="work-meta">
                            <span class="artist">作者：${work.author}</span>
                            <span class="category">类别：${categoryText}</span>
                        </div>
                    </div>
                </div>
            `;
        } else if (template === 'latest') {
            return `
                <div class="latest-card">
                    <div class="work-preview">
                        <img src="${work.images[0]}" alt="${work.title}" class="work-svg">
                    </div>
                    <div class="work-info">
                        <h3>${work.title}</h3>
                        <p>发布时间：${new Date(work.createTime).toLocaleDateString()}</p>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="work-card" data-category="${work.category}">
                    <div class="work-preview">
                        <img src="${work.images[0]}" alt="${work.title}" class="work-svg">
                    </div>
                    <div class="work-info">
                        <h3>${work.title}</h3>
                        <p>${work.description}</p>
                    </div>
                </div>
            `;
        }
    }

    // 渲染精选作品
    function renderFeaturedWorks() {
        const featuredWorks = workStorage.getFeaturedWorks();
        if (featuredWorks.length > 0) {
            featuredGrid.innerHTML = featuredWorks
                .map(work => renderWorkCard(work, 'featured'))
                .join('');
        }
    }

    // 渲染最新作品
    function renderLatestWorks() {
        const latestWorks = workStorage.getLatestWorks();
        if (latestWorks.length > 0) {
            latestGrid.innerHTML = latestWorks
                .map(work => renderWorkCard(work, 'latest'))
                .join('');
        }
    }

    // 渲染分类作品
    function renderCategoryWorks(category = 'all') {
        const works = workStorage.getWorksByCategory(category);
        worksGrid.innerHTML = works.length > 0 
            ? works.map(work => renderWorkCard(work)).join('')
            : '<div class="no-works">暂无作品</div>';
    }

    // 初始化页面
    function initGallery() {
        renderFeaturedWorks();
        renderLatestWorks();
        renderCategoryWorks('all');

        // 为作品卡片添加点击事件
        document.querySelectorAll('.work-card, .featured-card, .latest-card').forEach(card => {
            card.addEventListener('click', function() {
                // 这里可以添加查看作品详情的逻辑
                console.log('查看作品详情');
            });
        });
    }

    // 分类切换
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.dataset.category;
            renderCategoryWorks(category);
        });
    });

    // 初始化画廊
    initGallery();

    // 添加作品预览图片的加载动画
    const workPreviews = document.querySelectorAll('.work-preview');
    workPreviews.forEach(preview => {
        preview.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });

    // 实现无限滚动加载（示例）
    let isLoading = false;
    window.addEventListener('scroll', () => {
        if (isLoading) return;

        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 100) {
            loadMoreWorks();
        }
    });

    // 加载更多作品的函数（示例）
    function loadMoreWorks() {
        isLoading = true;
        // 这里可以添加实际的加载逻辑
        console.log('加载更多作品...');
        setTimeout(() => {
            isLoading = false;
        }, 1000);
    }
}); 