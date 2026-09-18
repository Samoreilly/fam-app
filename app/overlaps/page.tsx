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
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl">
          🎯
        </div>
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Food Overlaps</h1>
          <p className="text-amber-700/60 text-sm">
            Discover which foods everyone agrees on
          </p>
        </div>
      </div>

      {/* Filter section */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-amber-900">
            Filter by Family Members
          </h2>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="text-xs font-semibold text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full transition-colors"
            >
              Select All
            </button>
            <button
              onClick={selectNone}
              className="text-xs font-semibold text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {FAMILY_MEMBERS.map((member) => {
            const isSelected = selectedMembers.has(member);
            return (
              <button
                key={member}
                onClick={() => toggleMember(member)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border-2 ${
                  isSelected
                    ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20"
                    : "bg-white text-amber-700 border-amber-200 hover:border-amber-400 hover:bg-amber-50"
                }`}
              >
                {isSelected && (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {member}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-amber-900">
            Overlapping Foods
          </h2>
          {selectedMembers.size > 0 && (
            <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
              {selectedMembers.size} selected
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3 animate-pulse-soft">⏳</div>
            <p className="text-amber-700/60">Loading foods...</p>
          </div>
        ) : selectedMembers.size === 0 ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">👆</div>
            <p className="text-amber-900 font-semibold mb-1">No members selected</p>
            <p className="text-amber-700/60 text-sm">
              Select at least one family member above to see overlapping foods.
            </p>
          </div>
        ) : overlappingFoods.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-amber-900 font-semibold mb-1">No overlaps yet</p>
            <p className="text-amber-700/60 text-sm">
              No foods are liked by all {selectedMembers.size} selected family members yet.
            </p>
          </div>
        ) : (
          <div>
            {/* Celebration banner */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4 flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <p className="font-bold text-green-800">
                  {overlappingFoods.length} food{overlappingFoods.length !== 1 ? "s" : ""} everyone agrees on!
                </p>
                <p className="text-green-600 text-xs">
                  Liked by all {selectedMembers.size} selected family members
                </p>
              </div>
            </div>

            {/* Food list */}
            <div className="space-y-2">
              {overlappingFoods.map((food, i) => (
                <div
                  key={food.id}
                  className="flex items-center gap-3 px-5 py-3.5 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-semibold text-green-900">{food.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
