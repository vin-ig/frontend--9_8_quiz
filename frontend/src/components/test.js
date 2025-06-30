import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Test {
    constructor() {
        this.quizId = null
        this.quiz = null
        this.currentQuestionIndex = 0
        this.questionTitleElement = null
        this.optionsElement = null
        this.progressBarElement = null
        this.prevButtonElement = null
        this.nextButtonElement = null
        this.passButtonElement = null
        this.userResult = []

        this.init()
    }

    async init() {

        this.quizId = sessionStorage.getItem('quizId')
        if (!this.quizId) {
            location.href = '#/'
            return
        }

        try {
            const result = await CustomHttp.request(config.host + '/tests/' + this.quizId)
            if (result) {
                if (result.error) {
                    throw new Error(response.error)
                }
                this.quiz = result
                this.startQuiz()
            }
        } catch (error) {
            console.log(error)
        }
    }

    startQuiz() {
        this.questionTitleElement = document.getElementById('title')
        this.optionsElement = document.getElementById('options')
        this.progressBarElement = document.getElementById('progress-bar')

        this.prevButtonElement = document.getElementById('prev')
        this.prevButtonElement.onclick = this.move.bind(this, 'prev')

        this.nextButtonElement = document.getElementById('next')
        this.nextButtonElement.onclick = this.move.bind(this, 'next')

        this.passButtonElement = document.getElementById('pass')
        this.passButtonElement.onclick = this.move.bind(this, 'pass')

        document.getElementById('pre-title').innerText = this.quiz.name

        this.prepareProgressBar()
        this.showQuestion()

        const timerElement = document.getElementById('timer')
        let seconds = 180
        timerElement.innerText = seconds
        this.interval = setInterval(function () {
            timerElement.innerText = --seconds
            if (seconds < 10) {
                timerElement.style.color = 'red'
            }
            if (seconds === 0) {
                clearInterval(this.interval)
                this.complete()
            }
        }.bind(this), 1000)
    }

    prepareProgressBar() {
        for (let i = 0; i < this.quiz.questions.length; i++) {
            const itemElement = document.createElement('div')
            itemElement.className = 'test-progress-bar-item' + (i === 0 ? ' active' : '')

            const itemCircleElement = document.createElement('div')
            itemCircleElement.className = 'test-progress-bar-item-circle'

            const itemTextElement = document.createElement('div')
            itemTextElement.className = 'test-progress-bar-item-text'
            itemTextElement.innerText = 'Вопрос ' + (i + 1)

            itemElement.appendChild(itemCircleElement)
            itemElement.appendChild(itemTextElement)

            this.progressBarElement.appendChild(itemElement)
        }
    }

    showQuestion() {
        const activeQuestion = this.quiz.questions[this.currentQuestionIndex]
        this.questionTitleElement.innerHTML = `<span>Вопрос ${this.currentQuestionIndex + 1}: </span>${activeQuestion.question}`
        this.optionsElement.innerHTML = ''
        const that = this
        const chosenOption = this.userResult.find(item => item.questionId === activeQuestion.id)
        if (chosenOption && chosenOption.chosenAnswerId) {
            this.disableLink(this.passButtonElement)
        } else {
            this.passButtonElement.classList.remove('disabled')
            this.passButtonElement.onclick = this.move.bind(this, 'pass')
        }
        activeQuestion.answers.forEach(answer => {
            const optionElement = document.createElement('div')
            optionElement.className = 'test-question-option'

            const inputId = 'answer' + answer.id
            const inputElement = document.createElement('input')
            inputElement.className = 'option-answer'
            inputElement.setAttribute('id', inputId)
            inputElement.setAttribute('type', 'radio')
            inputElement.setAttribute('name', answer)
            inputElement.setAttribute('value', answer.id)
            if (chosenOption && chosenOption.chosenAnswerId === answer.id) {
                inputElement.setAttribute('checked', 'checked')
            }

            inputElement.onchange = function () {
                that.chooseAnswer()
            }

            const labelElement = document.createElement('label')
            labelElement.setAttribute('for', inputId)
            labelElement.innerText = answer.answer

            optionElement.appendChild(inputElement)
            optionElement.appendChild(labelElement)

            this.optionsElement.appendChild(optionElement)
        })
        if (chosenOption && chosenOption.chosenAnswerId) {
            this.nextButtonElement.removeAttribute('disabled')
        } else {
            this.nextButtonElement.setAttribute('disabled', 'disabled')
        }

        if (this.currentQuestionIndex === this.quiz.questions.length - 1) {
            this.nextButtonElement.innerText = 'Завершить'
        } else {
            this.nextButtonElement.innerText = 'Дальше'
        }
        if (this.currentQuestionIndex > 0) {
            this.prevButtonElement.removeAttribute('disabled')
        } else {
            this.prevButtonElement.setAttribute('disabled', 'disabled')
        }
    }

    chooseAnswer() {
        this.nextButtonElement.removeAttribute('disabled')
        this.disableLink(this.passButtonElement)
    }

    move(action) {
        const activeQuestion = this.quiz.questions[this.currentQuestionIndex]
        const chosenAnswer = Array.from(document.getElementsByClassName('option-answer')).find(element => {
            return element.checked
        })

        let chosenAnswerId = null
        if (chosenAnswer && chosenAnswer.value) {
            chosenAnswerId = Number(chosenAnswer.value)
        }

        const existingResult = this.userResult.find(item => {
            return item.questionId === activeQuestion.id
        })
        if (existingResult) {
            existingResult.chosenAnswerId = chosenAnswerId
        } else {
            this.userResult.push({
                questionId: activeQuestion.id,
                chosenAnswerId: chosenAnswerId,
            })
        }

        if (action === 'next' || action === 'pass') {
            this.currentQuestionIndex++
        } else {
            this.currentQuestionIndex--
        }

        if (this.currentQuestionIndex > this.quiz.questions.length - 1) {
            clearInterval(this.interval)
            this.complete()
            return
        }

        Array.from(this.progressBarElement.children).forEach((item, index) => {
            item.classList.remove('complete')
            item.classList.remove('active')

            if (index === this.currentQuestionIndex) {
                item.classList.add('active')
            } else if (index < this.currentQuestionIndex) {
                item.classList.add('complete')
            }
        })

        this.showQuestion()
    }

    async complete() {
        const userInfo = Auth.getUserInfo()
        if (!userInfo) {
            location.href = '#/'
        }
        const result = await CustomHttp.request(config.host + '/tests/' + this.quizId + '/pass', 'POST', {
            userId: userInfo.userId,
            results: this.userResult,
        })

        if (result) {
            if (result.error) {
                console.log(result.error)
            }
            location.href = '#/result'
        }
    }

    disableLink(element) {
        element.classList.add('disabled')
        element.onclick = function () {}
    }
}