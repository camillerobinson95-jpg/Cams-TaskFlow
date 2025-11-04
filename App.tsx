import React, { useState, useEffect } from 'react';
import { Todo, Status, Priority } from './types';
import TodoList from './components/TodoList';
import TodoEditor from './components/TodoEditor';
import Dashboard from './components/Dashboard';

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
    </svg>
);


const Logo: React.FC = () => (
    <div className="flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#00A9FF" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 7L12 12L22 7" stroke="#00A9FF" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M12 22V12" stroke="#00A9FF" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
        <span className="text-2xl font-bold text-white">TaskFlow</span>
    </div>
);


type View = 'dashboard' | 'list' | 'editor';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [view, setView] = useState<View>('dashboard');
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      } else {
        // Add sample data if no todos are stored
        setTodos([
          { id: '1', title: 'Design Landing Page', description: 'Create mockups and style guide for the new landing page.', dueDate: '2024-08-15', priority: Priority.High, status: Status.InProgress },
          { id: '2', title: 'Develop API Endpoints', description: 'Set up Node.js server and create REST API for user authentication.', dueDate: '2024-08-20', priority: Priority.High, status: Status.NotStarted },
          { id: '3', title: 'Write Documentation', description: 'Document the API endpoints and component library.', dueDate: '2024-09-01', priority: Priority.Medium, status: Status.NotStarted },
          { id: '4', title: 'Test Application', description: 'Write unit and integration tests for all new features.', dueDate: '', priority: Priority.Low, status: Status.Completed },
        ]);
      }
    } catch (error) {
      console.error("Failed to parse todos from localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  const handleAddNew = () => {
    setCurrentTodo(null);
    setView('editor');
  };

  const handleEdit = (id: string) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    if (todoToEdit) {
      setCurrentTodo(todoToEdit);
      setView('editor');
    }
  };

  const handleSave = (todoToSave: Todo) => {
    if (currentTodo) {
      // Update existing
      setTodos(todos.map(todo => (todo.id === todoToSave.id ? todoToSave : todo)));
    } else {
      // Add new
      setTodos([...todos, { ...todoToSave, id: Date.now().toString() }]);
    }
    setView('list');
    setCurrentTodo(null);
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    setView('list');
    setCurrentTodo(null);
  };

  const handleCancel = () => {
    setView('list');
    setCurrentTodo(null);
  };
  
  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard todos={todos} />;
      case 'list':
        return <TodoList todos={todos} onEdit={handleEdit} />;
      case 'editor':
        return <TodoEditor todo={currentTodo} onSave={handleSave} onCancel={handleCancel} onDelete={handleDelete} />;
      default:
        return <Dashboard todos={todos} />;
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gray-900">
      <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-700/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-8">
                    <Logo />
                    <nav className="hidden md:flex gap-6">
                       {isAuthenticated && (
                         <>
                            <button 
                                onClick={() => setView('dashboard')}
                                className={`text-sm font-medium transition-colors ${view === 'dashboard' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
                            >
                                Dashboard
                            </button>
                            <button 
                                onClick={() => setView('list')}
                                className={`text-sm font-medium transition-colors ${view === 'list' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
                            >
                                Todos
                            </button>
                         </>
                       )}
                       <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Company</a>
                       <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">More Info</a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <button
                                onClick={handleAddNew}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md shadow-lg shadow-blue-600/20 transition-all transform hover:scale-105"
                            >
                                <PlusIcon className="h-5 w-5" />
                                <span className="hidden sm:inline">Add New Todo</span>
                            </button>
                             <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-md transition-colors"
                                title="Sign Out"
                            >
                                <LogoutIcon className="h-5 w-5" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md shadow-lg shadow-blue-600/20 transition-all transform hover:scale-105"
                        >
                            <UserIcon className="h-5 w-5" />
                            <span className="hidden sm:inline">Login</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
      </header>
      
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
           {!isAuthenticated ? (
            <div className="text-center py-20 px-6">
                <h1 className="text-5xl font-extrabold text-white tracking-tight">Welcome to TaskFlow</h1>
                <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                    Your personal space to organize, track, and accomplish your goals with clarity and focus.
                </p>
                <button
                    onClick={handleLogin}
                    className="mt-8 flex items-center gap-2 mx-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-md shadow-lg shadow-blue-600/20 transition-all transform hover:scale-105"
                >
                    Login to Get Started
                </button>
            </div>
           ) : (
            renderView()
           )}
        </div>
      </main>
    </div>
  );
};

export default App;