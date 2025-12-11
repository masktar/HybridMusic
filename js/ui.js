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

    // Các mục khác
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

// ================= 2. VẼ TRANG CHỦ (HOME) - ĐÃ SỬA =================
function renderHomePage() {
    const homeHTML = `
        <div class="hero-banner">
            <div class="hero-title">Your Music<br>Your Vibes</div>
            <div class="hero-subtitle">Nghe nhạc không giới hạn.</div>
            <button class="hero-btn" onclick="playRandom()">Phát Ngẫu Nhiên</button>
        </div>
        
        <div class="section-header"><span>Khám phá</span></div>
        <div class="card-grid" id="home-grid"></div>
        <div style="height: 50px;"></div>
    `;
    playlistContainer.innerHTML = homeHTML;

    const gridEl = document.getElementById('home-grid');

    for (let key in allPlaylists) {
        if (key === 'home') continue;

        const data = allPlaylists[key];
        const card = document.createElement('div');
        card.classList.add('music-card');

        // --- LOGIC XỬ LÝ ẢNH TRÒN/VUÔNG ---
        const isArtist = data.type === 'artist'; // Kiểm tra xem có phải ca sĩ không
        
        // 1. Nếu là Artist thì bo tròn 50%, Playlist thì bo nhẹ 4px
        const imgRadius = isArtist ? '50%' : '4px';
        
        // 2. Quan trọng: Nếu là Artist thì phải ẨN BACKGROUND của khung đi để không bị lòi màu xám ra
        const bgStyle = isArtist ? 'background: transparent; box-shadow: none;' : 'background: #333;';

        let imgHtml = '';
        if (data.avatar) {
            // Có ảnh (Sơn Tùng, Vũ...)
            imgHtml = `<img src="${data.avatar}" style="width:100%; height:100%; object-fit:cover; border-radius:${imgRadius};">`;
        } else {
            // Không ảnh (Playlist Lofi...)
            imgHtml = `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:40px;">${data.icon}</div>`;
        }

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

// ================= 3. VẼ TRANG NGHỆ SĨ - ĐÃ SỬA =================
function renderArtistPage(data) {
    
    // --- BƯỚC 1: Header ---
    let headerStyle = "";
    if (data.banner) {
        let pos = data.bannerPos || "center center";
        let size = data.bannerSize || "cover";
        headerStyle = `background-image: url('${data.banner}'); background-position: ${pos}; background-size: ${size};`;
    } else {
        let color = data.bgColor || "linear-gradient(to right, #434343, #000000)"; 
        headerStyle = `background: ${color};`;
    }

    // --- BƯỚC 2: Tạo HTML ---
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

    // --- BƯỚC 3: Vẽ bài hát ---
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
        div.onclick = () => playSpecificSong(index);
        listContainer.appendChild(div);
    });
}

// ================= 4. CÁC HÀM PHỤ TRỢ =================
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

// ================= 5. DANH SÁCH DỌC =================
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