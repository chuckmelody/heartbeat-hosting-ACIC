import AbstractView from "./AbstractView.js";
import RightSidebar from "./_RightSidebar.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.examId = params.examId;

        // --- Exam Configuration ---
        const examConfigs = {
            'cic-101': { title: 'CIC 101 Exam', jsonPath: '/static/data/cic_exam_questions.json', icon: 'fa-graduation-cap' },
            'safeguarding-101': { title: 'Safeguarding 101 Exam', jsonPath: '/static/data/safeguarding_exam_questions.json', icon: 'fa-user-shield' },
            'ecka-101': { title: 'ECKA 101 Exam', jsonPath: '/static/data/ecka_exam_questions.json', icon: 'fa-khanda' },
            'wako-101': { title: 'WAKO Rules 101 Exam', jsonPath: '/static/data/wako_exam_questions.json', icon: 'fa-user-group' }
        };

        this.config = examConfigs[this.examId] || { title: 'Exam Not Found', jsonPath: null, icon: 'fa-circle-question' };
        this.setTitle(this.config.title);

        // --- Exam State ---
        this.questions = [];
        this.userAnswers = [];
        this.currentQuestionIndex = 0;
        this.examState = 'start'; // 'start', 'active', 'finished'
        this.timerInterval = null;
        this.isPaused = false;
        this.timeLeft = 30 * 60; // 30 minutes for 40 questions
        this.totalQuestions = 40; // We'll take the first 40 questions
    }

    async getHtml() {
        return `
            <div class="two-column-grid">
                <div class="main-content">
                    <div class="exam-container">
                        <!-- Start Screen -->
                        <div id="exam-start-screen" class="content-card">
                            <h2 class="page-title"><i class="fa-solid ${this.config.icon} fa-fw"></i> ${this.config.title}</h2>
                            <p>Welcome to the "${this.config.title}" assessment. This exam is designed to test your knowledge on this subject.</p>
                            <ul>
                                <li><strong>Number of Questions:</strong> ${this.totalQuestions}</li>
                                <li><strong>Time Limit:</strong> ${this.timeLeft / 60} minutes</li>
                                <li><strong>Passing Score:</strong> 75% (Proficient)</li>
                            </ul>
                            <p>Click the button below to begin. The timer will start as soon as you do.</p>
                            <button id="start-exam-btn" class="form-button">Start Exam</button>
                        </div>

                        <!-- Active Exam Screen -->
                        <div id="exam-active-screen" style="display: none;">
                            <div class="exam-header">
                                <div class="exam-progress">
                                    <span>Question <span id="current-q-number">1</span> of ${this.totalQuestions}</span>
                                    <div class="progress-bar-container">
                                        <div id="progress-bar" class="progress-bar"></div>
                                    </div>
                                </div>
                                <div class="exam-timer">
                                    <i class="fa-solid fa-clock"></i>
                                    <span id="timer-display">30:00</span>
                                    <button id="pause-resume-btn" class="timer-control-btn" data-tooltip="Pause Timer">
                                        <i class="fa-solid fa-pause"></i>
                                    </button>
                                </div>
                            </div>
                            <div id="question-container" class="content-card">
                                <!-- Question will be rendered here -->
                            </div>
                            <div class="exam-navigation">
                                <button id="prev-q-btn" class="form-button secondary">Previous</button>
                                <button id="next-q-btn" class="form-button">Next</button>
                                <button id="finish-exam-btn" class="form-button" style="display: none;">Finish Exam</button>
                            </div>
                        </div>

                        <!-- Results Screen -->
                        <div id="exam-results-screen" style="display: none;" class="content-card">
                            <!-- Results will be rendered here -->
                        </div>

                        <!-- Pause Overlay -->
                        <div id="exam-pause-overlay" style="display: none;">
                            <div class="pause-content">
                                <i class="fa-solid fa-pause-circle"></i>
                                <h2>Exam Paused</h2>
                                <p>Your progress is saved. Click the button below to resume.</p>
                                <button id="resume-from-overlay-btn" class="form-button">Resume Exam</button>
                            </div>
                        </div>
                    </div>
                </div>
                ${await RightSidebar.render()}
            </div>

        `;
    }

    async after_render() {
        try {
            const response = await fetch(this.config.jsonPath);
            const allQuestions = await response.json();
            // Shuffle and take the first 40 questions for variety
            this.questions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, this.totalQuestions); // Slice first
            this.totalQuestions = this.questions.length; // Update totalQuestions to reflect actual count
            this.userAnswers = new Array(this.totalQuestions).fill(null);
        } catch (error) {
            console.error("Failed to load exam questions:", error);
            document.getElementById('exam-start-screen').innerHTML = '<h2>Error</h2><p>Could not load exam questions. Please try again later.</p>';
            return;
        }

        const startScreen = document.getElementById('exam-start-screen');
        const activeScreen = document.getElementById('exam-active-screen');
        const startBtn = document.getElementById('start-exam-btn');
        const pauseResumeBtn = document.getElementById('pause-resume-btn');
        const pauseOverlay = document.getElementById('exam-pause-overlay');
        const resumeFromOverlayBtn = document.getElementById('resume-from-overlay-btn');

        const togglePause = () => this.togglePause();

        startBtn.addEventListener('click', () => {
            this.examState = 'active';
            startScreen.style.display = 'none';
            activeScreen.style.display = 'block';
            this.startTimer();
            this.renderQuestion();
        });

        pauseResumeBtn.addEventListener('click', togglePause);
        resumeFromOverlayBtn.addEventListener('click', togglePause);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseResumeBtnIcon = document.getElementById('pause-resume-btn').querySelector('i');
        const pauseOverlay = document.getElementById('exam-pause-overlay');

        if (this.isPaused) {
            clearInterval(this.timerInterval);
            pauseResumeBtnIcon.classList.replace('fa-pause', 'fa-play');
            pauseOverlay.style.display = 'flex';
            console.log('[DEBUG] Exam Paused');
        } else {
            this.startTimer();
            pauseResumeBtnIcon.classList.replace('fa-play', 'fa-pause');
            pauseOverlay.style.display = 'none';
            console.log('[DEBUG] Exam Resumed');
        }
    }

    startTimer() {
        if (this.isPaused) return; // Don't start a new timer if we are just resuming

        const timerDisplay = document.getElementById('timer-display');
        this.timerInterval = setInterval(() => {
            if (this.isPaused) return; // Don't count down if paused

            this.timeLeft--;
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (this.timeLeft <= 0) {
                this.finishExam();
            }
        }, 1000);
    }

    renderQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        const container = document.getElementById('question-container');
        
        let optionsHtml = question.options.map((option, index) => `
            <label class="exam-option">
                <input type="radio" name="q${question.id}" value="${option}" ${this.userAnswers[this.currentQuestionIndex] === option ? 'checked' : ''}>
                <span class="custom-control"></span>
                <span>${option}</span>
            </label>
        `).join('');

        container.innerHTML = `
            <h3 class="content-subheader" style="margin-top:0;">${question.question}</h3>
            <div class="exam-options-container">${optionsHtml}</div>
        `;

        document.getElementById('current-q-number').textContent = this.currentQuestionIndex + 1;
        document.getElementById('progress-bar').style.width = `${((this.currentQuestionIndex + 1) / this.totalQuestions) * 100}%`;

        // Add event listeners for the new radio buttons
        container.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.userAnswers[this.currentQuestionIndex] = e.target.value;
            });
        });

        // Navigation button logic
        document.getElementById('prev-q-btn').style.display = this.currentQuestionIndex === 0 ? 'none' : 'inline-block';
        document.getElementById('next-q-btn').style.display = this.currentQuestionIndex === this.totalQuestions - 1 ? 'none' : 'inline-block';
        document.getElementById('finish-exam-btn').style.display = this.currentQuestionIndex === this.totalQuestions - 1 ? 'inline-block' : 'none';

        document.getElementById('prev-q-btn').onclick = () => this.navigate(-1);
        document.getElementById('next-q-btn').onclick = () => this.navigate(1);
        document.getElementById('finish-exam-btn').onclick = () => this.finishExam();
    }

    navigate(direction) {
        this.currentQuestionIndex += direction;
        this.renderQuestion();
    }

    finishExam() {
        clearInterval(this.timerInterval);
        this.examState = 'finished';

        let score = 0;
        this.questions.forEach((q, index) => {
            if (this.userAnswers[index] === q.correctAnswer) {
                score++;
            }
        });

        const percentage = (score / this.totalQuestions) * 100;
        const passMark = 75;
        const resultStatus = percentage >= passMark ? 'Proficient' : 'Developing';
        const resultClass = percentage >= passMark ? 'proficient' : 'developing';

        const resultsScreen = document.getElementById('exam-results-screen');
        document.getElementById('exam-active-screen').style.display = 'none';
        resultsScreen.style.display = 'block';

        let reviewHtml = this.questions.map((q, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer === q.correctAnswer;
            return `
                <div class="review-question ${isCorrect ? 'correct' : 'incorrect'}">
                    <p><strong>Q${index + 1}: ${q.question}</strong></p>
                    <p>Your answer: <span class="user-answer">${userAnswer || 'Not answered'}</span></p>
                    ${!isCorrect ? `<p>Correct answer: <span class="correct-answer">${q.correctAnswer}</span></p>` : ''}
                    <p class="reference"><em>Reference:</em> ${q.reference}</p>
                </div>
            `;
        }).join('');

        resultsScreen.innerHTML = `
            <h2 class="page-title">Exam Results</h2>
            <div class="results-summary">
                <p>Your Score:</p>
                <div class="final-score">${score} / ${this.totalQuestions} (${percentage.toFixed(0)}%)</div>
                <p>Status: <span class="result-status ${resultClass}">${resultStatus}</span></p>
            </div>
            <h3 class="content-subheader">Review Your Answers</h3>
            <div class="review-container">${reviewHtml}</div>
        `;

        // Simulate saving results to a file
        this.saveResults({
            userName: "Junior Anderson", // Mock user
            date: new Date().toISOString(),
            score: score,
            totalQuestions: this.totalQuestions,
            percentage: percentage,
            status: resultStatus,
            examName: this.config.title // Add exam name to results
        });
    }

    saveResults(resultData) {
        // In a real application, this would be an API call to a backend server.
        // For this mockup, we will just log it to the console and explain.
        console.log("--- Exam Result to be Saved ---");
        console.log(JSON.stringify(resultData, null, 2));
        console.log("NOTE: This result would be sent to a backend server and saved to a database or a secure file. Direct file writing from frontend JavaScript is not possible for security reasons.");
        
        // We can also create a downloadable blob for the user as a demonstration.
        const blob = new Blob([JSON.stringify(resultData, null, 2)], { type: 'application/json' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `${this.examId}_result_${new Date().getTime()}.json`;
        downloadLink.innerHTML = 'Download Your Results';
        downloadLink.classList.add('form-button', 'secondary');
        downloadLink.style.marginTop = '2rem';
        document.querySelector('.results-summary').appendChild(downloadLink);
    }
}