(function () {
    const Answers = {
        init() {
            const url = new URL(location.href)
            // const score = url.searchParams.get('score')
            // const total = url.searchParams.get('total')
            //
            // if (!score || !total) {
            //     location.href = 'index.html'
            //     return
            // }

            // document.getElementById('result').innerText = `${score}/${total}`
        },
    }

    Answers.init()
})()