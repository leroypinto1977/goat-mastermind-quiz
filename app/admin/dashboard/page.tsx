import { prisma } from '@/app/lib/prisma';
import { handleSignOut } from '@/app/admin/actions';
import CohortPanel from './dashboard-client';
import UsersTable from './users-table';

export default async function DashboardPage() {
  const [users, cohorts] = await Promise.all([
    prisma.testUser.findMany({
      orderBy: { createdAt: 'desc' },
      include: { cohort: true },
    }),
    prisma.cohort.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  const activeCohort = cohorts.find(c => c.isOpen) ?? null;

  // Stats
  const totalCompleted = users.filter(u => u.hasTakenTest).length;
  const inCohortCount = users.filter(u => u.cohortId === activeCohort?.id && u.hasTakenTest).length;

  return (
    <div className="min-h-screen font-sans text-zinc-900 bg-zinc-50 flex">
      {/* Sidebar */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

          {/* Left column: cohort panel + stats */}
          <div className="lg:col-span-1 space-y-6">

            {/* Cohort Management */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-200 sticky top-8">
              <h2 className="text-lg font-bold text-zinc-900 mb-6">Cohort Management</h2>
              <CohortPanel activeCohort={activeCohort} />
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200">
              <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Overview</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-500">Total Submitted</span>
                  <span className="font-mono font-bold text-zinc-900">{totalCompleted}</span>
                </div>
                {activeCohort && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-500">In Current Cohort</span>
                    <span className="font-mono font-bold text-green-700">{inCohortCount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-500">All Registered</span>
                  <span className="font-mono font-bold text-zinc-900">{users.length}</span>
                </div>
              </div>
            </div>

            {/* Past Cohorts */}
            {cohorts.filter(c => !c.isOpen).length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200">
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Past Cohorts</h2>
                <div className="space-y-2">
                  {cohorts.filter(c => !c.isOpen).map(c => {
                    const count = users.filter(u => u.cohortId === c.id).length;
                    return (
                      <div key={c.id} className="flex justify-between items-center py-1.5">
                        <span className="text-sm text-zinc-700 font-medium">{c.name}</span>
                        <span className="text-xs font-mono text-zinc-400">{count} taken</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right column: users table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
              <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">Test Takers</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Click any row to view answers</p>
                </div>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider bg-zinc-100 px-3 py-1 rounded-full">{users.length} Total</span>
              </div>
              <UsersTable users={users} activeCohortId={activeCohort?.id ?? null} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
