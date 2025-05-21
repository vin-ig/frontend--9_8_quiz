(function () {
    const Answers = {
        quiz: null,
        correctAnswers: null,
        quizNameElement: null,
        userInfoElement: null,
        answersItemsElement: null,
        init() {
            const quiz = sessionStorage.getItem('quiz')
            if (!quiz) {
                location.href = 'index.html'
                return
            }
            this.quiz = JSON.parse(quiz)

            // STUB
            // const xhr = new XMLHttpRequest()
            // xhr.open('GET', 'https://testologia.ru/get-quiz?id=' + testId, false)
            // xhr.send()

            // TOREMOVE
            const xhr = {
                status: 200,
                responseText: '[8, 11]'
            }

            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.correctAnswers = JSON.parse(xhr.responseText)
                } catch (e) {
                    location.href = 'index.html'
                }
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
                    if (answer.id === userAnswer.chosenAnswerId) {
                        listItemElement.className = correctAnswers.includes(question.id) ? 'correct' : 'wrong'
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