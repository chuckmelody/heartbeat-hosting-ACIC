import AbstractView from "./AbstractView.js";
import RightSidebar from "./_RightSidebar.js";
import PostManager from "../managers/PostManager.js";
import ModalManager from "../managers/ModalManager.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Posts");
        this.postManager = null;
    }

    async getHtml() {
        return `
            <div class="event-view-header">
                <h2 class="page-title"><i class="fa-solid fa-signs-post fa-fw"></i> Posts</h2>
                <button id="create-post-btn" class="form-button" data-tooltip="Create a new post"><i class="fa-solid fa-plus fa-fw"></i> Create Post</button>
            </div>
            <div class="two-column-grid">
                <div class="main-content post-feed" id="post-feed-container">
                    <!-- Posts will be rendered here by PostManager -->
                </div>
                ${await RightSidebar.render()}
            </div>
        `;
    }

    async after_render() {
        this.postManager = new PostManager('post-feed-container');
        const modalManager = new ModalManager();

        document.getElementById('create-post-btn').addEventListener('click', () => {
            modalManager.showCreatePostModal((postData) => {
                // This is where you would send the data to the backend
                console.log('New post created (frontend simulation):', postData);
                modalManager.showInfoModal('Post Created', 'Your new post has been successfully created.');
            });
        });
    }
}