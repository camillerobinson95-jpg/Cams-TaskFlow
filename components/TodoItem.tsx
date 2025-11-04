import React from 'react';
import { Todo, Priority, Status } from '../types';

interface TodoItemProps {
  todo: Todo;
  onEdit: (id: string) => void;
}

const priorityClasses: Record<Priority, string> = {
  [Priority.High]: 'text-red-400',
  [Priority.Medium]: 'text-yellow-400',
  [Priority.Low]: 'text-blue-400',
};

const statusClasses: Record<Status, string> = {
  [Status.NotStarted]: 'text-gray-400',
  [Status.InProgress]: 'text-purple-400',
  [Status.Completed]: 'text-green-400',
};

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);


const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit }) => {
  return (
    <div 
        className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-5 flex flex-col justify-between border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer group"
        onClick={() => onEdit(todo.id)}
    >
      <div>
        {todo.image && <img src={todo.image} alt={todo.title} className="w-full h-40 object-cover rounded-md mb-4"/>}
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-white mb-2 pr-2">{todo.title}</h3>
            <button className="text-gray-500 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <EditIcon className="h-5 w-5"/>
            </button>
        </div>
        <p className="text-gray-400 text-sm mb-4 min-h-[40px]">{todo.description.length > 100 ? `${todo.description.substring(0, 100)}...` : todo.description}</p>
      </div>
      <div className="mt-auto">
        {todo.dueDate && (
            <p className="text-xs text-gray-500 mb-3">Due: {new Date(todo.dueDate).toLocaleDateString()}</p>
        )}
        <div className="flex flex-wrap gap-2">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-700/50 ${priorityClasses[todo.priority]}`}>
              {todo.priority}
            </span>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-700/50 ${statusClasses[todo.status]}`}>
              {todo.status}
            </span>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;