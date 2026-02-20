(function() {
    // ==================== STATE & VARIABEL ====================
    let secretNumber = "";               // angka rahasia 3 digit (string)
    let sessionWrong = 0;                // salah dalam sesi ini
    let gameActive = false;               // apakah game sedang berjalan (bisa tebak)
    
    // Storage keys
    const STORAGE_CORRECT = 'tebak123_totalCorrect';
    const STORAGE_MAXWRONG = 'tebak123_maxWrong';

    // ==================== ELEMEN DOM ====================
    const guessInput = document.getElementById('guessInput');
    const guessBtn = document.getElementById('guessBtn');
    const playBtn = document.getElementById('playBtn');
    const messageBox = document.getElementById('messageBox');
    const totalCorrectSpan = document.getElementById('totalCorrectDisplay');
    const maxWrongSpan = document.getElementById('maxWrongDisplay');
    const wrongCountSpan = document.getElementById('wrongCountDisplay');
    const resetStatsBtn = document.getElementById('resetStatsBtn');

    // ==================== FUNGSI STORAGE ====================
    function loadStats() {
        let total = localStorage.getItem(STORAGE_CORRECT);
        let max = localStorage.getItem(STORAGE_MAXWRONG);
        total = total ? parseInt(total, 10) : 0;
        max = max ? parseInt(max, 10) : 0;
        // pastikan angka
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

    // ==================== UPDATE TAMPILAN SESSION ====================
    function updateSessionDisplay() {
        wrongCountSpan.innerText = sessionWrong;
    }

    // ==================== RESET SESSION (tanpa menyentuh localStorage) ====================
    function resetGameSession() {
        sessionWrong = 0;
        updateSessionDisplay();
        // kosongkan input & enable/disable
        guessInput.value = '';
        messageBox.innerHTML = `<i class="fas fa-play"></i> Game baru dimulai! tebak angka 3 digit.`;
        // aktifkan game
        gameActive = true;
        guessInput.disabled = false;
        guessBtn.disabled = false;
        guessInput.focus();
    }

    // ==================== GENERATE ANGKA RAHASIA (acak dari 6 permutasi) ====================
    function generateSecret() {
        const digits = ['1', '2', '3'];
        // acak permutasi
        for (let i = digits.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [digits[i], digits[j]] = [digits[j], digits[i]];
        }
        return digits.join(''); // string 3 char
    }

    // ==================== MULAI PERMAINAN BARU ====================
    function startNewGame() {
        secretNumber = generateSecret();
        console.log("🔍 Rahasia (dev):", secretNumber); // untuk testing
        resetGameSession();
        messageBox.innerHTML = `<i class="fas fa-search"></i> Masukkan tebakan 3 digit (1,2,3 tanpa ulang)`;
    }

    // ==================== CEK VALIDITAS INPUT ====================
    function isValidGuess(str) {
        if (!/^[1-3]{3}$/.test(str)) return false;
        // cek tidak ada duplikat
        return str[0] !== str[1] && str[0] !== str[2] && str[1] !== str[2];
    }

    // ==================== PROSES TEBAKAN ====================
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

        // Bandingkan dengan secret
        if (guess === secretNumber) {
            // ======= BENAR ========
            let { total, max } = loadStats();
            total += 1;
            if (sessionWrong > max) {
                max = sessionWrong;
            }
            saveStats(total, max);
            updateStatDisplays();

            messageBox.innerHTML = `<i class="fas fa-crown" style="color:#ffd966;"></i> BENAR! Angkanya ${secretNumber}. Total menang bertambah!`;

            // Nonaktifkan game
            gameActive = false;
            guessInput.disabled = true;
            guessBtn.disabled = true;
        } else {
            // ======= SALAH ========
            sessionWrong += 1;
            updateSessionDisplay();
            messageBox.innerHTML = `<i class="fas fa-times" style="color:#ff8a7a;"></i> Salah! Coba lagi. (${sessionWrong} x salah)`;
            guessInput.value = '';
            guessInput.focus();
        }
    }

    // ==================== HAPUS SEMUA DATA STATISTIK ====================
    function resetAllStats() {
        saveStats(0, 0);
        updateStatDisplays();
        messageBox.innerHTML = `<i class="fas fa-broom"></i> Semua statistik lokal dihapus.`;
    }

    // ==================== INITIAL LOAD & EVENT LISTENERS ====================
    function init() {
        updateStatDisplays();

        gameActive = false;
        guessInput.disabled = true;
        guessBtn.disabled = true;
        secretNumber = '';

        playBtn.addEventListener('click', startNewGame);
        guessBtn.addEventListener('click', handleGuess);
        guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (!guessBtn.disabled) handleGuess();
            }
        });
        resetStatsBtn.addEventListener('click', resetAllStats);
        guessInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^1-3]/g, '').slice(0,3);
        });
    }

    init();
})();