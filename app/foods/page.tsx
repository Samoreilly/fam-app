"use client";

import { useState, useEffect } from "react";
import { supabase, type Food } from "@/lib/supabase";

export default function FoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [newFood, setNewFood] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoods();
  }, []);

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Global Foods</h1>
      <p className="text-gray-600">
        Add foods to the master list. Family members can then select which ones
        they like.
      </p>

      <form onSubmit={addFood} className="flex gap-2">
        <input
          type="text"
          value={newFood}
          onChange={(e) => setNewFood(e.target.value)}
          placeholder="Enter a food..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!newFood.trim()}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Food
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">Loading foods...</p>
      ) : foods.length === 0 ? (
        <p className="text-gray-500">
          No foods yet. Add one above to get started!
        </p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {foods.map((food) => (
            <div
              key={food.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-gray-900 font-medium">{food.name}</span>
              <button
                onClick={() => deleteFood(food.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && foods.length > 0 && (
        <p className="text-sm text-gray-500">{foods.length} food(s) total</p>
      )}
    </div>
  );
}
