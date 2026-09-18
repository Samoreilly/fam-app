"use client";

import { useState, useEffect, use } from "react";
import { supabase, FAMILY_MEMBERS, type Food } from "@/lib/supabase";

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
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Unknown Family Member
        </h1>
        <p className="text-gray-600">
          &quot;{name}&quot; is not a recognized family member.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{name}&apos;s Foods</h1>
      <p className="text-gray-600">
        Select the foods that {name} likes by toggling them on and off.
      </p>

      {loading ? (
        <p className="text-gray-500">Loading foods...</p>
      ) : foods.length === 0 ? (
        <p className="text-gray-500">
          No foods in the global list yet. Add some on the Foods page first!
        </p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {foods.map((food) => {
            const isLiked = selectedFoods.has(food.id);
            return (
              <button
                key={food.id}
                onClick={() => toggleFood(food.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                  isLiked
                    ? "bg-green-50 hover:bg-green-100"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <span
                  className={`font-medium ${
                    isLiked ? "text-green-900" : "text-gray-900"
                  }`}
                >
                  {food.name}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isLiked ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {isLiked ? "Liked" : "Not liked"}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {!loading && foods.length > 0 && (
        <p className="text-sm text-gray-500">
          {selectedFoods.size} of {foods.length} foods liked
        </p>
      )}
    </div>
  );
}
