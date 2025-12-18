// ====================================================
// FILE: js/main.js
// PHIÊN BẢN: FIXED (SỬA LỖI NULL PLAYER IMAGE)
// ====================================================

// --- 1. KHỞI TẠO BIẾN TOÀN CỤC ---

let currentPlaylist = [];
let viewKey = 'home';
let playbackPlaylist = [];
let playbackIndex = 0;

let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let isDraggingProgress = false;
let isDraggingVolume = false;

// Lấy danh sách yêu thích
let favorites = JSON.parse(localStorage.getItem('myFavorites')) || [];

// --- 2. LẤY CÁC PHẦN TỬ DOM ---

const audio = document.getElementById('audio');
const ytPlayer = document.getElementById('youtube-floating-player');

const playBtn = document.getElementById('btn-play');
const playIcon = playBtn ? playBtn.querySelector('i') : null;
const prevBtn = document.getElementById('btn-prev');
const nextBtn = document.getElementById('btn-next');
const shuffleBtn = document.getElementById('btn-shuffle');
const repeatBtn = document.getElementById('btn-repeat');
const playerHeartBtn = document.getElementById('btn-player-heart'); // Nút Tim ở Player

const songNameEl = document.getElementById('player-song-name');
const artistNameEl = document.getElementById('player-artist-name');
const focusSongEl = document.getElementById('focus-song-info');
// Lưu ý: class này có thể không tồn tại trong HTML của bạn, nên ta sẽ kiểm tra kỹ
const playerImgEl = document.querySelector('.player-img');

const progressContainer = document.querySelector('.progress-bar');
const progressFill = document.querySelector('.progress-fill');
const timeCurrent = document.querySelector('.time-text:first-child');
const timeDuration = document.querySelector('.time-text:last-child');

const volumeContainer = document.querySelector('.volume-bar');
const volumeFill = document.querySelector('.volume-fill');
const volumeIcon = document.querySelector('.fa-volume-high');


// ====================================================
// 3. CHỨC NĂNG ĐIỀU HƯỚNG
// ====================================================

function switchPlaylist(key) {
    viewKey = key;

    // Thu nhỏ video nếu đang phát
    if (ytPlayer && !ytPlayer.classList.contains('hidden')) {
        ytPlayer.classList.remove('full');
        ytPlayer.classList.add('mini');
    }

    if (key === 'favorites') {
        let likedNames = JSON.parse(localStorage.getItem('myFavorites')) || [];
        let uniqueFavoriteSongs = [];
        let seenNames = new Set();

        for (let k in allPlaylists) {
            if (allPlaylists[k].songs) {
                allPlaylists[k].songs.forEach(song => {
                    if (likedNames.includes(song.name) && !seenNames.has(song.name)) {
                        uniqueFavoriteSongs.push(song);
                        seenNames.add(song.name);
                    }
                });
            }
        }
        currentPlaylist = uniqueFavoriteSongs;
        if (playlistHeader) playlistHeader.style.display = 'none';
        renderFavoritesPage();
    } 
    else {
        const data = allPlaylists[key];
        currentPlaylist = data.songs;

        if (playlistHeader) {
            if (data.type === 'home' || data.type === 'artist') {
                playlistHeader.style.display = 'none';
            } else {
                playlistHeader.style.display = 'flex';
                playlistTitle.innerText = data.title;
            }
        }

        if (data.type === 'home') renderHomePage();
        else if (data.type === 'artist') renderArtistPage(data);
        else renderVerticalList();
    }

    renderSidebar();
    scrollToTop();
}

function scrollToTop() {
    setTimeout(() => {
        const container = document.getElementById('playlist-container');
        if (container) container.scrollTop = 0;
        if (container && container.parentElement) container.parentElement.scrollTop = 0;
        window.scrollTo(0, 0);
    }, 50);
}


// ====================================================
// 4. PHÁT NHẠC & XỬ LÝ (CORE LOGIC)
// ====================================================

function loadSong(song) {
    // 1. Cập nhật thông tin text
    if (songNameEl) songNameEl.innerText = song.name;
    if (artistNameEl) artistNameEl.innerText = song.artist;
    if (focusSongEl) focusSongEl.innerText = `Đang phát: ${song.name} - ${song.artist}`;

    // 2. Cập nhật trạng thái nút Tim ở Player
    if (playerHeartBtn) {
        const isLiked = favorites.includes(song.name);
        if(isLiked) {
            playerHeartBtn.classList.remove('fa-regular');
            playerHeartBtn.classList.add('fa-solid' , 'liked');
        } else {
            playerHeartBtn.classList.remove('fa-solid' , 'liked');
            playerHeartBtn.classList.add('fa-regular');
        }
    }

    // 3. Phân loại Youtube / MP3
    if (song.youtubeId) {
        audio.pause();
        audio.src = ""; 
        isPlaying = false;
        if(playIcon) playIcon.className = 'fa-solid fa-play';

        ytPlayer.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${song.youtubeId}?autoplay=1&controls=1&enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        
        ytPlayer.classList.remove('hidden');
        ytPlayer.classList.remove('mini');
        ytPlayer.classList.add('full'); 

    } else {
        ytPlayer.innerHTML = "";
        ytPlayer.classList.add('hidden');
        ytPlayer.classList.remove('full', 'mini');
        audio.src = song.src;
    }
}

