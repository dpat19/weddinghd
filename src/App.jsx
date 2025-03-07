import React,{ Component } from 'react'
import Person from './Person/Person'
import './App.css'


class App extends Component{
  state = {
    persons:[
      {name:'Max',age :28},
      {name: 'Maxi ' , age:29},
      {name: 'MACDcd', age :29}
    ]
  }


  switchNameHandler =  (newName) =>{
    console.log('Was Clicked');
    this.setState({
      persons:[
        {name:newName,age :28},
        {name: 'Maxi ' , age:29},
        {name: 'MACDcsdfdsd', age :239}
      ]
    })
  }

  nameChangedHandler = (event) => {
    this.setState({
      persons:[
        {name:'Max',age :28},
        {name: event.target.value , age:29},
        {name: 'MACDcsdfdsd', age :239}
      ]
    })
  }
  
  
  
  render(){
    const style = {
      backgroundColor: 'white',
      font : 'inherit',
      border : '1px solid blue',
      padding: '8px',
      cursor: 'pointer'
    }
    return(
      <div className="App" >
      <h1> I Ma react</h1>
      <p>Thus is good</p>

      <button 
      style={style}
      onClick={()=>this.switchNameHandler('Dhruv!!!!')}>
        Switch Name
      </button>

      <Person 
        name= {this.state.persons[0].name} 
        age={this.state.persons[0].age}></Person>
      <Person 
        name= {this.state.persons[1].name} 
        age={this.state.persons[1].age}
        click={this.switchNameHandler.bind(this,'hdsjfhdjsk')}
        changed ={this.nameChangedHandler}>My Hobbies: Racing
        </Person>
      <Person 
        name= {this.state.persons[2].name} 
        age={this.state.persons[2].age}></Person>
      </div>
    );
  }
}




export default App
