import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const Crud = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${API_URL}/tasks`);
            setTasks(response.data);
        } catch (error) {
            console.error('Greška pri učitavanju zadataka:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                await axios.put(`${API_URL}/tasks/${editingTask.id}`, {
                    title,
                    description
                });
                setEditingTask(null);
            } else {
                await axios.post(`${API_URL}/tasks`, {
                    title,
                    description
                });
            }
            setTitle('');
            setDescription('');
            fetchTasks();
        } catch (error) {
            console.error('Greška pri čuvanju zadatka:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/tasks/${id}`);
            fetchTasks();
        } catch (error) {
            console.error('Greška pri brisanju zadatka:', error);
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setTitle(task.title);
        setDescription(task.description);
    };

    const toggleComplete = async (task) => {
        try {
            await axios.put(`${API_URL}/tasks/${task.id}`, {
                ...task,
                completed: !task.completed
            });
            fetchTasks();
        } catch (error) {
            console.error('Greška pri promeni statusa:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Upravljanje Zadacima</h1>
            
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Naslov zadatka"
                    className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Opis zadatka"
                    className="w-full mb-4 p-3 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    {editingTask ? 'Izmeni Zadatak' : 'Dodaj Zadatak'}
                </button>
            </form>

            <div className="space-y-4">
                {tasks.map((task) => (
                    <div 
                        key={task.id} 
                        className={`bg-white shadow-md rounded-lg p-6 ${task.completed ? 'bg-green-50' : ''}`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h3>
                                <p className="text-gray-600 mb-2">{task.description}</p>
                                <small className="text-gray-500">
                                    Kreirano: {new Date(task.created_at).toLocaleDateString()}
                                </small>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => toggleComplete(task)}
                                    className={`px-4 py-2 rounded-md text-white ${task.completed ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}
                                >
                                    {task.completed ? 'Poništi' : 'Završi'}
                                </button>
                                <button 
                                    onClick={() => handleEdit(task)}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                                >
                                    Izmeni
                                </button>
                                <button 
                                    onClick={() => handleDelete(task.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    Obriši
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Crud;