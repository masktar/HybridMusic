// --- js/data.js ---

const allPlaylists = {
    'home': {
        type: 'home',
        title: "Trang chủ",
        // icon: "🏠",
        // ĐỔ NHẠC VÀO ĐÂY ĐỂ HIỆN Ở TRANG CHỦ
        songs: [
            { name: 'Hạ Còn Vương Nắng', artist: 'DatKaa', src: 'music/datkaa/HaConVuongNang.mp3' , img: 'pic/dk/dk4.jpg'},
            { name: 'Chắc Ai Đó Sẽ Về', artist: 'Sơn Tùng M-TP', src: 'music/mtp/ChacAiDoSeVe.mp3', img: 'pic/st/st1.jpg' },
            { name: 'Sing Me To Sleep', artist: 'Alan Walker', src: 'music/aw/SingMeToSleep.mp3' , img: 'pic/aw/aw4.jpg'},
            { name: 'Unity', artist: 'The Walkers, Alan Walker, Sapphire', src: 'music/aw/Unity.mp3' , img: 'pic/aw/aw5.jpg'},
            { name: 'Bước Qua Nhau', artist: 'Vũ', src: 'music/vu/BuocQuaNhau.mp3', img: 'pic/vu/vu1.jpg' },
            { name: 'Có Sao Cũng Đành', artist: 'DatKaa', src: 'music/datkaa/CoSaoCungDanh.mp3', img: 'pic/dk/dk1.jpg' },
            { name: 'Faded', artist: 'Alan Walker', src: 'music/aw/Faded.mp3', img: 'pic/aw/aw1.jpg' },
            { name: 'Chúng Ta Không Thuộc Về Nhau', artist: 'Sơn Tùng M-TP', src: 'music/mtp/ChungTaKhongThuocVeNhau.mp3', img: 'pic/st/st1.jpg' },
            { name: 'Đông Kiếm Em', artist: 'Vũ', src: 'music/vu/DongKiemEm.mp3', img: 'pic/vu/vu3.jpg' },
            // ... Bạn có thể copy thêm bao nhiêu bài tùy thích
        ]
    },
    // --- js/data.js ---

    'sontung': {
        type: 'artist',
        title: "Sơn Tùng M-TP",
        // icon: "🎤",
        banner: "pic/st/st_ban.jpg",
        avatar: "pic/st/st_ava.jpg",
        listeners: "2,793,004 người nghe hàng tháng",

        // 1. DANH SÁCH BÀI HÁT (Giữ nguyên)
        songs: [
            { name: 'Chắc Ai Đó Sẽ Về', artist: 'Sơn Tùng M-TP', src: 'music/mtp/ChacAiDoSeVe.mp3' , img: 'pic/st/st1.jpg'},
            { name: 'Chúng Ta Không Thuộc Về Nhau', artist: 'Sơn Tùng M-TP', src: 'music/mtp/ChungTaKhongThuocVeNhau.mp3', img: 'pic/st/st1.jpg' },
            { name: 'Em Của Ngày Hôm Qua', artist: 'Sơn Tùng M-TP', src: 'music/mtp/EmCuaNgayHomQua.mp3', img: 'pic/st/st2.jpg' },
            { name: 'Hãy Trao Cho Anh-Sơn Tùng', artist: 'Sơn Tùng M-TP', src: 'music/mtp/HayTraoChoAnh.mp3', img: 'pic/st/st3.jpg' },
            { name: 'Không Phải Dạng Vừa Đâu', artist: 'Sơn Tùng M-TP', src: 'music/mtp/KhongPhaiDangVuaDau.mp3', img: 'pic/st/st2.jpg' },
            { name: 'Nắng Ấm Xa Dần', artist: 'Sơn Tùng M-TP', src: 'music/mtp/NangAmXaDan.mp3', img: 'pic/st/st1.jpg' },

        ],

        // 2. ALBUMS (Mới thêm)
        albums: [
            { title: "m-tp M-TP", year: "2017", img: "pic/st/playlist1.jpg" },
            { title: "Sky Tour Movie", year: "2020", img: "pic/st/playlist2.jpg" }
        ],

        // 3. SINGLES (Đĩa đơn - Mới thêm)
        singles: [
            { title: "Chúng Ta Của Tương Lai", year: "2024", img: "pic/st/st2.jpg" },
            { title: "Muộn Rồi Mà Sao Còn", year: "2021", img: "pic/st/st1.jpg" }
        ],

        // 4. FAN CŨNG THÍCH (Mới thêm)
        related: [
            { name: "DatKaa", img: "pic/dk/dk_ava.jpg" },
            { name: "Vũ", img: "pic/vu/vu_ava.jpg" },
            { name: "Alan Walker", img: "pic/aw/aw_ava.jpg" },
        ]
    },

    'vu': {
        type: 'artist',
        title: "Vũ.",
        // icon: "🎸", // Icon cây đàn cho chất Indie

        // Bạn thay bằng ảnh trong máy (pic/vu_banner.jpg) hoặc dùng link này
        banner: "pic/vu/vu_ban.jpg",
        bannerPos: "center 60%",
        avatar: "pic/vu/vu_ava.jpg",

        listeners: "1,540,291 người nghe hàng tháng",

        // 1. DANH SÁCH NHẠC (Quan trọng: Bạn phải có file nhạc trong máy)
        songs: [
            { name: 'Anh Nhớ Ra', artist: 'Vũ', src: 'music/vu/AnhNhoRa.mp3' , img: 'pic/vu/vu1.jpg'},
            { name: 'Bước Qua Nhau', artist: 'Vũ', src: 'music/vu/BuocQuaNhau.mp3' , img: 'pic/vu/vu1.jpg'},
            { name: 'Dành Hết Xuân Thì Để Chờ Nhau', artist: 'Vũ', src: 'music/vu/DanhHetXuanThiDeChoNhau.mp3', img: 'pic/vu/vu2.jpg' },
            { name: 'Đông Kiếm Em', artist: 'Vũ', src: 'music/vu/DongKiemEm.mp3' , img: 'pic/vu/vu3.jpg'},
            { name: 'Những Lời Hứa Bỏ Quên', artist: 'Vũ', src: 'music/vu/NhungLoiHuaBoQuen.mp3' , img: 'pic/vu/vu4.jpg'},
            { name: 'Vì Anh Đâu Có Biết', artist: 'Vũ', src: 'music/vu/ViAnhDauCoBiet.mp3' , img: 'pic/vu/vu5.jpg'},

        ],

        // 2. ALBUMS
        albums: [
            { title: "Tuyển tập của Vũ", year: "2022", img: "pic/vu/playlist1.jpg" },
            { title: "Vũ Hits", year: "2019", img: "pic/vu/vu1.jpg" }
        ],

        // 3. SINGLES
        singles: [
            { title: "Những Lời Hứa Bỏ Quên", year: "2023", img: "pic/vu/vu2.jpg" },
            { title: "Bước Qua Mùa Cô Đơn", year: "2020", img: "pic/vu/vu4.jpg" }
        ],

        // 4. FAN CŨNG THÍCH (Gợi ý nghệ sĩ Indie khác)
        related: [
            { name: "DatKaa", img: "pic/dk/dk_ava.jpg" },
            { name: "Sơn Tùng M-TP", img: "pic/st/st_ava.jpg" },
            { name: "Alan Walker", img: "pic/aw/aw_ava.jpg" },
        ]
    },

    'Datkaa': {
        type: 'artist',
        title: "Datkaa.",
        // icon: "🎸", // Icon cây đàn cho chất Indie
        avatar: "pic/dk/dk_ava.jpg",

        listeners: "1,540,291 người nghe hàng tháng",
        bgColor: "linear-gradient(to bottom right, #e088d5ff, #d86dc1ff)",

        // 1. DANH SÁCH NHẠC (Quan trọng: Bạn phải có file nhạc trong máy)
        songs: [
            { name: 'Có Sao Cũng Đành', artist: 'DatKaa', src: 'music/datkaa/CoSaoCungDanh.mp3' , img: 'pic/dk/dk1.jpg'},
            { name: 'Chiều Thu Họa Bóng Nàng', artist: 'DatKaa', src: 'music/datkaa/ChieuThuHoaBongNang.mp3' , img: 'pic/dk/dk2.jpg'},
            { name: 'Đớn Đau Vô Cùng', artist: 'DatKaa', src: 'music/datkaa/DonDauVoCung.mp3' , img: 'pic/dk/dk3.jpg'},
            { name: 'Hạ Còn Vương Nắng', artist: 'DatKaa', src: 'music/datkaa/HaConVuongNang.mp3' , img: 'pic/dk/dk4.jpg'},
            { name: 'Mây Hồng Đưa Lối', artist: 'DatKaa', src: 'music/datkaa/MayHongDuaLoi.mp3' , img: 'pic/dk/dk5.jpg'},
            { name: 'Tình Thu Sao Hạ Buồn', artist: 'DatKaa', src: 'music/datkaa/TinhThuSaoHaBuon.mp3' , img: 'pic/dk/dk6.jpg'}
        ],

        // 2. ALBUaw
        albums: [
            { title: "Tuyển tập Datkaa", year: "2022", img: "pic/dk/playlist1.jpg" },
            { title: "Hits", year: "2019", img: "pic/dk/playlist2.jpg" }
        ],

        // 3. SINGLES
        singles: [
            { title: "Tình thu sao hạ buồn", year: "2023", img: "pic/dk/dk6.jpg" },
            { title: "Chiều thu họa bóng nàng", year: "2020", img: "pic/dk/dk2.jpg" }
        ],

        // 4. FAN CŨNG THÍCH (Gợi ý nghệ sĩ Indie khác)
        related: [
            { name: "Sơn Tùng M-TP", img: "pic/st/st_ava.jpg" },
            { name: "Vũ", img: "pic/vu/vu_ava.jpg" },
            { name: "Alan Walker", img: "pic/aw/aw_ava.jpg" },
        ]
    },

    'Alan Walker': {
        type: 'artist',
        title: "Alan Walker.",
        // icon: "🎸", // Icon cây đàn cho chất Indie
        avatar: "pic/aw/aw_ava.jpg",
        banner: "pic/aw/aw_ban.jpg",
        bannerPos: "center 25%",

        listeners: "1,540,291 người nghe hàng tháng",

        // 1. DANH SÁCH NHẠC (Quan trọng: Bạn phải có file nhạc trong máy)
        songs: [
            { name: 'Alone', artist: 'Alan Walker', src: 'music/aw/Alone.mp3' , img: 'pic/aw/aw1.jpg'},
            { name: 'Faded', artist: 'Alan Walker', src: 'music/aw/Faded.mp3' , img: 'pic/aw/aw1.jpg'},
            { name: 'Ignite', artist: 'Alan Walker, Julie Bergan, K-391, Seung Ri ', src: 'music/aw/Ignite.mp3' , img: 'pic/aw/aw2.jpg'},
            { name: 'On My Way', artist: 'Alan Walker, Sabrina Carpenter, Farruko', src: 'music/aw/OnMyWay.mp3' , img: 'pic/aw/aw3.jpg'},
            { name: 'Sing Me To Sleep', artist: 'Alan Walker', src: 'music/aw/SingMeToSleep.mp3' , img: 'pic/aw/aw4.jpg'},
            { name: 'Unity', artist: 'The Walkers, Alan Walker, Sapphire', src: 'music/aw/Unity.mp3' , img: 'pic/aw/aw5.jpg'},

        ],

        // 2. ALBUMS
        albums: [
            { title: "Walkers", year: "2022", img: "pic/aw/playlist1.jpg" },
            { title: "Alan Walkers", year: "2019", img: "pic/aw/playlist2.jpg" }
        ],

        // 3. SINGLES
        singles: [
            { title: "Faded", year: "2023", img: "pic/aw/aw1.jpg" },
            { title: "On My Way", year: "2020", img: "pic/aw/aw3.jpg" }
        ],

        // 4. FAN CŨNG THÍCH (Gợi ý nghệ sĩ Indie khác)
        related: [
            { name: "Sơn Tùng M-TP", img: "pic/st/st_ava.jpg" },
            { name: "Vũ", img: "pic/vu/vu_ava.jpg" },
            { name: "DatKaa", img: "pic/dk/dk_ava.jpg" },
        ]
    },

    'lofi': {
        type: 'playlist',
        title: "Lofi Girl Radio",
        icon: "☕",
        songs: [
            { 
                name: "lofi hip hop radio - beats to relax/study to", 
                artist: "Lofi Girl", 
                // Đây là mã video Live của Lofi Girl
                youtubeId: "P6Segk8cr-c", 
                img: "https://i.ytimg.com/vi/P6Segk8cr-c/maxresdefault.jpg" 
            },
            { 
                name: "synthwave radio - beats to chill/game to", 
                artist: "Lofi Girl", 
                // Mã video Live thứ 2 (nhạc điện tử)
                youtubeId: "4xDzrJKXOOY", 
                img: "https://i.ytimg.com/vi/4xDzrJKXOOY/maxresdefault.jpg" 
            },
            { 
                name: "Feel Good Vibes 2025 ☀️ 24/7 Live Stream 🎧 Deep & Chill House Music by We Are Diamond", 
                artist: "We Are Diamond", 
                // Mã video Live thứ 2 (nhạc điện tử)
                youtubeId: "v-KQZ1KZcEo", 
                img: "https://i.ytimg.com/vi/v-KQZ1KZcEo/maxresdefault.jpg" 
            }
            
        ]
    },
    // ... Copy hết các playlist còn lại vào đây
};