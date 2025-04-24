export default function TodoList() {
    
    function handleSubmit(event){
        event.preventDefault()

        let tarefa = event.target.tarefa.value

        alert("nova tarefa: " + tarefa)

        event.target.reset()
    }
    
    return (
        <div className="container my-5">
            <div className="mx-auto rounded border p-4" style={{width: "600px", backgroundColor: "#454545"}}>
                <h2 className="text-white text-center mb-5">Minhas Tarefas</h2>
                <form className="d-flex" onSubmit={handleSubmit}>
                    <input className="form-control me-2" placeholder="Nova Tarefa" name="tarefa"/>
                    <button className="btn btn-outline-light" type="submit">Adicionar</button>
                </form>
            </div>
        </div>
    )
}