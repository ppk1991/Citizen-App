
import React, { useState, useEffect, useMemo } from 'react';
import type { Project } from '../../types';
import Icon from '../shared/Icon';
import Modal from '../shared/Modal';

interface ProjectsViewProps {
    projects: Project[];
}

const getStatusColor = (status: Project['status']) => {
    switch (status) {
        case 'In Progress': return 'bg-blue-100 text-blue-800';
        case 'Planning': return 'bg-yellow-100 text-yellow-800';
        case 'Approved': return 'bg-purple-100 text-purple-800';
        case 'Completed': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getSolidStatusColor = (status: Project['status']) => {
    switch (status) {
        case 'In Progress': return 'bg-blue-500';
        case 'Planning': return 'bg-yellow-500';
        case 'Approved': return 'bg-purple-500';
        case 'Completed': return 'bg-green-500';
        default: return 'bg-gray-500';
    }
};

const MilestoneTimeline: React.FC<{ milestones: Project['milestones'] }> = ({ milestones }) => {
    // Calculate the width of the completed part of the timeline
    let completedWidth = '0%';
    const lastCompletedIndex = milestones.findLastIndex(m => m.status === 'Completed');
    if (milestones.length > 1 && lastCompletedIndex > -1) {
        const percentage = (lastCompletedIndex / (milestones.length - 1)) * 100;
        completedWidth = `${percentage}%`;
    }

    return (
        <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-600 mb-6">Project Milestones</h4>
            <div className="relative w-full" style={{minHeight: '50px'}}>
                {/* Background line */}
                <div className="absolute top-2 left-2 right-2 h-0.5 bg-gray-200" />
                {/* Completed progress line */}
                <div className="absolute top-2 left-2 h-0.5 bg-brand-primary" style={{ width: `calc(${completedWidth} * (100% - 1rem))` }} />
                
                <div className="flex justify-between relative">
                    {milestones.map((milestone) => {
                        const isCompleted = milestone.status === 'Completed';
                        return (
                            <div key={milestone.name} className="flex flex-col items-center group text-center" style={{ width: '60px' }}>
                                <div className={`w-4 h-4 rounded-full border-2 z-10 transition-all duration-300 ${isCompleted ? 'bg-brand-primary border-brand-primary' : 'bg-white border-gray-300'}`} />
                                <div className="mt-2">
                                    <p className="text-xs font-semibold text-gray-700 leading-tight truncate w-full" title={milestone.name}>{milestone.name}</p>
                                    <p className="text-xs text-gray-500">{new Date(milestone.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const ProjectCard: React.FC<{ project: Project; onSelect: (project: Project) => void; allProjects: Project[] }> = ({ project, onSelect, allProjects }) => {
    const [animatedProgress, setAnimatedProgress] = useState(0);

    useEffect(() => {
        const animationFrameId = requestAnimationFrame(() => {
            setAnimatedProgress(project.progress);
        });
        return () => cancelAnimationFrame(animationFrameId);
    }, [project.progress]);
    
    const relatedProjects = useMemo(() => {
        if (!allProjects) return [];
        return allProjects
            .filter(p => p.company === project.company && p.id !== project.id)
            .slice(0, 2); // Limit to 2 related projects
    }, [allProjects, project.company, project.id]);

    const isOverdue = new Date(project.endDate) < new Date() && project.status !== 'Completed';

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-xl hover:border-brand-primary hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
            <div className="w-full h-48">
                <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                        </span>
                    </div>
                     <p className="mt-2 text-sm text-gray-600">
                        {project.description.substring(0, 100)}...
                    </p>
                    <div className="mt-2 text-sm text-gray-500">
                        <p><span className="font-medium text-gray-600">Contractor:</span> {project.company}</p>
                        <p><span className="font-medium text-gray-600">Budget:</span> {project.budget.toLocaleString()} MDL</p>
                    </div>
                     <div className="mt-3 pt-3 border-t border-gray-100">
                         <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <Icon name="calendar" className="w-5 h-5 mr-2 text-gray-400" />
                                <div>
                                    <p className="text-gray-500">Deadline</p>
                                    <p className="font-semibold text-gray-700">{new Date(project.endDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            {isOverdue && (
                                <div className="flex items-center bg-red-100 text-status-red px-2 py-1 rounded-full text-xs font-semibold">
                                    <Icon name="info" className="w-4 h-4 mr-1" />
                                    <span>Overdue</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-600">Progress</span>
                            <span className="text-sm font-bold text-brand-primary">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className="bg-brand-primary h-2.5 rounded-full transition-all duration-1500 ease-in-out" 
                                style={{ width: `${animatedProgress}%` }}></div>
                        </div>
                    </div>
                    {project.milestones && project.milestones.length > 0 && (
                        <MilestoneTimeline milestones={project.milestones} />
                    )}
                    {relatedProjects.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <h4 className="text-sm font-medium text-gray-600 mb-2">Related Projects</h4>
                            <ul className="space-y-1">
                                {relatedProjects.map(related => (
                                    <li key={related.id}>
                                        <button 
                                            onClick={() => onSelect(related)}
                                            className="text-sm text-brand-primary hover:underline text-left"
                                        >
                                            {related.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <button 
                    onClick={() => onSelect(project)}
                    className="mt-4 text-sm font-semibold text-brand-primary hover:underline flex items-center self-start"
                >
                    View Details <Icon name="chevron-right" className="w-4 h-4 ml-1" />
                </button>
            </div>
        </div>
    );
};

const MapView: React.FC<{ projects: Project[]; onSelect: (project: Project) => void }> = ({ projects, onSelect }) => {
    const [activeProjectId, setActiveProjectId] = useState<number | null>(null);

    return (
        <div 
            className="bg-gray-200 rounded-lg shadow-inner overflow-hidden relative cursor-pointer" 
            style={{ paddingTop: '66.66%' /* 3:2 aspect ratio */ }}
            onClick={() => setActiveProjectId(null)}
        >
            <img 
                src="https://maps.picsum.photos/seed/floresti/1200/800" 
                alt="City Map" 
                className="absolute top-0 left-0 w-full h-full object-cover"
            />
            {projects.map(project => project.coordinates && (
                <div
                    key={project.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: `${project.coordinates.x}%`, top: `${project.coordinates.y}%` }}
                >
                     {/* Tooltip */}
                     {activeProjectId === project.id && (
                        <div 
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-48 bg-white rounded-lg shadow-xl p-3 z-20 cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h4 className="font-bold text-gray-800 text-sm text-center leading-tight mb-2">{project.name}</h4>
                            <div className="flex justify-center mb-2">
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                                    {project.status}
                                </span>
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect(project);
                                }}
                                className="w-full text-xs bg-brand-primary text-white py-1.5 rounded hover:bg-brand-dark transition-colors font-medium"
                            >
                                View Details
                            </button>
                            {/* Triangle pointer */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white"></div>
                        </div>
                    )}

                    {/* Marker */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveProjectId(activeProjectId === project.id ? null : project.id);
                        }}
                        className={`w-6 h-6 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110 flex items-center justify-center ${getSolidStatusColor(project.status)}`}
                        title={project.name}
                    >
                         {activeProjectId === project.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </button>
                </div>
            ))}
        </div>
    );
};

const filterOptions: (Project['status'] | 'All')[] = ['All', 'In Progress', 'Planning', 'Approved', 'Completed'];

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects }) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [statusFilter, setStatusFilter] = useState<Project['status'] | 'All'>('All');
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

    const filteredProjects = projects.filter(project => {
        if (statusFilter === 'All') return true;
        return project.status === statusFilter;
    });

    return (
        <div>
             <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">City Projects</h1>
                    <div className="flex-shrink-0">
                        <div className="flex items-center bg-gray-200 rounded-full p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                                    viewMode === 'grid' ? 'bg-white text-brand-primary shadow' : 'text-gray-600'
                                }`}
                            >
                                Grid View
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                 className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                                    viewMode === 'map' ? 'bg-white text-brand-primary shadow' : 'text-gray-600'
                                }`}
                            >
                                Map View
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {filterOptions.map(option => (
                        <button
                            key={option}
                            onClick={() => setStatusFilter(option)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                                statusFilter === option
                                    ? 'bg-brand-primary text-white shadow'
                                    : 'bg-white text-gray-700 hover:bg-brand-light border'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {filteredProjects.length > 0 ? (
                <div>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map(project => (
                                <ProjectCard key={project.id} project={project} onSelect={setSelectedProject} allProjects={projects} />
                            ))}
                        </div>
                    ) : (
                        <MapView projects={filteredProjects} onSelect={setSelectedProject} />
                    )}
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <Icon name="info" className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Projects Found</h3>
                    <p className="mt-1 text-sm text-gray-500">There are no projects with the status "{statusFilter}".</p>
                </div>
            )}

            {selectedProject && (
                <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title={selectedProject.name}>
                    <img src={selectedProject.imageUrl} alt={selectedProject.name} className="w-full h-64 object-cover rounded-lg mb-4" />
                    <div className="space-y-4 text-gray-700">
                        <div>
                            <p className="font-semibold">Status</p>
                            <span className={`px-2 py-0.5 text-sm font-medium rounded-full ${getStatusColor(selectedProject.status)}`}>{selectedProject.status}</span>
                        </div>
                        <div>
                            <p className="font-semibold">Description</p>
                            <p className="text-sm text-gray-600">{selectedProject.description}</p>
                        </div>
                         <p><span className="font-semibold">Contractor:</span> {selectedProject.company}</p>
                         <p><span className="font-semibold">Total Budget:</span> {selectedProject.budget.toLocaleString()} MDL</p>
                         <p><span className="font-semibold">Deadline:</span> {new Date(selectedProject.endDate).toLocaleDateString()}</p>
                        
                        <div className="pt-2">
                            <h4 className="font-semibold mb-1">Progress: {selectedProject.progress}%</h4>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                               <div className="bg-brand-primary h-4 rounded-full text-white flex items-center justify-center text-xs" style={{ width: `${selectedProject.progress}%` }}>
                                   {selectedProject.progress > 10 && `${selectedProject.progress}%`}
                               </div>
                            </div>
                        </div>

                         <div className="pt-4 border-t">
                            <h4 className="font-semibold mb-4">Key Milestones</h4>
                            <ol className="relative border-l border-gray-200 ml-2">
                                {selectedProject.milestones.map((milestone, index) => (
                                    <li key={index} className="mb-6 ml-6">
                                        <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white ${milestone.status === 'Completed' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                            <Icon name={milestone.status === 'Completed' ? 'check' : 'calendar'} className={`w-3 h-3 ${milestone.status === 'Completed' ? 'text-brand-primary' : 'text-gray-500'}`} />
                                        </span>
                                        <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900">{milestone.name}</h3>
                                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400">{new Date(milestone.date).toDateString()}</time>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className="pt-2 border-t">
                            <h4 className="font-semibold mb-2">Key Stakeholders</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                {selectedProject.stakeholders.map((stakeholder, index) => (
                                    <li key={index}>{stakeholder}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ProjectsView;
