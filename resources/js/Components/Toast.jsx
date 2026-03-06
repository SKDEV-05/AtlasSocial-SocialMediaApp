import { useEffect } from 'react';
import { Transition } from '@headlessui/react';

export default function Toast({ message, show, onClose, type = 'success' }) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <div
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-[100]"
        >
            <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                <Transition
                    show={show}
                    enter="transform ease-out duration-500 transition"
                    enterFrom="translate-y-4 opacity-0 scale-95 sm:translate-y-0 sm:translate-x-4"
                    enterTo="translate-y-0 opacity-100 scale-100 sm:translate-x-0"
                    leave="transition ease-in duration-300"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-[20px] bg-white/95 backdrop-blur-md shadow-2xl border border-emerald-50 ring-1 ring-black/5">
                        <div className="p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    {type === 'success' ? (
                                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                            <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm font-black text-gray-900 leading-tight">
                                        {type === 'success' ? 'Great!' : 'Attention'}
                                    </p>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">{message}</p>
                                </div>
                                <div className="ml-4 flex flex-shrink-0">
                                    <button
                                        type="button"
                                        className="inline-flex rounded-lg p-1.5 bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all focus:outline-none"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Progress bar at bottom */}
                        <div className={`h-1.5 w-full bg-gray-100 overflow-hidden`}>
                             <div 
                                className={`h-full ${type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'} animate-[shrink_4s_linear_forwards] origin-left`}
                             ></div>
                        </div>
                    </div>
                </Transition>
            </div>
            <style jsx>{`
                @keyframes shrink {
                    from { transform: scaleX(1); }
                    to { transform: scaleX(0); }
                }
            `}</style>
        </div>
    );
}
