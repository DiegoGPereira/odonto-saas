import React, { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Tooth {
    id: string;
    number: number;
    status: string;
    notes?: string;
}

interface OdontogramProps {
    patientId: string;
}

const TOOTH_NUMBERS = [
    // Upper Right (18-11)
    18, 17, 16, 15, 14, 13, 12, 11,
    // Upper Left (21-28)
    21, 22, 23, 24, 25, 26, 27, 28,
    // Lower Right (48-41)
    48, 47, 46, 45, 44, 43, 42, 41,
    // Lower Left (31-38)
    31, 32, 33, 34, 35, 36, 37, 38
];

const STATUS_COLORS: Record<string, string> = {
    HEALTHY: 'fill-slate-50 hover:fill-slate-100',
    CAVITY: 'fill-red-400 hover:fill-red-500',
    RESTORED: 'fill-blue-400 hover:fill-blue-500',
    MISSING: 'fill-slate-800 hover:fill-slate-900',
    CANAL: 'fill-purple-400 hover:fill-purple-500',
    PROTHESIS: 'fill-yellow-400 hover:fill-yellow-500',
};

const STATUS_LABELS: Record<string, string> = {
    HEALTHY: 'Saudável',
    CAVITY: 'Cárie',
    RESTORED: 'Restaurado',
    MISSING: 'Ausente',
    CANAL: 'Canal',
    PROTHESIS: 'Prótese',
};

const BG_COLORS: Record<string, string> = {
    HEALTHY: 'bg-slate-50',
    CAVITY: 'bg-red-400',
    RESTORED: 'bg-blue-400',
    MISSING: 'bg-slate-800',
    CANAL: 'bg-purple-400',
    PROTHESIS: 'bg-yellow-400',
};

const TEXT_COLORS: Record<string, string> = {
    HEALTHY: 'fill-slate-700',
    CAVITY: 'fill-white',
    RESTORED: 'fill-white',
    MISSING: 'fill-white',
    CANAL: 'fill-white',
    PROTHESIS: 'fill-slate-700',
};

export const Odontogram: React.FC<OdontogramProps> = ({ patientId }) => {
    const [teeth, setTeeth] = useState<Tooth[]>([]);
    const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadOdontogram();
    }, [patientId]);

    const loadOdontogram = async () => {
        try {
            const { data } = await api.get(`/odontogram/${patientId}`);
            setTeeth(data);
        } catch (err) {
            console.error('Error loading odontogram:', err);
            toast.error('Erro ao carregar odontograma');
        }
    };

    const handleToothClick = (number: number) => {
        const tooth = teeth.find(t => t.number === number);
        setSelectedTooth(number);
        setNotes(tooth?.notes || '');
    };

    const handleUpdateStatus = async (status: string) => {
        if (!selectedTooth) return;

        setLoading(true);
        try {
            await api.put(`/odontogram/${patientId}/tooth`, {
                number: selectedTooth,
                status,
                notes
            });

            await loadOdontogram();
            toast.success('Dente atualizado com sucesso');
            setSelectedTooth(null);
        } catch (err) {
            console.error('Error updating tooth:', err);
            toast.error('Erro ao atualizar dente');
        } finally {
            setLoading(false);
        }
    };

    const getToothColor = (number: number) => {
        const tooth = teeth.find(t => t.number === number);
        const status = tooth?.status || 'HEALTHY';
        return STATUS_COLORS[status] || STATUS_COLORS.HEALTHY;
    };

    const getToothTextColor = (number: number) => {
        const tooth = teeth.find(t => t.number === number);
        const status = tooth?.status || 'HEALTHY';
        return TEXT_COLORS[status] || TEXT_COLORS.HEALTHY;
    };

    const ToothShape = ({ number, className }: { number: number, className?: string }) => (
        <svg
            viewBox="0 0 100 100"
            className="w-12 h-12 cursor-pointer drop-shadow-sm hover:scale-110 transition-transform duration-200"
            onClick={() => handleToothClick(number)}
        >
            <path
                d="M20,30 Q20,10 50,10 Q80,10 80,30 L80,70 Q80,90 50,90 Q20,90 20,70 Z"
                stroke="#334155"
                strokeWidth="2"
                className={`transition-colors duration-200 ${className}`}
            />
            <text
                x="50"
                y="55"
                textAnchor="middle"
                fontSize="24"
                fontWeight="bold"
                className={`pointer-events-none transition-colors duration-200 ${getToothTextColor(number)}`}
            >
                {number}
            </text>
        </svg>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Arcada Dentária</h3>

                <div className="flex flex-col gap-8 items-center">
                    {/* Upper Teeth */}
                    <div className="flex gap-2 flex-wrap justify-center">
                        {TOOTH_NUMBERS.slice(0, 16).map(num => (
                            <ToothShape key={num} number={num} className={getToothColor(num)} />
                        ))}
                    </div>

                    <div className="w-full h-px bg-slate-200 my-2"></div>

                    {/* Lower Teeth */}
                    <div className="flex gap-2 flex-wrap justify-center">
                        {TOOTH_NUMBERS.slice(16).map(num => (
                            <ToothShape key={num} number={num} className={getToothColor(num)} />
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex gap-4 flex-wrap justify-center text-sm text-slate-600">
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <div key={key} className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full border border-slate-200 ${BG_COLORS[key]}`}></div>
                            <span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            {selectedTooth && (
                <div className="w-full lg:w-80 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">
                        Dente {selectedTooth}
                    </h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleUpdateStatus(key)}
                                        disabled={loading}
                                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${teeth.find(t => t.number === selectedTooth)?.status === key
                                            ? 'bg-primary text-white border-primary'
                                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Observações</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                rows={3}
                                placeholder="Adicione notas sobre o dente..."
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedTooth(null)}
                                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
