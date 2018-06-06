import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import {
    addCardMsg,
    saveCardMsg,
    editCardMsg,
    showAnswerCardMsg,
    deleteCardMsg,
    cardBadMsg,
    cardGoodMsg,
    cardGreatMsg,
    questionInputMsg,
    answerInputMsg,
} from './Update'

const { pre, div, h1, button, i, a, textarea, input, label, form } = hh(h);

function addButton(dispatch, model){
    return div({className: ''}, [
        button({
            className: 'pa2 br1 mv2 bg-green bn white',
            onclick: () => dispatch(addCardMsg()),
        }, [
            i({className: 'fa fa-plus ph1'}),
            "Add Flashcard",
        ])
    ])
}

function displayCards(dispatch, model){
    return div({className: 'flex flex-wrap nl-2 nr-2'},
        cardArrayToDisplay(dispatch, model)
    )
}
function cardArrayToDisplay(dispatch, model){
    const { editId, answerId } = model;
    return R.map(card => {
        return div({className:"w-third pa2"},[
            ChooseCardTypeToDisplay(dispatch, card, editId, answerId)
            ]
        )
    })(model.cards);

}
function ChooseCardTypeToDisplay(dispatch ,card, editId, answerId){
    if (card.id === editId){
        return editCard(dispatch, card)
    }
    if (card.id === answerId){
        return openCard(dispatch, card)
    }
    return closedCard(dispatch, card)
}
function closedCard(dispatch, card){
    const { question, answer, id } = card
    return div({
        className:"w-100 pa2 bg-light-yellow shadow-1 mv2 relative pb5"
    },[
        div({},[
            div({className: 'b f6 mv1 underline'},[
                "Question"
            ]),
            a({className: 'pointer block',
                onclick: ()=>dispatch(editCardMsg(id)),
            },[
                question
            ]),
        ]),
        div({}, [
            a(
                {
                    className: " f6 underline link pointer",
                    onclick: ()=>dispatch(showAnswerCardMsg(id)),
                }
                , "Show Answer")
        ]),
        a({ onclick: () => dispatch(deleteCardMsg(id)) },[
            i({
                className: ' absolute top-0 right-0 fa fa-remove fa-fw black-50 pointer'},
            )]),
    ])

}
function openCard(dispatch, card){
    const { question, answer, id } = card
    return div({
        className:"w-100 pa2 bg-light-yellow shadow-1 mv2 relative pb5"
    },[
        div({},[
            div({className: 'b f6 mv1 underline'},[
                "Question"
            ]),
            div({className: 'pointer'},[
                question
            ]),
        ]),
        div({},[
            div({className: 'b f6 mv1 underline'},[
                "Answer"
            ]),
            div({className: 'pointer'},[
                answer
            ]),
            rankButtons(dispatch, card),
        ]),
        a({ onclick: () => dispatch(deleteCardMsg(id)) },[
            i({
                className: ' absolute top-0 right-0 fa fa-remove fa-fw black-50 pointer'},
            )]),
    ])

}
function rankButtons(dispatch, card){
    return div({ className: "absolute bottom-0 left-0 w-100 ph2"},[
        div({ className:"mv2 flex justify-between"},[
            button({
                className: ' f4 ph3 pv2 bg-red bn white br1',
                onclick: e => dispatch(cardBadMsg(card)),
            }
                , "Bad"),
            button({
                className: ' f4 ph3 pv2 bg-blue bn white br1',
                onclick: e => dispatch(cardGoodMsg(card)),
            }
                , "Good"),
            button({
                className: ' f4 ph3 pv2 bg-dark-green bn white br1',
                onclick: e => dispatch(cardGreatMsg(card)),
            }
                , "Great"),
        ])
    ])
}

function fieldSet(labelText, inputValue, oninput){
    return  div({}, [
        label({className: 'b f6 mv1'}, labelText),
        textarea(
            {
                className: ' w-100 bg-washed-yellow outline-0',
                value: inputValue,
                oninput,
            },[])
    ])
}
function editCard(dispatch, card){
    const { id, question, answer } = card
    return form({
        className: "w-100 pa2 bg-light-yellow mv2 shadow-1 relative",
        onsubmit:e =>{
            e.preventDefault();
            dispatch(saveCardMsg());
        }
    },[
        fieldSet("Question",
            question,
            e => dispatch(questionInputMsg(e.target.value))),
        fieldSet("Answer",
            answer,
            e => dispatch(answerInputMsg(e.target.value))),
        button({
            className: "f4 ph3 pv2 br1 bg-gray bn white mv2",
            type: 'submit'
        },[
            "Save",
            i({className: 'absolute top-0 right-0 fa fa-remove fa-fw black-50 pointer'})
        ])

    ])
}

function view(dispatch, model) {
    return div({ className: 'mw8 center' }, [
        h1({ className: 'f2 pv2 bb' }, 'Flashcard Study'),
        addButton(dispatch, model),
        displayCards(dispatch, model),
    ]);
}

export default view;
