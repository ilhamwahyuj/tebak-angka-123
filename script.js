(function() {
    // ==================== DATA USER & STORAGE ====================
    const STORAGE_USERS = 'tebak123_users';
    const STORAGE_CURRENT_USER = 'tebak123_currentUser';
    // Statistik game (global)
    const STORAGE_CORRECT = 'tebak123_totalCorrect';
    const STORAGE_MAXWRONG = 'tebak123_maxWrong';

    // Helper baca/tulis users
    function getUsers() {
        let users = localStorage.getItem(STORAGE_USERS);
        return users ? JSON.parse(users) : [];
    }
    function saveUsers(users) {
        localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    }

    // Mendapatkan current user
    function getCurrentUser() {
        return localStorage.getItem(STORAGE_CURRENT_USER);
    }

    // Simpan current user
    function setCurrentUser(username) {
        if (username) {
            localStorage.setItem(STORAGE_CURRENT_USER, username);
        } else {
            localStorage.removeItem(STORAGE_CURRENT_USER);
        }
    }

    // ==================== ELEMEN DOM ====================
    const authSection = document.getElementById('authSection');
    const gameSection = document.getElementById('gameSection');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginName = document.getElementById('loginName');
    const loginBtn = document.getElementById('loginBtn');
    const regName = document.getElementById('regName');
    const regAge = document.getElementById('regAge');
    const regCity = document.getElementById('regCity');
    const registerBtn = document.getElementById('registerBtn');
    const userListBody = document.getElementById('userListBody');
    const welcomeUser = document.getElementById('welcomeUser');
    const logoutBtn = document.getElementById('logoutBtn');

    // Elemen game
    const guessInput = document.getElementById('guessInput');
    const guessBtn = document.getElementById('guessBtn');
    const playBtn = document.getElementById('playBtn');
    const messageBox = document.getElementById('messageBox');
    const totalCorrectSpan = document.getElementById('totalCorrectDisplay');
    const maxWrongSpan = document.getElementById('maxWrongDisplay');
    const wrongCountSpan = document.getElementById('wrongCountDisplay');
    const resetStatsBtn = document.getElementById('resetStatsBtn');

    // ==================== STATE GAME ====================
    let secretNumber = "";
    let sessionWrong = 0;
    let gameActive = false;

    // ==================== FUNGSI UI ====================
    // Tampilkan daftar user di tabel
    function renderUserList() {
        const users = getUsers();
        let html = '';
        users.forEach(u => {
            html += `<tr><td>${u.nama}</td><td>${u.umur || '-'}</td><td>${u.domisili || '-'}</td></tr>`;
        });
        userListBody.innerHTML = html || '<tr><td colspan="3">Belum ada user</td></tr>';
    }

    // Switch tab login/register
    function setActiveTab(tab) {
        if (tab === 'login') {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        } else {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    // Cek session saat load
    function checkSession() {
        const currentUser = getCurrentUser();
        if (currentUser) {
            showGameSection(currentUser);
        } else {
            showAuthSection();
        }
    }

    function showAuthSection() {
        authSection.classList.remove('hidden');
        gameSection.classList.add('hidden');
        renderUserList();
    }

    function showGameSection(username) {
        authSection.classList.add('hidden');
        gameSection.classList.remove('hidden');
        welcomeUser.innerHTML = `<i class="fas fa-user"></i> Halo, ${username}`;
        resetGameToInitial();
        updateStatDisplays();
    }

    // Reset game ke keadaan awal
    function resetGameToInitial() {
        gameActive = false;
        secretNumber = '';
        sessionWrong = 0;
        guessInput.disabled = true;
        guessBtn.disabled = true;
        guessInput.value = '';
        messageBox.innerHTML = `<i class="fas fa-lightbulb"></i> Tekan "Play" untuk mulai`;
        updateSessionDisplay();
    }

    // ==================== FUNGSI GAME ====================
    function loadStats() {
        let total = localStorage.getItem(STORAGE_CORRECT);
        let max = localStorage.getItem(STORAGE_MAXWRONG);
        total = total ? parseInt(total, 10) : 0;
        max = max ? parseInt(max, 10) : 0;
        if (isNaN(total)) total = 0;
        if (isNaN(max)) max = 0;
        return { total, max };
    }
    function saveStats(total, max) {
        localStorage.setItem(STORAGE_CORRECT, total.toString());
        localStorage.setItem(STORAGE_MAXWRONG, max.toString());
    }
    function updateStatDisplays() {
        const { total, max } = loadStats();
        totalCorrectSpan.innerText = total;
        maxWrongSpan.innerText = max;
    }
    function updateSessionDisplay() {
        wrongCountSpan.innerText = sessionWrong;
    }
    function generateSecret() {
        const digits = ['1', '2', '3'];
        for (let i = digits.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [digits[i], digits[j]] = [digits[j], digits[i]];
        }
        return digits.join('');
    }
    function startNewGame() {
        secretNumber = generateSecret();
        console.log("Rahasia:", secretNumber); // untuk debugging
        sessionWrong = 0;
        updateSessionDisplay();
        guessInput.value = '';
        messageBox.innerHTML = `<i class="fas fa-search"></i> Masukkan tebakan 3 digit (1,2,3 tanpa ulang)`;
        gameActive = true;
        guessInput.disabled = false;
        guessBtn.disabled = false;
        guessInput.focus();
    }
    function isValidGuess(str) {
        if (!/^[1-3]{3}$/.test(str)) return false;
        return str[0] !== str[1] && str[0] !== str[2] && str[1] !== str[2];
    }
    function handleGuess() {
        if (!gameActive) {
            messageBox.innerHTML = `<i class="fas fa-hand"></i> Tekan PLAY dulu ya!`;
            return;
        }
        const guess = guessInput.value.trim();
        if (!isValidGuess(guess)) {
            messageBox.innerHTML = `<i class="fas fa-exclamation-triangle" style="color:#f9a66c;"></i> Tebakan harus 3 angka beda dari 1,2,3 (contoh: 132)`;
            guessInput.value = '';
            guessInput.focus();
            return;
        }
        if (guess === secretNumber) {
            // Benar
            let { total, max } = loadStats();
            total += 1;
            if (sessionWrong > max) {
                max = sessionWrong;
            }
            saveStats(total, max);
            updateStatDisplays();
            messageBox.innerHTML = `<i class="fas fa-crown" style="color:#ffd966;"></i> BENAR! Angkanya ${secretNumber}. Total menang bertambah!`;
            gameActive = false;
            guessInput.disabled = true;
            guessBtn.disabled = true;
        } else {
            sessionWrong += 1;
            updateSessionDisplay();
            messageBox.innerHTML = `<i class="fas fa-times" style="color:#ff8a7a;"></i> Salah! Coba lagi. (${sessionWrong} x salah)`;
            guessInput.value = '';
            guessInput.focus();
        }
    }
    function resetAllStats() {
        saveStats(0, 0);
        updateStatDisplays();
        messageBox.innerHTML = `<i class="fas fa-broom"></i> Semua statistik lokal dihapus.`;
    }

    // ==================== EVENT LISTENERS ====================
    // Tab switching
    tabLogin.addEventListener('click', () => setActiveTab('login'));
    tabRegister.addEventListener('click', () => setActiveTab('register'));

    // Register
    registerBtn.addEventListener('click', () => {
        const nama = regName.value.trim();
        const umur = regAge.value.trim();
        const domisili = regCity.value.trim();
        if (!nama) {
            alert('Nama harus diisi!');
            return;
        }
        const users = getUsers();
        if (users.find(u => u.nama.toLowerCase() === nama.toLowerCase())) {
            alert('Nama sudah terdaftar, gunakan nama lain.');
            return;
        }
        users.push({ nama, umur, domisili });
        saveUsers(users);
        renderUserList();
        regName.value = '';
        regAge.value = '';
        regCity.value = '';
        alert('Registrasi berhasil! Silakan login.');
        setActiveTab('login');
    });

    // Login
    loginBtn.addEventListener('click', () => {
        const nama = loginName.value.trim();
        if (!nama) {
            alert('Masukkan nama!');
            return;
        }
        const users = getUsers();
        const user = users.find(u => u.nama.toLowerCase() === nama.toLowerCase());
        if (user) {
            setCurrentUser(user.nama);
            showGameSection(user.nama);
            loginName.value = '';
        } else {
            alert('Nama tidak ditemukan. Silakan register terlebih dahulu.');
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        setCurrentUser(null);
        showAuthSection();
        resetGameToInitial();
    });

    // Game listeners
    playBtn.addEventListener('click', startNewGame);
    guessBtn.addEventListener('click', handleGuess);
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!guessBtn.disabled) handleGuess();
        }
    });
    guessInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^1-3]/g, '').slice(0,3);
    });
    resetStatsBtn.addEventListener('click', resetAllStats);

    // Inisialisasi
    checkSession();
    renderUserList();
})();