
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Utility } from '../../types';
import Icon from '../shared/Icon';
import Modal from '../shared/Modal';

interface UtilitiesViewProps {
    utilities: Utility[];
    onPayUtility: (name: Utility['name']) => void;
    onToggleAutoPay: (name: Utility['name']) => void;
}

const UtilityCard: React.FC<{ utility: Utility, onPay: (utility: Utility) => void, onManageAutoPay: (utility: Utility) => void }> = ({ utility, onPay, onManageAutoPay }) => {
    const isBill = utility.amount !== null;

    if (!isBill) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full flex flex-col justify-between">
                <div>
                    <h3 className="font-semibold text-lg text-gray-700">{utility.name}</h3>
                    <p className="text-sm text-gray-500">Service Status</p>
                </div>
                <div className="my-4">
                    <p className="text-2xl font-bold text-gray-900">{utility.status}</p>
                </div>
                <div className="text-sm text-gray-400">No payment required.</div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-gray-700">{utility.name}</h3>
                    {utility.autoPay && (
                         <div className="flex items-center text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            <Icon name="autoplay" className="w-4 h-4 mr-1"/>
                            Auto-Pay Active
                        </div>
                    )}
                </div>
                <p className="text-3xl font-bold text-gray-900 mt-2">{utility.amount.toFixed(2)} MDL</p>
                <p className="text-sm text-gray-500">
                    {utility.status === 'Paid' ? `Paid this cycle` : `Due: ${new Date(utility.dueDate!).toLocaleDateString()}`}
                </p>
            </div>
            <div className="mt-4 space-y-2">
                {utility.status === 'Due' && (
                    utility.autoPay ? (
                        <div className="w-full flex items-center justify-center text-center py-2 px-4 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                            <Icon name="autoplay" className="w-4 h-4 mr-2 text-gray-600"/>
                            <span>Auto-payment on {new Date(utility.dueDate!).toLocaleDateString()}</span>
                        </div>
                    ) : (
                        <button 
                            onClick={() => onPay(utility)}
                            className="w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-dark transition-colors"
                        >
                            Pay Bill
                        </button>
                    )
                )}
                {utility.status === 'Paid' && !utility.autoPay && (
                    <div className="w-full flex items-center justify-center text-center py-2 px-4 rounded-lg bg-gray-100 text-gray-800 font-semibold">
                        <Icon name="check" className="w-5 h-5 mr-2 text-green-600" /> Paid this month
                    </div>
                )}
                
                {utility.autoPay ? (
                    <button onClick={() => onManageAutoPay(utility)} className="w-full bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                        Manage Auto-Pay
                    </button>
                ) : (
                     <button onClick={() => onManageAutoPay(utility)} className="w-full text-sm text-brand-primary font-semibold hover:underline">
                        Set up Auto-Pay
                    </button>
                )}
            </div>
        </div>
    );
}

