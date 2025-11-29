
import React, { useState } from 'react';
import type { Transport } from '../../types';
import Icon from '../shared/Icon';
import Modal from '../shared/Modal';

interface TransportViewProps {
    transport: Transport;
    onTopUp: (amount: number) => void;
}

const topUpAmounts = [50, 100, 200, 500];

const TransportView: React.FC<TransportViewProps> = ({ transport, onTopUp }) => {
    const [isTopUpModalOpen, setTopUpModalOpen] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState(100);
    const [topUpState, setTopUpState] = useState<'selecting' | 'confirming' | 'success'>('selecting');

    const handleConfirmTopUp = () => {
        setTopUpState('confirming');
        setTimeout(() => {
            onTopUp(selectedAmount);
            setTopUpState('success');
        }, 1500);
    };

    const resetModal = () => {
        setTopUpModalOpen(false);
        setTimeout(() => {
          setTopUpState('selecting');
          setSelectedAmount(100);
        }, 300); // delay to allow modal to close smoothly
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Transport</h1>
            <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-br from-brand-primary to-blue-800 text-white rounded-2xl shadow-2xl p-8 transform rotate-1">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">{transport.cardName}</h2>
                        <Icon name="transport" className="w-10 h-10 opacity-80" />
                    </div>
                    <div className="mt-8 text-center">
                        <p className="text-lg opacity-90">Current Balance</p>
                        <p className="text-5xl font-bold tracking-wider">
                            {transport.balance.toFixed(2)}
                            <span className="text-3xl ml-2 opacity-80">{transport.currency}</span>
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setTopUpModalOpen(true)}
                    className="w-full mt-8 bg-brand-secondary text-brand-dark font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-yellow-300 transition-all transform hover:-translate-y-1 text-lg"
                >
                    Top-Up Balance
                </button>
            </div>

            <Modal isOpen={isTopUpModalOpen} onClose={resetModal} title="Top-Up MetroCard">
                {topUpState === 'selecting' && (
                    <div>
                        <p className="text-gray-600 mb-4">Select an amount to add to your card.</p>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {topUpAmounts.map(amount => (
                                <button
                                    key={amount}
                                    onClick={() => setSelectedAmount(amount)}
                                    className={`p-4 rounded-lg border-2 font-semibold transition-colors ${selectedAmount === amount ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-700 border-gray-200 hover:border-brand-primary'}`}
                                >
                                    {amount} {transport.currency}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleConfirmTopUp}
                            className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-dark transition-colors"
                        >
                            Confirm {selectedAmount} {transport.currency}
                        </button>
                    </div>
                )}
                {topUpState === 'confirming' && (
                    <div className="text-center p-8">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-primary mx-auto"></div>
                        <p className="mt-4 text-gray-600 font-semibold">Processing payment...</p>
                    </div>
                )}
                {topUpState === 'success' && (
                     <div className="text-center p-8">
                         <div className="mx-auto bg-green-100 rounded-full h-20 w-20 flex items-center justify-center">
                            <Icon name="check" className="h-12 w-12 text-status-green" />
                         </div>
                         <h3 className="text-2xl font-bold text-gray-800 mt-4">Success!</h3>
                         <p className="text-gray-600 mt-1">{selectedAmount} {transport.currency} has been added to your card.</p>
                         <p className="text-xl font-semibold text-gray-800 mt-4">New Balance: {transport.balance.toFixed(2)} {transport.currency}</p>
                         <button onClick={resetModal} className="mt-6 w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-dark transition-colors">
                            Done
                         </button>
                     </div>
                )}
            </Modal>
        </div>
    );
};

export default TransportView;
