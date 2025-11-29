
import React, { useState } from 'react';
import type { Benefit } from '../../types';
import Icon from '../shared/Icon';

interface BenefitsViewProps {
    benefits: Benefit[];
}

const BenefitCard: React.FC<{ benefit: Benefit }> = ({ benefit }) => {
    const [shared, setShared] = useState(false);

    const handleShare = () => {
        setShared(true);
        navigator.clipboard.writeText(`Benefit Update for ${benefit.recipient}:\nName: ${benefit.name}\nStatus: ${benefit.status}\nNext Payment: ${benefit.nextPaymentDate}\nAnnual Amount: ${benefit.annualAmount} MDL`);
        setTimeout(() => setShared(false), 2000);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-brand-secondary">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                    <p className="text-sm font-semibold text-brand-primary">{benefit.recipient}</p>
                    <h2 className="text-2xl font-bold text-gray-800 mt-1">{benefit.name}</h2>
                    <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                        <Icon name="check" className="w-4 h-4 mr-2" />
                        {benefit.status}
                    </span>
                </div>
                <button
                    onClick={handleShare}
                    className={`mt-4 sm:mt-0 flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                        shared
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    <Icon name={shared ? "check" : "share"} className="w-5 h-5 mr-2" />
                    {shared ? 'Copied!' : 'Share'}
                </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                <div>
                    <p className="text-sm text-gray-500">Next Payment Date</p>
                    <p className="text-lg font-semibold text-gray-800">{benefit.nextPaymentDate}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total Annual Amount</p>
                    <p className="text-lg font-semibold text-gray-800">{benefit.annualAmount.toLocaleString()} MDL</p>
                </div>
            </div>
        </div>
    );
};

const BenefitsView: React.FC<BenefitsViewProps> = ({ benefits }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Family Benefits</h1>
            <div className="space-y-6">
                {benefits.map(benefit => (
                    <BenefitCard key={benefit.id} benefit={benefit} />
                ))}
            </div>

            <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <Icon name="info" className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                           This section shows benefits linked to your family. For more information or to apply for new benefits, please visit the National House of Social Insurance portal.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BenefitsView;
