// Constants
const CORRECT_TOKEN = 'OS2J8U';
const SELECTION_TIME = 30;
const QUESTION_TIME = 600; // 10 minutes

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
        // If no difficulty selected, auto-select hard difficulty
        if (state.selectedDifficulty === null) {
            state.selectedDifficulty = 3;
        }
        // Move to question stage
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
    // Only allow selection if not already selected
    state.selectedDifficulty = difficulty;
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
        1: { label: 'Mudah', correct: '+5', wrong: '-1', color: 'bg-green-500', borderColor: 'border-green-500' },
        2: { label: 'Sedang', correct: '+8', wrong: '-2', color: 'bg-yellow-500', borderColor: 'border-yellow-500' },
        3: { label: 'Sulit', correct: '+15', wrong: '-4', color: 'bg-red-500', borderColor: 'border-red-500' }
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
    trophy: `<svg class="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
    </svg>`,
    timer: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`,
    alert: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
    </svg>`,
    check: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
    </svg>`,
    trophyLarge: `<svg class="w-24 h-24 text-yellow-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
    </svg>`
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
    const selectedInfo = state.selectedDifficulty !== null ? getDifficultyInfo(state.selectedDifficulty) : null;
    
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
                    
                    ${selectedInfo !== null ? `
                        <div class="mt-6 bg-green-500 text-white px-8 py-4 rounded-xl inline-flex items-center gap-3 shadow-lg animate-pulse">
                            ${icons.check}
                            <span class="font-bold text-lg">Kesulitan ${selectedInfo.label} telah dipilih. Menunggu waktu habis...</span>
                        </div>
                    ` : `
                        <div class="mt-6 bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl inline-flex items-center gap-3 shadow-lg">
                            ${icons.alert}
                            <span class="font-bold text-lg">Jika tidak memilih, otomatis akan memilih SULIT</span>
                        </div>
                    `}
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    ${[1, 2, 3].map(diff => {
                        const info = getDifficultyInfo(diff);
                        const isSelected = state.selectedDifficulty === diff;
                        return `
                            <button
                                onclick="handleDifficultySelect(${diff})"
                                class="${info.color} text-white rounded-2xl p-8 shadow-2xl transition-all transform hover:scale-105 ${isSelected ? 'scale-110 ring-8 ring-white' : ''}"
                                style="position: relative;"
                            >
                                ${isSelected ? `
                                    <div style="position: absolute; top: -15px; right: -15px; background: white; border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                                        <svg class="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                        </svg>
                                    </div>
                                ` : ''}
                                
                                <div class="text-4xl font-bold mb-6">${info.label}</div>
                                <div class="space-y-3 text-xl">
                                    <div class="font-semibold">✓ Benar: ${info.correct}</div>
                                    <div class="font-semibold">✗ Salah: ${info.wrong}</div>
                                </div>
                                
                                ${isSelected ? `
                                    <div class="mt-6 text-2xl font-bold bg-white bg-opacity-30 py-2 rounded-lg">
                                        TERPILIH
                                    </div>
                                ` : ''}
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
                        <div class="px-6 py-3 rounded-lg ${diffInfo.color} text-white font-bold text-lg shadow-md">
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
