import { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../services/api";

const Expenses = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ amount: "", description: "" });
  const [formType, setFormType] = useState("expense");
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });

  const formRef = useRef(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/expenses");
      const data = response.data.expenses || response.data || [];
      setExpenses(data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError("Could not load your transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage({ type: "", text: "" });

    try {
      const payload = {
        amount: Number(formData.amount),
        description: formData.description,
        type: formType,
      };

      if (editingId) {
        const response = await api.put(
          `/expenses/update/${editingId}`,
          payload,
        );
        if (response.data.success) {
          setFormData({ amount: "", description: "" });
          setEditingId(null);
          setFormMessage({
            type: "success",
            text: `Transaction updated! Categorized as: ${response.data.category}`,
          });
          await fetchExpenses();
        }
      } else {
        const response = await api.post("/expenses/add", payload);
        if (response.data.success) {
          setFormData({ amount: "", description: "" });
          setFormMessage({
            type: "success",
            text: `Transaction added! Categorized as: ${response.data.category}`,
          });
          await fetchExpenses();
        }
      }
    } catch (err) {
      setFormMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to save.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (expense) => {
    setEditingId(expense.id);
    setFormData({
      amount: expense.expenseAmount,
      description: expense.description || "",
    });
    setFormType(expense.type || "expense");
    setFormMessage({ type: "", text: "" });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ amount: "", description: "" });
    setFormType("expense");
    setFormMessage({ type: "", text: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    try {
      setDeletingId(id);
      await api.delete(`/expenses/delete/${id}`);
      setExpenses(expenses.filter((expense) => expense.id !== id));
      if (editingId === id) handleCancelEdit();
    } catch (err) {
      alert("Failed to delete transaction.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 selection:bg-[#B9FF66] selection:text-[#191A23] ${isDarkMode ? "bg-[#191A23] text-white" : "bg-white text-[#191A23]"}`}
    >
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:px-16">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Transactions
            </h1>
            <p
              className={`mt-2 text-lg font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Manage, track, and add your income or expenses.
            </p>
          </div>
        </div>

        {/* FORM */}
        <div
          ref={formRef}
          className={`mb-12 rounded-[35px] border-2 p-6 sm:p-8 transition-colors duration-300 ${
            editingId
              ? isDarkMode
                ? "border-[#B9FF66] bg-[#292A32] shadow-[6px_6px_0_0_#B9FF66]"
                : "border-[#B9FF66] bg-white shadow-[6px_6px_0_0_#B9FF66]"
              : isDarkMode
                ? "border-gray-700 bg-[#292A32] shadow-[6px_6px_0_0_#000]"
                : "border-[#191A23] bg-[#F3F3F3] shadow-[6px_6px_0_0_#191A23]"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {editingId ? "Edit Transaction" : "New Transaction"}
            </h2>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                className={`text-sm font-bold underline decoration-2 underline-offset-4 ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-[#191A23]"}`}
              >
                Cancel Edit
              </button>
            )}
          </div>

          {/* TOGGLE */}
          <div
            className={`mb-6 inline-flex rounded-xl border-2 p-1 ${isDarkMode ? "border-gray-600 bg-[#191A23]" : "border-[#191A23] bg-white"}`}
          >
            <button
              type="button"
              onClick={() => setFormType("expense")}
              className={`cursor-pointer rounded-lg px-6 py-2 text-sm font-bold transition-all ${formType === "expense" ? "bg-red-500 text-white shadow-md" : isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-[#191A23]"}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormType("income")}
              className={`cursor-pointer rounded-lg px-6 py-2 text-sm font-bold transition-all ${formType === "income" ? "bg-green-500 text-white shadow-md" : isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-[#191A23]"}`}
            >
              Income
            </button>
          </div>

          {formMessage.text && (
            <div
              className={`mb-6 rounded-xl border-2 p-4 text-sm font-bold ${formMessage.type === "success" ? "border-green-600 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "border-red-600 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
            >
              {formMessage.text}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <label
                htmlFor="amount"
                className="mb-2 block text-sm font-bold tracking-wide"
              >
                Amount (₹)
              </label>
              <input
                type="number"
                id="amount"
                required
                min="1"
                step="any"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="e.g. 450"
                className={`w-full rounded-xl border-2 px-4 py-3 text-sm font-medium outline-none transition-all ${isDarkMode ? "border-gray-600 bg-[#191A23] text-white placeholder-gray-500 focus:border-green-500" : "border-[#191A23] bg-white text-[#191A23] placeholder-gray-400 focus:border-green-500"}`}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex-[2]">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-bold tracking-wide"
              >
                Description (AI will categorize this)
              </label>
              <input
                type="text"
                id="description"
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder={
                  formType === "expense"
                    ? "e.g. Swiggy dinner order"
                    : "e.g. Monthly Salary"
                }
                className={`w-full rounded-xl border-2 px-4 py-3 text-sm font-medium outline-none transition-all ${isDarkMode ? "border-gray-600 bg-[#191A23] text-white placeholder-gray-500 focus:border-green-500" : "border-[#191A23] bg-white text-[#191A23] placeholder-gray-400 focus:border-green-500"}`}
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`cursor-pointer mt-4 flex items-center justify-center gap-2 rounded-xl border-2 px-8 py-3.5 text-base font-bold transition-all hover:-translate-y-1 sm:mt-0 disabled:cursor-not-allowed disabled:opacity-70 ${formType === "income" ? "border-green-600 bg-green-500 text-white" : "border-red-600 bg-red-500 text-white"}`}
            >
              {isSubmitting
                ? "Saving..."
                : editingId
                  ? "Update"
                  : formType === "income"
                    ? "Add Income"
                    : "Add Expense"}
            </button>
          </form>
        </div>

        {/* LIST */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <svg
              className="h-10 w-10 animate-spin text-green-500"
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
        ) : expenses.length > 0 ? (
          <div
            className={`overflow-hidden rounded-[35px] border-2 ${isDarkMode ? "border-gray-700 bg-[#292A32] shadow-[6px_6px_0_0_#000]" : "border-[#191A23] bg-white shadow-[6px_6px_0_0_#191A23]"}`}
          >
            <div
              className={`flex flex-col divide-y-2 ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}
            >
              {expenses.map((expense, index) => {
                const isIncome =
                  expense.type === "income" ||
                  expense.category?.toLowerCase() === "income";

                return (
                  <div
                    key={expense.id || `expense-${index}`}
                    className={`flex flex-col gap-6 p-6 transition-colors md:flex-row md:items-center md:justify-between ${isDarkMode ? "hover:bg-[#1f222b]" : "hover:bg-gray-50"}`}
                  >
                    <div className="flex flex-1 flex-col gap-6 md:flex-row md:items-center">
                      <div className="w-full shrink-0 md:w-[150px]">
                        <p
                          className={`mb-1.5 text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                        >
                          Category
                        </p>
                        <span
                          className={`inline-block rounded-md border-2 px-3 py-1 text-xs font-bold uppercase tracking-wider ${isIncome ? (isDarkMode ? "border-green-500 bg-green-500/10 text-green-400" : "border-green-600 bg-green-100 text-green-700") : isDarkMode ? "border-red-500 bg-red-500/10 text-red-400" : "border-red-600 bg-red-100 text-red-700"}`}
                        >
                          {expense.category || "Other"}
                        </span>
                      </div>

                      <div className="flex-1">
                        <p
                          className={`mb-1.5 text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                        >
                          Description
                        </p>
                        <h3 className="text-base font-bold leading-tight">
                          {expense.description || "No description"}
                        </h3>
                        {expense.createdAt && (
                          <p
                            className={`mt-1 text-xs font-medium ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                          >
                            {new Date(expense.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className={`flex items-end justify-between border-t-2 pt-4 md:w-auto md:items-center md:border-t-0 md:pt-0 ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}
                    >
                      <div className="md:mr-8 md:text-right">
                        <p
                          className={`mb-1 text-[10px] font-bold uppercase tracking-widest md:text-right ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                        >
                          Amount
                        </p>
                        <span
                          className={`text-2xl font-black tracking-tight ${isIncome ? "text-green-500" : "text-red-500"}`}
                        >
                          {isIncome ? "+" : "-"} ₹{" "}
                          {(expense.expenseAmount || 0).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(expense)}
                          className={`cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-colors ${isDarkMode ? "border-gray-600 text-gray-300 hover:border-green-500 hover:text-green-500" : "border-gray-300 text-gray-500 hover:border-[#191A23] hover:text-[#191A23]"}`}
                          aria-label="Edit"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          disabled={deletingId === expense.id}
                          className={`cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-colors disabled:opacity-50 ${isDarkMode ? "border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-500" : "border-gray-300 text-gray-500 hover:border-red-600 hover:text-red-600"}`}
                          aria-label="Delete"
                        >
                          {deletingId === expense.id ? (
                            <svg
                              className="h-4 w-4 animate-spin"
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
                          ) : (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center rounded-[35px] border-2 border-dashed p-12 text-center ${isDarkMode ? "border-gray-600 bg-[#292A32]" : "border-gray-300 bg-gray-50"}`}
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20 text-3xl">
              💸
            </div>
            <h3 className="text-2xl font-bold mb-2">No transactions yet</h3>
            <p
              className={`max-w-md text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              You haven't logged any income or expenses. Use the form above to
              get started.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Expenses;
