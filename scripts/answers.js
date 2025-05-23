(function () {
    const Answers = {
        quiz: null,
        correctAnswers: null,
        quizNameElement: null,
        userInfoElement: null,
        answersItemsElement: null,
        init() {
            const quizId = sessionStorage.getItem('quizId')
            if (!quizId) {
                location.href = 'index.html'
                return
            }
            this.quiz = getParsedResponse('https://testologia.ru/get-quiz?id=' + quizId)
            this.correctAnswers = getParsedResponse('https://testologia.ru/get-quiz-right?id=' + quizId)

            // STUB
            // this.quiz = JSON.parse('{"id":2,"name":"\u0422\u0435\u0441\u0442 \u21162. \\"JavaScript: \u041f\u0440\u043e\u0434\u0432\u0438\u043d\u0443\u0442\u044b\u0439 \u0443\u0440\u043e\u0432\u0435\u043d\u044c\\"","questions":[{"id":7,"question":"\u0427\u0442\u043e \u0442\u0430\u043a\u043e\u0435 ECMAScript?","answers":[{"id":27,"answer":"\u041d\u043e\u0432\u044b\u0439 \u044f\u0437\u044b\u043a \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f."},{"id":28,"answer":"\u041f\u0435\u0440\u0435\u0440\u0430\u0431\u043e\u0442\u0430\u043d\u043d\u0430\u044f \u0440\u0435\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f Javascript."},{"id":29,"answer":"\u0421\u043f\u0435\u0446\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044f \u044f\u0437\u044b\u043a\u0430 Javascript."}]},{"id":8,"question":"\u0415\u0441\u0442\u044c \u043b\u0438 \u0440\u0430\u0437\u043d\u0438\u0446\u0430 \u043c\u0435\u0436\u0434\u0443 \u0432\u044b\u0437\u043e\u0432\u0430\u043c\u0438 i++ \u0438 ++i?","answers":[{"id":30,"answer":"\u0420\u0430\u0437\u043d\u0438\u0446\u0430 \u0432 \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0438, \u043a\u043e\u0442\u043e\u0440\u043e\u0435 \u0432\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442 \u0442\u0430\u043a\u043e\u0439 \u0432\u044b\u0437\u043e\u0432."},{"id":31,"answer":"\u0420\u0430\u0437\u043d\u0438\u0446\u0430 \u0432 \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0438 i \u043f\u043e\u0441\u043b\u0435 \u0432\u044b\u0437\u043e\u0432\u0430."},{"id":32,"answer":"\u041d\u0435\u0442 \u043d\u0438\u043a\u0430\u043a\u043e\u0439 \u0440\u0430\u0437\u043d\u0438\u0446\u044b."}]},{"id":9,"question":"\u0412 \u0447\u0435\u043c \u0440\u0430\u0437\u043d\u0438\u0446\u0430 \u043c\u0435\u0436\u0434\u0443 confirm \u0438 prompt?","answers":[{"id":33,"answer":"confirm \u0432\u044b\u0437\u044b\u0432\u0430\u0435\u0442 \u0434\u0438\u0430\u043b\u043e\u0433\u043e\u0432\u043e\u0435 \u043e\u043a\u043d\u043e \u0441 \u043f\u043e\u043b\u0435\u043c \u0434\u043b\u044f \u0432\u0432\u043e\u0434\u0430, prompt - \u043e\u043a\u043d\u043e \u0441 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u0435\u043c"},{"id":34,"answer":"\u041e\u043d\u0438 \u043d\u0438\u0447\u0435\u043c \u043d\u0435 \u043e\u0442\u043b\u0438\u0447\u0430\u044e\u0442\u0441\u044f"},{"id":35,"answer":"prompt \u0432\u044b\u0437\u044b\u0432\u0430\u0435\u0442 \u0434\u0438\u0430\u043b\u043e\u0433\u043e\u0432\u043e\u0435 \u043e\u043a\u043d\u043e \u0441 \u043f\u043e\u043b\u0435\u043c \u0434\u043b\u044f \u0432\u0432\u043e\u0434\u0430, confirm - \u043e\u043a\u043d\u043e \u0441 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u0435\u043c"}]},{"id":10,"question":"\u0420\u0430\u0441\u0448\u0438\u0444\u0440\u0443\u0439\u0442\u0435 \u0430\u0431\u0431\u0440\u0435\u0432\u0438\u0430\u0442\u0443\u0440\u0443 DOM","answers":[{"id":36,"answer":"Document Object Model"},{"id":37,"answer":"Digital Optical Modulation"},{"id":38,"answer":"Domestic Object Mode"}]},{"id":11,"question":"\u041a\u0430\u043a\u0438\u0435 \u043a\u043b\u044e\u0447\u0435\u0432\u044b\u0435 \u0441\u043b\u043e\u0432\u0430 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u044e\u0442\u0441\u044f \u0432 JavaScript \u0434\u043b\u044f \u0442\u043e\u0433\u043e, \u0447\u0442\u043e\u0431\u044b \u043e\u0431\u044a\u044f\u0432\u0438\u0442\u044c \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u0443\u044e?","answers":[{"id":39,"answer":"var, let, const"},{"id":40,"answer":"byte, short, int, long, float"},{"id":41,"answer":"int, short,var"}]}]}')
            // this.correctAnswers = JSON.parse('[28, 39, 31, 35, 38]')

            if (this.quiz && this.correctAnswers) {
                this.showResult()
            } else {
                location.href = 'index.html'
            }
        },
        showResult() {
            this.userInfoElement = document.getElementById('user-info')
            this.answersItemsElement = document.getElementById('answers-items')

            document.getElementById('quiz-name').innerText = this.quiz.name
            this.showUserInfo()
            this.showAnswers()
            document.getElementById('back').onclick = function () {
                location.href = 'result.html'
            }
        },
        showUserInfo() {
            const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            if (!userInfo) { return }
            this.userInfoElement.innerHTML = `Тест выполнил <span class="contrast-color">
                ${userInfo.name} ${userInfo.lastName}, ${userInfo.email}
            </span>`
        },
        showAnswers() {
            const correctAnswers = this.correctAnswers
            const userResult = JSON.parse(sessionStorage.getItem('userResult'))

            this.quiz.questions.forEach((question, index) => {
                const answerItemElement = document.createElement('div')
                answerItemElement.className = 'answers-item'
                const AnswerNameElement = document.createElement('h3')
                AnswerNameElement.innerHTML = `<span class="contrast-color">Вопрос ${index + 1}: </span>${question.question}`
                const listElement = document.createElement('ul')

                const userAnswer = userResult.find(item => item.questionId === question.id)

                question.answers.forEach(answer => {
                    const listItemElement = document.createElement('li')
                    if (answer.id === (userAnswer ? userAnswer.chosenAnswerId : null)) {
                        listItemElement.className = correctAnswers.includes(answer.id) ? 'correct' : 'wrong'
                    }
                    listItemElement.innerText = answer.answer
                    listElement.appendChild(listItemElement)
                })

                answerItemElement.appendChild(AnswerNameElement)
                answerItemElement.appendChild(listElement)
                this.answersItemsElement.appendChild(answerItemElement)
            })
        },
    }

    Answers.init()
})()