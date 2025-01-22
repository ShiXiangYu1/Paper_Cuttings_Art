// 作品数据存储管理
window.WorkStorage = class WorkStorage {
    constructor() {
        this.storageKey = 'papercut_works';
        this.works = this.loadWorks();
    }

    // 加载所有作品
    loadWorks() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    // 保存所有作品
    saveWorks() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.works));
    }

    // 添加新作品
    addWork(work) {
        work.id = Date.now(); // 使用时间戳作为唯一ID
        work.createTime = new Date().toISOString();
        this.works.unshift(work); // 新作品添加到开头
        this.saveWorks();
        return work;
    }

    // 获取所有作品
    getAllWorks() {
        return this.works;
    }

    // 根据类别获取作品
    getWorksByCategory(category) {
        if (category === 'all') {
            return this.works;
        }
        return this.works.filter(work => work.category === category);
    }

    // 获取最新作品
    getLatestWorks(limit = 5) {
        return this.works.slice(0, limit);
    }

    // 获取精选作品
    getFeaturedWorks(limit = 2) {
        return this.works
            .filter(work => work.featured)
            .slice(0, limit);
    }

    // 设置作品为精选
    setFeatured(workId, featured = true) {
        const work = this.works.find(w => w.id === workId);
        if (work) {
            work.featured = featured;
            this.saveWorks();
        }
    }

    // 删除作品
    deleteWork(workId) {
        this.works = this.works.filter(w => w.id !== workId);
        this.saveWorks();
    }
} 