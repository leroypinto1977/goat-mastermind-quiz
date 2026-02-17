import { prisma } from '@/app/lib/prisma';
import { generateNewCode, handleSignOut } from '@/app/admin/actions';
import { Suspense } from 'react';
import DashboardClient from './dashboard-client';
import { signOut } from '@/auth';

export default async function DashboardPage() {
  const users = await prisma.testUser.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen font-sans text-zinc-900 bg-zinc-50 flex">
      {/* Sidebar Navigation */}
      <aside className="fixed w-64 h-full bg-white border-r border-zinc-200 hidden md:flex flex-col">
        <div className="p-8 border-b border-zinc-100">
          <h1 className="text-2xl font-black tracking-tighter text-zinc-900">GOAT <span className="text-zinc-400">ADMIN</span></h1>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
            <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-zinc-100 text-zinc-900 font-bold border border-zinc-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                <span>Dashboard</span>
            </a>
        </nav>

        <div className="p-6 border-t border-zinc-100">
           <form action={handleSignOut}>
            <button className="flex items-center space-x-3 px-4 py-3 w-full text-left text-zinc-500 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                <span className="font-medium">Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 p-8 overflow-y-auto h-screen">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6 pb-4 border-b border-zinc-200">
            <h1 className="text-xl font-black text-zinc-900">GOAT <span className="text-zinc-400">ADMIN</span></h1>
             <form action={handleSignOut}>
                <button className="text-sm font-medium text-zinc-500">Sign Out</button>
            </form>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Generate Code Section */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-200 sticky top-8">
                    <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center">
                        Generate New Code
                    </h2>
                    <DashboardClient />
                </div>
            </div>

            {/* Test Users Table */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
                    <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-zinc-900">Recent Test Takers</h2>
                        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider bg-zinc-100 px-3 py-1 rounded-full">{users.length} Users</span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50 border-b border-zinc-100">
                                <tr>
                                    <th className="p-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Date</th>
                                    <th className="p-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">User</th>
                                    <th className="p-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Code</th>
                                    <th className="p-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                                    <th className="p-5 text-xs font-bold text-zinc-400 uppercase tracking-wider text-right">Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors group">
                                        <td className="p-5 text-sm text-zinc-500 font-mono">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-5">
                                            <div className="font-bold text-zinc-900">{user.fullName}</div>
                                            <div className="text-xs text-zinc-400">{user.email || 'No email'}</div>
                                        </td>
                                        <td className="p-5">
                                             <span className="font-mono text-xs bg-zinc-50 px-2 py-1 rounded text-zinc-600 border border-zinc-200 group-hover:border-zinc-300 transition-colors">{user.testCode}</span>
                                        </td>
                                        <td className="p-5">
                                            {user.hasTakenTest ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                    Completed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                         <td className="p-5 text-right font-mono font-bold text-zinc-900">
                                            {user.score !== null ? user.score : '-'}
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-zinc-400">
                                            No users found. Generate a code to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
