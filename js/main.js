// --- js/main.js ---

// ================= 1. KHỞI TẠO BIẾN =================
let currentPlaylist = [];
let songIndex = 0;
let currentKey = 'home';
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let isDraggingProgress = false;
let isDraggingVolume = false;

// Lấy DOM Elements
const audio = document.getElementById('audio');
const playBtn = document.getElementById('btn-play');
const playIcon = playBtn.querySelector('i');
const prevBtn = document.getElementById('btn-prev');
const nextBtn = document.getElementById('btn-next');
const shuffleBtn = document.getElementById('btn-shuffle');
const repeatBtn = document.getElementById('btn-repeat');

const songNameEl = document.getElementById('player-song-name');
const artistNameEl = document.getElementById('player-artist-name');
const focusSongEl = document.getElementById('focus-song-info');

const progressContainer = document.querySelector('.progress-bar');
const progressFill = document.querySelector('.progress-fill');
const timeCurrent = document.querySelector('.time-text:first-child');
const timeDuration = document.querySelector('.time-text:last-child');

const volumeContainer = document.querySelector('.volume-bar');
const volumeFill = document.querySelector('.volume-fill');
const volumeIcon = document.querySelector('.fa-volume-high');


// ================= 2. HÀM LOGIC (CONTROLLER) =================

function switchPlaylist(key) {
    currentKey = key;
    const data = allPlaylists[key];
    currentPlaylist = data.songs;

    // Xử lý hiển thị tiêu đề header
    if (data.type === 'home' || data.type === 'artist') {
        playlistHeader.style.display = 'none';
    } else {
        playlistHeader.style.display = 'flex';
        playlistTitle.innerText = data.title;
    }

    // Gọi UI vẽ đúng giao diện (Hàm render này nằm bên ui.js)
    if (data.type === 'home') renderHomePage();
    else if (data.type === 'artist') renderArtistPage(data);
    else renderVerticalList();

    renderSidebar(); // Update active sidebar
}

function playSpecificSong(index) {
    songIndex = index;
    loadSong(currentPlaylist[songIndex]);
    playSong();

    // Refresh giao diện để highlight bài đang hát
    if (allPlaylists[currentKey].type === 'artist') {
        // Nếu là Nghệ sĩ (Sơn Tùng, Vũ,...) -> Vẽ trang Artist đầy đủ
        renderArtistPage(allPlaylists[currentKey]);
    } else {
        // Nếu là Playlist thường (Lofi, Home...) -> Vẽ danh sách dọc
        renderVerticalList();
    }
}

function loadSong(song) {
    songNameEl.innerText = song.name;
    artistNameEl.innerText = song.artist;
    audio.src = song.src;
    if (focusSongEl) focusSongEl.innerText = `Đang phát: ${song.name} - ${song.artist}`;
}

function playSong() {
    isPlaying = true;
    audio.play();
    playIcon.className = 'fa-solid fa-pause';
}

function pauseSong() {
    isPlaying = false;
    audio.pause();
    playIcon.className = 'fa-solid fa-play';
}

function togglePlay() {
    if (!audio.src || audio.src === "") playSpecificSong(0);
    else isPlaying ? pauseSong() : playSong();
}

function playRandom() {
    if (currentPlaylist.length === 0) currentPlaylist = allPlaylists['lofi'].songs;
    playSpecificSong(Math.floor(Math.random() * currentPlaylist.length));
}

function nextSong() {
    if (isShuffle) {
        let newIndex;
        do { newIndex = Math.floor(Math.random() * currentPlaylist.length); }
        while (newIndex === songIndex && currentPlaylist.length > 1);
        songIndex = newIndex;
    } else {
        songIndex++;
        if (songIndex > currentPlaylist.length - 1) songIndex = 0;
    }
    playSpecificSong(songIndex);
}

function prevSong() {
    songIndex--;
    if (songIndex < 0) songIndex = currentPlaylist.length - 1;
    playSpecificSong(songIndex);
}

