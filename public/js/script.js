document.addEventListener('DOMContentLoaded', () => {
    const addLinkForm = document.getElementById('add-link-form');
    const linksContainer = document.getElementById('links-container');

    if (addLinkForm) {
        addLinkForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(addLinkForm);
            try {
                const response = await fetch('/links', {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    window.location.reload();
                } else {
                    console.error('Failed to add link');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    if (linksContainer) {
        linksContainer.addEventListener('click', async (e) => {
            if (e.target.classList.contains('like-button')) {
                const linkId = e.target.dataset.id;
                try {
                    const response = await fetch(`/links/${linkId}/like`, { method: 'POST' });
                    if (response.ok) {
                        const data = await response.json();
                        e.target.previousElementSibling.textContent = data.likes;
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }

            if (e.target.classList.contains('comment-button')) {
                const linkId = e.target.dataset.id;
                const commentsSection = document.getElementById(`comments-${linkId}`);
                if (commentsSection.innerHTML === '') {
                    try {
                        const response = await fetch(`/comments/${linkId}`);
                        if (response.ok) {
                            const comments = await response.json();
                            commentsSection.innerHTML = comments.map(comment => `
                                <div class="comment">
                                    <strong>${comment.User.username}:</strong> ${comment.content}
                                </div>
                            `).join('');
                            const commentForm = document.createElement('form');
                            commentForm.innerHTML = `
                                <textarea name="content" required></textarea>
                                <button type="submit">Add Comment</button>
                            `;
                            commentForm.addEventListener('submit', async (e) => {
                                e.preventDefault();
                                const content = e.target.content.value;
                                try {
                                    const response = await fetch('/comments', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ linkId, content }),
                                    });
                                    if (response.ok) {
                                        const newComment = await response.json();
                                        commentsSection.insertAdjacentHTML('afterbegin', `
                                            <div class="comment">
                                                <strong>${newComment.User.username}:</strong> ${newComment.content}
                                            </div>
                                        `);
                                        e.target.content.value = '';
                                    }
                                } catch (error) {
                                    console.error('Error:', error);
                                }
                            });
                            commentsSection.appendChild(commentForm);
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                } else {
                    commentsSection.innerHTML = '';
                }
            }
        });
    }
});