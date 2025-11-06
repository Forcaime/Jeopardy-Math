// Constants
const CORRECT_TOKEN = 'OS2J8U';
const SELECTION_TIME = 30;
const QUESTION_TIME = 600
; // 10 minutes

// State
let state = {
    token: '',
    stage: 'login', // login, selection, question, finished
    currentSet: 0,
    selectedDifficulty: null,
    timeLeft: SELECTION_TIME,
    questionOrder: [],
    timerInterval: null
};

// Initialize
function init() {
    // Generate shuffled question order
    const sets = ['A', 'B', 'C', 'D', 'E', 'F'];
    state.questionOrder = [...sets].sort(() => Math.random() - 0.5);
    
    render();
}

// Timer functions
function startTimer() {
    stopTimer();
    state.timerInterval = setInterval(() => {
        state.timeLeft--;
        if (state.timeLeft <= 0) {
            handleTimeUp();
        }
        render();
    }, 1000);
}

function stopTimer() {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
}

function handleTimeUp() {
    stopTimer();
    
    if (state.stage === 'selection') {
        // Auto-select hard difficulty
        state.selectedDifficulty = 3;
        state.stage = 'question';
        state.timeLeft = QUESTION_TIME;
        startTimer();
    } else if (state.stage === 'question') {
        // Move to next set
        if (state.currentSet < 5) {
            state.currentSet++;
            state.selectedDifficulty = null;
            state.stage = 'selection';
            state.timeLeft = SELECTION_TIME;
            startTimer();
        } else {
            state.stage = 'finished';
        }
    }
    
    render();
}

// Event handlers
function handleLogin() {
    const tokenInput = document.getElementById('tokenInput');
    if (tokenInput.value.toUpperCase() === CORRECT_TOKEN) {
        state.stage = 'selection';
        state.timeLeft = SELECTION_TIME;
        startTimer();
        render();
    } else {
        alert('Token salah! Silakan coba lagi.');
    }
}

function handleDifficultySelect(difficulty) {
    state.selectedDifficulty = difficulty;
    state.stage = 'question';
    state.timeLeft = QUESTION_TIME;
    stopTimer();
    startTimer();
    render();
}

// Helper functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getDifficultyInfo(diff) {
    const info = {
        1: { label: 'Mudah', correct: '+5', wrong: '-1', color: 'bg-green-500' },
        2: { label: 'Sedang', correct: '+8', wrong: '-2', color: 'bg-yellow-500' },
        3: { label: 'Sulit', correct: '+15', wrong: '-4', color: 'bg-red-500' }
    };
    return info[diff];
}

function getCurrentQuestion() {
    if (state.questionOrder.length === 0) return '';
    const setLetter = state.questionOrder[state.currentSet];
    return `questions/${setLetter}${state.selectedDifficulty}.png`;
}

// SVG Icons
const icons = {
    trophy: '<svg class="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v16h14V3M5 7h14m-7 4v8m-3-8l3 3m0 0l3-3"></path></svg>',
    timer: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
    alert: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>',
    trophyLarge: '<svg class="w-24 h-24 text-yellow-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v16h14V3M5 7h14m-7 4v8m-3-8l3 3m0 0l3-3"></path></svg>'
};