function playSpecificSong(indexInViewList) {
    playbackPlaylist = [...currentPlaylist];
    playbackIndex = indexInViewList;
    const currentSong = playbackPlaylist[playbackIndex];

    loadSong(currentSong);

    if (!currentSong.youtubeId) {
        playSong();
    }
    updateInterfaceHighlights();
}

function playRandomAndExpand() {
    if (playbackPlaylist.length === 0 && allPlaylists['home'].songs) {
        playbackPlaylist = [...allPlaylists['home'].songs];
    }
    if (currentPlaylist.length > 0) {
        playbackPlaylist = [...currentPlaylist];
    }

    playbackIndex = Math.floor(Math.random() * playbackPlaylist.length);
    const song = playbackPlaylist[playbackIndex];

    loadSong(song);
    
    if (!song.youtubeId) {
        playSong();
        openNowPlaying();
    }
}

function openNowPlaying() {
    const currentSong = playbackPlaylist[playbackIndex];
    if (currentSong && currentSong.youtubeId) {
        if (ytPlayer) {
            ytPlayer.classList.remove('mini');
            ytPlayer.classList.add('full');
        }
        return;
    }

    let artistData = null;
    if (allPlaylists[viewKey] && allPlaylists[viewKey].type === 'artist') {
        artistData = allPlaylists[viewKey];
    } else {
        for (let key in allPlaylists) {
            if (allPlaylists[key].title === currentSong.artist) {
                artistData = allPlaylists[key];
                break;
            }
        }
    }
    renderSongDetailPage(currentSong, artistData);
}

function updateInterfaceHighlights() {
    // 1. Nếu đang ở màn hình chi tiết (Lyric/Disk) thì render lại để update thông tin
    if (document.querySelector('.song-detail-page')) {
        openNowPlaying();
        return;
    }

    // 2. Xử lý riêng cho trang Favorites (SỬA LỖI TẠI ĐÂY)
    if (viewKey === 'favorites') {
        renderFavoritesPage();
        return; // Dừng luôn, không chạy đoạn dưới nữa để tránh lỗi
    }

    // 3. Các trang còn lại (Home, Artist...)
    // Kiểm tra xem dữ liệu có tồn tại không trước khi check .type
    if (allPlaylists[viewKey]) {
        if (allPlaylists[viewKey].type === 'artist') {
            renderArtistPage(allPlaylists[viewKey]);
        } else if (allPlaylists[viewKey].type !== 'home') {
            renderVerticalList();
        }
    }
}

// ====================================================
// 5. ĐIỀU KHIỂN PLAYER
// ====================================================

function playSong() {
    isPlaying = true;
    audio.play();
    if(playIcon) playIcon.className = 'fa-solid fa-pause';
}

function pauseSong() {
    isPlaying = false;
    audio.pause();
    if(playIcon) playIcon.className = 'fa-solid fa-play';
}

function togglePlay() {
    if ((!audio.src || audio.src === "") && ytPlayer.classList.contains('hidden')) {
        if (allPlaylists['home']) {
            switchPlaylist('home');
            playSpecificSong(0);
        }
        return;
    }

    if (ytPlayer.classList.contains('hidden')) {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    }
}

function nextSong() {
    if (playbackPlaylist.length === 0) return;

    if (isShuffle) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * playbackPlaylist.length);
        } while (newIndex === playbackIndex && playbackPlaylist.length > 1);
        playbackIndex = newIndex;
    } else {
        playbackIndex++;
        if (playbackIndex > playbackPlaylist.length - 1) {
            playbackIndex = 0;
        }
    }
    const song = playbackPlaylist[playbackIndex];
    loadSong(song);
    
    if (!song.youtubeId) {
        playSong();
    }
    updateInterfaceHighlights();
}

function prevSong() {
    if (playbackPlaylist.length === 0) return;

    playbackIndex--;
    if (playbackIndex < 0) {
        playbackIndex = playbackPlaylist.length - 1;
    }

    const song = playbackPlaylist[playbackIndex];
    loadSong(song);
    
    if (!song.youtubeId) {
        playSong();
    }
    updateInterfaceHighlights();
}

