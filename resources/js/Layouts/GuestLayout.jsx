import { Link } from '@inertiajs/react';
import Text from '@/Components/Text';
import ApplicationLogo from '@/Components/ApplicationLogo';


export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div
                className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #064e3b 0%, #065f46 30%, #047857 60%, #059669 100%)' }}
            >
                {/* Animated Background Orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/3 -right-24 w-80 h-80 bg-green-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute -bottom-32 left-1/4 w-72 h-72 bg-teal-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }}></div>

                {/* Logo */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <ApplicationLogo className="w-16 h-16 object-contain" />
                        <Text className="text-2xl font-black text-white tracking-tight">Atlas Social</Text>
                    </div>
                    <p className="text-emerald-200 text-sm font-medium">Connect. Share. Collaborate.</p>
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
                            <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span>
                            <span className="text-emerald-200 text-xs font-bold uppercase tracking-wider">2026 Edition</span>
                        </div>
                        <h1 className="text-5xl font-black text-white leading-tight mb-4">
                            Connect with<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200">
                                everyone
                            </span>
                        </h1>
                        <p className="text-emerald-100/80 text-lg leading-relaxed max-w-sm">
                            Share posts, chat in real-time, and stay connected with the people who matter most.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                        {[
                            { icon: '💬', title: 'Real-time messaging', desc: 'Instant chat with friends' },
                            { icon: '📸', title: 'Share moments', desc: 'Post photos and updates' },
                            { icon: '🔔', title: 'Smart notifications', desc: 'Never miss a message' },
                        ].map((f, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white/8 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/12 transition-all">
                                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                                    {f.icon}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">{f.title}</p>
                                    <p className="text-emerald-200/70 text-xs">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {['?u=a1', '?u=b2', '?u=c3', '?u=d4'].map((u, i) => (
                                <img key={i} src={`https://i.pravatar.cc/32${u}`} alt="" className="w-7 h-7 rounded-full ring-2 ring-emerald-700 object-cover" />
                            ))}
                        </div>
                        <p className="text-emerald-200/70 text-xs font-medium">Join <span className="text-white font-bold">1,200+</span> users already connected</p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Auth Form */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-white px-6 py-12">
                {/* Mobile Logo */}
                <div className="lg:hidden mb-8 text-center">
                    <ApplicationLogo className="w-20 h-20 object-contain mx-auto mb-3" />
                    <Text as="h2" className="text-2xl font-black text-gray-900">Atlas Social</Text>
                </div>

                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
