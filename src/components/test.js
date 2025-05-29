import {UlrManager as UrlManager} from "../utils/ulr-manager.js";

export class Test{
    constructor() {
        this.quiz = null
        this.currentQuestionIndex = 0
        this.questionTitleElement = null
        this.optionsElement = null
        this.progressBarElement = null
        this.prevButtonElement = null
        this.nextButtonElement = null
        this.passButtonElement = null
        this.userResult = []

        UrlManager.checkSessionUserData()
        const quizId = sessionStorage.getItem('quizId')
        if (!quizId) {
            location.href = '#/'
            return
        }
        this.quiz = UrlManager.getParsedResponse('https://testologia.ru/get-quiz?id=' + quizId)

        // STUB
        // this.quiz = JSON.parse('{"id":2,"name":"\u0422\u0435\u0441\u0442 \u21162. \\"JavaScript: \u041f\u0440\u043e\u0434\u0432\u0438\u043d\u0443\u0442\u044b\u0439 \u0443\u0440\u043e\u0432\u0435\u043d\u044c\\"","questions":[{"id":7,"question":"\u0427\u0442\u043e \u0442\u0430\u043a\u043e\u0435 ECMAScript?","answers":[{"id":27,"answer":"\u041d\u043e\u0432\u044b\u0439 \u044f\u0437\u044b\u043a \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f."},{"id":28,"answer":"\u041f\u0435\u0440\u0435\u0440\u0430\u0431\u043e\u0442\u0430\u043d\u043d\u0430\u044f \u0440\u0435\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f Javascript."},{"id":29,"answer":"\u0421\u043f\u0435\u0446\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044f \u044f\u0437\u044b\u043a\u0430 Javascript."}]},{"id":8,"question":"\u0415\u0441\u0442\u044c \u043b\u0438 \u0440\u0430\u0437\u043d\u0438\u0446\u0430 \u043c\u0435\u0436\u0434\u0443 \u0432\u044b\u0437\u043e\u0432\u0430\u043c\u0438 i++ \u0438 ++i?","answers":[{"id":30,"answer":"\u0420\u0430\u0437\u043d\u0438\u0446\u0430 \u0432 \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0438, \u043a\u043e\u0442\u043e\u0440\u043e\u0435 \u0432\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442 \u0442\u0430\u043a\u043e\u0439 \u0432\u044b\u0437\u043e\u0432."},{"id":31,"answer":"\u0420\u0430\u0437\u043d\u0438\u0446\u0430 \u0432 \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0438 i \u043f\u043e\u0441\u043b\u0435 \u0432\u044b\u0437\u043e\u0432\u0430."},{"id":32,"answer":"\u041d\u0435\u0442 \u043d\u0438\u043a\u0430\u043a\u043e\u0439 \u0440\u0430\u0437\u043d\u0438\u0446\u044b."}]},{"id":9,"question":"\u0412 \u0447\u0435\u043c \u0440\u0430\u0437\u043d\u0438\u0446\u0430 \u043c\u0435\u0436\u0434\u0443 confirm \u0438 prompt?","answers":[{"id":33,"answer":"confirm \u0432\u044b\u0437\u044b\u0432\u0430\u0435\u0442 \u0434\u0438\u0430\u043b\u043e\u0433\u043e\u0432\u043e\u0435 \u043e\u043a\u043d\u043e \u0441 \u043f\u043e\u043b\u0435\u043c \u0434\u043b\u044f \u0432\u0432\u043e\u0434\u0430, prompt - \u043e\u043a\u043d\u043e \u0441 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u0435\u043c"},{"id":34,"answer":"\u041e\u043d\u0438 \u043d\u0438\u0447\u0435\u043c \u043d\u0435 \u043e\u0442\u043b\u0438\u0447\u0430\u044e\u0442\u0441\u044f"},{"id":35,"answer":"prompt \u0432\u044b\u0437\u044b\u0432\u0430\u0435\u0442 \u0434\u0438\u0430\u043b\u043e\u0433\u043e\u0432\u043e\u0435 \u043e\u043a\u043d\u043e \u0441 \u043f\u043e\u043b\u0435\u043c \u0434\u043b\u044f \u0432\u0432\u043e\u0434\u0430, confirm - \u043e\u043a\u043d\u043e \u0441 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u0435\u043c"}]},{"id":10,"question":"\u0420\u0430\u0441\u0448\u0438\u0444\u0440\u0443\u0439\u0442\u0435 \u0430\u0431\u0431\u0440\u0435\u0432\u0438\u0430\u0442\u0443\u0440\u0443 DOM","answers":[{"id":36,"answer":"Document Object Model"},{"id":37,"answer":"Digital Optical Modulation"},{"id":38,"answer":"Domestic Object Mode"}]},{"id":11,"question":"\u041a\u0430\u043a\u0438\u0435 \u043a\u043b\u044e\u0447\u0435\u0432\u044b\u0435 \u0441\u043b\u043e\u0432\u0430 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u044e\u0442\u0441\u044f \u0432 JavaScript \u0434\u043b\u044f \u0442\u043e\u0433\u043e, \u0447\u0442\u043e\u0431\u044b \u043e\u0431\u044a\u044f\u0432\u0438\u0442\u044c \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u0443\u044e?","answers":[{"id":39,"answer":"var, let, const"},{"id":40,"answer":"byte, short, int, long, float"},{"id":41,"answer":"int, short,var"}]}]}')

        if (this.quiz) {
            this.startQuiz()
        } else {
            location.href = '#/'
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
        const interval = setInterval(function () {
            timerElement.innerText = --seconds
            if (seconds < 10) {
                timerElement.style.color = 'red'
            }
            if (seconds === 0) {
                clearInterval(interval)
                this.complete()  // STUB
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

    complete() {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        const quizId = sessionStorage.getItem('quizId')

        let xhr = new XMLHttpRequest()
        xhr.open('POST', 'https://testologia.ru/pass-quiz?id=' + quizId, false)
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        xhr.send(JSON.stringify({
            name: userInfo.name,
            lastName: userInfo.lastName,
            email: userInfo.email,
            results: this.userResult
        }))
        // STUB
        // try {
        // } catch {
        //     console.log('Не удалось сделать запрос! Используются статические тестовые данные')
        //     xhr = {
        //         status: 200,
        //         responseText: '{"score": 9, "total" : 9}'
        //     }
        // }

        if (xhr.status === 200 && xhr.responseText) {
            let result = null
            try {
                result = JSON.parse(xhr.responseText)
            } catch (e) {
                location.href = '#/'
            }
            if (result) {
                sessionStorage.setItem('userResult', JSON.stringify(this.userResult))
                sessionStorage.setItem('result', xhr.responseText)
                location.href = '#/result'
            }
        } else {
            location.href = '#/'
        }
    }

    disableLink(element) {
        element.classList.add('disabled')
        element.onclick = function () {}
    }
}