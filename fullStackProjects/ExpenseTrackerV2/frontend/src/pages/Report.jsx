import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../services/api";

const Reports = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter State
  const [timeFilter, setTimeFilter] = useState("all"); // "all", "daily", "weekly", "monthly"

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Summary State
  const [totals, setTotals] = useState({ income: 0, expense: 0, savings: 0 });

  // Fetch Data
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const response = await api.get("/expenses");
        const data = response.data.expenses || response.data || [];
        setExpenses(data);
      } catch (err) {
        console.error("Reports Error:", err);
        setError("Failed to load report data.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // Apply Filters & Calculate Totals
  useEffect(() => {
    let filtered = [...expenses];
    const now = new Date();

    if (timeFilter === "daily") {
      filtered = expenses.filter((e) => {
        const d = new Date(e.createdAt);
        return d.toDateString() === now.toDateString();
      });
    } else if (timeFilter === "weekly") {
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = expenses.filter((e) => new Date(e.createdAt) >= lastWeek);
    } else if (timeFilter === "monthly") {
      filtered = expenses.filter((e) => {
        const d = new Date(e.createdAt);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
    }

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Calculate Totals
    let incomeTotal = 0;
    let expenseTotal = 0;

    filtered.forEach((item) => {
      if (item.category?.toLowerCase() === "income") {
        incomeTotal += Number(item.expenseAmount);
      } else {
        expenseTotal += Number(item.expenseAmount);
      }
    });

    setFilteredExpenses(filtered);
    setTotals({
      income: incomeTotal,
      expense: expenseTotal,
      savings: incomeTotal - expenseTotal,
    });

    // ✅ Reset to page 1 whenever the filter changes
    setCurrentPage(1);
  }, [expenses, timeFilter]);

  // ✅ Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExpenses.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Optional: Scroll to top of table smoothly
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // CSV Download Logic
  const downloadCSV = () => {
    const headers = ["Date", "Description", "Category", "Income", "Expense"];
    const rows = filteredExpenses.map((item) => {
      const isIncome = item.category?.toLowerCase() === "income";
      return [
        new Date(item.createdAt).toLocaleDateString("en-IN"),
        `"${item.description || "N/A"}"`,
        item.category || "Uncategorized",
        isIncome ? item.expenseAmount : 0,
        !isIncome ? item.expenseAmount : 0,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ExpenseFlow_Report_${timeFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount) =>
    `₹ ${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 selection:bg-[#B9FF66] selection:text-[#191A23] ${
        isDarkMode ? "bg-[#191A23] text-white" : "bg-white text-[#191A23]"
      }`}
    >
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-8 lg:px-16">
        {/* ================= HEADER ================= */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Reports & History
            </h1>
            <p
              className={`mt-2 text-lg font-medium ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Detailed breakdown of your finances.
            </p>
          </div>

          <button
            onClick={downloadCSV}
            disabled={filteredExpenses.length === 0}
            className={`flex items-center gap-2 rounded-xl border-2 px-6 py-3.5 text-base font-bold transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 ${
              isDarkMode
                ? "border-[#B9FF66] bg-[#B9FF66] text-[#191A23] shadow-[4px_4px_0_0_#ffffff]"
                : "border-[#191A23] bg-[#191A23] text-white shadow-[4px_4px_0_0_#B9FF66]"
            }`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download CSV
          </button>
        </div>

        {/* ================= FILTERS ================= */}
        <div className="mb-8 flex flex-wrap gap-3">
          {["all", "daily", "weekly", "monthly"].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`rounded-xl border-2 px-6 py-2 text-sm font-bold capitalize transition-all ${
                timeFilter === filter
                  ? "border-[#191A23] bg-[#B9FF66] text-[#191A23]"
                  : isDarkMode
                    ? "border-gray-600 text-gray-300 hover:border-gray-400"
                    : "border-gray-300 text-gray-600 hover:border-[#191A23]"
              }`}
            >
              {filter === "all" ? "All Time" : filter}
            </button>
          ))}
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="mb-8 grid gap-6 sm:grid-cols-3">
          <div
            className={`rounded-[25px] border-2 p-6 ${
              isDarkMode
                ? "border-gray-700 bg-[#292A32]"
                : "border-[#191A23] bg-white shadow-[4px_4px_0_0_#191A23]"
            }`}
          >
            <p
              className={`text-sm font-bold uppercase tracking-wider ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Total Income
            </p>
            <h3 className="mt-2 text-3xl font-black text-green-500">
              {formatCurrency(totals.income)}
            </h3>
          </div>
          <div
            className={`rounded-[25px] border-2 p-6 ${
              isDarkMode
                ? "border-gray-700 bg-[#292A32]"
                : "border-[#191A23] bg-white shadow-[4px_4px_0_0_#191A23]"
            }`}
          >
            <p
              className={`text-sm font-bold uppercase tracking-wider ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Total Expenses
            </p>
            <h3 className="mt-2 text-3xl font-black text-red-500">
              {formatCurrency(totals.expense)}
            </h3>
          </div>
          <div
            className={`rounded-[25px] border-2 p-6 ${
              isDarkMode
                ? "border-[#B9FF66] bg-[#B9FF66] text-[#191A23] shadow-[4px_4px_0_0_#B9FF66]"
                : "border-[#191A23] bg-[#B9FF66] text-[#191A23] shadow-[4px_4px_0_0_#191A23]"
            }`}
          >
            <p className="text-sm font-bold uppercase tracking-wider text-[#191A23]/70">
              Net Savings
            </p>
            <h3 className="mt-2 text-3xl font-black">
              {formatCurrency(totals.savings)}
            </h3>
          </div>
        </div>

        {/* ================= DATA TABLE ================= */}
        <div
          className={`overflow-hidden rounded-[25px] border-2 ${
            isDarkMode
              ? "border-gray-700 bg-[#292A32]"
              : "border-[#191A23] bg-white shadow-[4px_4px_0_0_#191A23]"
          }`}
        >
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <svg
                className="h-10 w-10 animate-spin text-[#B9FF66]"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500 font-bold">
              {error}
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B9FF66]/20 text-3xl">
                📊
              </div>
              <h3 className="text-xl font-bold">No records found</h3>
              <p
                className={`mt-2 text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                There are no transactions for this period.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead
                    className={`border-b-2 text-xs uppercase tracking-wider ${
                      isDarkMode
                        ? "border-gray-700 bg-[#1f222b] text-gray-400"
                        : "border-[#191A23] bg-gray-100 text-gray-600"
                    }`}
                  >
                    <tr>
                      <th className="px-6 py-4 font-bold">Date</th>
                      <th className="px-6 py-4 font-bold">Description</th>
                      <th className="px-6 py-4 font-bold">Category</th>
                      <th className="px-6 py-4 font-bold text-right text-green-500">
                        Income
                      </th>
                      <th className="px-6 py-4 font-bold text-right text-red-500">
                        Expense
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y-2 ${
                      isDarkMode ? "divide-gray-700" : "divide-gray-200"
                    }`}
                  >
                    {/* ✅ Render currentItems instead of filteredExpenses */}
                    {currentItems.map((item) => {
                      const isIncome =
                        item.category?.toLowerCase() === "income";
                      return (
                        <tr
                          key={item.id}
                          className={`transition-colors ${
                            isDarkMode
                              ? "hover:bg-[#1f222b]"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td className="px-6 py-4 font-bold">
                            {item.description || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                isDarkMode
                                  ? "bg-gray-800 text-gray-300"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-green-500">
                            {isIncome
                              ? formatCurrency(item.expenseAmount)
                              : "-"}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-red-500">
                            {!isIncome
                              ? formatCurrency(item.expenseAmount)
                              : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ================= PAGINATION CONTROLS ================= */}
              <div
                className={`flex flex-col items-center justify-between gap-4 border-t-2 px-6 py-4 sm:flex-row ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Showing{" "}
                  <span className="font-bold">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-bold">
                    {Math.min(indexOfLastItem, filteredExpenses.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold">{filteredExpenses.length}</span>{" "}
                  expenses
                </div>

                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`rounded-lg border-2 px-4 py-2 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                      isDarkMode
                        ? "border-gray-600 hover:border-[#B9FF66] hover:text-[#B9FF66]"
                        : "border-gray-300 hover:border-[#191A23] hover:bg-gray-50"
                    }`}
                  >
                    Prev
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (number) => (
                        <button
                          key={number}
                          onClick={() => handlePageChange(number)}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg border-2 text-sm font-bold transition-all ${
                            currentPage === number
                              ? "border-[#191A23] bg-[#B9FF66] text-[#191A23]"
                              : isDarkMode
                                ? "border-gray-600 hover:border-gray-400"
                                : "border-gray-300 hover:border-[#191A23]"
                          }`}
                        >
                          {number}
                        </button>
                      ),
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`rounded-lg border-2 px-4 py-2 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                      isDarkMode
                        ? "border-gray-600 hover:border-[#B9FF66] hover:text-[#B9FF66]"
                        : "border-gray-300 hover:border-[#191A23] hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reports;
