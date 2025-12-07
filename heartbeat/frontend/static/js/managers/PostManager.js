const mockPosts = [
    {
        id: 1,
        author: "Junior Anderson BEM",
        avatar: "/static/img/junior1.jpg", // Placeholder
        timestamp: "2h ago",
        content: "Great to see so many new faces at our last community workshop! Your energy and enthusiasm are what drive this initiative forward. We discussed key strategies for youth engagement and the feedback was incredible. Looking forward to putting these ideas into action. #Community #YouthEmpowerment",
        image: "/static/img/junior1.jpg", // Placeholder image
        likes: 15,
        comments: 4,
    },
    {
        id: 2,
        author: "Heatbeat A CIC",
        avatar: "/static/img/junior1.jpg", // Placeholder
        timestamp: "1d ago",
        content: "We are officially launching our new mentorship program next month! This program will pair experienced community leaders with young individuals looking for guidance and support. It's a fantastic opportunity to build connections and foster growth. If you're interested in becoming a mentor or a mentee, please visit our volunteer page for more information. Let's make a difference together!",
        image: null,
        likes: 32,
        comments: 12,
    }
];

import ModalManager from "./ModalManager.js";
import ShareManager from "./ShareManager.js";

export default class PostManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`PostManager: Container with id "${containerId}" not found.`);
            return;
        }
        this.posts = [];
        this._fetchPosts();
        this.modalManager = new ModalManager();
        this.shareManager = new ShareManager();
    }

    _fetchPosts() {
        // In a real application, this would be an API call.
        this.posts = mockPosts;
        this.render();
    }

    render() {
        this.container.innerHTML = this.posts.map(post => this._createPostHTML(post)).join('');
        this._attachEventListeners();
    }

    _createPostHTML(post) {
        const imageHTML = post.image ? `<div class="post-image"><img src="${post.image}" alt="Post image"></div>` : '';

        return `
            <div class="post-card" data-post-id="${post.id}">
                <div class="post-header">
                    <img src="${post.avatar}" alt="${post.author}" class="post-author-avatar">
                    <div class="post-author-info">
                        <span class="post-author-name">${post.author}</span>
                        <span class="post-timestamp">${post.timestamp}</span>
                    </div>
                    <div class="post-options">
                        <button class="post-options-btn" data-tooltip="More options"><i class="fa-solid fa-ellipsis"></i></button>
                        <div class="post-options-dropdown">
                            <a href="#" class="edit-post-btn">Edit Post</a>
                            <a href="#" class="delete-post-btn">Delete Post</a>
                        </div>
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.content}</p>
                </div>
                ${imageHTML}
                <div class="post-stats">
                    <span><i class="fa-solid fa-thumbs-up"></i> ${post.likes}</span>
                    <span>${post.comments} Comments</span>
                </div>
                <div class="post-actions">
                    <button class="post-action-btn like-btn"><i class="fa-regular fa-thumbs-up"></i> Like</button>
                    <button class="post-action-btn"><i class="fa-regular fa-comment"></i> Comment</button>
                    <button class="post-action-btn share-btn"><i class="fa-regular fa-share-from-square"></i> Share</button>
                </div>
            </div>
        `;
    }

    _attachEventListeners() {
        this.container.querySelectorAll('.post-options-btn').forEach(button => {
            button.addEventListener('click', e => {
                e.stopPropagation();
                const dropdown = button.nextElementSibling;
                // Close other dropdowns
                document.querySelectorAll('.post-options-dropdown.is-active').forEach(d => {
                    if (d !== dropdown) d.classList.remove('is-active');
                });
                dropdown.classList.toggle('is-active');
            });
        });

        this.container.querySelectorAll('.edit-post-btn').forEach(button => {
            button.addEventListener('click', e => {
                e.preventDefault();
                const postId = e.target.closest('.post-card').dataset.postId;
                const post = this.posts.find(p => p.id == postId);
                this.modalManager.showEditModal(post, (id, newContent) => {
                    this._updatePost(id, newContent);
                });
            });
        });

        this.container.querySelectorAll('.delete-post-btn').forEach(button => {
            button.addEventListener('click', e => {
                e.preventDefault();
                const postId = e.target.closest('.post-card').dataset.postId;
                this.modalManager.showConfirmModal('Delete Post', 'Are you sure you want to delete this post? This action cannot be undone.', () => {
                    this._deletePost(postId);
                });
            });
        });

        this.container.querySelectorAll('.share-btn').forEach(button => {
            button.addEventListener('click', e => {
                e.preventDefault();
                const postId = e.target.closest('.post-card').dataset.postId;
                const post = this.posts.find(p => p.id == postId);
                if (post) {
                    this.shareManager.share({
                        title: `Check out this post from ${post.author}`,
                        text: post.content,
                        url: window.location.href // In a real app, this would be a direct link to the post
                    });
                }
            });
        });

        this.container.querySelectorAll('.like-btn').forEach(button => {
            button.addEventListener('click', () => {
                button.classList.toggle('is-liked');
                const icon = button.querySelector('i');
                icon.classList.toggle('fa-regular');
                icon.classList.toggle('fa-solid');
            });
        });

        // Close dropdowns when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.post-options')) {
                document.querySelectorAll('.post-options-dropdown.is-active').forEach(d => {
                    d.classList.remove('is-active');
                });
            }
        });
    }

    _updatePost(id, newContent) {
        const post = this.posts.find(p => p.id == id);
        if (post) {
            post.content = newContent;
            // Re-render the specific post card for simplicity, or the whole feed
            this.render();
            console.log(`Post ${id} updated.`);
        }
    }

    _deletePost(id) {
        this.posts = this.posts.filter(p => p.id != id);
        // Re-render the feed
        this.render();
        console.log(`Post ${id} deleted.`);
    }
}