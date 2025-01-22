// 社区页面交互脚本
document.addEventListener('DOMContentLoaded', function() {
    // 初始化变量
    let currentPage = 1;
    const worksPerPage = 12;
    
    // 模拟作品数据（实际项目中应该从服务器获取）
    const mockWorks = [
        {
            id: 1,
            title: '春天的蝴蝶',
            image: '../../assets/images/placeholder.svg',
            likes: 128,
            comments: 32
        },
        // 更多作品数据...
    ];

    // 初始化页面
    initializePage();

    // 搜索功能
    const searchInput = document.querySelector('.search-box input');
    searchInput.addEventListener('input', debounce(handleSearch, 300));

    // 标签筛选
    const filterTags = document.querySelectorAll('.filter-tags .tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', handleTagFilter);
    });

    // 加载更多
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.addEventListener('click', loadMoreWorks);

    // 初始化页面函数
    function initializePage() {
        loadWorks();
        loadRankingList();
        setupInteractions();
    }

    // 加载作品列表
    function loadWorks(page = 1) {
        const worksGrid = document.querySelector('.works-grid');
        // 实际项目中这里应该是异步请求服务器数据
        // 这里使用模拟数据演示
        const works = mockWorks.slice((page - 1) * worksPerPage, page * worksPerPage);
        
        works.forEach(work => {
            const workCard = createWorkCard(work);
            worksGrid.appendChild(workCard);
        });
    }

    // 创建作品卡片
    function createWorkCard(work) {
        const article = document.createElement('article');
        article.className = 'work-card';
        article.innerHTML = `
            <div class="work-image">
                <img src="${work.image}" alt="${work.title}">
            </div>
            <div class="work-info">
                <h3>${work.title}</h3>
                <p class="author">作者：${work.author}</p>
                <div class="work-stats">
                    <span><i class="fas fa-heart"></i> ${work.likes}</span>
                    <span><i class="fas fa-comment"></i> ${work.comments}</span>
                </div>
            </div>
        `;
        return article;
    }

    // 加载排行榜
    function loadRankingList() {
        const rankingList = document.querySelector('.ranking-list');
        // 实际项目中这里应该是异步请求服务器数据
        const mockUsers = [
            { name: '张小明', points: 1280 },
            { name: '李华', points: 980 },
            { name: '王小红', points: 750 }
        ];

        mockUsers.forEach((user, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="rank">${index + 1}</span>
                <span class="name">${user.name}</span>
                <span class="points">${user.points}分</span>
            `;
            rankingList.appendChild(li);
        });
    }

    // 搜索处理函数
    function handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        const workCards = document.querySelectorAll('.work-card');
        
        workCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const author = card.querySelector('.author').textContent.toLowerCase();
            const isVisible = title.includes(searchTerm) || author.includes(searchTerm);
            card.style.display = isVisible ? 'block' : 'none';
        });
    }

    // 标签筛选处理函数
    function handleTagFilter(event) {
        const selectedTag = event.target;
        // 更新活动标签样式
        document.querySelectorAll('.filter-tags .tag').forEach(tag => {
            tag.classList.remove('active');
        });
        selectedTag.classList.add('active');
        
        // 实际项目中这里应该根据标签重新请求数据
        // 这里仅做演示
    }

    // 加载更多作品
    function loadMoreWorks() {
        currentPage++;
        loadWorks(currentPage);
    }

    // 设置交互效果
    function setupInteractions() {
        // 添加作品卡片悬停效果
        document.querySelectorAll('.work-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.classList.add('hover');
            });
            card.addEventListener('mouseleave', function() {
                this.classList.remove('hover');
            });
        });
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}); 