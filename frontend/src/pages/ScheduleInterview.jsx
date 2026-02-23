import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Mail, Calendar, Bold, Italic, Link, List, ListOrdered, Sparkles, ChevronLeft, Calendar as CalendarIcon, Send } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { fetchCandidateDetails, scheduleInterview } from '../services/api';

export default function ScheduleInterview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isReject = new URLSearchParams(location.search).get('type') === 'reject';
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isScheduling, setIsScheduling] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState("Oct 24, 2:00 PM - 2:30 PM");
    const editorRef = React.useRef(null);

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

    const handleSchedule = async () => {
        if (!candidate) return;
        setIsScheduling(true);
        try {
            const subject = isReject
                ? 'Update on your application to Recruit-AI'
                : 'Invitation to Interview at Recruit-AI: Senior Role';

            const body = editorRef.current ? editorRef.current.innerText : 'Please contact us regarding your application.';
            const email = candidate.email || 'candidate@example.com';

            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(gmailUrl, '_blank');

            await scheduleInterview(id, selectedSlot, "Syncing action to backend...");

            navigate('/candidates');
        } catch (err) {
            console.error("Failed to schedule", err);
            alert("Failed to trigger email automation.");
        } finally {
            setIsScheduling(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500 font-medium">Loading Interview setup...</div>;
    }

    if (!candidate) {
        return <div className="p-8 text-center text-red-500 font-medium">Candidate not found.</div>;
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Breadcrumbs & Header */}
            <div>
                <nav className="flex text-sm text-slate-500 mb-2">
                    <ol className="flex items-center space-x-2">
                        <li><a href="/candidates" className="hover:text-slate-900">Candidates</a></li>
                        <li><ChevronRight size={14} /></li>
                        <li><a href={`/candidates/${id}`} className="hover:text-slate-900">{candidate.name}</a></li>
                        <li><ChevronRight size={14} /></li>
                        <li className="font-medium text-slate-900">{isReject ? 'Draft Rejection' : 'Schedule Interview'}</li>
                    </ol>
                </nav>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold text-slate-900">{isReject ? 'Candidate Rejection' : 'Interview Automation'}</h1>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Sparkles size={12} className="mr-1" /> {candidate.score}% Match
                        </span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white p-1 rounded-full shadow-sm border border-slate-200 pr-4 pl-1">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 leading-none mb-0.5">{candidate.name}</p>
                            <p className="text-xs text-slate-500 leading-none">{candidate.role || 'Candidate'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
                {/* Left Column (Email Draft) */}
                <Card className="flex flex-col shadow-sm border-slate-200">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center">
                            <Mail size={16} className="mr-2 text-primary-600" /> Email Draft
                        </h3>
                        <div className="flex bg-slate-100 rounded p-0.5">
                            <button className="px-3 py-1 bg-white shadow-sm rounded text-xs font-medium text-slate-700">Preview</button>
                            <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-700">Templates</button>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col p-6 space-y-4">
                        <div className="flex items-center border-b border-slate-100 pb-3">
                            <span className="text-sm text-slate-500 w-16">To:</span>
                            <div className="flex items-center bg-slate-100 px-2 py-1 rounded text-sm text-slate-700">
                                <div className="h-5 w-5 bg-indigo-200 rounded-full mr-2"></div>
                                {candidate.name} <span className="ml-2 text-slate-400 hover:text-slate-600 cursor-pointer">×</span>
                            </div>
                        </div>

                        <div className="flex items-center border-b border-slate-100 pb-3">
                            <span className="text-sm text-slate-500 w-16">Subject:</span>
                            <span className="text-sm font-medium text-slate-900">{isReject ? 'Update on your application to Recruit-AI' : 'Invitation to Interview at Recruit-AI: Senior Role'}</span>
                        </div>

                        <div className="flex-1 flex flex-col border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
                            {/* Toolbar */}
                            <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                    <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded"><Bold size={16} /></button>
                                    <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded"><Italic size={16} /></button>
                                    <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded"><Link size={16} /></button>
                                    <div className="w-px h-4 bg-slate-300 mx-1"></div>
                                    <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded"><List size={16} /></button>
                                    <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded"><ListOrdered size={16} /></button>
                                </div>
                                <button className="flex items-center text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded hover:bg-primary-100">
                                    <Sparkles size={12} className="mr-1" /> AI Generated
                                </button>
                            </div>

                            {/* Editor Content */}
                            <div
                                ref={editorRef}
                                className="flex-1 p-4 font-sans text-sm text-slate-800 leading-relaxed overflow-y-auto outline-none"
                                contentEditable
                                suppressContentEditableWarning
                            >
                                Hi <strong>{candidate.name.split(' ')[0]}</strong>,<br /><br />
                                {isReject ? (
                                    <>
                                        Thank you for taking the time to apply for the {candidate.role || 'open position'} at Recruit-AI and exploring our journey.<br /><br />
                                        While your background is impressive, we have decided to advance with other candidates who more closely align with our current technical requirements.<br /><br />
                                        We wish you the best in your job search and future endeavors.<br /><br />
                                        Best regards,<br />
                                        The Recruit-AI Team
                                    </>
                                ) : (
                                    <>
                                        I hope you're having a great week!<br /><br />
                                        Our team at Recruit-AI was incredibly impressed by your background. Based on our analysis, your experience makes you an exceptional <strong className="text-emerald-600">{candidate.score}% match</strong> for our role.<br /><br />
                                        We'd love to schedule a 30-minute introductory call to discuss how your skills align with our roadmap.<br /><br />
                                        Please select a time that works best for you, or consider the slot I've proposed below:<br /><br />

                                        <div className="my-4 border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-start">
                                            <CalendarIcon className="text-primary-600 mt-0.5 mr-3" size={20} />
                                            <div>
                                                <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">Proposed Time</p>
                                                <div className="flex items-center bg-white border border-slate-200 px-3 py-1.5 rounded shadow-sm inline-flex">
                                                    <span className="text-sm font-medium text-slate-900">Oct 24, 2:00 PM - 2:30 PM</span>
                                                    <span className="ml-2 text-slate-400 hover:text-slate-600 cursor-pointer">×</span>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-2 italic">Click a slot on the calendar to add more options...</p>
                                            </div>
                                        </div>

                                        Looking forward to connecting,<br />
                                        Sarah
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <button className="text-sm text-slate-500 font-medium hover:text-slate-700">Save Draft</button>
                        <Button
                            className="flex items-center bg-primary-600 hover:bg-primary-700 text-white rounded-md px-6 py-2"
                            onClick={handleSchedule}
                            disabled={isScheduling}
                        >
                            <Send size={16} className="mr-2" /> {isScheduling ? "Sending..." : isReject ? "Send Rejection & Sync" : "Send Invitation & Sync"}
                        </Button>
                    </div>
                </Card>

                {/* Right Column (Calendar View) */}
                <Card className="flex flex-col shadow-sm border-slate-200 overflow-hidden bg-white">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="bg-indigo-50 text-indigo-600 p-1.5 rounded mr-3">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Sarah's Availability</h3>
                                <p className="text-xs text-slate-500 mt-0.5">October 2023</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 bg-slate-100 rounded-md p-1">
                            <button className="p-1 text-slate-500 hover:bg-white rounded hover:shadow-sm"><ChevronLeft size={16} /></button>
                            <span className="text-xs font-medium text-slate-700 px-2">Oct 22 - 28</span>
                            <button className="p-1 text-slate-500 hover:bg-white rounded hover:shadow-sm"><ChevronRight size={16} /></button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {/* Calendar Grid Header */}
                        <div className="grid grid-cols-5 border-b border-slate-100 divide-x divide-slate-100 bg-slate-50/50 sticky top-0 z-10">
                            {['MON 23', 'TUE 24', 'WED 25', 'THU 26', 'FRI 27'].map((day, i) => (
                                <div key={day} className="py-3 text-center">
                                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${i === 1 ? 'text-primary-600' : 'text-slate-400'}`}>{day.split(' ')[0]}</p>
                                    <p className={`text-xl font-bold ${i === 1 ? 'bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : 'text-slate-900'}`}>{day.split(' ')[1]}</p>
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid Body (Simulated) */}
                        <div className="h-[600px] relative mt-4 px-2">
                            {/* Grid lines */}
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="absolute w-full border-t border-slate-100" style={{ top: `${i * 60}px` }}></div>
                            ))}

                            {/* Grid columns */}
                            <div className="grid grid-cols-5 gap-2 absolute inset-0 pt-0 pb-4 h-full">

                                {/* Monday */}
                                <div className="relative">
                                    <div className="absolute top-[0px] w-full bg-slate-100 border border-slate-200 rounded p-2 h-[120px]">
                                        <p className="text-[10px] font-medium text-slate-500">Team Sync</p>
                                    </div>
                                    <div className="absolute top-[180px] w-full bg-blue-50 border border-blue-200 rounded p-2 h-[45px] cursor-pointer hover:border-primary-400 hover:bg-blue-100 transition-colors flex items-center justify-center">
                                        <span className="text-xs font-bold text-primary-700">1:00 PM</span>
                                    </div>
                                </div>

                                {/* Tuesday */}
                                <div className="relative">
                                    <div className="absolute top-[0px] w-full bg-slate-200 border border-slate-300 rounded p-2 h-[60px]">
                                        <p className="text-[10px] font-medium text-slate-600">Interview</p>
                                    </div>
                                    <div className="absolute top-[80px] w-full bg-blue-50 border border-blue-200 rounded p-2 h-[60px] cursor-pointer hover:border-primary-400 hover:bg-blue-100 transition-colors flex items-center justify-center">
                                        <span className="text-xs font-bold text-primary-700">11:00 AM</span>
                                    </div>
                                    <div className="absolute top-[240px] w-full bg-primary-600 shadow-md rounded p-2 h-[60px] flex justify-center items-center text-white">
                                        <CheckCircle size={14} className="mr-1" />
                                        <span className="text-xs font-bold">2:00 PM</span>
                                    </div>
                                    <div className="absolute top-[320px] w-full bg-blue-50 border border-blue-200 rounded p-2 h-[60px] cursor-pointer hover:border-primary-400 hover:bg-blue-100 transition-colors flex items-center justify-center">
                                        <span className="text-xs font-bold text-primary-700">4:00 PM</span>
                                    </div>
                                </div>

                                {/* Wednesday */}
                                <div className="relative">
                                    <div className="absolute top-[30px] w-full bg-slate-100 border border-slate-200 rounded p-2 h-[150px]">
                                        <p className="text-[10px] font-medium text-slate-500">Deep Work</p>
                                    </div>
                                    <div className="absolute top-[200px] w-full bg-blue-50 border border-blue-200 rounded p-2 h-[60px] cursor-pointer hover:border-primary-400 hover:bg-blue-100 transition-colors flex items-center justify-center">
                                        <span className="text-xs font-bold text-primary-700">2:00 PM</span>
                                    </div>
                                </div>

                                {/* Thursday */}
                                <div className="relative">
                                    <div className="absolute top-[80px] w-full bg-blue-50 border border-blue-200 rounded p-2 h-[60px] cursor-pointer hover:border-primary-400 hover:bg-blue-100 transition-colors flex items-center justify-center">
                                        <span className="text-xs font-bold text-primary-700">11:00 AM</span>
                                    </div>
                                    <div className="absolute top-[160px] w-full bg-blue-50 border border-blue-200 rounded p-2 h-[45px] cursor-pointer hover:border-primary-400 hover:bg-blue-100 transition-colors flex items-center justify-center">
                                        <span className="text-xs font-bold text-primary-700">1:00 PM</span>
                                    </div>
                                </div>

                                {/* Friday */}
                                <div className="relative">
                                    <div className="absolute top-[0px] w-full bg-red-50/50 border border-red-100 rounded p-2 h-[45px] flex items-center justify-center">
                                        <p className="text-[10px] font-medium text-red-400">Out of Office</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/50 mt-auto">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center"><div className="w-3 h-3 rounded bg-blue-100 border border-blue-200 mr-2"></div><span className="text-slate-600 font-medium">Available</span></div>
                            <div className="flex items-center"><div className="w-3 h-3 rounded bg-primary-600 mr-2"></div><span className="text-slate-600 font-medium">Selected</span></div>
                            <div className="flex items-center"><div className="w-3 h-3 rounded bg-slate-200 mr-2"></div><span className="text-slate-600 font-medium">Busy</span></div>
                        </div>
                        <a href="#" className="font-medium text-primary-600 hover:text-primary-700 flex items-center">
                            View Full Calendar <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></svg>
                        </a>
                    </div>
                </Card>
            </div>
        </div>
    );
}
