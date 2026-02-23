import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, File as FileIcon, CheckCircle2, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { uploadBatch } from '../services/api';

export default function Dashboard() {
    const navigate = useNavigate();
    const [jdText, setJdText] = useState(() => localStorage.getItem('jdText') || 'Senior Frontend Engineer (React/TypeScript)');
    const [resumes, setResumes] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        const newFiles = acceptedFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file: file,
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            status: 'ready',
            progress: 0,
        }));
        setResumes(prev => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt']
        }
    });

    const handleStartAnalysis = async () => {
        if (resumes.length === 0) return alert("Please add some resumes.");

        try {
            setIsUploading(true);
            setResumes(prev => prev.map(r => ({ ...r, status: 'uploading', progress: 50 })));

            const filesToUpload = resumes.map(r => r.file);
            await uploadBatch(jdText, filesToUpload);

            setResumes(prev => prev.map(r => ({ ...r, status: 'ready', progress: 100 })));

            setTimeout(() => {
                navigate('/candidates');
            }, 500);

        } catch (err) {
            console.error(err);
            alert("Failed to analyze files.");
            setIsUploading(false);
            setResumes(prev => prev.map(r => ({ ...r, status: 'queued', progress: 0 })));
        }
    };

    const removeFile = (id) => {
        setResumes(prev => prev.filter(f => f.id !== id));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
                        <span>Batch Upload Resumes</span>
                    </h1>
                    <p className="text-slate-500 mt-1">Add candidates to the processing queue</p>
                </div>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium font-medium">
                    Need help? View Guide
                </a>
            </div>

            <div className="space-y-6">
                <Card className="shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base font-semibold text-slate-900">Job Description</h3>
                            <div className="flex bg-slate-100 rounded-md p-1">
                                <button className="px-3 py-1 bg-white shadow-sm rounded text-sm font-medium text-slate-700">Upload JD</button>
                                <button className="px-3 py-1 text-sm font-medium text-slate-500 hover:text-slate-700">Paste JD Text</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                                <p className="text-sm font-semibold text-slate-900 mb-2">Job Description Text</p>
                                <textarea
                                    className="w-full h-24 p-2 border border-slate-300 rounded text-sm focus:ring-primary-500"
                                    value={jdText}
                                    onChange={(e) => {
                                        setJdText(e.target.value);
                                        localStorage.setItem('jdText', e.target.value);
                                    }}
                                    placeholder="Paste job description requirements here..."
                                />
                            </div>

                            <div className="bg-primary-50 rounded-lg p-5 flex items-start space-x-3">
                                <div className="text-primary-600 mt-0.5">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 0 0-5 5v2a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5Z" /><path d="M19 14h-1.5M5 14H3.5M12 22v-3.5M12 14v-2M15 14h-1.5M9 14H7.5" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-primary-900">
                                        Parsing logic will adapt to the uploaded role requirements. Ensure the file is clear and readable.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    {...getRootProps()}
                    className={`shadow-sm border-dashed border-2 transition-colors cursor-pointer ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-primary-400 bg-white/50'}`}
                >
                    <input {...getInputProps()} />
                    <CardContent className="p-12 text-center pb-20 pt-16">
                        <div className="mx-auto bg-primary-100 text-primary-600 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                            <UploadCloud size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                            Drop up to 50 Resumes here or <span className="text-primary-600 hover:underline">Click to Browse</span>
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">Support for PDF, DOCX, TXT. Maximum file size 10MB per document.<br />Bulky files will be automatically compressed during upload.</p>

                        <div className="flex items-center justify-center space-x-2">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">.PDF</span>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">.DOCX</span>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">.TXT</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="p-0">
                        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-sm font-semibold text-slate-900">Upload Queue</h3>
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">{resumes.length} Files</span>
                            </div>
                            <button
                                className="text-danger-500 hover:text-danger-600 text-sm font-medium"
                                onClick={(e) => { e.stopPropagation(); setResumes([]); }}
                            >
                                Clear All
                            </button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {resumes.map((file) => (
                                <div key={file.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4 flex-1">
                                        <div className="p-2 bg-red-50 text-red-500 rounded-md">
                                            <FileText size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium text-slate-900">{file.name}</span>
                                                <span className="text-xs text-slate-500">{file.status === 'ready' ? <span className="text-success-500 flex items-center"><CheckCircle2 size={12} className="mr-1" /> Ready</span> : file.status === 'uploading' ? <span className="text-primary-600">Uploading...</span> : 'Queued'}</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <span className="text-xs text-slate-500 w-12">{file.size}</span>
                                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${file.status === 'ready' ? 'bg-success-500' : 'bg-primary-500'}`}
                                                        style={{ width: `${file.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-500 w-8">{file.progress}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="ml-6 text-slate-400 hover:text-slate-600" onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}>
                                        <X size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end items-center space-x-4 pt-4 border-t border-slate-200 mt-8">
                <Button variant="ghost" onClick={() => setResumes([])}>Cancel Batch</Button>
                <Button
                    className="flex items-center space-x-2"
                    onClick={handleStartAnalysis}
                    disabled={isUploading || resumes.length === 0}
                >
                    <span>{isUploading ? 'Analyzing...' : 'Start Batch Analysis'}</span>
                </Button>
            </div>
        </div>
    );
}
