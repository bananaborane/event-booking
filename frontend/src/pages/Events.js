import React, { Component, Fragment } from "react";

import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import EventList from './../components/Events/EventList/EventList'
import AuthContext from '../context/auth-context'

import "./Events.css";

class EventsPage extends Component {
    state = {
        creating: false,
        events: []
    }

    constructor(props){
        super(props)

        // react references api used below

        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }

    static contextType = AuthContext;

    startCreateEventHandler = () => {
        this.setState({ creating: true })
    }

    componentDidMount(){
        this.fetchEvents();
    }
    
    modalConfirmHandler = () => {
        this.setState({ creating: false })
        const title = this.titleElRef.current.value;
        const price = +this.priceElRef.current.value;
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;


        if (title.trim(). length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0){
            return;
        }

        const event = {title, price, date, description};
        console.log(event)

        const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
                        _id
                        title
                        description
                        date
                        price
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        }

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authrization': 'Bearer ' + token
            }
        })  
        .then(res => {
            if (res.status !== 200 && res.status !== 201){
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            this.fetchEvents(); // rerenders the list of events after submitting a new event
        })
        .catch(err => {
            console.log(err);
        } ); // fetch api takes a second argument (an object) to configure the request
    }
    
    modalCancelHandler = () => {
        this.setState({ creating: false })
    }

    fetchEvents = () => {
        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        date
                        price
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        }

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })  
        .then(res => {
            if (res.status !== 200 && res.status !== 201){
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            const events = resData.data.events;
            this.setState({
                events: events
            })

        })
        .catch(err => {
            console.log(err);
        } ); // fetch api takes a second argument (an object) to configure the request
    }


  render() {

    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />} 
        {this.state.creating && <Modal title="Add Event" canCancel={this.modalCancelHandler} canConfirm={this.modalConfirmHandler} >
            <form>
                <div className='form-control'>
                    <label htmlFor='title'>Title</label>
                    <input type='text' id='title' ref={this.titleElRef}></input>
                </div> 
                <div className='form-control'>
                    <label htmlFor='price'>Price</label>
                    <input type='number' id='price' ref={this.priceElRef}></input>
                </div>
                <div className='form-control'>
                    <label htmlFor='date'>Date</label>
                    <input type='date' id='datetime-local' ref={this.dateElRef}></input>
                </div>
                <div className='form-control'>
                    <label htmlFor='description'>Description</label>
                    <textarea id='description' rows='4' ref={this.descriptionElRef} />
                </div>
            </form>
        </Modal>
    }
            {this.context.token && (<div className="events-control">
                <p>Share your own Events!</p>
                <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
            </div>
            )}
            <ul className='events__list'>
                {eventList}
            </ul>
            <EventList events={this.state.events} />
      </React.Fragment>
      
    );
  }
}

export default EventsPage;
