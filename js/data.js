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
            { title: "m-tp M-TP", year: "2017", img: "https://upload.wikimedia.org/wikipedia/vi/5/53/S%C6%A1n_T%C3%B9ng_M-TP_-_m-tp_M-TP.png" },
            { title: "Sky Tour Movie", year: "2020", img: "https://upload.wikimedia.org/wikipedia/vi/2/23/Sky_Tour_Movie_poster.jpg" }
        ],

        // 3. SINGLES (Đĩa đơn - Mới thêm)
        singles: [
            { title: "Chúng Ta Của Tương Lai", year: "2024", img: "https://i.scdn.co/image/ab67616d0000b27329f8605df0ebcc523df16d06" },
            { title: "Making My Way", year: "2023", img: "https://i.scdn.co/image/ab67616d0000b27320b333737b822cb6295d9834" },
            { title: "There's No One At All", year: "2022", img: "https://upload.wikimedia.org/wikipedia/vi/6/61/There%27s_no_one_at_all_single_cover.jpg" },
            { title: "Muộn Rồi Mà Sao Còn", year: "2021", img: "https://upload.wikimedia.org/wikipedia/vi/thumb/9/9f/Mu%E1%BB%99n_r%E1%BB%93i_m%C3%A0_sao_c%C3%B2n.png/220px-Mu%E1%BB%99n_r%E1%BB%93i_m%C3%A0_sao_c%C3%B2n.png" }
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
            { title: "Một Vạn Năm", year: "2022", img: "https://i.scdn.co/image/ab67616d0000b2736b047c1401da9df5977936cc" },
            { title: "Vũ Trụ Song Song", year: "2019", img: "https://i.scdn.co/image/ab67616d0000b273a2b0057053359c55b62b700f" }
        ],

        // 3. SINGLES
        singles: [
            { title: "Những Lời Hứa Bỏ Quên", year: "2023", img: "https://i.scdn.co/image/ab67616d0000b27393fe387cb7729f27d530f406" },
            { title: "Bước Qua Mùa Cô Đơn", year: "2020", img: "https://i.scdn.co/image/ab67616d0000b273d6e5ac47ae07df3747cb99d4" }
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
            { title: "Một Vạn Năm", year: "2022", img: "https://i.scdn.co/image/ab67616d0000b2736b047c1401da9df5977936cc" },
            { title: "Vũ Trụ Song Song", year: "2019", img: "https://i.scdn.co/image/ab67616d0000b273a2b0057053359c55b62b700f" }
        ],

        // 3. SINGLES
        singles: [
            { title: "Những Lời Hứa Bỏ Quên", year: "2023", img: "https://i.scdn.co/image/ab67616d0000b27393fe387cb7729f27d530f406" },
            { title: "Bước Qua Mùa Cô Đơn", year: "2020", img: "https://i.scdn.co/image/ab67616d0000b273d6e5ac47ae07df3747cb99d4" }
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
            { name: 'Ignite', artist: 'Alan Walker, Julie Bergan, K-391, Seung Ri; ', src: 'music/aw/Ignite.mp3' , img: 'pic/aw/aw2.jpg'},
            { name: 'On My Way', artist: 'Alan Walker, Sabrina Carpenter, Farruko', src: 'music/aw/OnMyWay.mp3' , img: 'pic/aw/aw3.jpg'},
            { name: 'Sing Me To Sleep', artist: 'Alan Walker', src: 'music/aw/SingMeToSleep.mp3' , img: 'pic/aw/aw4.jpg'},
            { name: 'Unity', artist: 'The Walkers, Alan Walker, Sapphire', src: 'music/aw/Unity.mp3' , img: 'pic/aw/aw5.jpg'},

        ],

        // 2. ALBUMS
        albums: [
            { title: "Một Vạn Năm", year: "2022", img: "https://i.scdn.co/image/ab67616d0000b2736b047c1401da9df5977936cc" },
            { title: "Vũ Trụ Song Song", year: "2019", img: "https://i.scdn.co/image/ab67616d0000b273a2b0057053359c55b62b700f" }
        ],

        // 3. SINGLES
        singles: [
            { title: "Những Lời Hứa Bỏ Quên", year: "2023", img: "https://i.scdn.co/image/ab67616d0000b27393fe387cb7729f27d530f406" },
            { title: "Bước Qua Mùa Cô Đơn", year: "2020", img: "https://i.scdn.co/image/ab67616d0000b273d6e5ac47ae07df3747cb99d4" }
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
        title: "Nhạc Lofi Học Bài",
        // icon: "🎵",
        songs: [
            { name: "Ignite", artist: "K-391", src: "music/1.mp3" },
            { name: "Alone", artist: "Marshmello", src: "music/3.mp3" }
        ]
    },
    // ... Copy hết các playlist còn lại vào đây
};