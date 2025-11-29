
import React, { useState, useEffect, useCallback } from 'react';
// FIX: UserData type is now imported from types.ts, and initialUserData value from mockData.
import { initialUserData } from './data/mockData';
import type { View, UserData, Utility } from './types';
import LoginScreen from './components/auth/LoginScreen';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import ProjectsView from './components/projects/ProjectsView';
import TransportView from './components/transport/TransportView';
import TaxesView from './components/taxes/TaxesView';
import UtilitiesView from './components/utilities/UtilitiesView';
import BenefitsView from './components/benefits/BenefitsView';
import type { Tax } from './types';


const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<View>('DASHBOARD');
    const [userData, setUserData] = useState<UserData>(initialUserData);

    useEffect(() => {
        // Simulate checking auth status and if user should be remembered
        const isRemembered = localStorage.getItem('rememberUser') === 'true';
        if (isRemembered) {
            setIsLoggedIn(true);
        }
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleLogin = useCallback((rememberMe: boolean) => {
        setIsLoading(true);
        if (rememberMe) {
            localStorage.setItem('rememberUser', 'true');
        }
        setTimeout(() => {
            setIsLoggedIn(true);
            setIsLoading(false);
        }, 1500);
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('rememberUser');
        setIsLoggedIn(false);
        setView('DASHBOARD');
    }, []);

    const handleTopUp = useCallback((amount: number) => {
        setUserData(prevData => ({
            ...prevData,
            transport: {
                ...prevData.transport,
                balance: prevData.transport.balance + amount
            }
        }));
    }, []);
    
    const handlePayTaxes = useCallback((taxIds: number[]) => {
      setUserData(prevData => {
          const newTaxes = prevData.taxes.map(tax => 
              taxIds.includes(tax.id) 
                ? { 
                    ...tax, 
                    status: 'Paid' as const, 
                    overdue: false, 
                    paymentDate: new Date().toLocaleDateString('en-GB') 
                  } 
                : tax
          );
          return { ...prevData, taxes: newTaxes };
      });
    }, []);

    const handlePayUtility = useCallback((utilityName: Utility['name']) => {
        setUserData(prevData => {
            const newUtilities = prevData.utilities.map(utility =>
                utility.name === utilityName ? { ...utility, status: 'Paid' as const, paymentDate: new Date().toLocaleDateString('en-GB') } : utility
            );
            return { ...prevData, utilities: newUtilities };
        });
    }, []);

    const handleToggleAutoPay = useCallback((utilityName: Utility['name']) => {
        setUserData(prevData => {
            const newUtilities = prevData.utilities.map(utility =>
                utility.name === utilityName ? { ...utility, autoPay: !utility.autoPay } : utility
            );
            return { ...prevData, utilities: newUtilities };
        });
    }, []);

    const renderView = () => {
        switch (view) {
            case 'DASHBOARD':
                return <Dashboard userData={userData} setView={setView} />;
            case 'PROJECTS':
                return <ProjectsView projects={userData.projects} />;
            case 'TRANSPORT':
                return <TransportView transport={userData.transport} onTopUp={handleTopUp} />;
            case 'TAXES':
                return <TaxesView taxes={userData.taxes} onPayTaxes={handlePayTaxes} />;
            case 'UTILITIES':
                return <UtilitiesView utilities={userData.utilities} onPayUtility={handlePayUtility} onToggleAutoPay={handleToggleAutoPay} />;
            case 'BENEFITS':
                return <BenefitsView benefits={userData.benefits} />;
            default:
                return <Dashboard userData={userData} setView={setView} />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-brand-primary">
                <div className="text-white text-2xl font-semibold animate-pulse">Loading Florești Civic Portal...</div>
            </div>
        );
    }
    
    if (!isLoggedIn) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return (
        <Layout user={userData.user} activeView={view} setView={setView} onLogout={handleLogout}>
            {renderView()}
        </Layout>
    );
};

export default App;
