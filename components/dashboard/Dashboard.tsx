
import React from 'react';
import type { UserData, View } from '../../types';
import Icon from '../shared/Icon';

interface DashboardProps {
    userData: UserData;
    setView: (view: View) => void;
}

interface SummaryCardProps {
    title: string;
    value: string;
    label: string;
    icon: React.ComponentProps<typeof Icon>['name'];
    color: string;
    viewName: View;
    onClick: (view: View) => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, label, icon, color, viewName, onClick }) => (
    <div 
        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
        onClick={() => onClick(viewName)}
    >
        <div>
            <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-700">{title}</h3>
                <div className={`p-2 rounded-full ${color}`}>
                    <Icon name={icon} className="h-6 w-6 text-white" />
                </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
        <div className="mt-4 text-brand-primary font-semibold flex items-center">
            Go to {title} <Icon name="chevron-right" className="h-4 w-4 ml-1" />
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ userData, setView }) => {
    const nextTax = userData.taxes.find(t => t.status !== 'Paid');
    const waterUtility = userData.utilities.find(u => u.name === 'Water');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {userData.user.name}!</h1>
                <p className="text-gray-600 mt-1">Here's a quick summary of your civic services.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SummaryCard
                    title="Transport"
                    icon="transport"
                    value={`${userData.transport.balance.toFixed(2)} ${userData.transport.currency}`}
                    label="Current MetroCard Balance"
                    color="bg-blue-500"
                    viewName="TRANSPORT"
                    onClick={setView}
                />
                <SummaryCard
                    title="Taxes"
                    icon="taxes"
                    value={nextTax ? `${nextTax.amount} ${userData.transport.currency}` : 'All Paid'}
                    label={nextTax ? `Next payment due: ${nextTax.dueDate}` : 'Your taxes are up to date'}
                    color={nextTax?.overdue ? 'bg-status-red' : 'bg-yellow-500'}
                    viewName="TAXES"
                    onClick={setView}
                />
                <SummaryCard
                    title="Utilities"
                    icon="utilities"
                    value={waterUtility?.usage || '-'}
                    label="Latest Water Bill Usage"
                    color="bg-green-500"
                    viewName="UTILITIES"
                    onClick={setView}
                />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                 <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Links</h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <QuickLink title="View Projects" icon="projects" viewName="PROJECTS" onClick={setView} />
                     <QuickLink title="See Benefits" icon="benefits" viewName="BENEFITS" onClick={setView} />
                     <QuickLink title="Pay Taxes" icon="taxes" viewName="TAXES" onClick={setView} />
                     <QuickLink title="Top-up Card" icon="transport" viewName="TRANSPORT" onClick={setView} />
                 </div>
            </div>
            
            <div className="bg-brand-primary text-white p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold">Have a say in our city's future!</h3>
                    <p className="opacity-90">Join the "Budget Saturday" meeting to discuss new city projects.</p>
                </div>
                <button className="bg-brand-secondary text-brand-dark font-bold py-2 px-6 rounded-lg hover:bg-yellow-300 transition-colors flex-shrink-0">
                    Learn More
                </button>
            </div>
        </div>
    );
};

const QuickLink: React.FC<{title: string, icon: React.ComponentProps<typeof Icon>['name'], viewName: View, onClick: (view:View) => void}> = ({title, icon, viewName, onClick}) => (
    <button onClick={() => onClick(viewName)} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-brand-light transition-colors">
        <Icon name={icon} className="h-8 w-8 text-brand-primary mb-2" />
        <span className="font-semibold text-gray-700 text-center">{title}</span>
    </button>
)

export default Dashboard;
