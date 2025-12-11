// --- js/ui.js ---

// Lấy các phần tử DOM cần thiết
const sidebarContainer = document.getElementById('sidebar-container');
const playlistContainer = document.getElementById('playlist-container');
const playlistHeader = document.getElementById('playlist-header');
const playlistTitle = document.getElementById('current-playlist-title');

// ================= 1. VẼ SIDEBAR =================
function renderSidebar() {
    sidebarContainer.innerHTML = '';

    // Nút Trang chủ
    const homeDiv = document.createElement('div');
    homeDiv.classList.add('playlist-item');
    if (currentKey === 'home') homeDiv.classList.add('active');
    homeDiv.innerHTML = `<span>🏠</span> Trang chủ`;
    homeDiv.onclick = () => switchPlaylist('home');
    sidebarContainer.appendChild(homeDiv);

    // Các mục Playlist/Artist
    for (let key in allPlaylists) {
        if (key === 'home') continue;
        const playlist = allPlaylists[key];
        const div = document.createElement('div');
        div.classList.add('playlist-item');
        if (key === currentKey) div.classList.add('active');
        div.innerHTML = `<span>${playlist.icon}</span> ${playlist.title}`;
        div.onclick = () => switchPlaylist(key);
        sidebarContainer.appendChild(div);
    }
}

// ================= 2. VẼ TRANG CHỦ (HOME) =================
function renderHomePage() {
    let homeHTML = `
        <div class="hero-banner">
            <div class="hero-title">Your Music<br>Your Vibes</div>
            <div class="hero-subtitle">Nghe nhạc không giới hạn.</div>
            <button class="hero-btn" onclick="playRandomAndExpand()">Phát Ngẫu Nhiên</button>
        </div>
        
        <div class="section-header"><span>Gợi ý cho bạn</span></div>
        <div class="song-grid-horizontal" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; margin-bottom: 40px;">
    `;

    // 2. Vòng lặp vẽ các bài hát trong playlist Home
    if (currentPlaylist && currentPlaylist.length > 0) {
        homeHTML += currentPlaylist.map((song, index) => `
            <div class="music-card" onclick="playSpecificSong(${index}); openNowPlaying();" style="cursor: pointer;">
                <div class="card-img" style="position: relative; aspect-ratio: 1/1;">
                    <img src="${song.img || 'pic/disk.png'}" style="width:100%; height:100%; object-fit:cover; border-radius:16px;">
                    
                    <div style="position:absolute; bottom:10px; right:10px; background:#cc5600; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.5);">
                        <i class="fa-solid fa-play" style="color:black; font-size:16px;"></i>
                    </div>
                </div>
                
                <div class="card-title" style="margin-top:10px; font-weight:600; color: #ffffff;">${song.name}</div>
                
                <div class="card-artist" style="font-size:14px; opacity:0.7;">${song.artist}</div>
            </div>
        `).join('');
    } else {
        homeHTML += `<div style="opacity:0.5;">Chưa có bài hát nào trong Home. Hãy thêm vào data.js</div>`;
    }

    homeHTML += `</div>`; 

    // 3. Phần Khám phá Nghệ sĩ (Giữ nguyên)
    homeHTML += `
        <div class="section-header"><span>Khám phá Nghệ sĩ & Playlist</span></div>
        <div class="card-grid" id="home-grid"></div>
        <div style="height: 50px;"></div>
    `;

    playlistContainer.innerHTML = homeHTML;

    // 4. Vẽ các thẻ Nghệ sĩ/Playlist bên dưới
    const gridEl = document.getElementById('home-grid');
    for (let key in allPlaylists) {
        if (key === 'home') continue;

        const data = allPlaylists[key];
        const card = document.createElement('div');
        card.classList.add('music-card');

        const isArtist = data.type === 'artist';
        const imgRadius = isArtist ? '50%' : '4px';
        const bgStyle = isArtist ? 'background: transparent; box-shadow: none;' : 'background: #333;';

        let imgHtml = data.avatar
            ? `<img src="${data.avatar}" style="width:100%; height:100%; object-fit:cover; border-radius:${imgRadius};">`
            : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:40px;">${data.icon}</div>`;

        card.innerHTML = `
            <div class="card-img" style="${bgStyle}">
                ${imgHtml}
            </div>
            <div class="card-title" style="${isArtist ? 'text-align:center; margin-top:10px;' : ''}">${data.title}</div>
            <div class="card-artist" style="${isArtist ? 'text-align:center;' : ''}">${isArtist ? 'Nghệ sĩ' : 'Playlist'}</div>
        `;

        card.onclick = () => switchPlaylist(key);
        gridEl.appendChild(card);
    }
}

