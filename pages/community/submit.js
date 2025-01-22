// 作品上传页面交互脚本
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const form = document.getElementById('workSubmitForm');
    const descInput = document.getElementById('workDesc');
    const charCount = document.querySelector('.char-count');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('workImage');
    const previewArea = document.getElementById('previewArea');
    const tagsInput = document.getElementById('workTags');
    const tagsContainer = document.querySelector('.tags-container');
    const previewBtn = document.getElementById('previewBtn');
    const previewModal = document.getElementById('previewModal');
    const closeBtn = document.querySelector('.close-btn');
    const editBtn = document.getElementById('editBtn');
    const confirmBtn = document.getElementById('confirmBtn');

    // 初始化存储管理器
    const workStorage = new WorkStorage();

    // 存储当前标签和图片
    let tags = [];
    let images = [];

    // 字数统计
    descInput.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = `${length}/200`;
        if (length > 200) {
            charCount.style.color = 'var(--color-error)';
            this.value = this.value.slice(0, 200);
        } else {
            charCount.style.color = 'var(--color-text-light)';
        }
    });

    // 文件上传处理
    function handleFiles(files) {
        if (files.length + images.length > 5) {
            alert('最多只能上传5张图片');
            return;
        }

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                alert('请上传图片文件');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('图片大小不能超过5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                images.push(imageData);

                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = `
                    <img src="${imageData}" alt="预览图片">
                    <span class="preview-remove">&times;</span>
                `;
                previewArea.appendChild(previewItem);

                // 删除预览图片
                previewItem.querySelector('.preview-remove').addEventListener('click', function() {
                    const index = Array.from(previewArea.children).indexOf(previewItem);
                    images.splice(index, 1);
                    previewArea.removeChild(previewItem);
                });
            };
            reader.readAsDataURL(file);
        });
    }

    // 文件选择处理
    fileInput.addEventListener('change', function(e) {
        handleFiles(this.files);
    });

    // 拖放上传
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    // 标签管理
    function addTag(tagText) {
        if (tags.length >= 5) {
            alert('最多添加5个标签');
            return;
        }

        if (tagText && !tags.includes(tagText)) {
            tags.push(tagText);
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = `
                ${tagText}
                <span class="tag-remove">&times;</span>
            `;
            tagsContainer.appendChild(tag);

            // 删除标签
            tag.querySelector('.tag-remove').addEventListener('click', function() {
                tags = tags.filter(t => t !== tagText);
                tagsContainer.removeChild(tag);
            });
        }
    }

    tagsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tagText = this.value.trim();
            if (tagText) {
                addTag(tagText);
                this.value = '';
            }
        }
    });

    // 预览功能
    function updatePreview() {
        const title = document.getElementById('workTitle').value;
        const category = document.getElementById('workCategory').value;
        const desc = document.getElementById('workDesc').value;
        const techniques = Array.from(document.querySelectorAll('input[name="techniques"]:checked'))
            .map(input => input.parentElement.textContent.trim());

        document.querySelector('.preview-title').textContent = title;
        document.querySelector('.preview-category').textContent = 
            category ? `类别：${document.querySelector(`option[value="${category}"]`).textContent}` : '';
        document.querySelector('.preview-desc').textContent = desc;

        const techContainer = document.querySelector('.preview-techniques');
        techContainer.innerHTML = techniques
            .map(tech => `<span class="preview-technique">${tech}</span>`)
            .join('');

        const tagsContainer = document.querySelector('.preview-tags');
        tagsContainer.innerHTML = tags
            .map(tag => `<span class="preview-tag">${tag}</span>`)
            .join('');

        const previewImages = document.querySelector('.preview-images');
        previewImages.innerHTML = images
            .map(img => `
                <div class="preview-image">
                    <img src="${img}" alt="预览图片">
                </div>
            `).join('');
    }

    // 预览按钮点击事件
    previewBtn.addEventListener('click', function() {
        updatePreview();
        previewModal.classList.add('active');
    });

    // 关闭预览
    closeBtn.addEventListener('click', function() {
        previewModal.classList.remove('active');
    });

    editBtn.addEventListener('click', function() {
        previewModal.classList.remove('active');
    });

    // 点击模态框外部关闭
    previewModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });

    // 确认提交
    confirmBtn.addEventListener('click', function() {
        submitWork();
    });

    // 表单提交
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitWork();
    });

    // 提交作品
    function submitWork() {
        // 验证必填字段
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        if (!isValid) {
            alert('请填写所有必填字段');
            return;
        }

        // 验证图片数量
        if (images.length === 0) {
            alert('请至少上传一张图片');
            return;
        }

        // 收集作品数据
        const workData = {
            title: document.getElementById('workTitle').value,
            category: document.getElementById('workCategory').value,
            description: document.getElementById('workDesc').value,
            techniques: Array.from(document.querySelectorAll('input[name="techniques"]:checked'))
                .map(input => input.value),
            tags: tags,
            images: images,
            featured: false, // 新上传的作品默认不是精选
            author: '用户', // 这里可以添加用户系统
            likes: 0,
            views: 0
        };

        // 保存作品
        try {
            workStorage.addWork(workData);
            alert('作品提交成功！');
            
            // 重置表单
            form.reset();
            previewArea.innerHTML = '';
            tagsContainer.innerHTML = '';
            tags = [];
            images = [];
            
            // 关闭预览模态框
            previewModal.classList.remove('active');
            
            // 跳转到画廊页面
            setTimeout(() => {
                window.location.href = '../gallery/index.html';
            }, 1000);
        } catch (error) {
            alert('提交失败，请稍后重试');
            console.error('提交作品失败:', error);
        }
    }
}); 