import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import type {QuizAnswerType, QuizQuestionType, QuizType} from "../types/quiz.type";
import type {UserResultType} from "../types/user-result.type";
import type {DefaultResponseType} from "../types/default-response.type";
import {ActionTestType} from "../types/action-test.type";
import type {UserInfoType} from "../types/user-info.type";
import type {PassTestResponseType} from "../types/pass-test-response.type";

export class Test {
    private quizId: number | null
    private currentQuestionIndex: number = 0
    private interval: number = 0
    quiz: QuizType | null
    userResult: UserResultType[]
    private questionTitleElement: HTMLElement | null
    private optionsElement: HTMLElement | null
    private progressBarElement: HTMLElement | null
    private prevButtonElement: HTMLElement | null
    private nextButtonElement: HTMLElement | null
    private passButtonElement: HTMLElement | null

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

        this.init().then()
    }

    private async init(): Promise<void> {

        this.quizId = Number(sessionStorage.getItem('quizId'))
        if (!this.quizId) {
            location.href = '#/'
            return
        }

        try {
            const result: DefaultResponseType | QuizType = await CustomHttp.request(config.host + '/tests/' + this.quizId)
            if (result) {
                if ((result as DefaultResponseType).error !== undefined) {
                    throw new Error((result as DefaultResponseType).message)
                }

                this.quiz = result as QuizType
                this.startQuiz()
            }
        } catch (error) {
            console.log(error)
        }
    }

    private startQuiz(): void {
        if (!this.quiz) return

        this.questionTitleElement = document.getElementById('title')
        this.optionsElement = document.getElementById('options')
        this.progressBarElement = document.getElementById('progress-bar')

        this.prevButtonElement = document.getElementById('prev')
        if (this.prevButtonElement) {
            this.prevButtonElement.onclick = this.move.bind(this, ActionTestType.prev)
        }

        this.nextButtonElement = document.getElementById('next')
        if (this.nextButtonElement) {
            this.nextButtonElement.onclick = this.move.bind(this, ActionTestType.next)
        }

        this.passButtonElement = document.getElementById('pass')
        if (this.passButtonElement) {
            this.passButtonElement.onclick = this.move.bind(this, ActionTestType.pass)
        }

        const preTitleElement: HTMLElement | null = document.getElementById('pre-title')
        if (preTitleElement) {
            preTitleElement.innerText = this.quiz.name
        }

        this.prepareProgressBar()
        this.showQuestion()

        const timerElement: HTMLElement | null = document.getElementById('timer')
        let seconds = 180
        const that: Test = this
        if (timerElement) {
            timerElement.innerText = String(seconds)
            this.interval = setInterval(function () {
                timerElement.innerText = String(--seconds)
                if (seconds < 10) {
                    timerElement.style.color = 'red'
                }
                if (seconds === 0) {
                    clearInterval(that.interval)
                    that.complete()
                }
            }.bind(this), 1000)
        }
    }

    private prepareProgressBar(): void {
        if (!this.quiz) return

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

            if (this.progressBarElement) {
                this.progressBarElement.appendChild(itemElement)
            }
        }
    }

    private showQuestion(): void {
        if (!this.quiz) return

        const activeQuestion: QuizQuestionType | undefined = this.quiz.questions[this.currentQuestionIndex]
        if (!activeQuestion) return

        if (this.questionTitleElement) {
            this.questionTitleElement.innerHTML = `<span>Вопрос ${this.currentQuestionIndex + 1}: </span>${activeQuestion.question}`
        }

        if (this.optionsElement) {
            this.optionsElement.innerHTML = ''
        }
        const that: Test = this
        const chosenOption: UserResultType | undefined = this.userResult.find(item => item.questionId === activeQuestion.id)
        if (chosenOption && chosenOption.chosenAnswerId) {
            if (this.passButtonElement) {
                this.disableLink(this.passButtonElement)
            }
        } else if (this.passButtonElement && this.passButtonElement) {
            this.passButtonElement.classList.remove('disabled')
            this.passButtonElement.onclick = this.move.bind(this, ActionTestType.pass)
        }
        activeQuestion.answers.forEach((answer: QuizAnswerType) => {
            const optionElement: HTMLElement | null = document.createElement('div')
            optionElement.className = 'test-question-option'

            const inputId = 'answer' + answer.id
            const inputElement: HTMLInputElement = document.createElement('input')
            inputElement.className = 'option-answer'
            inputElement.setAttribute('id', inputId)
            inputElement.setAttribute('type', 'radio')
            inputElement.setAttribute('name', 'answer')
            inputElement.setAttribute('value', answer.id.toString())
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

            if (this.optionsElement) {
                this.optionsElement.appendChild(optionElement)
            }
        })
        if (this.nextButtonElement) {
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
        }

        if (this.prevButtonElement) {
            if (this.currentQuestionIndex > 0) {
                this.prevButtonElement.removeAttribute('disabled')
            } else {
                this.prevButtonElement.setAttribute('disabled', 'disabled')
            }
        }
    }

    private chooseAnswer(): void {
        if (this.nextButtonElement) {
            this.nextButtonElement.removeAttribute('disabled')
        }

        if (this.passButtonElement) {
            this.disableLink(this.passButtonElement)
        }
    }

    private move(action: ActionTestType): void {
        if (!this.quiz) return

        const activeQuestion: QuizQuestionType | undefined = this.quiz.questions[this.currentQuestionIndex]
        const chosenAnswer: HTMLInputElement | undefined = Array.from(document.getElementsByClassName('option-answer')).find(element => {
            return (element as HTMLInputElement).checked
        }) as HTMLInputElement

        let chosenAnswerId: number | null = null
        if (chosenAnswer && chosenAnswer.value) {
            chosenAnswerId = Number(chosenAnswer.value)
        }

        if (activeQuestion) {
            const existingResult: UserResultType | undefined = this.userResult.find(item => {
                return activeQuestion.id === item.questionId
            })

            if (chosenAnswerId) {
                if (existingResult) {
                    existingResult.chosenAnswerId = chosenAnswerId
                } else {
                    this.userResult.push({
                        questionId: activeQuestion.id,
                        chosenAnswerId: chosenAnswerId,
                    })
                }
            }
        }

        if (action === ActionTestType.next || action === ActionTestType.pass) {
            this.currentQuestionIndex++
        } else {
            this.currentQuestionIndex--
        }

        if (this.currentQuestionIndex > this.quiz.questions.length - 1) {
            clearInterval(this.interval)
            this.complete()
            return
        }


        if (this.progressBarElement) {
            Array.from(this.progressBarElement.children).forEach((item: Element, index: number) => {
                item.classList.remove('complete')
                item.classList.remove('active')

                if (index === this.currentQuestionIndex) {
                    item.classList.add('active')
                } else if (index < this.currentQuestionIndex) {
                    item.classList.add('complete')
                }
            })
        }

        this.showQuestion()
    }

    private async complete(): Promise<void> {
        const userInfo: UserInfoType | null = Auth.getUserInfo()
        if (!userInfo) {
            location.href = '#/'
            return
        }
        const result: DefaultResponseType | PassTestResponseType = await CustomHttp.request(config.host + '/tests/' + this.quizId + '/pass', 'POST', {
            userId: userInfo.userId,
            results: this.userResult,
        })

        if (result) {
            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message)
            }
            location.href = '#/result'
        }
    }

    private disableLink(element: HTMLElement): void {
        element.classList.add('disabled')
        element.onclick = function () {}
    }
}