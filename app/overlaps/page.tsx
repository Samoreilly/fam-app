"use client";

import { useState, useEffect } from "react";
import { supabase, FAMILY_MEMBERS, type Food } from "@/lib/supabase";

export default function OverlapsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set(FAMILY_MEMBERS)
  );
  const [overlappingFoods, setOverlappingFoods] = useState<Food[]>([]);
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
        setLoading(false);
      }
    }
    fetchFoods();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function calculateOverlaps() {
      if (selectedMembers.size === 0 || foods.length === 0) {
        if (!cancelled) setOverlappingFoods([]);
        return;
      }

      const membersArray = Array.from(selectedMembers);

      const { data: personFoods, error } = await supabase
        .from("person_foods")
        .select("food_id, person_name")
        .in("person_name", membersArray);

      if (cancelled || error || !personFoods) {
        if (!cancelled) setOverlappingFoods([]);
        return;
      }

      const foodCount = new Map<string, Set<string>>();
      for (const pf of personFoods) {
        if (!foodCount.has(pf.food_id)) {
          foodCount.set(pf.food_id, new Set());
        }
        foodCount.get(pf.food_id)!.add(pf.person_name);
      }

      const overlapping = foods.filter((food) => {
        const membersWhoLike = foodCount.get(food.id);
        return membersWhoLike && membersWhoLike.size === selectedMembers.size;
      });

      if (!cancelled) setOverlappingFoods(overlapping);
    }
    calculateOverlaps();
    return () => {
      cancelled = true;
    };
  }, [foods, selectedMembers]);

  function toggleMember(member: string) {
    setSelectedMembers((prev) => {
      const next = new Set(prev);
      if (next.has(member)) {
        next.delete(member);
      } else {
        next.add(member);
      }
      return next;
    });
  }

  function selectAll() {
    setSelectedMembers(new Set(FAMILY_MEMBERS));
  }

  function selectNone() {
    setSelectedMembers(new Set());
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Food Overlaps</h1>
      <p className="text-gray-600">
        See which foods are liked by everyone you select. Choose family members
        below to filter the results.
      </p>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Filter by Family Members
          </h2>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Select All
            </button>
            <button
              onClick={selectNone}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Select None
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {FAMILY_MEMBERS.map((member) => (
            <label
              key={member}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                selectedMembers.has(member)
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedMembers.has(member)}
                onChange={() => toggleMember(member)}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  selectedMembers.has(member)
                    ? "bg-white border-white"
                    : "border-gray-300"
                }`}
              >
                {selectedMembers.has(member) && (
                  <svg
                    className="w-3 h-3 text-gray-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </span>
              {member}
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Overlapping Foods
          {selectedMembers.size > 0 && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              (liked by all {selectedMembers.size} selected)
            </span>
          )}
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : selectedMembers.size === 0 ? (
          <p className="text-gray-500">
            Select at least one family member to see overlapping foods.
          </p>
        ) : overlappingFoods.length === 0 ? (
          <p className="text-gray-500">
            No foods are liked by all selected family members yet.
          </p>
        ) : (
          <div className="space-y-2">
            {overlappingFoods.map((food) => (
              <div
                key={food.id}
                className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <span className="text-green-600">✓</span>
                <span className="font-medium text-green-900">{food.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
