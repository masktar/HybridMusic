// --- js/ui.js ---

const sidebarContainer = document.getElementById('sidebar-container');
const playlistContainer = document.getElementById('playlist-container');
const playlistHeader = document.getElementById('playlist-header');
const playlistTitle = document.getElementById('current-playlist-title');

function escapeName(name) {
    return name.replace(/'/g, "\\'");
}

function clickRelatedArtist(name) {
    let s = name.toLowerCase().replace(/\.$/, "").trim();
    let t = null;
    for (let k in allPlaylists) {
        if (allPlaylists[k].type === 'artist') {
            let d = allPlaylists[k].title.toLowerCase().replace(/\.$/, "").trim();
            if (d === s || d.includes(s) || s.includes(d)) {
                t = k;
                break;
            }
        }
    }
    if (t) {
        switchPlaylist(t);
    }
}

function isSongPlaying(songName) {
    if (playbackPlaylist.length === 0) return false;
    return playbackPlaylist[playbackIndex].name === songName;
}

// 1. SIDEBAR
function renderSidebar() {
    sidebarContainer.innerHTML = '';
    
    // Nút Trang chủ
    const h = document.createElement('div');
    h.className = `playlist-item ${viewKey==='home'?'active':''}`;
    h.innerHTML = `<span></span> Trang chủ`;
    h.onclick = () => switchPlaylist('home');
    sidebarContainer.appendChild(h);

    // Nút Bài hát yêu thích
    const f = document.createElement('div');
    f.className = `playlist-item ${viewKey==='favorites'?'active':''}`;
    f.innerHTML = `<span style="color:#ff5500;"></span> Bài hát yêu thích`;
    f.onclick = () => switchPlaylist('favorites');
    sidebarContainer.appendChild(f);

    // Các playlist khác
    for (let k in allPlaylists) {
        if (k === 'home') continue;
        const p = allPlaylists[k];
        const d = document.createElement('div');
        d.className = `playlist-item ${k===viewKey?'active':''}`;
        d.innerHTML = `<span>${p.icon||''}</span> ${p.title}`;
        d.onclick = () => switchPlaylist(k);
        sidebarContainer.appendChild(d);
    }
}

// 2. HOME PAGE
function renderHomePage() {
    let h = `
        <div class="hero-banner">
            <div class="hero-title">Your Music<br>Your Vibes</div>
            <div class="hero-subtitle">Nghe nhạc không giới hạn.</div>
            <button class="hero-btn" onclick="playRandomAndExpand()" style="background-color:#ff5500; border:2px solid white;">Phát Ngẫu Nhiên</button>
        </div>
        <div class="section-header"><span>Gợi ý cho bạn</span></div>
        <div class="scroll-wrapper">
            <button class="scroll-btn left" onclick="document.getElementById('rec-list').scrollLeft-=300;"><i class="fa-solid fa-chevron-left"></i></button>
            <div class="horizontal-scroll-container" id="rec-list">
    `;

    if (currentPlaylist && currentPlaylist.length > 0) {
        h += currentPlaylist.map((s, i) => {
            const l = checkIsLiked(s.name);
            const hc = l ? 'fa-solid fa-heart heart-btn liked' : 'fa-regular fa-heart heart-btn';
            const activeStyle = isSongPlaying(s.name) ? 'color:#ff5500;' : 'color:white;';

            return `
            <div class="music-card" onclick="playSpecificSong(${i}); openNowPlaying();" style="cursor:pointer;">
                <div class="card-img" style="position:relative; aspect-ratio:1/1; background:transparent; box-shadow:none;">
                    <img src="${s.img||'pic/disk.png'}" style="width:100%; height:100%; object-fit:cover; border-radius:16px;">
                    <div style="position:absolute; bottom:10px; right:10px; background:#ff5500; width:40px; height:40px; border-radius:50%; border:2px solid black; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.5);">
                        <i class="fa-solid fa-play" style="color:black; font-size:16px; transform:translateX(1px)"></i>
                    </div>
                </div>
                <div class="title-container">
                    <div class="card-title" style="font-weight:600; ${activeStyle} white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:140px; margin:0;">${s.name}</div>
                    <i class="${hc}" onclick="toggleHeart('${escapeName(s.name)}', event)"></i>
                </div>
                <div class="card-artist" style="font-size:14px; opacity:0.7;">${s.artist}</div>
            </div>`;
        }).join('');
    } else {
        h += `<div style="opacity:0.5;">Không tìm thấy bài hát...</div>`;
    }

    h += `</div><button class="scroll-btn right" onclick="document.getElementById('rec-list').scrollLeft+=300;"><i class="fa-solid fa-chevron-right"></i></button></div>`;
    h += `<div class="section-header"><span>Khám phá Nghệ sĩ & Playlist</span></div><div class="horizontal-scroll-container" id="home-grid" style="padding-bottom:10px;"></div><div style="height:50px;"></div>`;
    
    playlistContainer.innerHTML = h;
    renderDiscoveryGrid();
}

// 3. ARTIST PAGE
function renderArtistPage(d) {
    let bs = d.banner ? `background-image:url('${d.banner}'); background-position:${d.bannerPos||'center'}; background-size:cover;` : `background:${d.bgColor||'#333'};`;
    let h = `
    <div class="artist-header" style="${bs}">
        <div class="artist-info-container">
            <img src="${d.avatar}" class="artist-avatar" style="border-radius:50%;">
            <div class="artist-details">
                <p><i class="fa-solid fa-certificate verified-icon"></i> Nghệ sĩ được xác minh</p>
                <h1>${d.title}</h1>
                <p>${d.listeners||'Nhiều người nghe'}</p>
                <div class="artist-actions">
                    <button class="artist-play-btn" onclick="playSpecificSong(0)" style="background-color:#ff5500; color:black;"><i class="fa-solid fa-play"></i></button>
                    <button class="follow-btn">Follow</button>
                </div>
            </div>
        </div>
    </div>
    <div class="section-heading">Phổ biến</div>
    <div class="popular-list" id="artist-song-list"></div>
    ${renderSectionGrid("Albums",d.albums)}
    ${renderSectionGrid("Singles & EPs",d.singles)}
    <div class="section-heading">Fan cũng thích</div>
    <div class="card-grid" id="related-artist-grid">
        ${d.related ? d.related.map(i => `
            <div class="music-card" onclick="clickRelatedArtist('${i.name}')" style="cursor:pointer;">
                <div class="card-img" style="background:transparent; box-shadow:none;">
                    <img src="${i.img}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">
                </div>
                <div class="card-title" style="text-align:center;margin-top:10px;">${i.name}</div>
                <div class="card-artist" style="text-align:center;">Nghệ sĩ</div>
            </div>`).join('') : ''}
    </div>
    <div style="height:50px;"></div>`;
    
    playlistContainer.innerHTML = h;
    
    const l = document.getElementById('artist-song-list');
    d.songs.forEach((s, i) => {
        const div = document.createElement('div');
        div.className = 'song-box';
        if (isSongPlaying(s.name)) div.classList.add('active');
        
        const lk = checkIsLiked(s.name);
        const hc = lk ? 'fa-solid fa-heart heart-btn liked' : 'fa-regular fa-heart heart-btn';
        
        div.innerHTML = `
        <div style="display:flex; align-items:center;">
            <div style="display:flex; flex-direction:column;">
                <span style="font-weight:500;">${s.name}</span>
                <span style="font-size:12px; opacity:0.7;">${s.artist}</span>
            </div>
        </div>
        <i class="${hc}" style="font-size:14px;" onclick="toggleHeart('${escapeName(s.name)}', event)"></i>`;
        div.onclick = () => playSpecificSong(i);
        l.appendChild(div);
    });
}

// 4. FAVORITES PAGE
function renderFavoritesPage() {
    const h = `
    <div class="artist-header" style="background:linear-gradient(to right, #ff5500, #2b1600);">
        <div class="artist-info-container">
            <div style="width:180px; height:180px;margin-bottom:15px; background:white; display:flex; align-items:center; justify-content:center; border-radius:8px; box-shadow:0 10px 30px rgba(0,0,0,0.3);">
                <i class="fa-solid fa-heart" style="font-size:80px; color:#ff5500;"></i>
            </div>
            <div class="artist-details">
                <p>Playlist</p>
                <h1 style="font-size:50px; font-weight:800;">Bài Hát Yêu Thích</h1>
                <p>${currentPlaylist.length} bài hát</p>
                <div class="artist-actions">
                    <button class="artist-play-btn" onclick="playSpecificSong(0)" style="background-color:white; color:#ff5500;"><i class="fa-solid fa-play"></i></button>
                </div>
            </div>
        </div>
    </div>
    <div style="margin-top:30px;" id="fav-list-container"></div>
    <div style="height:100px;"></div>`;
    
    playlistContainer.innerHTML = h;
    const c = document.getElementById('fav-list-container');
    
    if (currentPlaylist.length === 0) {
        c.innerHTML = `<div style="padding:20px;opacity:0.6;color:white;">Chưa có bài hát yêu thích.</div>`;
        return;
    }
    renderListItems(c);
}

// 5. HELPER RENDERERS
function renderSongDetailPage(s, ad) {
    let ci = s.img || (ad ? ad.avatar : '') || "pic/disk.png";
    let bg = ad && ad.bgColor ? `background:${ad.bgColor};` : `background:linear-gradient(to bottom, #2c3e50, #000000);`;
    const lk = checkIsLiked(s.name);
    const hc = lk ? 'fa-solid fa-heart heart-btn liked' : 'fa-regular fa-heart heart-btn';
    
    let v = s.youtubeId ?
        `<div class="disk-container" style="width:100%;max-width:600px;aspect-ratio:16/9;margin-bottom:30px;box-shadow:0 10px 40px rgba(0,0,0,0.6);border-radius:12px;overflow:hidden;"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/${s.youtubeId}?autoplay=1&controls=1" title="YouTube" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>` :
        `<div class="disk-container" style="width:300px;height:300px;margin-bottom:30px;box-shadow:0 10px 40px rgba(0,0,0,0.6);"><img src="${ci}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;"></div>`;
    
    const html = `
    <div class="song-detail-page" style="${bg} width:100%; min-height:100%; padding:40px; box-sizing:border-box; display:flex; flex-direction:column; align-items:center; animation:fadeIn 0.3s; border-radius:20px;">
        <div style="width:100%; display:flex; justify-content:space-between; margin-bottom:20px;">
            <button onclick="restorePreviousView()" style="background:none; border:none; color:white; font-size:24px; cursor:pointer;"><i class="fa-solid fa-chevron-down"></i></button>
            <div style="text-transform:uppercase; font-size:12px; letter-spacing:1px; margin-top:10px; color:#fff; opacity:0.8;">ĐANG PHÁT</div>
            <div style="width:20px;"></div>
        </div>
        ${v}
        <div style="text-align:center; margin-bottom:30px;">
            <div style="display:flex; align-items:center; justify-content:center; gap:15px;">
                <h1 style="font-size:28px; margin:0; color:#fff;">${s.name}</h1>
                <i class="${hc}" style="font-size:24px;" onclick="toggleHeart('${escapeName(s.name)}', event)"></i>
            </div>
            <h3 style="font-size:18px; color:#ccc; font-weight:400; margin-top:10px;">${s.artist}</h3>
        </div>
        ${s.youtubeId ? '' : `<div class="lyrics-container" style="width:100%; max-width:600px; background:rgba(0,0,0,0.2); padding:20px; border-radius:12px; height:250px; overflow-y:auto;"><h4 style="margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:5px; font-weight:bold; color:#fff;">Lời bài hát</h4><p style="line-height:1.8; color:#ddd; font-size:16px;">(Lời bài hát đang cập nhật...)<br>🎵 Nhạc hay thì cứ nghe thôi...</p></div>`}
    </div>`;
    
    playlistContainer.innerHTML = html;
}

function renderDiscoveryGrid() {
    const g = document.getElementById('home-grid');
    for (let k in allPlaylists) {
        if (k === 'home') continue;
        const d = allPlaylists[k];
        const c = document.createElement('div');
        c.className = 'music-card';
        const isArt = d.type === 'artist';
        const r = isArt ? '50%' : '4px';
        const bg = isArt ? 'background:transparent;box-shadow:none;' : 'background:#333;';
        const im = d.avatar ? `<img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:${r};">` : `<div style="font-size:40px;display:flex;align-items:center;justify-content:center;height:100%;">${d.icon||'🎵'}</div>`;
        
        c.innerHTML = `
        <div class="card-img" style="${bg}">${im}</div>
        <div class="card-title" style="${isArt?'text-align:center;margin-top:10px;':''}">${d.title}</div>
        <div class="card-artist" style="${isArt?'text-align:center;':''}">${isArt?'Nghệ sĩ':'Playlist'}</div>`;
        
        c.onclick = () => switchPlaylist(k);
        g.appendChild(c);
    }
}

function renderSectionGrid(t, i) {
    if (!i || i.length === 0) return "";
    return `
    <div class="section-heading">${t}</div>
    <div class="card-grid">${i.map(x=>`
        <div class="music-card">
            <div class="card-img" style="background:#333;">
                <img src="${x.img}" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">
            </div>
            <div class="card-title">${x.title}</div>
            <div class="card-artist">${x.year} • Album</div>
        </div>`).join('')}
    </div>`;
}

function renderVerticalList() {
    playlistContainer.innerHTML = '';
    renderListItems(playlistContainer);
}

function renderListItems(c) {
    currentPlaylist.forEach((s, i) => {
        const d = document.createElement('div');
        d.className = 'song-box';
        
        if (isSongPlaying(s.name)) d.classList.add('active');
        
        const lk = checkIsLiked(s.name);
        const hc = lk ? 'fa-solid fa-heart heart-btn liked' : 'fa-regular fa-heart heart-btn';
        
        // --- ĐOẠN CODE SỬA ---
        d.innerHTML = `
        <div style="display:flex; flex-direction:column; flex: 1; padding-right: 10px; min-width: 0;">
            
            <div class="text-limit-2-lines" style="font-weight:500; font-size: 14px;" title="${s.name}">
                ${s.name}
            </div>
            
            <span style="font-size:12px; opacity:0.7;">${s.artist}</span>
        </div> 
        <i class="${hc}" style="margin-right:15px; flex-shrink: 0;" onclick="toggleHeart('${escapeName(s.name)}', event)"></i>`;
        
        
        d.onclick = () => playSpecificSong(i);
        c.appendChild(d);
    });
}