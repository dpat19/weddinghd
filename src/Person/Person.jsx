import React from 'react'
import './Person.css'

const person = (props) => {

    return (
    <div className='Person'>
        <p >I'm a {props.name} and I am {props.age} years old!</p>
        <p>{props.children}</p>
        <input typee="text" onChange={props.changed} value={props.name}/>
    </div>
    )
}





export default person