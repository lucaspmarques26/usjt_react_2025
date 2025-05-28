import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

// URL base para as requisições HTTP ao backend
const API_URL = 'http://localhost:8080/api';

export default function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editingTask, setEditingTask] = useState(null); // Guarda a tarefa que está sendo editada { index, text }
    const [editText, setEditText] = useState(''); // Texto da tarefa em edição
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Carregar tarefas do backend ao montar o componente
    useEffect(() => {
        fetchTasks();
    }, []);

    // Função para buscar todas as tarefas do backend
    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Requisição GET para buscar todas as tarefas
            const response = await axios.get(`${API_URL}/tasks`);
            
            // Atualiza o estado com as tarefas recebidas do backend
            setTasks(response.data);
            
        } catch (err) {
            console.error('Erro ao buscar tarefas:', err);
            setError('Não foi possível carregar as tarefas do servidor. Usando dados locais.');
            
            // Em caso de erro, carrega do localStorage
            const storedTasks = localStorage.getItem('tasks');
            if (storedTasks) {
                setTasks(JSON.parse(storedTasks));
            }
        } finally {
            setLoading(false);
        }
    };

    // Salvar tarefas no localStorage sempre que o estado 'tasks' mudar (backup local)
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newTask.trim() === '') return;
        
        // Cria o objeto da nova tarefa
        const newTaskObj = { text: newTask };
        
        try {
            setLoading(true);
            setError(null);
            
            // Requisição POST para adicionar nova tarefa
            const response = await axios.post(`${API_URL}/tasks`, newTaskObj);
            
            // Atualiza o estado com a resposta do backend (que deve incluir o ID gerado)
            setTasks([...tasks, response.data]);
            
        } catch (err) {
            console.error('Erro ao adicionar tarefa:', err);
            setError('Não foi possível adicionar a tarefa no servidor. Salvando localmente.');
            
            // Em caso de erro, adiciona localmente
            const localTaskObj = { ...newTaskObj, id: Date.now() };
            setTasks([...tasks, localTaskObj]);
        } finally {
            setLoading(false);
            setNewTask(''); // Limpa o input após adicionar
        }
    };

    const handleInputChange = (event) => {
        setNewTask(event.target.value);
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm("Tem certeza que deseja remover esta tarefa?")) {
            try {
                setLoading(true);
                setError(null);
                
                // Requisição DELETE para remover a tarefa
                await axios.delete(`${API_URL}/tasks/${taskId}`);
                
                // Atualiza o estado removendo a tarefa
                setTasks(tasks.filter(task => task.id !== taskId));
            } catch (err) {
                console.error('Erro ao excluir tarefa:', err);
                setError('Não foi possível excluir a tarefa no servidor. Removendo localmente.');
                
                // Em caso de erro, remove localmente
                setTasks(tasks.filter(task => task.id !== taskId));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setEditText(task.text);
    };

    const handleSaveEdit = async (taskId) => {
        // Cria o objeto com os dados atualizados
        const updatedTask = { id: taskId, text: editText };
        
        try {
            setLoading(true);
            setError(null);
            
            // Requisição PUT para atualizar a tarefa
            const response = await axios.put(`${API_URL}/tasks/${taskId}`, updatedTask);
            
            // Atualiza o estado com a resposta do backend
            setTasks(tasks.map(task => 
                task.id === taskId ? response.data : task
            ));
            
        } catch (err) {
            console.error('Erro ao atualizar tarefa:', err);
            setError('Não foi possível atualizar a tarefa no servidor. Atualizando localmente.');
            
            // Em caso de erro, atualiza localmente
            setTasks(tasks.map(task => 
                task.id === taskId ? updatedTask : task
            ));
        } finally {
            setLoading(false);
            setEditingTask(null);
            setEditText('');
        }
    };

    return (
        <div className="container my-5">
            <div className="mx-auto rounded border border-dark p-4" style={{width: "700px", backgroundColor: "#454545"}}>
                <h2 className="text-white text-center mb-5">Minhas Tarefas</h2>
                
                {/* Exibe mensagens de erro, se houver */}
                {error && (
                    <div className="alert alert-warning" role="alert">
                        {error}
                    </div>
                )}
                
                <form className="d-flex mb-4" onSubmit={handleSubmit}>
                    <input 
                        className="form-control me-2" 
                        placeholder="Nova Tarefa" 
                        name="tarefa" 
                        value={newTask} // Controla o valor do input
                        onChange={handleInputChange} // Atualiza o estado newTask
                        disabled={loading} // Desabilita durante carregamento
                    />
                    <button 
                        className="btn btn-outline-light" 
                        type="submit"
                        disabled={loading} // Desabilita durante carregamento
                    >
                        {loading ? 'Adicionando...' : 'Adicionar'}
                    </button>
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
                                    disabled={loading} // Desabilita durante carregamento
                                />
                            ) : (
                                <span>{task.text}</span>
                            )}
                            <div className="d-flex">
                                {editingTask && editingTask.id === task.id ? (
                                    <button 
                                        className="btn btn-sm btn-success me-2" 
                                        onClick={() => handleSaveEdit(task.id)}
                                        disabled={loading} // Desabilita durante carregamento
                                    >
                                        {loading ? 'Salvando...' : 'Salvar'}
                                    </button>
                                ) : (
                                    <button 
                                        className="btn btn-sm btn-outline-warning me-2" 
                                        onClick={() => handleEditTask(task)}
                                        disabled={loading} // Desabilita durante carregamento
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                )}
                                <button 
                                    className="btn btn-sm btn-outline-danger" 
                                    onClick={() => handleDeleteTask(task.id)}
                                    disabled={loading} // Desabilita durante carregamento
                                >
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
