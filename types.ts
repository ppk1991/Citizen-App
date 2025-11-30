export type View = 'DASHBOARD' | 'PROJECTS' | 'TRANSPORT' | 'TAXES' | 'UTILITIES' | 'BENEFITS';

export interface User {
    name: string;
    email: string;
}

export interface Milestone {
    name: string;
    date: string;
    status: 'Completed' | 'Upcoming';
}

export interface Project {
    id: number;
    name: string;
    status: 'In Progress' | 'Planning' | 'Approved' | 'Completed';
    progress: number;
    budget: number;
    company: string;
    endDate: string;
    description: string;
    stakeholders: string[];
    milestones: Milestone[];
    imageUrl: string;
    mapImageUrl?: string;
    coordinates?: { x: number; y: number; };
}

export interface Transport {
    cardName: string;
    balance: number;
    currency: string;
}

export interface Tax {
    id: number;
    name: string;
    amount: number;
    dueDate: string;
    status: 'Due' | 'Paid' | 'Overdue';
    overdue: boolean;
    paymentDate?: string;
}

export interface Utility {
    name: 'Water' | 'Gas' | 'Electricity' | 'Waste Collection';
    usage: string;
    change: number;
    status: 'Due' | 'Paid' | 'On Schedule' | 'Delayed';
    amount: number | null;
    dueDate: string | null;
    autoPay: boolean;
    paymentDate?: string;
}

export interface Benefit {
    id: number;
    name: string;
    status: 'Approved and Processed' | 'Pending';
    nextPaymentDate: string;
    annualAmount: number;
    recipient: string;
}

// FIX: Moved UserData interface here to centralize types and fix import error in Dashboard.tsx.
export interface UserData {
    user: User;
    projects: Project[];
    transport: Transport;
    taxes: Tax[];
    utilities: Utility[];
    benefits: Benefit[];
}