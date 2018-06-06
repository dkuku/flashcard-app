import * as R from 'ramda';

const MSGS = {
    ADD_CARD: "ADD_CARD",
    EDIT_CARD: "EDIT_CARD",
    SAVE_CARD: "SAVE_CARD",
    DELETE_CARD: "DELETE_CARD",
    CARD_BAD: "CARD_BAD",
    CARD_GOOD: "CARD_GOOD",
    CARD_GREAT: "CARD_GREAT",
    SHOW_ANSWER_CARD: "SHOW_ANSWER_CARD",
    QUESTION_INPUT_MSG: "QUESTION_INPUT_MSG",
    ANSWER_INPUT_MSG: "ANSWER_INPUT_MSG",

}
export function questionInputMsg(question){
    return {
        type: MSGS.QUESTION_INPUT_MSG,
        question,
    }
}
export function answerInputMsg(answer){
    return {
        type: MSGS.ANSWER_INPUT_MSG,
        answer,
    }
}
export function saveCardMsg(){
    return {
        type: MSGS.SAVE_CARD,

    }
}
export function editCardMsg(editId){
    return {
        type: MSGS.EDIT_CARD,
        editId
    }
}
export function showAnswerCardMsg(answerId){
    return {
        type: MSGS.SHOW_ANSWER_CARD,
        answerId
    }
}
export function cardBadMsg(card){
    return {
        type:MSGS.CARD_BAD,
        card
    }
}
export function cardGoodMsg(card){
    return {
        type:MSGS.CARD_GOOD,
        card
    }
}
export function cardGreatMsg(card){
    return {
        type:MSGS.CARD_GREAT,
        card
    }
}
export function deleteCardMsg(deleteId){
    return {
        type: MSGS.DELETE_CARD,
        deleteId
    }
}
export function addCardMsg(){
    return {
        type: MSGS.ADD_CARD,
    }
}
function update(msg, model) {
    console.log(msg)
    switch ( msg.type ){
        case MSGS.ADD_CARD: {
            return add(model);
        }
        case MSGS.SAVE_CARD: {
            return save(model);
        }
        case MSGS.EDIT_CARD: {
            const {editId} = msg;
            return { ...model, editId }
        }
        case MSGS.SHOW_ANSWER_CARD: {
            const {answerId} = msg;
            return { ...model, answerId }
        }
        case MSGS.DELETE_CARD: {
            const { deleteId } = msg;
            return deleteCard(model, deleteId);
        }
        case MSGS.CARD_BAD: {
            const { card } = msg;
            return bad(model, card)
        }
        case MSGS.CARD_GREAT: {
            const { card } = msg;
            return great(model, card)
        }
        case MSGS.CARD_GOOD: {
            const { card } = msg;
            return good(model, card)
        }
        case MSGS.QUESTION_INPUT_MSG: {
            const { question } = msg;
            return { ...model, question }
        }
        case MSGS.ANSWER_INPUT_MSG: {
            const { answer } = msg;
            return { ...model, answer }
        }
    }
    return model;
}
function add(model){
    const { cards, question, answer, rank, nextId, editId } = model;
    const card = { id: nextId, question, answer, rank };
    return { ...model,
        editId: nextId,
        nextId: nextId + 1,
        cards: [card, ...cards]  }
}
function edit(model){
    const {cards, editId } = model;
    R.find(card => {
        if (card.id === editId){
            const question = card.question;
            const answer = card.answer;
        }
    })(cards);
    return {...model, question, answer}
}
function save(model){
    const { editId, question, answer } = model;
    const cards = R.map(card => {
        if (card.id === editId){
            return {id: editId, question, answer};
        };
        return card
    })(model.cards)
    return { ...model, cards, editId: null, question: "", answer: ''  }
}
function deleteCard(model, deleteId){
    const cards = R.filter(
        card => card.id !== deleteId
        ,model.cards);
    return { ...model, cards }
}
function bad(model, card){
    const restOfCards = deleteCard(model, card.id).cards;
    const cards = [card, ...restOfCards];
    return {...model, cards, answerId: null}
}
function great(model, card){
    const restOfCards = deleteCard(model, card.id).cards;
    const cards = [...restOfCards, card];
    return {...model, cards, answerId: null}
}
function good(model, card){
    if (model.cards.length > 1) {
        const restOfCards = deleteCard(model, card.id).cards;
        console.log(restOfCards)
        const splitPoint = (restOfCards.length/2>>0);
        console.log(splitPoint)
        const halfArrays = R.splitAt(splitPoint, restOfCards);
        console.log(halfArrays)
        const cards = [...halfArrays[0], card, ...halfArrays[1]]
    return {...model, cards, answerId: null}
    }
    return {...model, answerId: null};
}
export default update;
