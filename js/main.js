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

// DOM Elements
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
const playerImgEl = document.querySelector('.player-img'); // Ảnh nhỏ dưới player

const progressContainer = document.querySelector('.progress-bar');
const progressFill = document.querySelector('.progress-fill');
const timeCurrent = document.querySelector('.time-text:first-child');
const timeDuration = document.querySelector('.time-text:last-child');

const volumeContainer = document.querySelector('.volume-bar');
const volumeFill = document.querySelector('.volume-fill');
const volumeIcon = document.querySelector('.fa-volume-high');

// ================= 2. CONTROLLER (LOGIC CHÍNH) =================

function switchPlaylist(key) {
    currentKey = key;
    const data = allPlaylists[key];
    currentPlaylist = data.songs;

    // Header hiển thị
    if (data.type === 'home' || data.type === 'artist') {
        playlistHeader.style.display = 'none';
    } else {
        playlistHeader.style.display = 'flex';
        playlistTitle.innerText = data.title;
    }

    // Vẽ UI tương ứng
    if (data.type === 'home') renderHomePage();
    else if (data.type === 'artist') renderArtistPage(data);
    else renderVerticalList();

    renderSidebar();
}

// Hàm này CHỈ PHÁT NHẠC, không chuyển trang (Dùng khi click trong list)
function playSpecificSong(index) {
    songIndex = index;
    loadSong(currentPlaylist[songIndex]);
    playSong();

    // Chỉ vẽ lại list hiện tại để cập nhật highlight (màu cam)
    if (allPlaylists[currentKey].type === 'artist') {
        renderArtistPage(allPlaylists[currentKey]);
    } else if (allPlaylists[currentKey].type !== 'home') {
        renderVerticalList();
    }
}

// Hàm này vừa phát nhạc vừa MỞ GIAO DIỆN CHI TIẾT (Dùng cho nút "Phát ngẫu nhiên" ở Home)
function playRandomAndExpand() {
    // Nếu chưa có nhạc thì lấy nhạc Lofi làm mặc định
    if (currentPlaylist.length === 0 && allPlaylists['lofi']) {
        currentPlaylist = allPlaylists['lofi'].songs;
        currentKey = 'lofi';
    }
    
    // Random bài
    songIndex = Math.floor(Math.random() * currentPlaylist.length);
    loadSong(currentPlaylist[songIndex]);
    playSong();

    // Mở ngay giao diện chi tiết
    openNowPlaying();
}

// Hàm mở giao diện chi tiết (Được gọi khi click vào thanh Player)
function openNowPlaying() {
    const currentSong = currentPlaylist[songIndex];
    if (!currentSong) return;

    // Tìm thông tin Artist để lấy màu nền
    let artistData = null;
    
    // Cách 1: Lấy từ playlist hiện tại nếu là trang artist
    if (allPlaylists[currentKey] && allPlaylists[currentKey].type === 'artist') {
        artistData = allPlaylists[currentKey];
    } 
    // Cách 2: Tìm quét trong data (cho trường hợp đang ở Home/Lofi)
    else {
        for (let key in allPlaylists) {
            if (allPlaylists[key].title === currentSong.artist) {
                artistData = allPlaylists[key];
                break;
            }
        }
    }

    renderSongDetailPage(currentSong, artistData);
}

// Hàm quay lại giao diện cũ (khi bấm nút Thu gọn)
function restorePreviousView() {
    switchPlaylist(currentKey);
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
    if (!audio.src || audio.src === "") {
        // Nếu chưa chọn bài nào, thử phát bài đầu tiên của Sơn Tùng
        if(allPlaylists['sontung']) {
            currentKey = 'sontung';
            currentPlaylist = allPlaylists['sontung'].songs;
            playSpecificSong(0);
        }
    } else {
        isPlaying ? pauseSong() : playSong();
    }
}

function playRandom() {
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
    
    // Nếu đang ở giao diện chi tiết thì cập nhật lại giao diện chi tiết
    // Nếu đang ở list thì cập nhật list
    loadSong(currentPlaylist[songIndex]);
    playSong();
    updateInterfaceAfterChange();
}

function prevSong() {
    songIndex--;
    if (songIndex < 0) songIndex = currentPlaylist.length - 1;
    
    loadSong(currentPlaylist[songIndex]);
    playSong();
    updateInterfaceAfterChange();
}

// Hàm helper để biết nên vẽ lại giao diện nào khi Next/Prev
function updateInterfaceAfterChange() {
    // Kiểm tra xem có đang ở màn hình chi tiết không (bằng cách check class)
    const isDetailPage = document.querySelector('.song-detail-page');
    
    if (isDetailPage) {
        openNowPlaying(); // Vẽ lại chi tiết bài mới
    } else {
        // Vẽ lại list để highlight
        if (allPlaylists[currentKey].type === 'artist') renderArtistPage(allPlaylists[currentKey]);
        else if (allPlaylists[currentKey].type !== 'home') renderVerticalList();
    }
}

function onSongEnded() {
    isRepeat ? playSpecificSong(songIndex) : nextSong();
}

// ================= 3. HELPER FUNCTIONS =================
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
    volumeIcon.className = percent === 0 ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
}

// ================= 4. GẮN SỰ KIỆN (EVENTS) =================

playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
audio.addEventListener('ended', onSongEnded);

// --- QUAN TRỌNG: SỰ KIỆN CLICK VÀO PLAYER ĐỂ BUNG RA CHI TIẾT ---
if (playerImgEl) {
    playerImgEl.style.cursor = 'pointer'; // Thêm icon bàn tay
    playerImgEl.onclick = openNowPlaying;
}
if (songNameEl) {
    songNameEl.style.cursor = 'pointer';
    songNameEl.onclick = openNowPlaying;
}
// -----------------------------------------------------------------

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

// ================= 5. FOCUS MODE & START =================
const IDLE_TIME = 10000;
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

window.onload = () => {
    switchPlaylist('home'); 
    updateClock();
    wakeUp();
    audio.volume = 0.5;
    volumeFill.style.width = '50%';
};

document.onmousemove = wakeUp;
document.onkeypress = wakeUp;
document.onclick = wakeUp;