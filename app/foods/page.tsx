"use client";

import { useState, useEffect } from "react";
import { supabase, type Food } from "@/lib/supabase";

export default function FoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [newFood, setNewFood] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchFoods() {
      const { data, error } = await supabase
        .from("foods")
        .select("*")
        .order("name");
      if (!cancelled && !error && data) {
        setFoods(data);
      }
      if (!cancelled) setLoading(false);
    }
    fetchFoods();
    return () => { cancelled = true; };
  }, []);

  async function addFood(e: React.FormEvent) {
    e.preventDefault();
    if (!newFood.trim()) return;

    const { error } = await supabase
      .from("foods")
      .insert({ name: newFood.trim() });

    if (!error) {
      setNewFood("");
      fetchFoods();
    }
  }

  async function deleteFood(id: string) {
    const { error } = await supabase.from("foods").delete().eq("id", id);
    if (!error) {
      fetchFoods();
    }
  }

  async function fetchFoods() {
    const { data, error } = await supabase
      .from("foods")
      .select("*")
      .order("name");
    if (!error && data) {
      setFoods(data);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">
          🍽️
        </div>
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Global Foods</h1>
          <p className="text-amber-700/60 text-sm">
            Add foods to the master list for everyone to choose from
          </p>
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={addFood} className="flex gap-3">
        <input
          type="text"
          value={newFood}
          onChange={(e) => setNewFood(e.target.value)}
          placeholder="Enter a food name..."
          className="input-field flex-1"
        />
        <button
          type="submit"
          disabled={!newFood.trim()}
          className="btn-primary whitespace-nowrap"
        >
          + Add Food
        </button>
      </form>

      {/* Food list */}
      {loading ? (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-3 animate-pulse-soft">⏳</div>
          <p className="text-amber-700/60">Loading foods...</p>
        </div>
      ) : foods.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-5xl mb-3">🛒</div>
          <p className="text-amber-900 font-semibold mb-1">No foods yet</p>
          <p className="text-amber-700/60 text-sm">
            Add your first food above to get started!
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="divide-y divide-amber-100">
            {foods.map((food, i) => (
              <div
                key={food.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-amber-50/50 transition-colors animate-fade-in-up"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🍴</span>
                  <span className="font-medium text-amber-900">{food.name}</span>
                </div>
                <button
                  onClick={() => deleteFood(food.id)}
                  className="text-amber-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                  title="Delete food"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && foods.length > 0 && (
        <p className="text-sm text-amber-700/50 text-center">
          {foods.length} food{foods.length !== 1 ? "s" : ""} in the list
        </p>
      )}
    </div>
  );
}
