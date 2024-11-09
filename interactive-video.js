// Select video and question elements
const video = document.getElementById('myVideo');
const questionContainer = document.getElementById('questionContainer');
const questionText = document.getElementById('questionText');
const answerForm = document.getElementById('answerForm');
const resultsContainer = document.getElementById('resultsContainer');
const resultsList = document.getElementById('resultsList');

// Define questions with time markers
const questions = [
    {
        time: 7,
        question: "What is the answer to question 1?",
        options: { A: "Option 1", B: "Option 2", C: "Option 3" },
        correctAnswer: "B"
    },
    {
        time: 14,
        question: "What is the answer to question 2?",
        options: { A: "Option A", B: "Option B", C: "Option C" },
        correctAnswer: "C"
    }
    // Add more questions as needed
];

let currentQuestionIndex = 0;

// Check the video time and pause at question times
video.ontimeupdate = function() {
    if (currentQuestionIndex < questions.length && Math.floor(video.currentTime) === questions[currentQuestionIndex].time) {
        pauseForQuestion(questions[currentQuestionIndex]);
    }
};

function pauseForQuestion(questionObj) {
    // Pause the video and show the question
    video.pause();
    questionContainer.style.display = 'block';
    questionText.textContent = questionObj.question;
    document.getElementById('labelA').textContent = questionObj.options.A;
    document.getElementById('labelB').textContent = questionObj.options.B;
    document.getElementById('labelC').textContent = questionObj.options.C;
}

function submitAnswer() {
    // Get selected answer
    const selectedAnswer = answerForm.elements['answer'].value;
    
    if (!selectedAnswer) {
        alert("Please select an answer!");
        return;
    }

    // Save answer in local storage
    const questionObj = questions[currentQuestionIndex];
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers')) || [];
    userAnswers.push({
        question: questionObj.question,
        selectedAnswer: selectedAnswer,
        correctAnswer: questionObj.correctAnswer,
        isCorrect: selectedAnswer === questionObj.correctAnswer
    });
    localStorage.setItem('userAnswers', JSON.stringify(userAnswers));

    // Hide question and resume video
    questionContainer.style.display = 'none';
    answerForm.reset();
    currentQuestionIndex++;
    
    // If there are more questions, continue the video; otherwise, show results
    if (currentQuestionIndex < questions.length) {
        video.play();
    } else {
        showResults();
    }
}

function showResults() {
    // Stop video and hide video controls
    video.pause();
    video.controls = false;

    // Retrieve answers from local storage
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers')) || [];

    // Display results
    resultsContainer.style.display = 'block';
    userAnswers.forEach((answer, index) => {
        const resultItem = document.createElement('li');
        resultItem.textContent = `Question ${index + 1}: ${answer.question} - Your answer: ${answer.selectedAnswer} - ${answer.isCorrect ? "Correct" : "Incorrect"}`;
        resultsList.appendChild(resultItem);
    });
}
