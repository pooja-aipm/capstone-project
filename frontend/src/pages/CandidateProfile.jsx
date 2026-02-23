import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Briefcase, FileText, Mail, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { fetchCandidateDetails } from '../services/api';

export default function CandidateProfile() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCandidate = async () => {
            try {
                const data = await fetchCandidateDetails(id);
                setCandidate(data);
            } catch (err) {
                console.error("Failed to load candidate", err);
            } finally {
                setLoading(false);
            }
        };
        loadCandidate();
    }, [id]);

    if (loading) {
        return <div className="p-8 text-center text-slate-500 font-medium">Loading Candidate Profile...</div>;
    }

    if (!candidate) {
        return <div className="p-8 text-center text-red-500 font-medium">Candidate not found.</div>;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center space-x-3 mb-1">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">Application #{candidate.id}</span>
                        <span className="text-xs text-slate-500">Processed recently</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">{candidate.name}</h1>
                    <p className="flex items-center text-slate-600 mt-1">
                        <Briefcase size={16} className="mr-2" />
                        {candidate.role || 'Candidate'}
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button className="flex items-center space-x-2">
                        <Mail size={16} />
                        <span>Contact Candidate</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                {/* Left Column (AI Analysis) */}
                <div className="lg:col-span-2 space-y-6">

                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center">
                                <span className="text-primary-600 mr-2">✨</span> AI Executive Summary
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed">
                                {candidate.summary}
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Key Matches */}
                        <Card className="shadow-sm border-emerald-100 bg-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 opacity-50"></div>
                            <CardContent className="p-6 relative z-10">
                                <h3 className="text-sm font-bold text-emerald-700 tracking-wide uppercase mb-4 flex items-center">
                                    <CheckCircle size={16} className="mr-2" /> Key Matches
                                </h3>
                                <div className="space-y-4">
                                    {candidate.key_matches?.map((match, i) => (
                                        <div key={i} className="flex items-start">
                                            <CheckCircle size={16} className="text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900">{match.title}</h4>
                                                <p className="text-xs text-slate-500 mt-0.5">{match.desc || match.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!candidate.key_matches || candidate.key_matches.length === 0) && (
                                        <p className="text-xs text-slate-500">No key matches detected.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Potential Gaps */}
                        <Card className="shadow-sm border-red-100 bg-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-0 opacity-50"></div>
                            <CardContent className="p-6 relative z-10">
                                <h3 className="text-sm font-bold text-red-700 tracking-wide uppercase mb-4 flex items-center">
                                    <AlertCircle size={16} className="mr-2" /> Potential Gaps
                                </h3>
                                <div className="space-y-4">
                                    {candidate.potential_gaps?.map((gap, i) => (
                                        <div key={i} className="flex items-start">
                                            <AlertCircle size={16} className="text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900">{gap.title}</h4>
                                                <p className="text-xs text-slate-500 mt-0.5">{gap.desc || gap.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!candidate.potential_gaps || candidate.potential_gaps.length === 0) && (
                                        <p className="text-xs text-slate-500">No major gaps detected.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-5">Skill Confidence Levels</h3>

                            <div className="space-y-5">
                                {candidate.skill_confidence?.map((skill, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between mb-1.5">
                                            <span className="text-sm font-medium text-slate-700">{skill.name || skill.skill}</span>
                                            <span className="text-sm font-bold text-slate-900">{skill.score || skill.confidence}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary-600 rounded-full" style={{ width: `${skill.score || skill.confidence}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (Score & Actions) */}
                <div className="space-y-6">
                    <Card className="shadow-sm text-center">
                        <CardContent className="p-8">
                            <h3 className="text-base font-semibold text-slate-900 mb-6">Overall Fit Score</h3>

                            <div className="relative w-40 h-40 mx-auto mb-6">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="transparent"
                                        stroke={candidate.score >= 80 ? "#2563eb" : candidate.score >= 70 ? "#eab308" : "#ef4444"}
                                        strokeWidth="12"
                                        strokeDasharray="251.2"
                                        strokeDashoffset={251.2 * (100 - (candidate.score || 0)) / 100}
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-slate-900">{candidate.score}<span className="text-2xl">%</span></span>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Match</span>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Cultural Fit</span>
                                    <span className="font-semibold text-emerald-600">{candidate.cultural_fit || 'Medium'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Experience</span>
                                    <span className="font-semibold text-primary-600">{candidate.experience_level || 'Solid'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary-600 border-none text-white shadow-lg overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mt-10 -mr-10"></div>
                        <CardContent className="p-6 relative z-10">
                            <div className="bg-white/20 inline-flex items-center px-2 py-1 rounded text-xs font-bold tracking-wide uppercase mb-4">
                                <span className="mr-1">🤖</span> Agent Recommendation
                            </div>
                            <h3 className="text-xl font-bold mb-2">{candidate.action}</h3>
                            <p className="text-primary-100 text-sm mb-6 leading-relaxed">
                                {candidate.action_reason || "Based on the comprehensive AI reasoning, we recommend this next step."}
                            </p>
                            <div className="space-y-3">
                                {candidate.score < 70 || (candidate.action && candidate.action.toLowerCase().includes('reject')) ? (
                                    <Button
                                        className="w-full bg-red-50 text-red-700 hover:bg-red-100 border-none font-bold"
                                        onClick={() => navigate(`/candidates/${candidate.id}/schedule?type=reject`)}
                                    >
                                        <Mail size={16} className="mr-2 inline" />
                                        Draft Rejection Email
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full bg-white text-primary-700 hover:bg-slate-50 border-none font-bold"
                                        onClick={() => navigate(`/candidates/${candidate.id}/schedule`)}
                                    >
                                        <Calendar size={16} className="mr-2 inline" />
                                        Schedule Interview
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="p-6 bg-slate-50/50">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-900">Generated Questions</h3>
                                <a href="#" className="text-xs font-medium text-primary-600 hover:text-primary-700">View All</a>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                                    <p className="text-sm text-slate-700 italic">"Can you describe a time you had to refactor a large React codebase? How did you ensure stability?"</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">Probes: Architecture</p>
                                </div>
                                <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                                    <p className="text-sm text-slate-700 italic">"How would you approach deploying a frontend app if you had minimal DevOps support?"</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">Probes: Gap Handling</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
