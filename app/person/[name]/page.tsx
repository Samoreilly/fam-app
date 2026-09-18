"use client";

import { useState, useEffect, use } from "react";
import { supabase, FAMILY_MEMBERS, type Food } from "@/lib/supabase";

const MEMBER_COLORS: Record<string, { bg: string; text: string; ring: string; light: string }> = {
  Sam: { bg: "bg-blue-500", text: "text-blue-700", ring: "ring-blue-300", light: "from-blue-500 to-blue-600" },
  Orla: { bg: "bg-pink-500", text: "text-pink-700", ring: "ring-pink-300", light: "from-pink-500 to-pink-600" },
  Alex: { bg: "bg-green-500", text: "text-green-700", ring: "ring-green-300", light: "from-green-500 to-green-600" },
  Ruth: { bg: "bg-purple-500", text: "text-purple-700", ring: "ring-purple-300", light: "from-purple-500 to-purple-600" },
  Ian: { bg: "bg-orange-500", text: "text-orange-700", ring: "ring-orange-300", light: "from-orange-500 to-orange-600" },
  Zach: { bg: "bg-cyan-500", text: "text-cyan-700", ring: "ring-cyan-300", light: "from-cyan-500 to-cyan-600" },
  Amelia: { bg: "bg-rose-500", text: "text-rose-700", ring: "ring-rose-300", light: "from-rose-500 to-rose-600" },
};

export default function PersonPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const isValidMember = FAMILY_MEMBERS.includes(
    name as (typeof FAMILY_MEMBERS)[number]
  );
  const colors = MEMBER_COLORS[name] || MEMBER_COLORS.Sam;

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      const [foodsResult, personFoodsResult] = await Promise.all([
        supabase.from("foods").select("*").order("name"),
        supabase
          .from("person_foods")
          .select("food_id")
          .eq("person_name", name),
      ]);

      if (cancelled) return;

      if (!foodsResult.error && foodsResult.data) {
        setFoods(foodsResult.data);
      }

      if (!personFoodsResult.error && personFoodsResult.data) {
        setSelectedFoods(
          new Set(personFoodsResult.data.map((pf) => pf.food_id))
        );
      }

      setLoading(false);
    }
    if (isValidMember) {
      fetchData();
    }
    return () => {
      cancelled = true;
    };
  }, [isValidMember, name]);

  async function toggleFood(foodId: string) {
    const isLiked = selectedFoods.has(foodId);

    if (isLiked) {
      const { error } = await supabase
        .from("person_foods")
        .delete()
        .eq("person_name", name)
        .eq("food_id", foodId);

      if (!error) {
        setSelectedFoods((prev) => {
          const next = new Set(prev);
          next.delete(foodId);
          return next;
        });
      }
    } else {
      const { error } = await supabase
        .from("person_foods")
        .insert({ person_name: name, food_id: foodId });

      if (!error) {
        setSelectedFoods((prev) => new Set(prev).add(foodId));
      }
    }
  }

  if (!isValidMember) {
    return (
      <div className="card p-12 text-center">
        <div className="text-5xl mb-4">🤔</div>
        <h1 className="text-2xl font-bold text-amber-900 mb-2">
          Unknown Family Member
        </h1>
        <p className="text-amber-700/60">
          &quot;{name}&quot; is not a recognized family member.
        </p>
      </div>
    );
  }

  const progress = foods.length > 0 ? (selectedFoods.size / foods.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Colored header */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${colors.light} p-6 md:p-8 text-white shadow-lg`}>
        <div className="absolute top-2 right-4 text-5xl opacity-20 select-none">
          {selectedFoods.size > 0 ? "😋" : "🍽️"}
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/40`}>
            <span className="text-2xl font-bold">{name[0]}</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{name}&apos;s Foods</h1>
            <p className="text-white/80 text-sm">
              Toggle the foods that {name} likes
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {!loading && foods.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-amber-700">
              {selectedFoods.size} of {foods.length} foods liked
            </span>
            <span className="text-sm font-bold text-amber-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${colors.light} transition-all duration-500 ease-out`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

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
            Add some foods on the Foods page first!
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="divide-y divide-amber-100">
            {foods.map((food, i) => {
              const isLiked = selectedFoods.has(food.id);
              return (
                <button
                  key={food.id}
                  onClick={() => toggleFood(food.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all duration-200 animate-fade-in-up ${
                    isLiked
                      ? "bg-green-50/80 hover:bg-green-100/80"
                      : "hover:bg-amber-50/50"
                  }`}
                  style={{ animationDelay: `${i * 20}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{isLiked ? "✅" : "⭕"}</span>
                    <span
                      className={`font-medium ${
                        isLiked ? "text-green-800" : "text-amber-900"
                      }`}
                    >
                      {food.name}
                    </span>
                  </div>

                  {/* Toggle switch */}
                  <div
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      isLiked ? "bg-green-500" : "bg-amber-200"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                        isLiked ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
