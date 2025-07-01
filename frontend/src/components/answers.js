import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Answers {
    constructor() {
        this.quiz = null
        this.detailResult = null
        this.quizNameElement = null
        this.userInfoElement = null
        this.answersItemsElement = null
        this.quizId = sessionStorage.getItem('quizId')
        this.userInfo = Auth.getUserInfo()
        if (!this.quizId || !this.userInfo) {
            location.href = '#/'
            return
        }

        this.init()
    }

    async init() {
        try {
            const result = await CustomHttp.request(`${config.host}/tests/${this.quizId}/result/details?userId=${this.userInfo.userId}`)
            if (result) {
                if (result.error) {
                    throw new Error(result.error)
                }
                this.detailResult = result
                this.showResult()
            }
        } catch (error) {
            console.log(error)
        }
    }

    showResult() {
        this.userInfoElement = document.getElementById('user-info')
        this.answersItemsElement = document.getElementById('answers-items')

        document.getElementById('quiz-name').innerText = this.detailResult.test.name
        this.showUserInfo()
        this.showAnswers()
        document.getElementById('back').onclick = function () {
            location.href = '#/result'
        }
    }

    showUserInfo() {
        this.userInfoElement.innerHTML = `Тест выполнил <span class="contrast-color">
            ${this.userInfo.fullName}, ${this.userInfo.email}
        </span>`
    }

    showAnswers() {
        this.detailResult.test.questions.forEach((question, index) => {
            const answerItemElement = document.createElement('div')
            answerItemElement.className = 'answers-item'
            const AnswerNameElement = document.createElement('h3')
            AnswerNameElement.innerHTML = `<span class="contrast-color">Вопрос ${index + 1}: </span>${question.question}`
            const listElement = document.createElement('ul')

            question.answers.forEach(answer => {
                const listItemElement = document.createElement('li')

                listItemElement.innerText = answer.answer
                if (answer.hasOwnProperty('correct')) {
                    listItemElement.className = answer.correct  ? 'correct' : 'wrong'
                }
                listElement.appendChild(listItemElement)
            })

            answerItemElement.appendChild(AnswerNameElement)
            answerItemElement.appendChild(listElement)
            this.answersItemsElement.appendChild(answerItemElement)
        })
    }
}