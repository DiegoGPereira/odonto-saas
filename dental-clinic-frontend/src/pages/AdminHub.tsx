import React from 'react';
import { Link } from 'react-router-dom';
import { Users, DollarSign } from 'lucide-react';

export const AdminHub: React.FC = () => {
    const adminSections = [
        {
            title: 'Usuários',
            description: 'Gerencie usuários do sistema',
            icon: Users,
            path: '/admin/users',
            color: 'bg-blue-500'
        },
        {
            title: 'Procedimentos',
            description: 'Gerencie a tabela de preços',
            icon: DollarSign,
            path: '/admin/procedures',
            color: 'bg-green-500'
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Administração</h1>
                <p className="text-slate-500">Central de gerenciamento do sistema</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminSections.map((section) => (
                    <Link
                        key={section.path}
                        to={section.path}
                        className="group bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-3 ${section.color} rounded-lg group-hover:scale-110 transition-transform`}>
                                <section.icon size={24} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-[var(--color-accent)] transition-colors">
                                    {section.title}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    {section.description}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
