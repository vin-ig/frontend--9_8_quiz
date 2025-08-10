export type DetailResultType = {
    test: {
        id: number,
        name: string,
        questions: DetailResultQuestionType[],
    }
}

export type DetailResultQuestionType = {
    id: number,
    question: string,
    answers: DetailResultAnswerType[]
}

export type DetailResultAnswerType = {
    id: number,
    answer: string,
    correct?: boolean,
}
