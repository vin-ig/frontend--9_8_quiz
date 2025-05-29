export class Result  {
    constructor() {
        const result = JSON.parse(sessionStorage.getItem('result'))

        if (!result) {
            location.href = '#/'
            return
        }

        document.getElementById('result').innerText = `${result.score}/${result.total}`
        document.getElementById('correct-answers').onclick = function () {
            location.href = '#/answers'
        }
    }
}