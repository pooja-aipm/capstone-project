import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Filter, Users, Activity, Star, CalendarDays, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { fetchCandidates, uploadBatch } from '../services/api';

const KPIS = [
    { id: 'total', label: 'Total Processed', value: '0', icon: Users, color: 'text-primary-600', bg: 'bg-primary-50' },
    { id: 'avg_score', label: 'Avg Fit Score', value: '0%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'top_matches', label: 'Top Matches', value: '0', icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'interviews', label: 'Interviews', value: '0', icon: CalendarDays, color: 'text-orange-600', bg: 'bg-orange-50' },
];

export default function Candidates() {
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const [kpis, setKpis] = useState(KPIS);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.useRef(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchCandidates();
                setCandidates(data.candidates);
                setKpis([
                    { ...KPIS[0], value: data.kpis.total },
                    { ...KPIS[1], value: data.kpis.avg_score + '%' },
                    { ...KPIS[2], value: data.kpis.top_matches },
                    { ...KPIS[3], value: data.kpis.interviews },
                ]);
            } catch (error) {
                console.error("Failed to load candidates", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleImportResume = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const jdText = localStorage.getItem('jdText');
        if (!jdText) {
            alert("Please set a Job Description on the Dashboard first.");
            return;
        }
        setIsUploading(true);
        try {
            await uploadBatch(jdText, [file]);
            const data = await fetchCandidates();
            setCandidates(data.candidates);
            setKpis([
                { ...KPIS[0], value: data.kpis.total },
                { ...KPIS[1], value: data.kpis.avg_score + '%' },
                { ...KPIS[2], value: data.kpis.top_matches },
                { ...KPIS[3], value: data.kpis.interviews },
            ]);
        } catch (error) {
            console.error("Failed to upload resume", error);
            alert("Failed to upload resume. See console for details.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500 font-medium">Loading Candidates...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Candidate Comparison</h1>
                    <p className="text-slate-500 mt-1">Reviewing batch for <span className="font-semibold text-slate-700">Senior Frontend Engineer</span></p>
                </div>
                <div className="flex space-x-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImportResume}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                    />
                    <Button
                        variant="secondary"
                        className="flex items-center space-x-2 bg-white"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                        <span>{isUploading ? "Uploading..." : "Import Resume"}</span>
                    </Button>
                    <Button className="flex items-center space-x-2">
                        <Filter size={16} />
                        <span>Compare Selected</span>
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {KPIS.map((kpi, idx) => (
                    <Card key={idx} className="shadow-sm border-slate-200">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">{kpi.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
                            </div>
                            <div className={`p-3 rounded-lg ${kpi.bg} ${kpi.color}`}>
                                <kpi.icon size={24} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row gap-6 mt-6">

                {/* Sidebar Filters */}
                <div className="w-full lg:w-64 space-y-6 flex-shrink-0">
                    <div>
                        <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">Fit Score</h4>
                        <div className="space-y-2">
                            {[
                                { label: '90% - 100%', checked: true },
                                { label: '80% - 89%', checked: true },
                                { label: '70% - 79%', checked: false },
                                { label: '< 70%', checked: false },
                            ].map(opt => (
                                <label key={opt.label} className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" checked={opt.checked} readOnly className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                                    <span className="text-sm text-slate-700">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">Key Skills</h4>
                        <div className="space-y-2">
                            {[
                                { label: 'React', checked: true },
                                { label: 'TypeScript', checked: true },
                                { label: 'Node.js', checked: false },
                                { label: 'GraphQL', checked: false },
                                { label: 'AWS', checked: false },
                            ].map(opt => (
                                <label key={opt.label} className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" checked={opt.checked} readOnly className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                                    <span className="text-sm text-slate-700">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">Experience Level</h4>
                        <div className="space-y-2">
                            {[
                                { label: 'Entry (0-2 yrs)', checked: false },
                                { label: 'Mid (3-5 yrs)', checked: false },
                                { label: 'Senior (5-8 yrs)', checked: true },
                                { label: 'Lead (8+ yrs)', checked: true },
                            ].map(opt => (
                                <label key={opt.label} className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" checked={opt.checked} readOnly className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                                    <span className="text-sm text-slate-700">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Data Table Area */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    {/* Table Toolbar */}
                    <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                        <div className="relative w-72">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search candidates..."
                                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-500">Sort by:</span>
                            <button className="flex items-center justify-between border border-slate-300 rounded-md px-3 py-2 text-sm bg-white min-w-[160px]">
                                <span className="font-medium text-slate-700">Highest Fit Score</span>
                                <ChevronDown size={14} className="text-slate-500 ml-2" />
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 tracking-wider">
                                    <th className="px-6 py-4 w-12 text-center">
                                        <input type="checkbox" className="rounded border-slate-300 text-primary-600" />
                                    </th>
                                    <th className="px-4 py-4 uppercase">Candidate Name</th>
                                    <th className="px-4 py-4 uppercase">Fit Score</th>
                                    <th className="px-4 py-4 uppercase">Key Strength</th>
                                    <th className="px-4 py-4 uppercase">Primary Gap</th>
                                    <th className="px-4 py-4 uppercase">Status</th>
                                    <th className="px-4 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {candidates.map((candidate, idx) => (
                                    <tr key={candidate.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-center">
                                            <input type="checkbox" defaultChecked={idx < 2} className="rounded border-slate-300 text-primary-600" />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm bg-indigo-100 text-indigo-700`}>
                                                    {candidate.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{candidate.name}</p>
                                                    <p className="text-xs text-slate-500 font-medium">{candidate.role || 'Candidate'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center">
                                                <span className="text-base font-bold text-slate-900 mr-2">{candidate.score}%</span>
                                                <div className="w-10 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${candidate.score >= 90 ? 'bg-emerald-500' : candidate.score >= 80 ? 'bg-primary-500' : 'bg-orange-500'}`}
                                                        style={{ width: `${candidate.score}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                {candidate.strength || candidate?.key_matches?.[0]?.title || 'Good Fit'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            {(candidate.gap || candidate?.potential_gaps?.[0]?.title) && (candidate.gap || candidate?.potential_gaps?.[0]?.title) !== 'None detected' ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                                    <svg width="12" height="12" className="mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                                                    {candidate.gap || candidate?.potential_gaps?.[0]?.title}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">None detected</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${candidate.status === 'New' ? 'bg-blue-50 text-blue-700' :
                                                candidate.status === 'Shortlisted' ? 'bg-purple-50 text-purple-700' :
                                                    candidate.status === 'Screening' ? 'bg-slate-100 text-slate-700' :
                                                        'bg-orange-50 text-orange-700'
                                                }`}>
                                                {candidate.status || 'New'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <button onClick={() => navigate(`/candidates/${candidate.id}`)} className="text-sm font-medium text-primary-600 hover:text-primary-700">View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-sm text-slate-500">Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">5</span> of <span className="font-medium text-slate-900">124</span> results</span>
                        <div className="flex bg-white rounded-md border border-slate-300 shadow-sm overflow-hidden text-sm">
                            <button className="px-3 py-1.5 border-r border-slate-300 hover:bg-slate-50 text-slate-500">&lt;</button>
                            <button className="px-3 py-1.5 border-r border-slate-300 bg-primary-50 text-primary-600 font-medium">1</button>
                            <button className="px-3 py-1.5 border-r border-slate-300 hover:bg-slate-50 text-slate-700 font-medium">2</button>
                            <button className="px-3 py-1.5 border-r border-slate-300 hover:bg-slate-50 text-slate-700 font-medium">3</button>
                            <button className="px-3 py-1.5 border-r border-slate-300 hover:bg-slate-50 text-slate-700 font-medium">...</button>
                            <button className="px-3 py-1.5 hover:bg-slate-50 text-slate-500">&gt;</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
