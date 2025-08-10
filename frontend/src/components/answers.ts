import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import type {QuizType} from "../types/quiz.type";
import type {DetailResultAnswerType, DetailResultQuestionType, DetailResultType} from "../types/detail-result.type";
import type {UserInfoType} from "../types/user-info.type";
import type {DefaultResponseType} from "../types/default-response.type";

export class Answers {
    quiz: QuizType | null
    detailResult: DetailResultType | null
    quizNameElement: HTMLElement | null
    userInfoElement: HTMLElement | null
    answersItemsElement: HTMLElement | null
    quizId: number
    userInfo: UserInfoType | null

    constructor() {
        this.quiz = null
        this.detailResult = null
        this.quizNameElement = null
        this.userInfoElement = null
        this.answersItemsElement = null
        this.quizId = Number(sessionStorage.getItem('quizId'))
        this.userInfo = Auth.getUserInfo()
        if (!this.quizId || !this.userInfo) {
            location.href = '#/'
            return
        }

        this.init().then()
    }

    private async init(): Promise<void> {
        try {
            const result: DefaultResponseType | DetailResultType = await CustomHttp.request(`${config.host}/tests/${this.quizId}/result/details?userId=${(this.userInfo as UserInfoType).userId}`)
            if (result) {
                if ((result as DefaultResponseType).error !== undefined) {
                    throw new Error((result as DefaultResponseType).message)
                }
                this.detailResult = result as DetailResultType
                this.showResult()
            }
        } catch (error) {
            console.log(error)
        }
    }

    private showResult(): void {
        this.userInfoElement = document.getElementById('user-info')
        this.answersItemsElement = document.getElementById('answers-items')
        const quizName: HTMLElement | null  = document.getElementById('quiz-name')
        const backButton: HTMLElement | null  = document.getElementById('back')

        if (quizName && this.detailResult) {
            quizName.innerText = this.detailResult.test.name
        }

        this.showUserInfo()
        this.showAnswers()

        if (backButton) {
            backButton.onclick = function () {
                location.href = '#/result'
            }
        }
    }

    private showUserInfo(): void {
        if (this.userInfoElement) {
            this.userInfoElement.innerHTML = `Тест выполнил <span class="contrast-color">
                ${(this.userInfo as UserInfoType).fullName}, ${(this.userInfo as UserInfoType).email}
            </span>`
        }
    }

    showAnswers() {
        (this.detailResult as DetailResultType).test.questions.forEach((question: DetailResultQuestionType, index: number) => {
            const answerItemElement = document.createElement('div')
            answerItemElement.className = 'answers-item'
            const AnswerNameElement = document.createElement('h3')
            AnswerNameElement.innerHTML = `<span class="contrast-color">Вопрос ${index + 1}: </span>${question.question}`
            const listElement = document.createElement('ul')

            question.answers.forEach((answer: DetailResultAnswerType) => {
                const listItemElement = document.createElement('li')

                listItemElement.innerText = answer.answer
                if (answer.hasOwnProperty('correct')) {
                    listItemElement.className = answer.correct  ? 'correct' : 'wrong'
                }
                listElement.appendChild(listItemElement)
            })

            answerItemElement.appendChild(AnswerNameElement)
            answerItemElement.appendChild(listElement)
            if (this.answersItemsElement) {
                this.answersItemsElement.appendChild(answerItemElement)
            }
        })
    }
}