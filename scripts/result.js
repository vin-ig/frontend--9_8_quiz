(function () {
    const Result = {
        init() {
            const result = JSON.parse(sessionStorage.getItem('result'))

            if (!result) {
                location.href = 'index.html'
                return
            }

            document.getElementById('result').innerText = `${result.score}/${result.total}`
            document.getElementById('correct-answers').onclick = function () {
                location.href = 'answers.html'
            }
        },
    }

    Result.init()
})()