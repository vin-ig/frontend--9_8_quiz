import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import type {QuizListType} from "../types/quiz-list.type";
import type {TestResultType} from "../types/test-result.type";
import type {UserInfoType} from "../types/user-info.type";
import type {DefaultResponseType} from "../types/default-response.type";

export class Choice {
    private quizzes: QuizListType[] = []
    private testResults: TestResultType[] = []

    constructor() {
        this.init()
    }

    private async init(): Promise<void> {
        try {
            this.quizzes = await CustomHttp.request(config.host + '/tests')
        } catch (error) {
            console.log(error)
            return
        }

        const userInfo: UserInfoType | null = Auth.getUserInfo()
        if (userInfo) {
            try {
                const result: TestResultType[] | DefaultResponseType = await CustomHttp.request(`${config.host}/tests/results?userId=${userInfo.userId}`)
                if (result) {
                    if ((result as DefaultResponseType).error !== undefined) {
                        throw new Error((result as DefaultResponseType).message)
                    }

                    this.testResults = result as TestResultType[]
                }
            } catch (error) {
                return console.log(error)
            }
        }
        this.processQuizzes()
    }

    private processQuizzes(): void {
        const choiceOptionsElement: HTMLElement | null = document.getElementById('choice-options')
        if (!this.quizzes || this.quizzes.length === 0 || !choiceOptionsElement) {
            return
        }
        this.quizzes.forEach((quiz: QuizListType) => {
            const that: Choice = this
            const choiceOptionElement: HTMLElement = document.createElement('div')
            choiceOptionElement.className = 'choice-option'
            choiceOptionElement.setAttribute('data-id', quiz.id.toString())
            choiceOptionElement.onclick = function () {
                that.chooseQuiz(<HTMLElement>this)
            }

            const choiceOptionTextElement: HTMLElement = document.createElement('div')
            choiceOptionTextElement.className = 'choice-option-text'
            choiceOptionTextElement.innerText = quiz.name

            const choiceOptionArrowElement: HTMLElement = document.createElement('div')
            choiceOptionArrowElement.className = 'choice-option-arrow'

            const result: TestResultType | undefined = this.testResults.find(item => item.testId === quiz.id)
            if (result) {
                const choiceOptionResultElement: HTMLElement = document.createElement('div')
                choiceOptionResultElement.className = 'choice-option-result'
                choiceOptionResultElement.innerHTML = `
                    <div>Результат</div>
                    <div>${result.score} / ${result.total}</div>
                `
                choiceOptionElement.appendChild(choiceOptionResultElement)
            }

            const choiceOptionImageElement: HTMLElement = document.createElement('img')
            choiceOptionImageElement.setAttribute('src', 'images/arrow.png')
            choiceOptionImageElement.setAttribute('alt', 'Стрелка')

            choiceOptionArrowElement.appendChild(choiceOptionImageElement)
            choiceOptionElement.appendChild(choiceOptionTextElement)
            choiceOptionElement.appendChild(choiceOptionArrowElement)

            choiceOptionsElement.appendChild(choiceOptionElement)
        })
    }

    private chooseQuiz(element: HTMLElement): void {
        const dataId: string | null = element.getAttribute('data-id')
        if (dataId) {
            sessionStorage.setItem('quizId', dataId)
            location.href = '#/test'
        }
    }
}