import React from 'react';

interface ProgressTrackerProps {
    currentStep: number; // Not really used in this chapter-based flow, but good for visual
    totalSteps: number;
    chapterTitle: string;
    estimatedMinutes?: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
    currentStep,
    totalSteps,
    chapterTitle,
    estimatedMinutes
}) => {
    // Calculate percentage based on nodes visited vs total nodes?
    // Or just a static "Chapter 1 of 5"
    // The prompt says "Chapter 1 of 5" with progress bar.
    // Since we don't know total nodes easily at runtime (branching), we might just estimate or use a fixed progress for now.
    // Let's assume we pass a percentage or calculate it.

    const progress = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

    return (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                        Chapter 1 of 5: {chapterTitle}
                    </h2>
                    {estimatedMinutes && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ~{estimatedMinutes} min
                        </span>
                    )}
                </div>

                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
