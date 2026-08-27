document.addEventListener('DOMContentLoaded', () => {

    // 1. Projects Filter & View More Toggle
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const viewMoreBtn = document.getElementById('view-more-btn');

    let isExpanded = false;
    const MAX_INITIAL_ITEMS = 5;

    function updateProjectVisibility() {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        let visibleCount = 0;

        projectCards.forEach(card => {
            const matchesFilter = (activeFilter === 'all' || card.getAttribute('data-category') === activeFilter);

            if (matchesFilter) {
                visibleCount++;
                if (isExpanded || visibleCount <= MAX_INITIAL_ITEMS) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            } else {
                card.style.display = 'none';
            }
        });

        let totalMatching = Array.from(projectCards).filter(card =>
            activeFilter === 'all' || card.getAttribute('data-category') === activeFilter
        ).length;

        if (totalMatching <= MAX_INITIAL_ITEMS) {
            if (viewMoreBtn) viewMoreBtn.style.display = 'none';
        } else {
            if (viewMoreBtn) {
                viewMoreBtn.style.display = 'inline-block';
                viewMoreBtn.textContent = isExpanded ? 'SHOW LESS' : 'VIEW MORE PROJECTS';
            }
        }
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            isExpanded = false;
            updateProjectVisibility();
        });
    });

    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            updateProjectVisibility();
        });
    }

    updateProjectVisibility();


    // 2. Experience Hover Photo Change & Active Highlight
    const expRows = document.querySelectorAll('.exp-row');
    const expActiveImg = document.getElementById('exp-active-img');

    // 默认给第一个卡片添加选中高亮
    if (expRows.length > 0) {
        expRows[0].classList.add('active');
    }

    expRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            // 清除其他卡片的 active，给当前悬浮/选中项添加 active
            expRows.forEach(r => r.classList.remove('active'));
            row.classList.add('active');

            const newImgSrc = row.getAttribute('data-img');
            if (newImgSrc && expActiveImg) {
                expActiveImg.style.opacity = '0';
                setTimeout(() => {
                    expActiveImg.src = newImgSrc;
                    expActiveImg.style.opacity = '1';
                }, 150);
            }
        });
    });

    // 3. Scroll Reveal Animation for Section Titles (每次滚动入屏均重复触发)
    const revealTitles = document.querySelectorAll('.section-large-title');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };

    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 进入视角：添加 reveal 类名触发上升动画
                entry.target.classList.add('reveal');
            } else {
                // 离开视角：移除 reveal 类名重置状态，以便下次进入时重新播放
                entry.target.classList.remove('reveal');
            }
        });
    }, observerOptions);

    revealTitles.forEach(title => titleObserver.observe(title));

    // 4. Interests Section Interactivity & Custom Cursor (图2/图3效果)
    const customCursor = document.getElementById('custom-cursor');
    const interestsSection = document.getElementById('interests');
    const interestTags = document.querySelectorAll('.interest-tag');

    const interestImg = document.getElementById('interest-img');
    const interestTitle = document.getElementById('interest-title');
    const interestDesc = document.getElementById('interest-desc');
    const interestTime = document.getElementById('interest-time');

    // 圆圈光标跟随
    window.addEventListener('mousemove', (e) => {
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
    });

    interestsSection.addEventListener('mouseenter', () => customCursor.classList.add('active'));
    interestsSection.addEventListener('mouseleave', () => customCursor.classList.remove('active'));

    interestTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => customCursor.classList.add('hovered'));
        tag.addEventListener('mouseleave', () => customCursor.classList.remove('hovered'));

        tag.addEventListener('click', () => {
            interestTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            const newImg = tag.getAttribute('data-img');
            const newTitle = tag.getAttribute('data-title');
            const newDesc = tag.getAttribute('data-desc');
            const newTime = tag.getAttribute('data-time');

            interestImg.style.opacity = '0';
            setTimeout(() => {
                interestImg.src = newImg;
                interestTitle.textContent = newTitle;
                interestDesc.textContent = newDesc;
                interestTime.textContent = newTime;
                interestImg.style.opacity = '1';
            }, 150);
        });
    });


    // 5. Certificates Horizontal Scroll on Vertical Wheel (图1效果)
    const certSection = document.getElementById('certificates');
    const certTrack = document.getElementById('cert-track');

    window.addEventListener('scroll', () => {
        if (!certSection || !certTrack) return;

        const sectionTop = certSection.offsetTop;
        const sectionHeight = certSection.offsetHeight;
        const viewportHeight = window.innerHeight;
        const scrollPosition = window.scrollY;

        // 计算用户在 Certificates 区域内的滚动进度 (0 到 1)
        const startScroll = sectionTop - 70;
        const endScroll = sectionTop + sectionHeight - viewportHeight;

        if (scrollPosition >= startScroll && scrollPosition <= endScroll) {
            const progress = (scrollPosition - startScroll) / (endScroll - startScroll);
            const maxTranslate = certTrack.scrollWidth - window.innerWidth + 80; // 额外补丁边距

            // 将垂直滚动距离转换为横向平移
            certTrack.style.transform = `translateX(-${progress * maxTranslate}px)`;
        }
    });

});