// ================= 3. VẼ TRANG NGHỆ SĨ (ARTIST) =================
function renderArtistPage(data) {
    // A. Header
    let headerStyle = "";
    if (data.banner) {
        let pos = data.bannerPos || "center center";
        let size = data.bannerSize || "cover";
        headerStyle = `background-image: url('${data.banner}'); background-position: ${pos}; background-size: ${size};`;
    } else {
        let color = data.bgColor || "linear-gradient(to right, #434343, #000000)";
        headerStyle = `background: ${color};`;
    }

    const artistHTML = `
        <div class="artist-header" style="${headerStyle}">
            <div class="artist-info-container">
                <img src="${data.avatar}" class="artist-avatar" style="border-radius: 50%;">
                <div class="artist-details">
                    <p><i class="fa-solid fa-certificate verified-icon"></i> Nghệ sĩ được xác minh</p>
                    <h1>${data.title}</h1>
                    <p>${data.listeners || 'Nhiều người nghe'}</p>
                    <div class="artist-actions">
                        <button class="artist-play-btn" onclick="playSpecificSong(0)"><i class="fa-solid fa-play"></i></button>
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
                <div class="music-card">
                    <div class="card-img" style="background: transparent; box-shadow: none;">
                        <img src="${item.img}" style="width:100%; height:100%; object-fit:cover; border-radius: 50%;">
                    </div>
                    <div class="card-title" style="text-align: center; margin-top: 10px;">${item.name}</div>
                    <div class="card-artist" style="text-align: center;">Nghệ sĩ</div>
                </div>
            `).join('') : '<span style="opacity:0.5; padding-left:15px;">Chưa có đề xuất</span>'}
        </div>
        <div style="height: 50px;"></div> 
    `;

    playlistContainer.innerHTML = artistHTML;

    // B. Danh sách bài hát (Bấm vào đây CHỈ PHÁT NHẠC, không đổi trang)
    const listContainer = document.getElementById('artist-song-list');
    const topSongs = data.songs;

    topSongs.forEach((song, index) => {
        const div = document.createElement('div');
        div.classList.add('song-box');

        if (typeof songIndex !== 'undefined' && index === songIndex && songNameEl.innerText === song.name) {
            div.classList.add('active');
        }

        div.innerHTML = `
            <div style="display:flex; align-items:center;">
                <div style="display:flex; flex-direction:column;">
                    <span style="font-weight:500;">${song.name}</span>
                    <span style="font-size:12px; opacity:0.7;">${song.artist}</span>
                </div>
            </div>
            <span style="font-size:12px; opacity:0.6;">3:45</span>
        `;
        // Quan trọng: Chỉ gọi playSpecificSong (chỉ phát nhạc)
        div.onclick = () => playSpecificSong(index);
        listContainer.appendChild(div);
    });
}

// ================= 4. VẼ GIAO DIỆN CHI TIẾT BÀI HÁT (NOW PLAYING) =================
function renderSongDetailPage(song, artistData) {
    // Logic lấy ảnh: Cover bài hát -> Avatar ca sĩ -> Đĩa mặc định
    let coverImg = song.img || (artistData ? artistData.avatar : '') || "pic/disk.png";

    // Logic lấy màu nền
    let bgStyle = artistData && artistData.bgColor
        ? `background: ${artistData.bgColor};`
        : `background: linear-gradient(to bottom, #2c3e50, #000000);`;

    const detailHTML = `
        <div class="song-detail-page" style="${bgStyle} width:100%; min-height:100%; padding: 40px; box-sizing: border-box; display:flex; flex-direction:column; align-items:center; animation: fadeIn 0.3s; border-radius: 20px;">
            
            <div style="width:100%; display:flex; justify-content:space-between; margin-bottom: 20px;">
                <button onclick="restorePreviousView()" style="background:none; border:none; color:white; font-size:24px; cursor:pointer;">
                    <i class="fa-solid fa-chevron-down"></i>
                </button>
                
                <div style="text-transform:uppercase; font-size:12px; letter-spacing:1px; margin-top:10px; color: #ffffff; opacity: 0.8;">ĐANG PHÁT</div>
                
                <div style="width:20px;"></div>
            </div>

            <div class="disk-container" style="width: 300px; height: 300px; margin-bottom: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
                <img src="${coverImg}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
            </div>

            <div style="text-align:center; margin-bottom:30px;">
                <h1 style="font-size:28px; margin-bottom:10px; color: #ffffff;">${song.name}</h1>
                <h3 style="font-size:18px; color:#ccc; font-weight:400;">${song.artist}</h3>
            </div>

            <div class="lyrics-container" style="width:100%; max-width:600px; background:rgba(0,0,0,0.2); padding:20px; border-radius:12px; height:250px; overflow-y:auto;">
                <h4 style="margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:5px; font-weight:bold; color: #ffffff;">Lời bài hát</h4>
                <p style="line-height:1.8; color:#ddd; font-size:16px;">
                    (Lời bài hát đang được cập nhật...)<br>
                    🎵 Lắng nghe giai điệu này...<br>
                    🎵 Cảm nhận cảm xúc...<br>
                    ...
                </p>
            </div>
        </div>
    `;
    playlistContainer.innerHTML = detailHTML;
}

// ================= 5. CÁC HÀM HỖ TRỢ KHÁC =================
function renderSectionGrid(title, items) {
    if (!items || items.length === 0) return "";
    return `
        <div class="section-heading">${title}</div>
        <div class="card-grid">
            ${items.map(item => `
                <div class="music-card">
                    <div class="card-img" style="background: #333;">
                        <img src="${item.img}" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">
                    </div>
                    <div class="card-title">${item.title}</div>
                    <div class="card-artist">${item.year} • Album</div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderVerticalList() {
    playlistContainer.innerHTML = '';
    renderListItems(playlistContainer);
}

function renderListItems(container) {
    currentPlaylist.forEach((song, index) => {
        const div = document.createElement('div');
        div.classList.add('song-box');
        if (index === songIndex && songNameEl.innerText === song.name && currentKey !== 'home') {
            div.classList.add('active');
        }
        div.innerHTML = `
            <div style="display:flex; flex-direction:column;">
                <span style="font-weight:500;">${song.name}</span>
                <span style="font-size:12px; opacity:0.7;">${song.artist}</span>
            </div>
            <button class="btn-play-small"><i class="fa-solid fa-play"></i></button>
        `;
        div.onclick = () => playSpecificSong(index);
        container.appendChild(div);
    });
}