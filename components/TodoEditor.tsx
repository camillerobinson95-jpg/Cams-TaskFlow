import React, { useState, useEffect } from 'react';
import { Todo, Priority, Status } from '../types';
import Modal from './Modal';
import ImageEditor from './ImageEditor';

interface TodoEditorProps {
  todo: Todo | null;
  onSave: (todo: Todo) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

const BackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
  </svg>
);


const TodoEditor: React.FC<TodoEditorProps> = ({ todo, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState<Omit<Todo, 'id'>>({
    title: '',
    description: '',
    dueDate: '',
    priority: Priority.Medium,
    status: Status.NotStarted,
    image: undefined,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Todo, 'id'>, string>>>({});
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        priority: todo.priority,
        status: todo.status,
        image: todo.image,
      });
    }
  }, [todo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if(errors[name as keyof typeof errors]) {
        setErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  const handleImageChange = (imageData?: string) => {
    setFormData(prev => ({ ...prev, image: imageData }));
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.priority) newErrors.priority = 'Priority is required.';
    if (!formData.status) newErrors.status = 'Status is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = () => {
    if (validate()) {
      onSave({
        ...formData,
        id: todo ? todo.id : '',
      });
    }
  };

  const handleDeleteClick = () => {
    if(todo) {
      onDelete(todo.id);
      setDeleteModalOpen(false);
    }
  }

  const isEditing = !!todo;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
         <button onClick={onCancel} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <BackIcon className="h-6 w-6"/>
            Back to List
        </button>
      </div>
      
      <h1 className="text-4xl font-bold text-white -mt-2 mb-6">
          {isEditing ? 'Edit Todo' : 'Create New Todo'}
      </h1>

      <div className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-lg border border-gray-700 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <ImageEditor imageData={formData.image} onImageDataChange={handleImageChange} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-400 mb-1">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-400 mb-1">Priority <span className="text-red-500">*</span></label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
               {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority}</p>}
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-1">Status <span className="text-red-500">*</span></label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
               {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
            </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 border-t border-gray-700">
            {isEditing && (
                <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >
                    <TrashIcon className="h-5 w-5"/>
                    Delete
                </button>
            )}
             <button onClick={onCancel} className="w-full sm:w-auto bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                Cancel
            </button>
            <button onClick={handleSaveClick} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                Save
            </button>
        </div>
      </div>
       <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteClick}
        title="Delete Todo"
      >
        <p className="text-gray-400">Are you sure you want to delete this todo? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default TodoEditor;