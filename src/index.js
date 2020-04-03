import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { createLogger } from 'redux-logger';
import { v4 as uuidv4 } from 'uuid';
import './index.css';

const CONTACT_ADD = 'CONTACT_ADD';

// set up initial state

const initialState = [
	{
		name: 'George Mayer',
		id: 0
	},
	{
		name: 'Mike Dempsey',
		id: 1
	},
	{
		name: 'Camilla Johnson',
		id: 2
	}
]

function contactReducer(state = initialState, action) {
	switch(action.type) {
		case CONTACT_ADD : {
			return applyAddContact(state, action)
		}
		default : return state;
	}
}

function applyAddContact(state, action) {
	const contact = Object.assign({}, action.contact);
	return state.concat(contact);
}

function doAddContact(id, name) {
	return {
		type: CONTACT_ADD,
		contact:  { id, name }
	}
}

// store

const rootReducer = combineReducers({
	contactState: contactReducer,
})

const logger = createLogger();

const store = createStore(rootReducer, undefined, applyMiddleware(logger));

// view layer

function ContactApp() {
	return (
		<div>
		<ConnectedContactCreate />
		<ConnectedContactList />
		</div>
		)
}

function ContactList({ contacts }) {
	return (
		<div>
		{contacts.map(contact => (
			<div key={contact.id}>
				<p>{contact.name}</p>
			</div>
			))}
		</div>
		)
}

class ContactCreate extends React.Component {
	constructor(props) {
		super (props);

		this.state = {
			value: '',
		}

		this.onCreateContact = this.onCreateContact.bind(this);
		this.onChangeContact = this.onChangeContact.bind(this);
	}

	onChangeContact(event) {
		this.setState({ value: event.target.value })
	}

	onCreateContact(event) {
		this.props.onAddContact(this.state.value);
		this.setState({ value: '' });
		event.preventDefault();
	}

	render() {
		return (
			<div>
				<form onSubmit={this.onCreateContact}>
					<input
						type="text"
						placeholder="Add Contact..."
						value={this.state.value}
						onChange={this.onChangeContact}
					/>
					<button type="submit">Add</button>
				</form>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		contacts: state.contactState,
	};
}

function mapDispatchToPropsCreate(dispatch) {
	return {
		onAddContact: name => dispatch(doAddContact(uuidv4(), name))
	}
}

const ConnectedContactList = connect(mapStateToProps)(ContactList);
const ConnectedContactCreate = connect(null, mapDispatchToPropsCreate)(ContactCreate);

ReactDOM.render(
	<Provider store={store}>
		<ContactApp />
	</Provider>,
	document.getElementById('root')
);
