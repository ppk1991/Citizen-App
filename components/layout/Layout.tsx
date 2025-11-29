
import React, { useState } from 'react';
import type { View, User } from '../../types';
import Icon from '../shared/Icon';

interface LayoutProps {
    user: User;
    activeView: View;
    setView: (view: View) => void;
    onLogout: () => void;
    children: React.ReactNode;
}

const navItems: { name: View; label: string; icon: React.ComponentProps<typeof Icon>['name'] }[] = [
    { name: 'DASHBOARD', label: 'Dashboard', icon: 'dashboard' },
    { name: 'PROJECTS', label: 'Projects', icon: 'projects' },
    { name: 'TRANSPORT', label: 'Transport', icon: 'transport' },
    { name: 'TAXES', label: 'Taxes', icon: 'taxes' },
    { name: 'UTILITIES', label: 'Utilities', icon: 'utilities' },
    { name: 'BENEFITS', label: 'Benefits', icon: 'benefits' },
];

const Layout: React.FC<LayoutProps> = ({ user, activeView, setView, onLogout, children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const NavLink: React.FC<{ item: typeof navItems[0] }> = ({ item }) => (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                setView(item.name);
                setSidebarOpen(false);
            }}
            className={`flex items-center p-3 my-1 rounded-lg transition-colors ${
                activeView === item.name
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'text-gray-600 hover:bg-brand-light hover:text-brand-dark'
            }`}
        >
            <Icon name={item.icon} className="h-6 w-6 mr-4" />
            <span className="font-medium">{item.label}</span>
        </a>
    );
    
    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white shadow-lg">
             <div className="flex items-center justify-center p-4 border-b">
                 <img src="https://picsum.photos/seed/floresti/40/40" alt="City Logo" className="rounded-full mr-3"/>
                <h1 className="text-xl font-bold text-brand-dark">Florești Portal</h1>
            </div>
            <nav className="flex-1 p-4">
                {navItems.map((item) => <NavLink key={item.name} item={item} />)}
            </nav>
            <div className="p-4 border-t">
                 <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); onLogout(); }}
                    className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                >
                    <Icon name="logout" className="h-6 w-6 mr-4" />
                    <span className="font-medium">Logout</span>
                </a>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Desktop Sidebar */}
            <aside className="w-64 hidden lg:block flex-shrink-0">
                <SidebarContent />
            </aside>
            
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-40 lg:hidden transition-opacity ${sidebarOpen ? 'bg-black bg-opacity-50' : 'pointer-events-none opacity-0'}`} onClick={() => setSidebarOpen(false)}></div>
            <div className={`fixed inset-y-0 left-0 w-64 z-50 transform lg:hidden transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 <SidebarContent />
            </div>

            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800 hidden sm:block">{navItems.find(i => i.name === activeView)?.label}</h2>
                    <div className="flex items-center">
                        <div className="text-right mr-4">
                            <div className="font-semibold text-gray-700">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                         <img className="h-12 w-12 rounded-full object-cover" src="https://picsum.photos/seed/elena/100/100" alt="User avatar" />
                    </div>
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
