
import React, { useState, useMemo } from 'react';
import type { Tax } from '../../types';
import Icon from '../shared/Icon';
import Modal from '../shared/Modal';

interface TaxesViewProps {
    taxes: Tax[];
    onPayTaxes: (taxIds: number[]) => void;
}

const getStatusClasses = (status: Tax['status']) => {
    switch (status) {
        case 'Paid': return 'bg-green-100 text-green-800';
        case 'Due': return 'bg-blue-100 text-blue-800';
        case 'Overdue': return 'bg-red-100 text-red-800';
    }
};

const TaxItem: React.FC<{ tax: Tax, onSelect: (id: number, checked: boolean) => void, isSelected: boolean, isPayable: boolean }> = ({ tax, onSelect, isSelected, isPayable }) => (
    <div className={`flex items-center justify-between p-4 rounded-lg ${tax.status === 'Paid' ? 'bg-gray-50' : 'bg-white'}`}>
        <div className="flex items-center">
            {isPayable && (
                <input 
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelect(tax.id, e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary mr-4"
                />
            )}
            <div className={!isPayable ? 'ml-9' : ''}>
                <p className="font-semibold text-gray-800">{tax.name}</p>
                <p className="text-sm text-gray-500">
                    {tax.status === 'Paid' && tax.paymentDate
                        ? `Paid on: ${tax.paymentDate}`
                        : `Due: ${tax.dueDate}`}
                </p>
            </div>
        </div>
        <div className="text-right">
            <p className="font-bold text-lg text-gray-900">{tax.amount.toFixed(2)} MDL</p>
             <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(tax.status)}`}>
                {tax.status}
            </span>
        </div>
    </div>
);


const TaxesView: React.FC<TaxesViewProps> = ({ taxes, onPayTaxes }) => {
    const [selectedTaxes, setSelectedTaxes] = useState<number[]>([]);
    const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success'>('idle');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const payableTaxes = useMemo(() => taxes.filter(t => t.status !== 'Paid'), [taxes]);
    
    const totalSelected = useMemo(() => {
        return taxes.filter(t => selectedTaxes.includes(t.id)).reduce((sum, tax) => sum + tax.amount, 0);
    }, [selectedTaxes, taxes]);

    const handleSelectTax = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedTaxes(prev => [...prev, id]);
        } else {
            setSelectedTaxes(prev => prev.filter(taxId => taxId !== id));
        }
    };
    
    const handlePayNow = () => {
        setIsModalOpen(true);
        setPaymentState('processing');
        setTimeout(() => {
            onPayTaxes(selectedTaxes);
            setPaymentState('success');
        }, 2000);
    }
    
    const reset = () => {
        setIsModalOpen(false);
        setPaymentState('idle');
        setSelectedTaxes([]);
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Taxes</h1>
            <div className="bg-white rounded-xl shadow-md">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Your Tax Records</h2>
                    <p className="text-gray-500">Select taxes to pay. Paid taxes are shown for your records.</p>
                </div>
                <div className="space-y-2 p-4">
                    {taxes.map(tax => (
                         <TaxItem
                            key={tax.id}
                            tax={tax}
                            onSelect={handleSelectTax}
                            isSelected={selectedTaxes.includes(tax.id)}
                            isPayable={tax.status !== 'Paid'}
                        />
                    ))}
                </div>
                {payableTaxes.length > 0 && (
                <div className="p-6 border-t bg-gray-50 rounded-b-xl flex flex-col sm:flex-row items-center justify-between">
                    <div>
                        <p className="font-semibold text-gray-800">Total Selected:</p>
                        <p className="text-3xl font-bold text-brand-primary">{totalSelected.toFixed(2)} MDL</p>
                    </div>
                    <button
                        onClick={handlePayNow}
                        disabled={selectedTaxes.length === 0}
                        className="mt-4 sm:mt-0 w-full sm:w-auto bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Pay Now
                    </button>
                </div>
                )}
            </div>
            
            <Modal isOpen={isModalOpen} onClose={reset} title="Payment Status">
                {paymentState === 'processing' && (
                    <div className="text-center p-8">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-primary mx-auto"></div>
                        <p className="mt-4 text-gray-600 font-semibold">Processing payment for {totalSelected.toFixed(2)} MDL...</p>
                        <p className="text-sm text-gray-500">This is a simulation. No real payment is being made.</p>
                    </div>
                )}
                {paymentState === 'success' && (
                     <div className="text-center p-8">
                         <div className="mx-auto bg-green-100 rounded-full h-20 w-20 flex items-center justify-center">
                            <Icon name="check" className="h-12 w-12 text-status-green" />
                         </div>
                         <h3 className="text-2xl font-bold text-gray-800 mt-4">Payment Successful!</h3>
                         <p className="text-gray-600 mt-1">Your tax record is now up to date.</p>
                         <div className="flex gap-4 mt-6">
                            <button onClick={reset} className="flex-1 bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-dark transition-colors">
                                Done
                            </button>
                             <button className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center">
                                <Icon name="receipt" className="w-5 h-5 mr-2" /> Download Receipt
                            </button>
                         </div>
                     </div>
                )}
            </Modal>
        </div>
    );
};

export default TaxesView;