// Render functions
function renderLogin() {
    return `
        <div class="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div class="text-center mb-8">
                    ${icons.trophy}
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">PDC Math Olympiad</h1>
                    <h2 class="text-xl font-semibold text-purple-600">Math Jeopardy</h2>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Masukkan Token
                        </label>
                        <input
                            type="text"
                            id="tokenInput"
                            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Masukkan token..."
                            style="text-transform: uppercase;"
                        />
                    </div>
                    
                    <button
                        onclick="handleLogin()"
                        class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
                    >
                        Mulai Kompetisi
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderSelection() {
    return `
        <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            <div class="bg-white shadow-lg">
                <div class="max-w-7xl mx-auto px-6 py-4">
                    <div class="flex justify-between items-center">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800">PDC Math Olympiad</h1>
                            <p class="text-purple-600 font-semibold">Math Jeopardy</p>
                        </div>
                        <div class="flex items-center gap-6">
                            <div class="text-right">
                                <div class="text-sm text-gray-600">Set Soal</div>
                                <div class="text-2xl font-bold text-purple-600">${state.currentSet + 1}/6</div>
                            </div>
                            <div class="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-lg">
                                ${icons.timer}
                                <span class="text-2xl font-bold text-red-600">${formatTime(state.timeLeft)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="max-w-4xl mx-auto px-6 py-12">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-white mb-4">Pilih Tingkat Kesulitan</h2>
                    <p class="text-xl text-gray-200">Anda memiliki 30 detik untuk memilih</p>
                    <div class="mt-4 bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg inline-flex items-center gap-2">
                        ${icons.alert}
                        <span class="font-semibold">Jika tidak memilih, otomatis akan memilih SULIT</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${[1, 2, 3].map(diff => {
                        const info = getDifficultyInfo(diff);
                        return `
                            <button
                                onclick="handleDifficultySelect(${diff})"
                                class="${info.color} text-white rounded-2xl p-8 shadow-2xl hover:scale-105 transition-transform transform"
                            >
                                <div class="text-3xl font-bold mb-4">${info.label}</div>
                                <div class="space-y-2 text-lg">
                                    <div>Benar: ${info.correct}</div>
                                    <div>Salah: ${info.wrong}</div>
                                </div>
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderQuestion() {
    const diffInfo = getDifficultyInfo(state.selectedDifficulty);
    return `
        <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div class="bg-white shadow-lg">
                <div class="max-w-7xl mx-auto px-6 py-4">
                    <div class="flex justify-between items-center">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800">PDC Math Olympiad</h1>
                            <p class="text-purple-600 font-semibold">Math Jeopardy</p>
                        </div>
                        <div class="flex items-center gap-6">
                            <div class="text-right">
                                <div class="text-sm text-gray-600">Set Soal</div>
                                <div class="text-2xl font-bold text-purple-600">${state.currentSet + 1}/6</div>
                            </div>
                            <div class="px-4 py-2 rounded-lg ${diffInfo.color} bg-opacity-20">
                                <div class="text-sm text-gray-700">Tingkat Kesulitan</div>
                                <div class="text-xl font-bold text-gray-900">${diffInfo.label}</div>
                            </div>
                            <div class="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg">
                                ${icons.timer}
                                <span class="text-2xl font-bold text-blue-600">${formatTime(state.timeLeft)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="max-w-5xl mx-auto px-6 py-8">
                <div class="bg-white rounded-2xl shadow-2xl p-8">
                    <div class="mb-6 flex justify-between items-center">
                        <div class="px-4 py-2 rounded-lg ${diffInfo.color} text-white font-semibold">
                            ${diffInfo.label}: Benar ${diffInfo.correct} | Salah ${diffInfo.wrong}
                        </div>
                    </div>

                    <div class="bg-gray-50 rounded-xl p-6 min-h-[500px] flex items-center justify-center">
                        <img 
                            src="${getCurrentQuestion()}" 
                            alt="Soal Matematika"
                            class="max-w-full max-h-[600px] object-contain"
                            onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22><rect fill=%22%23e5e7eb%22 width=%22400%22 height=%22300%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%236b7280%22 font-size=%2220%22>Gambar tidak ditemukan</text></svg>'"
                        />
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderFinished() {
    return `
        <div class="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full text-center">
                ${icons.trophyLarge}
                <h1 class="text-4xl font-bold text-gray-800 mb-4">Kompetisi Selesai!</h1>
                <p class="text-xl text-gray-600 mb-8">
                    Terima kasih telah mengikuti PDC Math Olympiad - Math Jeopardy
                </p>
                <div class="text-6xl font-bold text-purple-600 mb-4">6/6</div>
                <div class="text-gray-600">Set Soal Selesai</div>
            </div>
        </div>
    `;
}

function render() {
    const app = document.getElementById('app');
    
    if (state.stage === 'login') {
        app.innerHTML = renderLogin();
    } else if (state.stage === 'selection') {
        app.innerHTML = renderSelection();
    } else if (state.stage === 'question') {
        app.innerHTML = renderQuestion();
    } else if (state.stage === 'finished') {
        app.innerHTML = renderFinished();
    }
}

// Start application
window.addEventListener('DOMContentLoaded', init);