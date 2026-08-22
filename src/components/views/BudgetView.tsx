import React, { useState } from 'react';
import { 
  DollarSign, 
  PieChart as PieIcon, 
  Plus, 
  Trash2, 
  Users, 
  CreditCard, 
  ArrowRightLeft, 
  TrendingDown, 
  Sparkles,
  Building2,
  Train,
  UtensilsCrossed,
  MapPin,
  ShoppingBag
} from 'lucide-react';
import { Trip, ExpenseItem, Currency } from '../../types';
import { CURRENCY_RATES, formatCurrency } from '../../data/mockData';

interface BudgetViewProps {
  trip: Trip;
  currency: Currency;
  onUpdateTrip: (updatedTrip: Trip) => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  trip,
  currency,
  onUpdateTrip,
}) => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseItem['category']>('Food');
  const [newAmount, setNewAmount] = useState(45);
  const [newCity, setNewCity] = useState(trip.cities[0]?.name || 'London');
  const [newPaidBy, setNewPaidBy] = useState(trip.travelerNames[0] || 'Alex Rivera');

  // Currency calculator mini widget state
  const [calcAmount, setCalcAmount] = useState(100);
  const [calcFromCurr, setCalcFromCurr] = useState<Currency>('USD');
  const [calcToCurr, setCalcToCurr] = useState<Currency>(currency);

  const totalSpentUSD = trip.expenses.reduce((sum, e) => sum + e.amountUSD, 0);
  const budgetRemainingUSD = Math.max(0, trip.budgetTotalUSD - totalSpentUSD);
  const percentSpent = Math.min(100, Math.round((totalSpentUSD / trip.budgetTotalUSD) * 100)) || 0;

  // Category breakdown calculation
  const categoryTotals: Record<string, number> = {
    Lodging: 0,
    Transport: 0,
    Food: 0,
    Activities: 0,
    Shopping: 0,
    Misc: 0,
  };

  trip.expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amountUSD;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Lodging': return <Building2 className="w-4 h-4 text-sky-400" />;
      case 'Transport': return <Train className="w-4 h-4 text-indigo-400" />;
      case 'Food': return <UtensilsCrossed className="w-4 h-4 text-amber-400" />;
      case 'Activities': return <MapPin className="w-4 h-4 text-emerald-400" />;
      case 'Shopping': return <ShoppingBag className="w-4 h-4 text-purple-400" />;
      default: return <DollarSign className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      amountUSD: newAmount,
      cityName: newCity,
      date: new Date().toISOString().split('T')[0],
      paidBy: newPaidBy,
      splitAmong: trip.travelerNames,
    };

    onUpdateTrip({
      ...trip,
      expenses: [newExpense, ...trip.expenses],
    });

    setNewTitle('');
    setNewAmount(45);
    setShowAddExpense(false);
  };

  const handleDeleteExpense = (id: string) => {
    onUpdateTrip({
      ...trip,
      expenses: trip.expenses.filter((e) => e.id !== id),
    });
  };

  // Convert for mini calculator
  const convertedCalcValue = (calcAmount / (CURRENCY_RATES[calcFromCurr]?.rate || 1)) * (CURRENCY_RATES[calcToCurr]?.rate || 1);

  // Group balances calculation
  const travelerPaidMap: Record<string, number> = {};
  trip.travelerNames.forEach((name) => { travelerPaidMap[name] = 0; });
  trip.expenses.forEach((e) => {
    if (travelerPaidMap[e.paidBy] !== undefined) {
      travelerPaidMap[e.paidBy] += e.amountUSD;
    } else {
      travelerPaidMap[e.paidBy] = e.amountUSD;
    }
  });

  const perPersonShare = totalSpentUSD / Math.max(1, trip.travelersCount);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <DollarSign className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Trip Budget & Cost Estimator</h1>
              <p className="text-xs text-slate-400">Track multi-city expenses, split costs & convert international currencies</p>
            </div>
          </div>
        </div>

        <button
          id="log-expense-btn"
          onClick={() => setShowAddExpense(true)}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Expense</span>
        </button>
      </div>

      {/* Main Stats Gauge Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Target Budget</div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {formatCurrency(trip.budgetTotalUSD, currency)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {trip.travelersCount} travelers ({formatCurrency(trip.budgetTotalUSD / Math.max(1, trip.travelersCount), currency)}/person)
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Logged Spent</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
              {formatCurrency(totalSpentUSD, currency)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {percentSpent}% of total allocated budget
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Remaining Funds</div>
            <div className="text-2xl sm:text-3xl font-black text-sky-400 mt-1">
              {formatCurrency(budgetRemainingUSD, currency)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Safety margin & on-the-ground buffer
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-300 font-semibold mb-2">
            <span>Budget Utilization</span>
            <span>{percentSpent}% Used</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                percentSpent > 90
                  ? 'bg-rose-500'
                  : percentSpent > 70
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${percentSpent}%` }}
            />
          </div>
        </div>

        {/* Category Breakdown Progress */}
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
            Spending by Category
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(categoryTotals).map(([cat, amount]) => {
              const catPercent = totalSpentUSD > 0 ? Math.round((amount / totalSpentUSD) * 100) : 0;
              return (
                <div key={cat} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                    {getCategoryIcon(cat)}
                    <span>{cat}</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {formatCurrency(amount, currency)}
                  </div>
                  <div className="text-[10px] text-slate-400">{catPercent}% of total</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Grid: Group Expense Splitter & Live Currency Converter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Group Expense Splitter */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Users className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Traveler Expense Splitter</h3>
                <p className="text-[11px] text-slate-400">Track who paid what and balance settlement</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-sky-300 font-bold">
              Target: {formatCurrency(perPersonShare, currency)} / person
            </span>
          </div>

          <div className="space-y-3">
            {trip.travelerNames.map((name) => {
              const paid = travelerPaidMap[name] || 0;
              const netBalance = paid - perPersonShare;
              return (
                <div key={name} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 text-xs">
                  <div>
                    <div className="font-bold text-white">{name}</div>
                    <div className="text-slate-400 text-[11px]">Paid: {formatCurrency(paid, currency)}</div>
                  </div>
                  <div className="text-right">
                    {netBalance >= 0 ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                        + Gets Back {formatCurrency(netBalance, currency)}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-xs">
                        - Owes {formatCurrency(Math.abs(netBalance), currency)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Currency Converter Mini Widget */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ArrowRightLeft className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">Live Currency Converter</h3>
              <p className="text-[11px] text-slate-400">Multi-destination exchange rates calculator</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Amount</label>
              <input
                type="number"
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-bold text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">From</label>
                <select
                  value={calcFromCurr}
                  onChange={(e) => setCalcFromCurr(e.target.value as Currency)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs"
                >
                  {(Object.keys(CURRENCY_RATES) as Currency[]).map((c) => (
                    <option key={c} value={c}>{c} - {CURRENCY_RATES[c].name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">To</label>
                <select
                  value={calcToCurr}
                  onChange={(e) => setCalcToCurr(e.target.value as Currency)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs"
                >
                  {(Object.keys(CURRENCY_RATES) as Currency[]).map((c) => (
                    <option key={c} value={c}>{c} - {CURRENCY_RATES[c].name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Estimated Conversion</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">
                {CURRENCY_RATES[calcToCurr].symbol}
                {calcToCurr === 'JPY'
                  ? Math.round(convertedCalcValue).toLocaleString()
                  : convertedCalcValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-xs font-semibold text-slate-300 ml-1">({calcToCurr})</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Expense History Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Expense Ledger & Receipts</h3>
            <p className="text-xs text-slate-400">{trip.expenses.length} Logged Transactions</p>
          </div>
        </div>

        <div className="divide-y divide-slate-800 overflow-x-auto">
          {trip.expenses.map((item) => (
            <div key={item.id} className="p-4 sm:px-6 flex items-center justify-between gap-4 text-xs hover:bg-slate-800/40 transition">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{item.title}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{item.cityName}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>Paid by {item.paidBy}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-emerald-400">
                  {formatCurrency(item.amountUSD, currency)}
                </span>
                <button
                  id={`delete-exp-${item.id}`}
                  onClick={() => handleDeleteExpense(item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white">Log Travel Expense</h3>
            
            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Expense Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Gourmet Dinner at Le Comptoir or Taxi to CDG"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  >
                    <option value="Food">Food & Dining</option>
                    <option value="Transport">Transport / Transit</option>
                    <option value="Lodging">Lodging & Hotels</option>
                    <option value="Activities">Activities & Tours</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Misc">Miscellaneous</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Amount (USD)</label>
                  <input
                    type="number"
                    min={1}
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  >
                    {trip.cities.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Paid By</label>
                  <select
                    value={newPaidBy}
                    onChange={(e) => setNewPaidBy(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  >
                    {trip.travelerNames.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold shadow-md"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