function onSongEnded() {
    if (isRepeat) {
        loadSong(playbackPlaylist[playbackIndex]);
        if (!playbackPlaylist[playbackIndex].youtubeId) playSong();
    } else {
        nextSong();
    }
}

// ====================================================
// 6. CÁC TÍNH NĂNG PHỤ
// ====================================================

// --- Thả Tim & Đồng bộ ---
function checkIsLiked(songName) {
    return favorites.includes(songName);
}

function toggleHeart(songName, event) {
    if (event) event.stopPropagation();
    
    const index = favorites.indexOf(songName);
    const isLikedNow = index === -1;

    if (isLikedNow) {
        favorites.push(songName);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('myFavorites', JSON.stringify(favorites));

    // Cập nhật nút trong danh sách
    if (event && event.target) {
        const btn = event.target;
        if (isLikedNow) {
            btn.classList.add('liked', 'fa-solid');
            btn.classList.remove('fa-regular');
        } else {
            btn.classList.remove('liked', 'fa-solid');
            btn.classList.add('fa-regular');
        }
    }

    // Đồng bộ với nút ở Player Bar
    if (playerHeartBtn && playbackPlaylist.length > 0) {
        const currentSong = playbackPlaylist[playbackIndex];
        if (currentSong.name === songName) {
            if (isLikedNow) {
                playerHeartBtn.classList.remove('fa-regular');
                playerHeartBtn.classList.add('fa-solid', 'liked');
            } else {
                playerHeartBtn.classList.remove('fa-solid', 'liked');
                playerHeartBtn.classList.add('fa-regular');
            }
        }
    }
}

// --- Tìm kiếm ---
const searchInput = document.querySelector('input[placeholder*="Tìm kiếm"]');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase().trim();
        
        if (keyword === '') {
            switchPlaylist('home');
            return;
        }

        let uniqueResults = [];
        let seenNames = new Set();

        for (let key in allPlaylists) {
            if (allPlaylists[key].songs) {
                allPlaylists[key].songs.forEach(song => {
                    const isMatch = song.name.toLowerCase().includes(keyword) || 
                                  song.artist.toLowerCase().includes(keyword);
                    if (isMatch && !seenNames.has(song.name)) {
                        uniqueResults.push(song);
                        seenNames.add(song.name);
                    }
                });
            }
        }
        
        currentPlaylist = uniqueResults;
        renderHomePage();
        const headerTitle = document.querySelector('.section-header span');
        if (headerTitle) {
            headerTitle.innerText = `Kết quả tìm kiếm: "${keyword}"`;
        }
    });
}

// --- Đồng hồ & Lời chào ---
const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');

function updateClock() {
    const now = new Date();
    if (clockEl) {
        clockEl.innerText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
    if (dateEl) {
        dateEl.innerText = now.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' });
    }
}

function updateGreeting() {
    const greetingEl = document.getElementById('user-greeting');
    if (!greetingEl) return;
    const hour = new Date().getHours();
    let text = "", icon = "";
    if (hour >= 5 && hour < 12) { text = "Chào buổi sáng"; icon = "☀️"; }
    else if (hour >= 12 && hour < 18) { text = "Chiều rồi, thư giãn nhé"; icon = "🌤️"; }
    else if (hour >= 18 && hour < 23) { text = "Buổi tối vui vẻ"; icon = "🌙"; }
    else { text = "Khuya rồi, làm tí Lofi nhé"; icon = "🦉"; }
    greetingEl.innerHTML = `${icon} ${text}, User`;
}

// --- Progress Bar & Volume Logic ---
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function calculateGlobalPercent(e, container) {
    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    let percent = clickX / rect.width;
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;
    return percent;
}

function handleProgressDrag(e) {
    const percent = calculateGlobalPercent(e, progressContainer);
    progressFill.style.width = `${percent * 100}%`;
    if (audio.duration) {
        const seekTime = percent * audio.duration;
        timeCurrent.innerText = formatTime(seekTime);
        audio.currentTime = seekTime;
    }
}

function handleVolumeDrag(e) {
    const percent = calculateGlobalPercent(e, volumeContainer);
    audio.volume = percent;
    volumeFill.style.width = `${percent * 100}%`;
    if (percent === 0) volumeIcon.className = 'fa-solid fa-volume-xmark';
    else volumeIcon.className = 'fa-solid fa-volume-high';
}

function restorePreviousView() {
    switchPlaylist(viewKey);
}

// ====================================================
// 7. SỰ KIỆN & KHỞI CHẠY
// ====================================================

if(playBtn) playBtn.addEventListener('click', togglePlay);
if(nextBtn) nextBtn.addEventListener('click', nextSong);
if(prevBtn) prevBtn.addEventListener('click', prevSong);
audio.addEventListener('ended', onSongEnded);

// Nút Tim ở Player Bar (Click để Thích/Bỏ Thích)
if (playerHeartBtn) {
    playerHeartBtn.addEventListener('click', (e) => {
        if (playbackPlaylist.length > 0) {
            const currentSong = playbackPlaylist[playbackIndex];
            toggleHeart(currentSong.name, e);
            
            // Nếu đang xem trang Favorites thì reload để thấy thay đổi
            if (viewKey === 'favorites') {
                switchPlaylist('favorites');
            }
        }
    });
}

// Hàm chung để xử lý khi bấm vào Player nhỏ (Ảnh hoặc Tên bài)
const handlePlayerClick = () => {
    if (ytPlayer && !ytPlayer.classList.contains('hidden')) {
        ytPlayer.classList.remove('mini');
        ytPlayer.classList.add('full');
    } else {
        openNowPlaying();
    }
};

// Gán sự kiện click cho ảnh nhỏ (nếu có)
if (playerImgEl) {
    playerImgEl.style.cursor = 'pointer';
    playerImgEl.onclick = handlePlayerClick;
}

// Gán sự kiện click cho tên bài hát (nếu có)
if (songNameEl) {
    songNameEl.style.cursor = 'pointer';
    // SỬA LỖI Ở ĐÂY: Gán trực tiếp hàm handlePlayerClick thay vì copy từ playerImgEl
    songNameEl.onclick = handlePlayerClick;
}

if(shuffleBtn) {
    shuffleBtn.onclick = () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('icon-active', isShuffle);
        if (isShuffle) { isRepeat = false; repeatBtn.classList.remove('icon-active'); }
    };
}

