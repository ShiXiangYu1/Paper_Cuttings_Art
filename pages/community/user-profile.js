// 用户主页交互脚本
document.addEventListener('DOMContentLoaded', function() {
    // 初始化变量
    let currentPage = 1;
    const itemsPerPage = 12;
    let currentTab = 'works';
    
    // 获取DOM元素
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.profile-content');
    const followBtn = document.querySelector('.follow-btn');
    const editCoverBtn = document.querySelector('.edit-cover');
    const editAvatarBtn = document.querySelector('.edit-avatar');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.querySelector('.sort-select');
    const loadMoreBtns = document.querySelectorAll('.load-more-btn');
    const searchInputs = document.querySelectorAll('.search-box input');

    // 初始化页面
    initializePage();

    // 绑定事件监听器
    navItems.forEach(item => {
        item.addEventListener('click', handleTabChange);
    });

    followBtn.addEventListener('click', handleFollow);
    editCoverBtn.addEventListener('click', handleCoverUpload);
    editAvatarBtn.addEventListener('click', handleAvatarUpload);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });

    sortSelect?.addEventListener('change', handleSort);

    loadMoreBtns.forEach(btn => {
        btn.addEventListener('click', handleLoadMore);
    });

    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(handleSearch, 300));
    });

    // 初始化页面
    function initializePage() {
        loadUserProfile();
        loadWorks();
        setupImageUpload();
    }

    // 加载用户信息
    function loadUserProfile() {
        // 实际项目中这里应该从服务器获取数据
        const mockUserData = {
            name: '张小明',
            avatar: '../../assets/images/avatar-placeholder.svg',
            cover: '../../assets/images/cover-placeholder.svg',
            bio: '热爱传统剪纸艺术的手工艺人，专注于传统文化的传承与创新。',
            stats: {
                works: 128,
                following: 256,
                followers: 1200,
                likes: 12800
            }
        };

        // 更新页面上的用户信息
        updateUserProfile(mockUserData);
    }

    // 更新用户信息显示
    function updateUserProfile(userData) {
        document.querySelector('.profile-name').textContent = userData.name;
        document.querySelector('.profile-bio').textContent = userData.bio;
        document.querySelector('.profile-avatar img').src = userData.avatar;
        document.querySelector('.profile-cover img').src = userData.cover;
    }

    // 处理标签切换
    function handleTabChange(event) {
        event.preventDefault();
        const targetTab = event.currentTarget.getAttribute('data-tab');
        
        // 更新导航项状态
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        // 更新内容区域显示
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetTab) {
                section.classList.add('active');
            }
        });

        // 加载对应标签的内容
        currentPage = 1;
        currentTab = targetTab;
        loadTabContent(targetTab);
    }

    // 加载标签内容
    function loadTabContent(tab) {
        switch(tab) {
            case 'works':
                loadWorks();
                break;
            case 'collections':
                loadCollections();
                break;
            case 'following':
                loadFollowing();
                break;
            case 'followers':
                loadFollowers();
                break;
        }
    }

    // 加载作品列表
    function loadWorks() {
        const worksGrid = document.querySelector('.works-grid');
        // 实际项目中这里应该从服务器获取数据
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

        mockWorks.forEach(work => {
            const workCard = createWorkCard(work);
            worksGrid.appendChild(workCard);
        });
    }

    // 创建作品卡片
    function createWorkCard(work) {
        const div = document.createElement('div');
        div.className = 'work-card';
        div.innerHTML = `
            <div class="work-image">
                <img src="${work.image}" alt="${work.title}">
            </div>
            <div class="work-info">
                <h3>${work.title}</h3>
                <div class="work-stats">
                    <span><i class="fas fa-heart"></i> ${work.likes}</span>
                    <span><i class="fas fa-comment"></i> ${work.comments}</span>
                </div>
            </div>
        `;
        return div;
    }

    // 加载收藏列表
    function loadCollections() {
        const collectionsGrid = document.querySelector('.collections-grid');
        // 实际项目中这里应该从服务器获取数据
        const mockCollections = [
            {
                id: 1,
                title: '传统剪纸合集',
                image: '../../assets/images/placeholder.svg',
                count: 12
            },
            // 更多收藏数据...
        ];

        mockCollections.forEach(collection => {
            const collectionCard = createCollectionCard(collection);
            collectionsGrid.appendChild(collectionCard);
        });
    }

    // 创建收藏卡片
    function createCollectionCard(collection) {
        const div = document.createElement('div');
        div.className = 'collection-card';
        div.innerHTML = `
            <div class="collection-cover">
                <img src="${collection.image}" alt="${collection.title}">
                <span class="collection-count">${collection.count}个作品</span>
            </div>
            <div class="collection-info">
                <h3>${collection.title}</h3>
            </div>
        `;
        return div;
    }

    // 加载关注列表
    function loadFollowing() {
        const usersGrid = document.querySelector('#following .users-grid');
        loadUsers(usersGrid, 'following');
    }

    // 加载粉丝列表
    function loadFollowers() {
        const usersGrid = document.querySelector('#followers .users-grid');
        loadUsers(usersGrid, 'followers');
    }

    // 加载用户列表
    function loadUsers(container, type) {
        // 实际项目中这里应该从服务器获取数据
        const mockUsers = [
            {
                id: 1,
                name: '李华',
                avatar: '../../assets/images/avatar-placeholder.svg',
                bio: '剪纸爱好者',
                isFollowing: true
            },
            // 更多用户数据...
        ];

        mockUsers.forEach(user => {
            const userCard = createUserCard(user);
            container.appendChild(userCard);
        });
    }

    // 创建用户卡片
    function createUserCard(user) {
        const div = document.createElement('div');
        div.className = 'user-card';
        div.innerHTML = `
            <div class="user-avatar">
                <img src="${user.avatar}" alt="${user.name}">
            </div>
            <div class="user-info">
                <h3>${user.name}</h3>
                <p>${user.bio}</p>
                <button class="follow-btn ${user.isFollowing ? 'following' : ''}">
                    ${user.isFollowing ? '<i class="fas fa-check"></i>已关注' : '<i class="fas fa-plus"></i>关注'}
                </button>
            </div>
        `;
        return div;
    }

    // 处理关注按钮点击
    function handleFollow() {
        const isFollowing = followBtn.classList.toggle('following');
        followBtn.innerHTML = isFollowing ? 
            '<i class="fas fa-check"></i>已关注' : 
            '<i class="fas fa-plus"></i>关注';
        
        // 实际项目中这里应该调用API
        updateFollowStatus(isFollowing);
    }

    // 处理封面上传
    function handleCoverUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                // 实际项目中这里应该上传到服务器
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.querySelector('.profile-cover img').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    // 处理头像上传
    function handleAvatarUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                // 实际项目中这里应该上传到服务器
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.querySelector('.profile-avatar img').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    // 处理筛选
    function handleFilter(event) {
        const filterBtns = event.target.parentElement.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // 实际项目中这里应该重新请求数据
        currentPage = 1;
        loadTabContent(currentTab);
    }

    // 处理排序
    function handleSort(event) {
        const sortValue = event.target.value;
        // 实际项目中这里应该重新请求数据
        currentPage = 1;
        loadTabContent(currentTab);
    }

    // 处理加载更多
    function handleLoadMore() {
        currentPage++;
        loadTabContent(currentTab);
    }

    // 处理搜索
    function handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        // 实际项目中这里应该调用搜索API
        // 这里简单实现本地搜索
        const container = event.target.closest('.profile-content');
        const items = container.querySelectorAll('.user-card, .work-card, .collection-card');
        
        items.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const isVisible = title.includes(searchTerm);
            item.style.display = isVisible ? 'block' : 'none';
        });
    }

    // 设置图片上传
    function setupImageUpload() {
        // 实际项目中这里可能需要配置上传参数
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

    // API调用函数（实际项目中实现）
    function updateFollowStatus(status) {
        // 调用关注API
    }
}); 