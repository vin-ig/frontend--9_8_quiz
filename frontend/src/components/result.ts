import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import type {DefaultResponseType} from "../types/default-response.type";
import type {PassTestResponseType} from "../types/pass-test-response.type";

export class Result  {
    quizId: number

    constructor() {
        this.quizId = JSON.parse(<string>sessionStorage.getItem('quizId'))

        this.init()
    }

    async init() {
        const userInfo = Auth.getUserInfo()
        if (!this.quizId || !userInfo) {
            location.href = '#/'
            return
        }
        const result: DefaultResponseType | PassTestResponseType = await CustomHttp.request(`${config.host}/tests/${this.quizId}/result?userId=${userInfo.userId}`)

        if (result) {
            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message)
            }

            const resultElement: HTMLElement | null = document.getElementById('result')
            const correctAnswersElement: HTMLElement | null = document.getElementById('correct-answers')

            if (resultElement) {
                resultElement.innerText = `${(result as PassTestResponseType).score}/${(result as PassTestResponseType).total}`
            }

            if (correctAnswersElement) {
                correctAnswersElement.onclick = function () {
                    location.href = '#/answers'
                }
            }
        }
    }
}