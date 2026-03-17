const usernameInput = document.getElementById('usernameInput');
        const searchBtn = document.getElementById('searchBtn');
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        const profileCard = document.getElementById('profileCard');

        async function searchUser(username) {
            try {
                loading.classList.add('active');
                error.classList.remove('active');
                profileCard.classList.remove('active');

                const userResponse = await fetch(`https://api.github.com/users/${username}`);
                
                if (!userResponse.ok) {
                    throw new Error('User not found');
                }

                const userData = await userResponse.json();
                
                const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
                const reposData = await reposResponse.json();

                displayProfile(userData, reposData);

            } catch (err) {
                loading.classList.remove('active');
                error.classList.add('active');
            }
        }

        function displayProfile(user, repos) {
            document.getElementById('avatar').src = user.avatar_url;
            document.getElementById('name').textContent = user.name || user.login;
            document.getElementById('username').textContent = '@' + user.login;
            document.getElementById('bio').textContent = user.bio || 'No bio available';
            document.getElementById('repos').textContent = user.public_repos;
            document.getElementById('followers').textContent = user.followers;
            document.getElementById('following').textContent = user.following;
            
            document.getElementById('company').textContent = user.company || 'Not available';
            document.getElementById('location').textContent = user.location || 'Not available';
            
            const blogElement = document.getElementById('blog');
            if (user.blog) {
                blogElement.textContent = user.blog;
                blogElement.href = user.blog.startsWith('http') ? user.blog : 'http://' + user.blog;
            } else {
                blogElement.textContent = 'Not available';
                blogElement.removeAttribute('href');
            }
            
            const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            document.getElementById('created').textContent = 'Joined ' + joinDate;

            // Display repositories
            const reposGrid = document.getElementById('reposGrid');
            reposGrid.innerHTML = repos.map(repo => `
                <div class="repo-card" onclick="window.open('${repo.html_url}', '_blank')">
                    <div class="repo-name">${repo.name}</div>
                    <div class="repo-description">${repo.description || 'No description'}</div>
                    <div class="repo-stats">
                        <span class="repo-stat">⭐ ${repo.stargazers_count}</span>
                        <span class="repo-stat">🔀 ${repo.forks_count}</span>
                        ${repo.language ? `<span class="repo-stat">💻 ${repo.language}</span>` : ''}
                    </div>
                </div>
            `).join('');

            loading.classList.remove('active');
            profileCard.classList.add('active');
        }

        searchBtn.addEventListener('click', () => {
            const username = usernameInput.value.trim();
            if (username) {
                searchUser(username);
            }
        });

        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const username = usernameInput.value.trim();
                if (username) {
                    searchUser(username);
                }
            }
        });

        // Load default user on page load
        searchUser('github');
