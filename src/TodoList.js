import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editingTask, setEditingTask] = useState(null); // Guarda a tarefa que está sendo editada { index, text }
    const [editText, setEditText] = useState(''); // Texto da tarefa em edição

    // Carregar tarefas do localStorage ao montar o componente
    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, []);

    // Salvar tarefas no localStorage sempre que o estado 'tasks' mudar
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (newTask.trim() === '') return;
        setTasks([...tasks, { text: newTask, id: Date.now() }]);
        setNewTask(''); // Limpa o input após adicionar
        event.target.reset(); // Reseta o formulário, se o input não for controlado diretamente
    };

    const handleInputChange = (event) => {
        setNewTask(event.target.value);
    };

    const handleDeleteTask = (taskId) => {
        if (window.confirm("Tem certeza que deseja remover esta tarefa?")) {
            setTasks(tasks.filter(task => task.id !== taskId));
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setEditText(task.text);
    };

    const handleSaveEdit = (taskId) => {
        setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, text: editText } : task
        ));
        setEditingTask(null);
        setEditText('');
    };

    return (
        <div className="container my-5">
            <div className="mx-auto rounded border p-4" style={{width: "600px", backgroundColor: "#454545"}}>
                <h2 className="text-white text-center mb-5">Minhas Tarefas</h2>
                <form className="d-flex mb-4" onSubmit={handleSubmit}>
                    <input 
                        className="form-control me-2" 
                        placeholder="Nova Tarefa" 
                        name="tarefa" 
                        value={newTask} // Controla o valor do input
                        onChange={handleInputChange} // Atualiza o estado newTask
                    />
                    <button className="btn btn-outline-light" type="submit">Adicionar</button>
                </form>

                <ul className="list-group">
                    {tasks.map((task) => (
                        <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center" style={{backgroundColor: "#585858", color: "white", borderColor: "#6c757d"}}>
                            {editingTask && editingTask.id === task.id ? (
                                <input 
                                    type="text" 
                                    className="form-control me-2" 
                                    value={editText} 
                                    onChange={(e) => setEditText(e.target.value)} 
                                />
                            ) : (
                                <span>{task.text}</span>
                            )}
                            <div className="d-flex">
                                {editingTask && editingTask.id === task.id ? (
                                    <button className="btn btn-sm btn-success me-2" onClick={() => handleSaveEdit(task.id)}>
                                        Salvar
                                    </button>
                                ) : (
                                    <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEditTask(task)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                )}
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTask(task.id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

