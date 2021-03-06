import React, { Component } from 'react';
import {Button, Form, FormControl, FormGroup, ControlLabel, Checkbox, Radio} from 'react-bootstrap';
import Linkify from 'react-linkify';
import axios from 'axios';

require('./FillFormView.scss')

const theCheckbox = {
    he: "אני מאשר שקראתי ואני מסכים לתנאים",
    en: "I have read and accept the terms and conditions"
}

export default class FillFormView extends Component {
    constructor(props) {
        super(props);
        this.initState();
    }

    initState = _ => {
        const answers = this.props.questions && this.props.questions.map(question => ({
            ...question,
            answer: null
        }))
        this.state = { 
            questions: answers,
            showTheCheckbox: this.props.showTheCheckbox,
            theCheckbox: false,
        }
    }

    theCheckboxChange = event => {
        this.state.theCheckbox = event.target.checked;
        this.setState(this.state);
    }

    handleTextChange = event => {
        const id = event.target.id;
        const index = id.substring(3);
        const question = this.state.questions[index];
        question.answer = event.target.value;
        this.setState(this.state);
    }

    handleCheckboxChange = index => event => {
        const question = this.state.questions[index];
        question.answer = event.target.checked;
        this.setState(this.state);
    }

    handleSelectionChange = index => event => {
        const question = this.state.questions[index];
        question.answer = event.target.value;
        this.setState(this.state);
    }

    handleMulSelectionChange = index => event => {
        const question = this.state.questions[index];
        const isChecked = event.target.checked;
        const value = event.target.value;

        question.answer = question.answer ? question.answer : [];
        if (isChecked) {
            question.answer.push(value);
        } else {
            const elementIndex = question.answer.indexOf(value);
            if (elementIndex > -1) {
                question.answer.splice(elementIndex, 1);
            }
        }
        question.answer = question.answer.length > 0 ? question.answer : null;
        this.setState(this.state);
    }

    submit = form => {
        const elements = form.elements;
        const answers = this.state.questions.map((question ,index) => ({
            question: question.question[this.props.language],
            questionType: question.questionType,
            answer: question.answer
        }))
        this.props.onAnswer(answers)   
    }

    isValid = () => {
        if (this.state.showTheCheckbox && !this.state.theCheckbox) {
            return false;
        }
        for (let i=0; i<this.state.questions.length; i++) {
            if (!this.state.questions[i].answer && !this.state.questions[i].optional) {
                return false;
            }
        }
        return true;
    }

    render(){
        const language = this.props.language;
        const rtl = language === 'he';
        const isValid = this.isValid();

        return (
            <div className="fill-form-view">
                <Form>
                    {this.state.questions && this.state.questions.map((question, index) => 
                        <Linkify key={`question-${index}`} properties={{target: '_blank'}}>
                            <div  className={rtl ? 'rtl' : ''}>
                                {question.questionType === 'text' && (
                                    <FormGroup controlId={`id-${index}`}>
                                        <ControlLabel>{question.question[language]}</ControlLabel>
                                        <FormControl onChange={this.handleTextChange}/>
                                    </FormGroup>
                                )}
                                {question.questionType === 'textarea' && (
                                    <FormGroup controlId={`id-${index}`}>
                                        <ControlLabel>{question.question[language]}</ControlLabel>
                                        <FormControl componentClass="textarea" onChange={this.handleTextChange}/>
                                    </FormGroup>
                                )}
                                {question.questionType === 'checkbox' && (
                                    <FormGroup controlId={`id-${index}`}>
                                        <Checkbox inline onChange={this.handleCheckboxChange(index)}><b>{question.question[language]}</b></Checkbox>
                                    </FormGroup>
                                )}
                                {question.questionType === 'radio' && (
                                    <FormGroup controlId={`id-${index}`}>
                                        <ControlLabel>{question.question[language]}</ControlLabel>
                                        {question.options.map((option, optionIndex) =>
                                            <Radio name={`radio-${index}`} onChange={this.handleSelectionChange(index, optionIndex)} 
                                                value={option[language]} key={optionIndex}><span>{option[language]}</span></Radio>
                                        )}
                                    </FormGroup>
                                )}
                                {question.questionType === 'checkboxes' && (
                                    <FormGroup controlId={`id-${index}`}>
                                        <ControlLabel>{question.question[language]}</ControlLabel>
                                        {question.options.map((option, optionIndex) =>
                                            <Checkbox key={optionIndex} onChange={this.handleMulSelectionChange(index)}
                                                value={option[language]}><span>{option[language]}</span></Checkbox>
                                        )}
                                    </FormGroup>
                                )}
                            </div>
                        </Linkify>
                    )}
                    {this.state.showTheCheckbox &&
                        <div className={rtl ? 'rtl' : ''}>
                            <FormGroup controlId="the-checkbox">
                                <Checkbox inline onChange={this.theCheckboxChange}><a href="/terms.html" target="_blank"><b>{theCheckbox[language]}</b></a></Checkbox>
                            </FormGroup>
                        </div>
                    }
                    <div className='button-container'>
                        <Button className="send" bsStyle="success" disabled={!isValid}
                            onClick={this.submit}>Send</Button>
                    </div>
                </Form>
            </div>
        )
    }
}