function onSongEnded() {
    isRepeat ? playSpecificSong(songIndex) : nextSong();
}


// ================= 3. CÁC HÀM HỖ TRỢ (HELPER FUNCTIONS) =================
// Đây là phần bị thiếu ở file trước dẫn đến lỗi formatTime is not defined

// Hàm định dạng thời gian (Giây -> Phút:Giây)
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Hàm tính % khi kéo chuột
function calculateGlobalPercent(e, container) {
    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    let percent = clickX / rect.width;
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;
    return percent;
}

// Hàm xử lý kéo thanh nhạc
function handleProgressDrag(e) {
    const percent = calculateGlobalPercent(e, progressContainer);
    progressFill.style.width = `${percent * 100}%`;
    if (audio.duration) {
        const seekTime = percent * audio.duration;
        timeCurrent.innerText = formatTime(seekTime);
        audio.currentTime = seekTime;
    }
}

// Hàm xử lý kéo volume
function handleVolumeDrag(e) {
    const percent = calculateGlobalPercent(e, volumeContainer);
    audio.volume = percent;
    volumeFill.style.width = `${percent * 100}%`;
    if (percent === 0) {
        volumeIcon.className = 'fa-solid fa-volume-xmark';
    } else {
        volumeIcon.className = 'fa-solid fa-volume-high';
    }
}


// ================= 4. GẮN SỰ KIỆN (EVENTS) =================

playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
audio.addEventListener('ended', onSongEnded);

// Nút Shuffle & Repeat
shuffleBtn.onclick = () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('icon-active', isShuffle);
    if (isShuffle) { isRepeat = false; repeatBtn.classList.remove('icon-active'); }
};
repeatBtn.onclick = () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('icon-active', isRepeat);
    if (isRepeat) { isShuffle = false; shuffleBtn.classList.remove('icon-active'); }
};

// Cập nhật thanh tiến trình theo thời gian thực
audio.addEventListener('timeupdate', (e) => {
    if (isDraggingProgress) return;
    const { duration, currentTime } = e.srcElement;

    // Kiểm tra NaN để tránh lỗi
    if (!isNaN(duration)) {
        const percent = (currentTime / duration) * 100;
        progressFill.style.width = `${percent}%`;
        timeCurrent.innerText = formatTime(currentTime);
        timeDuration.innerText = formatTime(duration);
    }
});

// Sự kiện Kéo thả (Mouse Events)
progressContainer.addEventListener('mousedown', (e) => { isDraggingProgress = true; handleProgressDrag(e); });
volumeContainer.addEventListener('mousedown', (e) => { isDraggingVolume = true; handleVolumeDrag(e); });

document.addEventListener('mousemove', (e) => {
    if (isDraggingProgress) handleProgressDrag(e);
    if (isDraggingVolume) handleVolumeDrag(e);
});

document.addEventListener('mouseup', () => {
    isDraggingProgress = false;
    isDraggingVolume = false;
});


// ================= 5. FOCUS MODE (ĐỒNG HỒ) =================
const IDLE_TIME = 5000;
let idleTimer;
const uiLayer = document.getElementById('mainInterface');
const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');

function updateClock() {
    const now = new Date();
    if (clockEl) clockEl.innerText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (dateEl) dateEl.innerText = now.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' });
}
setInterval(updateClock, 1000);

function goFocus() { uiLayer.classList.add('hide-ui'); }
function wakeUp() { uiLayer.classList.remove('hide-ui'); clearTimeout(idleTimer); idleTimer = setTimeout(goFocus, IDLE_TIME); }


// ================= 6. KHỞI CHẠY WEB =================
window.onload = () => {
    switchPlaylist('home'); // Mặc định vào Trang chủ
    updateClock();
    wakeUp();
    audio.volume = 0.5;
    volumeFill.style.width = '50%';
};

document.onmousemove = wakeUp;
document.onkeypress = wakeUp;
document.onclick = wakeUp;