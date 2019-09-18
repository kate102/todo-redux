import { link } from "fs";
import { connect } from 'react-redux';
const { combineReducers } = Redux;
const todoApp = combineReducers({
  todos,
  visibilityFilter
});


const { Component } = React;

// The link component now only 
// specifies how the linke loks wheethere it is active ot inactive


const todo = (state, action) => {

}

// KM This is a reducer
const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
        return state.map(t =>
          todo(t, action)
      );
    default:
      return state;
  }
}

// Visibility Reducer
const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}











const Link = ({
  active,
  children,
  onClick
}) => {
  if (active) {
    return <span>{children}</span>;
  }

  return (
    <a href='#'
    onClick={e => {
      e.proventDefault();
      onClick(filter);
    }}
    >
      {children}
    </a>
  );
};

const mapStateToLinkProps = (
  state,
  ownProps
) => {
  return {
    active:
    ownProps.filter ===
    state.visibilityFilter
  };
};

const mapDispatchToLinkProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch ({
        type: 'SET_VISIBILITY_FILTER',
        filter: ownProps.filter
      });
    }
  };
}

const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);

const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink filter='SHOW_ALL'>
    All 
    </FilterLink>
    {', '}
    <FilterLink filter='SHOW_ACTIVE'>
    Active
    </FilterLink>
    {', '}
    <FilterLink filter='SHOW_COMPLETED'>
    Completed
    </FilterLink>
  </p>
);
// Presentational Component
const Todo = ({
  onClick, 
  completed,
  text
}) => (
  <li
    onClick={onClick}
    style={{
      textDecoration:
        completed ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>
);
// Presentational Component
const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
        />
    )}
  </ul>
);

let nextTodoId = 0;
// Presentational component does not express behaviours
let AddTodo = ({ dispatch }) => {
  let input;

  return (
    <div>
      <input ref={node => {
        input = node;
      }} />
      <button onClick={() => {
          dispatch({
            type: 'ADD_TODO',
            id: nextTodoId++,
            text: input.value
        })
        input.value = '';
      }}>
        Add Todo
      </ button> 
    </div>
  );
};
AddTodo = connect()(AddTodo);

const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed);
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed);
  }
};

// Takes the state of the Redux store and returns the props
// for the presentational component
// These props will be updated ny time the state changes
const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  };
};

// Takes the sores dispatch method and returns the prosp that use the dispatch method
// to disptch actions
// So, it returns the call back props needed for the presentational component
const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: (id)  => {
      dispatch({
        type: 'TOGGLE_TODO',
        id
      });
    }
  };
};

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);

// This is a container component
// All container components are similar, their job is to connect a presentational component to the Redux store and specify teh data 
// and the behaviour that it needs

const TodoApp = () =>  (
  <div>
    <AddTodo /> 
    <VisibleTodoList />
    <Footer />                  
  </div>
);

// Uses React advanced context feature
// Don't need to pass the store 
class Provider extends Component {
  getChildContext() {
    return {
      store: this.props.store
    }
  }

  render() {
    return this.props.children;
  }
}
Provider.childContextTypes = {
  store: ClientRect.PropTypes.object
};

const { createStore } = Redux;

ReactDOM.render(
    <Provider store ={createStore(todoApp)}>
      <TodoApp />
    </Provider>,
      document.getElementById('root')
);