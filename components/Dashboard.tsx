import React, { useMemo } from 'react';
import { Todo, Status, Priority } from '../types';

interface DashboardProps {
  todos: Todo[];
}

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: number;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-5 border border-gray-700">
        <div className="flex items-center">
            <div className={`rounded-full p-3 ${color}`}>
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    </div>
);

const priorityColors: Record<Priority, string> = {
  [Priority.High]: 'bg-red-500',
  [Priority.Medium]: 'bg-yellow-500',
  [Priority.Low]: 'bg-blue-500',
};

const statusProgressColors: Record<Status, string> = {
    [Status.Completed]: 'bg-green-500',
    [Status.InProgress]: 'bg-purple-500',
    [Status.NotStarted]: 'bg-yellow-500',
};

const statusTextColors: Record<Status, string> = {
    [Status.Completed]: 'text-green-400',
    [Status.InProgress]: 'text-purple-400',
    [Status.NotStarted]: 'text-yellow-400',
};


const Dashboard: React.FC<DashboardProps> = ({ todos }) => {

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.status === Status.Completed).length;
    const inProgress = todos.filter(t => t.status === Status.InProgress).length;
    const notStarted = todos.filter(t => t.status === Status.NotStarted).length;

    const highPriority = todos.filter(t => t.priority === Priority.High).length;
    const mediumPriority = todos.filter(t => t.priority === Priority.Medium).length;
    const lowPriority = todos.filter(t => t.priority === Priority.Low).length;
    
    return {
        total,
        completed,
        inProgress,
        notStarted,
        priorities: {
            [Priority.High]: highPriority,
            [Priority.Medium]: mediumPriority,
            [Priority.Low]: lowPriority,
        }
    }
  }, [todos]);
  
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-4xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">A high-level overview of your tasks.</p>
        </div>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
                title="Total Tasks"
                value={stats.total}
                color="bg-gray-500"
            />
             <StatCard 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                title="Completed"
                value={stats.completed}
                color={statusProgressColors[Status.Completed]}
            />
            <StatCard 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                title="In Progress"
                value={stats.inProgress}
                // FIX: Use bracket notation for enums with spaces in their string values.
                color={statusProgressColors[Status.InProgress]}
            />
             <StatCard 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                title="Not Started"
                value={stats.notStarted}
                // FIX: Use bracket notation for enums with spaces in their string values.
                color={statusProgressColors[Status.NotStarted]}
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Status Breakdown */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Status Breakdown</h3>
                <div className="space-y-4">
                    {[Status.Completed, Status.InProgress, Status.NotStarted].map(status => {
                        // FIX: Correctly generate camelCase key from status enum to access stats object.
                        const statKey = (status.charAt(0).toLowerCase() + status.slice(1)).replace(/ /g, '') as 'completed' | 'inProgress' | 'notStarted';
                        const count = stats[statKey];
                        return (
                            <div key={status}>
                                <div className="flex justify-between mb-1">
                                    <span className={`text-base font-medium ${statusTextColors[status]}`}>{status}</span>
                                    <span className={`text-sm font-medium ${statusTextColors[status]}`}>{count} / {stats.total}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div className={`${statusProgressColors[status]} h-2.5 rounded-full`} style={{width: `${stats.total > 0 ? (Number(count) / stats.total) * 100 : 0}%`}}></div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Priority Breakdown */}
             <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Tasks by Priority</h3>
                <div className="space-y-4">
                    {Object.values(Priority).map(p => (
                        <div key={p} className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-3 ${priorityColors[p]}`}></div>
                            <span className="font-medium text-gray-400 flex-1">{p}</span>
                            <span className="font-bold text-white">{stats.priorities[p]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    </div>
  );
};

export default Dashboard;
