import React from 'react';
import classes from './Input.module.scss';

const Input=(props)=>{
let inputClasses=[classes.Input];
let inputElement=null;
let label=null;

if(props.label){
    label=<label htmlFor={props.id}>{props.label}</label>;
}
!props.valid?inputClasses.push(classes.Invalid):inputClasses.push(classes.Valid);
props.touched?inputClasses.push(classes.Touched):inputClasses.push(classes.Untouched);

if(props.control==='input'){
   inputElement=<input
        className={inputClasses.join(' ')}
        type={props.type}
        id={props.id}
        required={props.required}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        onBlur={props.onBlur}
    />
}else if(props.control==='textarea'){
inputElement= <textarea
    className={inputClasses.join(' ')}
    id={props.id}
    rows={props.rows}
    required={props.required}
    value={props.value}
    onChange={props.onChange}
    onBlur={props.onBlur}
/>
}


return(
    <div className={classes.Input}>
        {label}
        {inputElement}
    </div>
);
};

export default Input;