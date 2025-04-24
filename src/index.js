import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import TodoList from './TodoList'

const App = () => {
    return(
        <TodoList />
    )
}

const root = ReactDOM.createRoot(document.querySelector("#root"))
root.render(<App />)