const UtilitiesView: React.FC<UtilitiesViewProps> = ({ utilities, onPayUtility, onToggleAutoPay }) => {
    const [payingUtility, setPayingUtility] = useState<Utility | null>(null);
    const [managingAutoPayUtility, setManagingAutoPayUtility] = useState<Utility | null>(null);
    const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success'>('idle');
    const [autoPayState, setAutoPayState] = useState<'idle' | 'processing' | 'success'>('idle');

    const handlePayClick = (utility: Utility) => {
        setPayingUtility(utility);
    };
    
    const handleAutoPayClick = (utility: Utility) => {
        setManagingAutoPayUtility(utility);
    };

    const handleConfirmPayment = () => {
        if (!payingUtility) return;
        setPaymentState('processing');
        setTimeout(() => {
            onPayUtility(payingUtility.name);
            setPaymentState('success');
        }, 1500);
    };

    const handleConfirmAutoPay = () => {
        if (!managingAutoPayUtility) return;
        setAutoPayState('processing');
        setTimeout(() => {
            onToggleAutoPay(managingAutoPayUtility.name);
            setAutoPayState('success');
        }, 1500);
    }

    const resetPaymentModal = () => {
        setPayingUtility(null);
        setTimeout(() => setPaymentState('idle'), 300);
    };

    const resetAutoPayModal = () => {
        setManagingAutoPayUtility(null);
        setTimeout(() => setAutoPayState('idle'), 300);
    };

    const chartData = utilities
        .filter(u => u.status !== 'On Schedule' && u.status !== 'Delayed')
        .map(u => ({
            name: u.name,
            change: u.change,
        }));
    
    const paidUtilities = utilities.filter(u => u.status === 'Paid' && u.amount !== null);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Utilities</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {utilities.map(utility => (
                    <UtilityCard key={utility.name} utility={utility} onPay={handlePayClick} onManageAutoPay={handleAutoPayClick}/>
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                 <h2 className="text-xl font-bold text-gray-800 mb-1">Monthly Usage Change</h2>
                 <p className="text-gray-500 mb-6">Comparison with the previous month.</p>
                <div style={{ width: '100%', height: 300 }}>
                     <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis unit="%" stroke="#6b7280"/>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                                labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
                                formatter={(value: number) => [`${value}%`, 'Change']}
                            />
                            <Bar dataKey="change">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.change > 0 ? '#ef4444' : '#22c55e'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Payment History Section */}
            {paidUtilities.length > 0 && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800">Payment History</h2>
                        <p className="text-sm text-gray-500">Recent utility payments.</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {paidUtilities.map(utility => (
                            <div key={utility.name} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                <div className="flex items-center">
                                    <div className="bg-green-100 p-2 rounded-full mr-4">
                                         <Icon name="check" className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{utility.name}</p>
                                        <p className="text-sm text-gray-500">Paid on {utility.paymentDate || 'N/A'}</p>
                                    </div>
                                </div>
                                <p className="font-bold text-gray-900">{utility.amount?.toFixed(2)} MDL</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {payingUtility && (
                <Modal isOpen={!!payingUtility} onClose={resetPaymentModal} title={`Pay ${payingUtility.name} Bill`}>
                    {paymentState === 'idle' && (
                        <div>
                            <p className="text-lg text-gray-600 mb-2">You are about to pay:</p>
                            <p className="text-4xl font-bold text-brand-dark text-center my-4">{payingUtility.amount?.toFixed(2)} MDL</p>
                            <p className="text-sm text-gray-500 text-center mb-6">for your {payingUtility.name} bill due on {new Date(payingUtility.dueDate!).toLocaleDateString()}.</p>
                            <button
                                onClick={handleConfirmPayment}
                                className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-dark transition-colors"
                            >
                                Confirm Payment
                            </button>
                        </div>
                    )}
                    {paymentState === 'processing' && (
                        <div className="text-center p-8">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-primary mx-auto"></div>
                            <p className="mt-4 text-gray-600 font-semibold">Processing payment...</p>
                        </div>
                    )}
                    {paymentState === 'success' && (
                         <div className="text-center p-8">
                             <div className="mx-auto bg-green-100 rounded-full h-20 w-20 flex items-center justify-center">
                                <Icon name="check" className="h-12 w-12 text-status-green" />
                             </div>
                             <h3 className="text-2xl font-bold text-gray-800 mt-4">Payment Successful!</h3>
                             <p className="text-gray-600 mt-1">Your {payingUtility.name} bill has been paid.</p>
                             <button onClick={resetPaymentModal} className="mt-6 w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-dark transition-colors">
                                Done
                             </button>
                         </div>
                    )}
                </Modal>
            )}

            {/* Auto-Pay Modal */}
             {managingAutoPayUtility && (
                <Modal isOpen={!!managingAutoPayUtility} onClose={resetAutoPayModal} title={`Manage Auto-Pay for ${managingAutoPayUtility.name}`}>
                    {autoPayState === 'idle' && (
                        <div>
                            {managingAutoPayUtility.autoPay ? (
                                <>
                                    <p className="text-gray-600 mb-4">Automatic payments are currently active for this utility. Your bill will be paid on the due date each month.</p>
                                    <button onClick={handleConfirmAutoPay} className="w-full bg-status-red text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors">
                                        Cancel Auto-Pay
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-600 mb-4">Enable automatic payments to have your {managingAutoPayUtility.name} bill paid on its due date each month. You will be notified 3 days before each payment.</p>
                                     <button onClick={handleConfirmAutoPay} className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-dark transition-colors">
                                        Activate Auto-Pay
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                     {autoPayState === 'processing' && (
                        <div className="text-center p-8">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-primary mx-auto"></div>
                            <p className="mt-4 text-gray-600 font-semibold">Updating settings...</p>
                        </div>
                    )}
                    {autoPayState === 'success' && (
                         <div className="text-center p-8">
                             <div className="mx-auto bg-green-100 rounded-full h-20 w-20 flex items-center justify-center">
                                <Icon name="check" className="h-12 w-12 text-status-green" />
                             </div>
                             <h3 className="text-2xl font-bold text-gray-800 mt-4">Success!</h3>
                             <p className="text-gray-600 mt-1">
                                Auto-Pay for {managingAutoPayUtility.name} is now {managingAutoPayUtility.autoPay ? 'active' : 'inactive'}.
                             </p>
                             <button onClick={resetAutoPayModal} className="mt-6 w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-dark transition-colors">
                                Done
                             </button>
                         </div>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default UtilitiesView;
