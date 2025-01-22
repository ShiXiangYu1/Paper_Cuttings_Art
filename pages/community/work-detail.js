// 作品详情页面交互脚本
document.addEventListener('DOMContentLoaded', function() {
    // 初始化变量
    let currentCommentPage = 1;
    const commentsPerPage = 10;
    let isLiked = false;
    let isCollected = false;

    // 获取DOM元素
    const likeBtn = document.querySelector('.like-btn');
    const collectBtn = document.querySelector('.collect-btn');
    const shareBtn = document.querySelector('.share-btn');
    const shareModal = document.getElementById('shareModal');
    const closeModalBtn = shareModal.querySelector('.close-btn');
    const commentForm = document.querySelector('.comment-form');
    const commentInput = document.querySelector('.comment-input');
    const submitCommentBtn = document.querySelector('.submit-comment');
    const loadMoreCommentsBtn = document.getElementById('loadMoreCommentsBtn');
    const commentsList = document.querySelector('.comments-list');
    const imageThumbnails = document.querySelector('.image-thumbnails');
    const mainImage = document.querySelector('.main-image img');
    const followBtn = document.querySelector('.follow-btn');

    // 初始化页面
    initializePage();

    // 绑定事件监听器
    likeBtn.addEventListener('click', handleLike);
    collectBtn.addEventListener('click', handleCollect);
    shareBtn.addEventListener('click', handleShare);
    closeModalBtn.addEventListener('click', closeShareModal);
    submitCommentBtn.addEventListener('click', handleSubmitComment);
    loadMoreCommentsBtn.addEventListener('click', loadMoreComments);
    followBtn.addEventListener('click', handleFollow);

    // 初始化页面
    function initializePage() {
        loadWorkDetails();
        loadComments();
        loadRelatedWorks();
        setupImageGallery();
    }

    // 加载作品详情
    function loadWorkDetails() {
        // 实际项目中这里应该从服务器获取数据
        const workImages = [
            '../../assets/images/placeholder.svg',
            '../../assets/images/placeholder2.svg',
            '../../assets/images/placeholder3.svg'
        ];

        // 加载缩略图
        workImages.forEach((src, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'thumb' + (index === 0 ? ' active' : '');
            thumb.innerHTML = `<img src="${src}" alt="作品图片${index + 1}">`;
            thumb.addEventListener('click', () => switchMainImage(src, thumb));
            imageThumbnails.appendChild(thumb);
        });
    }

    // 切换主图
    function switchMainImage(src, thumbElement) {
        mainImage.src = src;
        document.querySelectorAll('.thumb').forEach(thumb => {
            thumb.classList.remove('active');
        });
        thumbElement.classList.add('active');
    }

    // 设置图片画廊
    function setupImageGallery() {
        const thumbs = document.querySelectorAll('.thumb');
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').src;
                mainImage.src = imgSrc;
                thumbs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // 处理点赞
    function handleLike() {
        isLiked = !isLiked;
        const countSpan = likeBtn.querySelector('.count');
        const count = parseInt(countSpan.textContent);
        
        likeBtn.classList.toggle('active');
        countSpan.textContent = isLiked ? count + 1 : count - 1;
        
        // 实际项目中这里应该调用API
        updateLikeStatus(isLiked);
    }

    // 处理收藏
    function handleCollect() {
        isCollected = !isCollected;
        const countSpan = collectBtn.querySelector('.count');
        const count = parseInt(countSpan.textContent);
        
        collectBtn.classList.toggle('active');
        countSpan.textContent = isCollected ? count + 1 : count - 1;
        
        // 实际项目中这里应该调用API
        updateCollectStatus(isCollected);
    }

    // 处理分享
    function handleShare() {
        shareModal.classList.add('active');
    }

    // 关闭分享弹窗
    function closeShareModal() {
        shareModal.classList.remove('active');
    }

    // 加载评论
    function loadComments(page = 1) {
        // 实际项目中这里应该从服务器获取数据
        const mockComments = [
            {
                id: 1,
                author: {
                    name: '李华',
                    avatar: '../../assets/images/avatar-placeholder.svg'
                },
                content: '太美了！请问这个作品用了多长时间完成？',
                time: '2024-01-22 10:30'
            },
            // 更多评论数据...
        ];

        mockComments.forEach(comment => {
            const commentElement = createCommentElement(comment);
            commentsList.appendChild(commentElement);
        });
    }

    // 创建评论元素
    function createCommentElement(comment) {
        const div = document.createElement('div');
        div.className = 'comment-item';
        div.innerHTML = `
            <div class="comment-author">
                <img src="${comment.author.avatar}" alt="${comment.author.name}" class="author-avatar">
                <div class="author-info">
                    <span class="author-name">${comment.author.name}</span>
                    <span class="comment-time">${comment.time}</span>
                </div>
            </div>
            <div class="comment-content">${comment.content}</div>
            <div class="comment-actions">
                <button class="like-comment">
                    <i class="far fa-heart"></i>
                    <span>${comment.likes}</span>
                </button>
                <button class="reply-comment">回复</button>
            </div>
            ${comment.replies.length > 0 ? createRepliesList(comment.replies) : ''}
        `;
        return div;
    }

    // 创建回复列表
    function createRepliesList(replies) {
        return `
            <div class="replies-list">
                ${replies.map(reply => `
                    <div class="reply-item">
                        <div class="reply-author">
                            <img src="${reply.author.avatar}" alt="${reply.author.name}" class="author-avatar">
                            <span class="author-name">${reply.author.name}</span>
                        </div>
                        <div class="reply-content">${reply.content}</div>
                        <div class="reply-time">${reply.time}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 提交评论
    function handleSubmitComment() {
        const content = commentInput.value.trim();
        if (!content) return;

        // 实际项目中这里应该调用API
        const newComment = {
            id: Date.now(),
            author: {
                name: '当前用户',
                avatar: '../../assets/images/avatar-placeholder.svg'
            },
            content: content,
            time: new Date().toLocaleString(),
            likes: 0,
            replies: []
        };

        const commentElement = createCommentElement(newComment);
        commentsList.insertBefore(commentElement, commentsList.firstChild);
        commentInput.value = '';
        
        // 更新评论数量
        updateCommentCount(1);
    }

    // 加载更多评论
    function loadMoreComments() {
        currentCommentPage++;
        loadComments(currentCommentPage);
    }

    // 更新评论数量
    function updateCommentCount(increment) {
        const countSpan = document.querySelector('.comment-count');
        const currentCount = parseInt(countSpan.textContent.match(/\d+/)[0]);
        countSpan.textContent = `(${currentCount + increment})`;
    }

    // 加载相关作品
    function loadRelatedWorks() {
        const relatedWorksGrid = document.querySelector('.related-works-grid');
        // 实际项目中这里应该从服务器获取数据
        const mockRelatedWorks = [
            {
                id: 1,
                title: '金鱼',
                image: '../../assets/images/placeholder.svg',
                author: '张小明',
                likes: 96
            },
            // 更多相关作品...
        ];

        mockRelatedWorks.forEach(work => {
            const workElement = createRelatedWorkElement(work);
            relatedWorksGrid.appendChild(workElement);
        });
    }

    // 创建相关作品元素
    function createRelatedWorkElement(work) {
        const div = document.createElement('div');
        div.className = 'related-work-card';
        div.innerHTML = `
            <div class="work-image">
                <img src="${work.image}" alt="${work.title}">
            </div>
            <div class="work-info">
                <h3>${work.title}</h3>
                <p class="author">${work.author}</p>
            </div>
        `;
        return div;
    }

    // 处理关注
    function handleFollow() {
        const isFollowing = followBtn.classList.toggle('following');
        followBtn.innerHTML = isFollowing ? 
            '<i class="fas fa-check"></i>已关注' : 
            '<i class="fas fa-plus"></i>关注';
        
        // 实际项目中这里应该调用API
        updateFollowStatus(isFollowing);
    }

    // API调用函数（实际项目中实现）
    function updateLikeStatus(status) {
        // 调用点赞API
    }

    function updateCollectStatus(status) {
        // 调用收藏API
    }

    function updateFollowStatus(status) {
        // 调用关注API
    }

    // 点击外部关闭分享弹窗
    window.addEventListener('click', function(event) {
        if (event.target === shareModal) {
            closeShareModal();
        }
    });
}); 