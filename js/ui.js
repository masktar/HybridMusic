// --- js/ui.js ---

const sidebarContainer = document.getElementById('sidebar-container');
const playlistContainer = document.getElementById('playlist-container');
const playlistHeader = document.getElementById('playlist-header');
const playlistTitle = document.getElementById('current-playlist-title');

// Hàm xử lý tên bài hát để tránh lỗi dấu nháy đơn
function escapeName(name) { return name.replace(/'/g, "\\'"); }

// Hàm xử lý click vào nghệ sĩ liên quan (Fan cũng thích)
function clickRelatedArtist(name) {
    let searchName = name.toLowerCase().replace(/\.$/, "").trim();
    let targetKey = null;
    for (let key in allPlaylists) {
        if (allPlaylists[key].type === 'artist') {
            let dataTitle = allPlaylists[key].title.toLowerCase().replace(/\.$/, "").trim();
            if (dataTitle === searchName || dataTitle.includes(searchName) || searchName.includes(dataTitle)) {
                targetKey = key;
                break;
            }
        }
    }
    if (targetKey) switchPlaylist(targetKey);
}

// ================= 1. VẼ SIDEBAR =================
function renderSidebar() {
    sidebarContainer.innerHTML = '';

    // Nút Trang chủ
    const homeDiv = document.createElement('div');
    homeDiv.classList.add('playlist-item');
    if (currentKey === 'home') homeDiv.classList.add('active');
    homeDiv.innerHTML = `<span></span> Trang chủ`;
    homeDiv.onclick = () => switchPlaylist('home');
    sidebarContainer.appendChild(homeDiv);

    // Nút Bài hát yêu thích
    const favDiv = document.createElement('div');
    favDiv.classList.add('playlist-item');
    if (currentKey === 'favorites') favDiv.classList.add('active');
    favDiv.innerHTML = `<span style="color: #ff5500;"></span> Bài hát yêu thích`;
    favDiv.onclick = () => switchPlaylist('favorites');
    sidebarContainer.appendChild(favDiv);

    // Các Playlist khác
    for (let key in allPlaylists) {
        if (key === 'home') continue;
        const playlist = allPlaylists[key];
        const div = document.createElement('div');
        div.classList.add('playlist-item');
        if (key === currentKey) div.classList.add('active');
        div.innerHTML = `<span>${playlist.icon || ''}</span> ${playlist.title}`;
        div.onclick = () => switchPlaylist(key);
        sidebarContainer.appendChild(div);
    }
}

// ================= 2. VẼ TRANG CHỦ (SPOTIFY STYLE SCROLL) =================
function renderHomePage() {
    let homeHTML = `
        <div class="hero-banner">
            <div class="hero-title">Your Music<br>Your Vibes</div>
            <div class="hero-subtitle">Nghe nhạc không giới hạn.</div>
            <button class="hero-btn" onclick="playRandomAndExpand()" style="background-color: #ff5500; border: 2px solid white;">Phát Ngẫu Nhiên</button>
        </div>
        
        <div class="section-header"><span>Gợi ý cho bạn</span></div>
        
        <div class="scroll-wrapper">
            <button class="scroll-btn left" onclick="document.getElementById('recommend-list').scrollLeft -= 300;">
                <i class="fa-solid fa-chevron-left"></i>
            </button>
            
            <div class="horizontal-scroll-container" id="recommend-list"> 
    `;

    // Vòng lặp vẽ bài hát
    if (currentPlaylist && currentPlaylist.length > 0) {
        homeHTML += currentPlaylist.map((song, index) => {
            const isLiked = checkIsLiked(song.name);
            const heartClass = isLiked ? 'fa-solid fa-heart heart-btn liked' : 'fa-regular fa-heart heart-btn';
            
            return `
            <div class="music-card" onclick="playSpecificSong(${index}); openNowPlaying();" style="cursor: pointer;">
                <div class="card-img" style="position: relative; aspect-ratio: 1/1; background: transparent; box-shadow: none;">
                    <img src="${song.img || 'pic/disk.png'}" style="width:100%; height:100%; object-fit:cover; border-radius:16px;">
                    <div style="position:absolute; bottom:10px; right:10px; background:#ff5500; width:40px; height:40px; border-radius:50%; border: 2px solid black; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.5);">
                        <i class="fa-solid fa-play" style="color:black; font-size:16px; transform: translateX(1px)"></i>
                    </div>
                </div>
                
                <div class="title-container">
                    <div class="card-title" style="font-weight:600; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; margin: 0;">${song.name}</div>
                    <i class="${heartClass}" onclick="toggleHeart('${escapeName(song.name)}', event)"></i>
                </div>

                <div class="card-artist" style="font-size:14px; opacity:0.7;">${song.artist}</div>
            </div>`;
        }).join('');
    } else {
        homeHTML += `<div style="opacity:0.5;">Không tìm thấy bài hát nào...</div>`;
    }
    
    homeHTML += `</div>`; // Đóng div recommend-list
    
    // Nút Phải
    homeHTML += `
            <button class="scroll-btn right" onclick="document.getElementById('recommend-list').scrollLeft += 300;">
                <i class="fa-solid fa-chevron-right"></i>
            </button>
        </div> `;

    // PHẦN KHÁM PHÁ NGHỆ SĨ (Cũng làm tương tự nếu thích, ở đây mình giữ cuộn thường)
    homeHTML += `
        <div class="section-header"><span>Khám phá Nghệ sĩ & Playlist</span></div>
        <div class="horizontal-scroll-container" id="home-grid" style="padding-bottom:10px;"></div>
        <div style="height: 50px;"></div>
    `;
    
    playlistContainer.innerHTML = homeHTML;
    renderDiscoveryGrid();
}

// ================= 3. VẼ TRANG YÊU THÍCH =================
function renderFavoritesPage() {
    const favHTML = `
        <div class="artist-header" style="background: linear-gradient(to right, #ff5500, #2b1600);">
            <div class="artist-info-container">
                <div style="width: 180px; height: 180px;margin-bottom: 15px; background: white; display: flex; align-items: center; justify-content: center; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <i class="fa-solid fa-heart" style="font-size: 80px; color: #ff5500;"></i>
                </div>
                <div class="artist-details">
                    <p>Playlist</p>
                    <h1 style="font-size: 50px; font-weight: 800;">Bài Hát Yêu Thích</h1>
                    <p>${currentPlaylist.length} bài hát đã lưu</p>
                    <div class="artist-actions">
                         <button class="artist-play-btn" onclick="playSpecificSong(0)" style="background-color:white; color:#ff5500;"><i class="fa-solid fa-play"></i></button>
                    </div>
                </div>
            </div>
        </div>
        <div style="margin-top: 30px;" id="fav-list-container"></div>
        <div style="height: 100px;"></div>
    `;
    playlistContainer.innerHTML = favHTML;
    const container = document.getElementById('fav-list-container');
    if (currentPlaylist.length === 0) {
        container.innerHTML = `<div style="padding: 20px; opacity: 0.6; color:white;">Bạn chưa thích bài hát nào. Hãy thả tim ❤️ để thêm vào đây nhé!</div>`;
        return;
    }
    renderListItems(container);
}

// ================= 4. CÁC HÀM PHỤ TRỢ =================
function renderArtistPage(data) {
    let headerStyle = data.banner ? `background-image: url('${data.banner}'); background-position: ${data.bannerPos || 'center'}; background-size: cover;` : `background: ${data.bgColor || '#333'};`;
    const artistHTML = `
        <div class="artist-header" style="${headerStyle}">
            <div class="artist-info-container">
                <img src="${data.avatar}" class="artist-avatar" style="border-radius: 50%;">
                <div class="artist-details">
                    <p><i class="fa-solid fa-certificate verified-icon"></i> Nghệ sĩ được xác minh</p>
                    <h1>${data.title}</h1>
                    <p>${data.listeners || 'Nhiều người nghe'}</p>
                    <div class="artist-actions">
                        <button class="artist-play-btn" onclick="playSpecificSong(0)" style="background-color:#ff5500; color:black;"><i class="fa-solid fa-play"></i></button>
                        <button class="follow-btn">Follow</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="section-heading">Phổ biến</div>
        <div class="popular-list" id="artist-song-list"></div>
        ${renderSectionGrid("Albums", data.albums)}
        ${renderSectionGrid("Singles & EPs", data.singles)}
        <div class="section-heading">Fan cũng thích</div>
        <div class="card-grid" id="related-artist-grid">
            ${data.related ? data.related.map(item => `
                <div class="music-card" onclick="clickRelatedArtist('${item.name}')" style="cursor: pointer;">
                    <div class="card-img" style="background:transparent; box-shadow:none;">
                        <img src="${item.img}" style="width:100%; height:100%; object-fit:cover; border-radius: 50%;">
                    </div>
                    <div class="card-title" style="text-align:center; margin-top:10px;">${item.name}</div>
                    <div class="card-artist" style="text-align:center;">Nghệ sĩ</div>
                </div>
            `).join('') : ''}
        </div>
        <div style="height:50px;"></div> 
    `;
    playlistContainer.innerHTML = artistHTML;

    const listContainer = document.getElementById('artist-song-list');
    data.songs.forEach((song, index) => {
        const div = document.createElement('div');
        div.classList.add('song-box');
        if (index === songIndex && songNameEl.innerText === song.name) div.classList.add('active');
        const isLiked = checkIsLiked(song.name);
        const heartClass = isLiked ? 'fa-solid fa-heart heart-btn liked' : 'fa-regular fa-heart heart-btn';
        div.innerHTML = `
            <div style="display:flex; align-items:center;">
                <div style="display:flex; flex-direction:column;">
                    <span style="font-weight:500;">${song.name}</span>
                    <span style="font-size:12px; opacity:0.7;">${song.artist}</span>
                </div>
            </div>
            <i class="${heartClass}" style="font-size:14px;" onclick="toggleHeart('${escapeName(song.name)}', event)"></i>
        `;
        div.onclick = () => playSpecificSong(index);
        listContainer.appendChild(div);
    });
}

function renderSongDetailPage(song, artistData) {
    let coverImg = song.img || (artistData ? artistData.avatar : '') || "pic/disk.png";
    let bgStyle = artistData && artistData.bgColor ? `background: ${artistData.bgColor};` : `background: linear-gradient(to bottom, #2c3e50, #000000);`;
    const isLiked = checkIsLiked(song.name);
    const heartClass = isLiked ? 'fa-solid fa-heart heart-btn liked' : 'fa-regular fa-heart heart-btn';

    // 1. QUYẾT ĐỊNH: HIỆN ĐĨA THAN HAY HIỆN YOUTUBE?
    let visualContent = '';
    
    if (song.youtubeId) {
        // Nếu có Youtube ID -> Hiện khung Video (Iframe)
        visualContent = `
            <div class="disk-container" style="width: 100%; max-width: 600px; aspect-ratio: 16/9; margin-bottom: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.6); border-radius: 12px; overflow: hidden;">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/${song.youtubeId}?autoplay=1&controls=1" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
        `;
    } else {
        // Nếu là nhạc thường -> Hiện đĩa than xoay
        visualContent = `
            <div class="disk-container" style="width: 300px; height: 300px; margin-bottom: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
                <img src="${coverImg}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
            </div>
        `;
    }

    // 2. HTML CHÍNH
    const detailHTML = `
        <div class="song-detail-page" style="${bgStyle} width:100%; min-height:100%; padding: 40px; box-sizing: border-box; display:flex; flex-direction:column; align-items:center; animation: fadeIn 0.3s; border-radius: 20px;">
            <div style="width:100%; display:flex; justify-content:space-between; margin-bottom: 20px;">
                <button onclick="restorePreviousView()" style="background:none; border:none; color:white; font-size:24px; cursor:pointer;"><i class="fa-solid fa-chevron-down"></i></button>
                <div style="text-transform:uppercase; font-size:12px; letter-spacing:1px; margin-top:10px; color:#fff; opacity:0.8;">ĐANG PHÁT</div>
                <div style="width:20px;"></div>
            </div>

            ${visualContent}

            <div style="text-align:center; margin-bottom:30px;">
                <div style="display:flex; align-items:center; justify-content:center; gap:15px;">
                    <h1 style="font-size:28px; margin:0; color:#fff;">${song.name}</h1>
                    <i class="${heartClass}" style="font-size:24px;" onclick="toggleHeart('${escapeName(song.name)}', event)"></i>
                </div>
                <h3 style="font-size:18px; color:#ccc; font-weight:400; margin-top:10px;">${song.artist}</h3>
            </div>
            
            ${song.youtubeId ? '' : `
            <div class="lyrics-container" style="width:100%; max-width:600px; background:rgba(0,0,0,0.2); padding:20px; border-radius:12px; height:250px; overflow-y:auto;">
                <h4 style="margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:5px; font-weight:bold; color:#fff;">Lời bài hát</h4>
                <p style="line-height:1.8; color:#ddd; font-size:16px;">(Lời bài hát đang cập nhật...)<br>🎵 Nhạc hay thì cứ nghe thôi...</p>
            </div>`}
        </div>
    `;
    playlistContainer.innerHTML = detailHTML;
}

function renderDiscoveryGrid() {
    const gridEl = document.getElementById('home-grid');
    for (let key in allPlaylists) {
        if (key === 'home') continue;
        const data = allPlaylists[key];
        const card = document.createElement('div');
        card.classList.add('music-card');
        const isArtist = data.type === 'artist';
        const imgRadius = isArtist ? '50%' : '4px';
        const bgStyle = isArtist ? 'background: transparent; box-shadow: none;' : 'background: #333;';
        let imgHtml = data.avatar ? `<img src="${data.avatar}" style="width:100%; height:100%; object-fit:cover; border-radius:${imgRadius};">` : `<div style="font-size:40px; display:flex; align-items:center; justify-content:center; height:100%;">${data.icon}</div>`;
        card.innerHTML = `<div class="card-img" style="${bgStyle}">${imgHtml}</div><div class="card-title" style="${isArtist ? 'text-align:center; margin-top:10px;' : ''}">${data.title}</div><div class="card-artist" style="${isArtist ? 'text-align:center;' : ''}">${isArtist ? 'Nghệ sĩ' : 'Playlist'}</div>`;
        card.onclick = () => switchPlaylist(key);
        gridEl.appendChild(card);
    }
}
function renderSectionGrid(title, items) { if (!items || items.length === 0) return ""; return `<div class="section-heading">${title}</div><div class="card-grid">${items.map(item => `<div class="music-card"><div class="card-img" style="background:#333;"><img src="${item.img}" style="width:100%;height:100%;object-fit:cover;border-radius:4px;"></div><div class="card-title">${item.title}</div><div class="card-artist">${item.year} • Album</div></div>`).join('')}</div>`; }
function renderVerticalList() { playlistContainer.innerHTML = ''; renderListItems(playlistContainer); }
function renderListItems(container) {
    currentPlaylist.forEach((song, index) => {
        const div = document.createElement('div');
        div.classList.add('song-box');
        if (index === songIndex && songNameEl.innerText === song.name && currentKey !== 'home' && currentKey !== 'favorites') div.classList.add('active');
        const isLiked = checkIsLiked(song.name);
        const heartClass = isLiked ? 'fa-solid fa-heart heart-btn liked' : 'fa-regular fa-heart heart-btn';
        div.innerHTML = `<div style="display:flex; flex-direction:column;"><span style="font-weight:500;">${song.name}</span><span style="font-size:12px; opacity:0.7;">${song.artist}</span></div> <i class="${heartClass}" style="margin-right:15px;" onclick="toggleHeart('${escapeName(song.name)}', event)"></i>`;
        div.onclick = () => playSpecificSong(index);
        container.appendChild(div);
    });
}