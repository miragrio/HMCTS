import { useState } from 'react'
import axios from 'axios'
import './App.css'

interface TaskCreate {
  title: string;
  description?: string;
  status: string;
  deadline: string;
}

interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  status: string;
  deadline: string;
  created_at: string;
}

function App() {
  const [form, setForm] = useState<TaskCreate>({
    title: '',
    description: '',
    status: 'pending',
    deadline: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [createdTask, setCreatedTask] = useState<TaskResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<TaskResponse>('http://localhost:8000/', form);
      setCreatedTask(response.data);
      setShowModal(true);
      // Reset form after successful submission
      setForm({
        title: '',
        description: '',
        status: 'pending',
        deadline: '',
      });
    } catch (err) {
      alert('Error creating task: ' + err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCreatedTask(null);
  };
  
  return (
    <div>
      <h1>Task Management System</h1>
      <form onSubmit={submitForm}>
        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input type="date" name="deadline" value={form.deadline} onChange={handleChange} />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit">Create Task</button>
      </form>

      {showModal && createdTask && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Task Created Successfully!</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="task-detail">
                <label>Title:</label>
                <p>{createdTask.title}</p>
              </div>
              {createdTask.description && (
                <div className="task-detail">
                  <label>Description:</label>
                  <p>{createdTask.description}</p>
                </div>
              )}
              <div className="task-detail">
                <label>Status:</label>
                <p className={`status-badge status-${createdTask.status}`}>{createdTask.status}</p>
              </div>
              <div className="task-detail">
                <label>Deadline:</label>
                <p>{new Date(createdTask.deadline).toLocaleDateString()}</p>
              </div>
              <div className="task-detail">
                <label>Created:</label>
                <p>{new Date(createdTask.created_at).toLocaleString()}</p>
              </div>
              <div className="task-detail">
                <label>ID:</label>
                <p className="task-id">{createdTask.id}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