if(repeatBtn) {
    repeatBtn.onclick = () => {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle('icon-active', isRepeat);
        if (isRepeat) { isShuffle = false; shuffleBtn.classList.remove('icon-active'); }
    };
}

// Audio Update
audio.addEventListener('timeupdate', (e) => {
    if (isDraggingProgress) return;
    const { duration, currentTime } = e.srcElement;
    if (!isNaN(duration)) {
        const percent = (currentTime / duration) * 100;
        progressFill.style.width = `${percent}%`;
        timeCurrent.innerText = formatTime(currentTime);
        timeDuration.innerText = formatTime(duration);
    }
});

// Dragging
if(progressContainer) progressContainer.addEventListener('mousedown', (e) => { isDraggingProgress = true; handleProgressDrag(e); });
if(volumeContainer) volumeContainer.addEventListener('mousedown', (e) => { isDraggingVolume = true; handleVolumeDrag(e); });

document.addEventListener('mousemove', (e) => {
    if (isDraggingProgress) handleProgressDrag(e);
    if (isDraggingVolume) handleVolumeDrag(e);
});
document.addEventListener('mouseup', () => { isDraggingProgress = false; isDraggingVolume = false; });

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT') return;
    switch (e.code) {
        case 'Space': e.preventDefault(); togglePlay(); break;
        case 'ArrowRight': nextSong(); break;
        case 'ArrowLeft': prevSong(); break;
        case 'ArrowUp': 
            e.preventDefault(); 
            if (audio.volume < 1) audio.volume = Math.min(1, audio.volume + 0.1); 
            volumeFill.style.width = `${audio.volume * 100}%`; break;
        case 'ArrowDown': 
            e.preventDefault(); 
            if (audio.volume > 0) audio.volume = Math.max(0, audio.volume - 0.1); 
            volumeFill.style.width = `${audio.volume * 100}%`; break;
    }
});

// Chế độ Focus (10 giây không dùng chuột)
const IDLE_TIME = 120000;
let idleTimer;
const uiLayer = document.getElementById('mainInterface');

function goFocus() {
    if (uiLayer) uiLayer.classList.add('hide-ui');
    
    // Ẩn video bằng class để giữ nhạc
    if (ytPlayer) {
        ytPlayer.style.transition = '';
        ytPlayer.style.opacity = '';
        ytPlayer.classList.add('focus-hide');
    }
}

function wakeUp() {
    if (uiLayer) uiLayer.classList.remove('hide-ui');
    
    // Hiện lại video
    if (ytPlayer) {
        ytPlayer.classList.remove('focus-hide');
    }

    clearTimeout(idleTimer);
    idleTimer = setTimeout(goFocus, IDLE_TIME);
}

document.onmousemove = wakeUp;
document.onkeypress = wakeUp;
document.onclick = wakeUp;

// START APP
window.onload = () => {
    switchPlaylist('home');
    setInterval(updateClock, 1000);
    updateClock();
    wakeUp();
    audio.volume = 0.5;
    if(volumeFill) volumeFill.style.width = '50%';
    updateGreeting();
};