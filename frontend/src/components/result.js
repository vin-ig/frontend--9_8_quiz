import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";

export class Result  {
    constructor() {
        this.quizId = JSON.parse(sessionStorage.getItem('quizId'))

        this.init()
    }

    async init() {
        const userInfo = Auth.getUserInfo()
        if (!this.quizId || !userInfo) {
            location.href = '#/'
            return
        }
        const result = await CustomHttp.request(`${config.host}/tests/${this.quizId}/result?userId=${userInfo.userId}`)

        if (result) {
            if (result.error) {
                console.log(result.error)
            }

            document.getElementById('result').innerText = `${result.score}/${result.total}`
            document.getElementById('correct-answers').onclick = function () {
                location.href = '#/answers'
            }
        }
    }
}