import {UlrManager as UrlManager} from "../utils/ulr-manager.js";

export class Choice {
    constructor () {
        this.quizzes = []
        UrlManager.checkSessionUserData()
        this.quizzes = UrlManager.getParsedResponse('https://testologia.ru/get-quizzes')

        // STUB
        // this.quizzes = JSON.parse('[{"id":1,"name":"\u0422\u0435\u0441\u0442 \u21161. \\"JavaScript: \u041d\u0430\u0447\u0430\u043b\u044c\u043d\u044b\u0439 \u0443\u0440\u043e\u0432\u0435\u043d\u044c\\""},{"id":2,"name":"\u0422\u0435\u0441\u0442 \u21162. \\"JavaScript: \u041f\u0440\u043e\u0434\u0432\u0438\u043d\u0443\u0442\u044b\u0439 \u0443\u0440\u043e\u0432\u0435\u043d\u044c\\""},{"id":3,"name":"\u0422\u0435\u0441\u0442 \u21163. \\"JavaScript: \u041f\u0440\u043e\u0444\u0435\u0441\u0441\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0439 \u0443\u0440\u043e\u0432\u0435\u043d\u044c\\""}]')

        if (this.quizzes) {
            this.processQuizzes()
        } else {
            location.href = '#/'
        }

    }

    processQuizzes() {
        const choiceOptionsElement = document.getElementById('choice-options')
        if (!this.quizzes || !this.quizzes.length > 0) {return}
        this.quizzes.forEach(quiz => {
            const that = this
            const choiceOptionElement = document.createElement('div')
            choiceOptionElement.className = 'choice-option'
            choiceOptionElement.setAttribute('data-id', quiz.id)
            choiceOptionElement.onclick = function() {
                that.chooseQuiz(this)
            }

            const choiceOptionTextElement = document.createElement('div')
            choiceOptionTextElement.className = 'choice-option-text'
            choiceOptionTextElement.innerText = quiz.name

            const choiceOptionArrowElement = document.createElement('div')
            choiceOptionArrowElement.className = 'choice-option-arrow'

            const choiceOptionImageElement = document.createElement('img')
            choiceOptionImageElement.setAttribute('src', 'images/arrow.png')
            choiceOptionImageElement.setAttribute('alt', 'Стрелка')

            choiceOptionArrowElement.appendChild(choiceOptionImageElement)
            choiceOptionElement.appendChild(choiceOptionTextElement)
            choiceOptionElement.appendChild(choiceOptionArrowElement)

            choiceOptionsElement.appendChild(choiceOptionElement)
        })
    }

    chooseQuiz(element) {
        const dataId = element.getAttribute('data-id')
        if (dataId) {
            sessionStorage.setItem('quizId', dataId)
            location.href = '#/test'
        }
    }
}