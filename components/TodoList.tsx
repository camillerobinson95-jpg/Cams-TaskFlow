import React, { useState, useMemo } from 'react';
import { Todo, Status, Priority } from '../types';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onEdit: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onEdit }) => {
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const statusMatch = statusFilter === 'All' || todo.status === statusFilter;
      const priorityMatch = priorityFilter === 'All' || todo.priority === priorityFilter;
      return statusMatch && priorityMatch;
    });
  }, [todos, statusFilter, priorityFilter]);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-400 mb-1">Filter by Status</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | 'All')}
              className="w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All</option>
              {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-400 mb-1">Filter by Priority</label>
            <select
              id="priorityFilter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | 'All')}
              className="w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All</option>
              {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      <main>
        {filteredTodos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} onEdit={onEdit} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-white">No Todos Found</h2>
            <p className="text-gray-400 mt-2">Looks like your task list is empty. Click "Add New Todo" in the header to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TodoList;