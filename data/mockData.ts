// FIX: Import UserData from the centralized types file.
import type { User, Project, Transport, Tax, Utility, Benefit, UserData } from '../types';

export const initialUserData: UserData = {
    user: {
        name: 'Elena',
        email: 'elena.popescu@email.com',
    },
    projects: [
        { 
            id: 1, 
            name: 'MetroFlor Line M1', 
            status: 'In Progress', 
            progress: 70, 
            budget: 150000000, 
            company: 'InfraConstruct SRL', 
            endDate: '2025-12-31',
            description: 'Construction of a new 15km underground metro line to connect the city center with the northern districts.',
            stakeholders: ['Florești City Hall', 'Ministry of Transport', 'European Investment Bank', 'Local Businesses Association'],
            milestones: [
                { name: 'Planning Start', date: '2022-03-15', status: 'Completed' },
                { name: 'Design Approval', date: '2023-01-20', status: 'Completed' },
                { name: 'Construction', date: '2023-06-01', status: 'Completed' },
                { name: 'Completion', date: '2025-12-31', status: 'Upcoming' },
            ],
            imageUrl: 'https://storage.googleapis.com/aai-web-samples/metro-construction.jpeg',
            mapImageUrl: 'https://storage.googleapis.com/aai-web-samples/metro-map.jpeg',
            coordinates: { x: 50, y: 55 }
        },
        { 
            id: 2, 
            name: 'Răut Plaza Tower', 
            status: 'Approved', 
            progress: 15, 
            budget: 85000000, 
            company: 'UrbanDev Corp', 
            endDate: '2026-08-15',
            description: 'A 25-story mixed-use skyscraper featuring commercial office spaces, luxury apartments, and a rooftop restaurant with panoramic city views.',
            stakeholders: ['UrbanDev Corp Investors', 'Florești Planning Commission', 'Future Tenants Committee'],
            milestones: [
                { name: 'Planning', date: '2023-05-10', status: 'Completed' },
                { name: 'Approval', date: '2024-02-28', status: 'Completed' },
                { name: 'Construction', date: '2024-09-01', status: 'Upcoming' },
                { name: 'Completion', date: '2026-08-15', status: 'Upcoming' },
            ],
            imageUrl: 'https://picsum.photos/seed/tower/600/400',
            coordinates: { x: 30, y: 25 }
        },
        { 
            id: 3, 
            name: 'Varvareuca IT Hub', 
            status: 'Planning', 
            progress: 5, 
            budget: 120000000, 
            company: 'TechBuild Inc.', 
            endDate: '2027-01-20',
            description: 'Developing a state-of-the-art technology park to attract international IT companies and foster local startups, creating an estimated 2,500 new jobs.',
            stakeholders: ['Ministry of Economy and Digitalization', 'TechBuild Inc.', 'National Association of ICT Companies'],
            milestones: [
                { name: 'Feasibility', date: '2024-01-15', status: 'Completed' },
                { name: 'Planning', date: '2025-02-01', status: 'Upcoming' },
                { name: 'Acquisition', date: '2025-08-01', status: 'Upcoming' },
                { name: 'Construction', date: '2026-03-01', status: 'Upcoming' },
            ],
            imageUrl: 'https://picsum.photos/seed/hub/600/400',
            coordinates: { x: 80, y: 75 }
        },
        { 
            id: 4, 
            name: 'City Park Revitalization', 
            status: 'Completed', 
            progress: 100, 
            budget: 5000000, 
            company: 'GreenScapes', 
            endDate: '2023-05-01',
            description: 'Complete overhaul of the central city park, including new playgrounds, a modern irrigation system, a dedicated dog park, and restoration of historical monuments.',
            stakeholders: ['Florești Parks Department', 'Community Action Group "Green Florești"', 'Local Residents'],
            milestones: [
                { name: 'Consultation', date: '2022-09-01', status: 'Completed' },
                { name: 'Design', date: '2022-11-15', status: 'Completed' },
                { name: 'Renovation', date: '2023-01-10', status: 'Completed' },
                { name: 'Inauguration', date: '2023-05-01', status: 'Completed' },
            ],
            imageUrl: 'https://picsum.photos/seed/park/600/400',
            coordinates: { x: 65, y: 30 }
        }
    ],
    transport: {
        cardName: 'Florești MetroCard',
        balance: 125.50,
        currency: 'MDL',
    },
    taxes: [
        { id: 1, name: 'Property Tax', amount: 890, dueDate: '2024-06-30', status: 'Overdue', overdue: true },
        { id: 2, name: 'Business Tax', amount: 1250, dueDate: '2024-09-30', status: 'Due', overdue: false },
    ],
    utilities: [
        { name: 'Water', usage: '23.5 m³', change: 5, status: 'Due', amount: 345.50, dueDate: '2024-07-25', autoPay: false },
        { name: 'Gas', usage: '45.2 m³', change: 12, status: 'Due', amount: 780.20, dueDate: '2024-07-25', autoPay: true },
        { name: 'Electricity', usage: '156 kWh', change: -2, status: 'Paid', amount: 450.00, dueDate: '2024-06-25', autoPay: false, paymentDate: '2024-06-24' },
        { name: 'Waste Collection', usage: '-', change: 0, status: 'On Schedule', amount: null, dueDate: null, autoPay: false },
    ],
    benefits: [
        { id: 1, name: 'Pensioner Compensation', status: 'Approved and Processed', nextPaymentDate: 'January 15', annualAmount: 37560, recipient: "Elena's Mother" }
    ],
};