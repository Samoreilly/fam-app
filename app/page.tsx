import Link from "next/link";
import { FAMILY_MEMBERS } from "@/lib/supabase";

const MEMBER_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  Sam: { bg: "bg-blue-100", text: "text-blue-700", ring: "ring-blue-300" },
  Orla: { bg: "bg-pink-100", text: "text-pink-700", ring: "ring-pink-300" },
  Alex: { bg: "bg-green-100", text: "text-green-700", ring: "ring-green-300" },
  Ruth: { bg: "bg-purple-100", text: "text-purple-700", ring: "ring-purple-300" },
  Ian: { bg: "bg-orange-100", text: "text-orange-700", ring: "ring-orange-300" },
  Zach: { bg: "bg-cyan-100", text: "text-cyan-700", ring: "ring-cyan-300" },
  Amelia: { bg: "bg-rose-100", text: "text-rose-700", ring: "ring-rose-300" },
};

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-8 md:p-12 text-white shadow-xl shadow-amber-500/20">
        <div className="absolute top-4 right-6 text-5xl opacity-30 select-none">🍕</div>
        <div className="absolute bottom-4 left-8 text-4xl opacity-20 select-none">🍔</div>
        <div className="absolute top-8 left-1/3 text-3xl opacity-20 select-none">🌮</div>
        <div className="absolute bottom-6 right-1/4 text-4xl opacity-20 select-none">🥗</div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg">
            FamFoods
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-lg">
            Track what your family loves to eat and discover what everyone agrees on
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/foods"
          className="card card-hover p-6 flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl shrink-0">
            🍽️
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-900 mb-1">Global Foods</h2>
            <p className="text-amber-700/70">
              Add or remove foods from the master list that everyone can choose from.
            </p>
          </div>
        </Link>

        <Link
          href="/overlaps"
          className="card card-hover p-6 flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl shrink-0">
            🎯
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-900 mb-1">Overlaps</h2>
            <p className="text-amber-700/70">
              See which foods are liked by selected family members. Filter by who is available.
            </p>
          </div>
        </Link>
      </div>

      {/* Family Members */}
      <div>
        <h2 className="text-2xl font-bold text-amber-900 mb-5">Family Members</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {FAMILY_MEMBERS.map((member) => {
            const colors = MEMBER_COLORS[member];
            return (
              <Link
                key={member}
                href={`/person/${member}`}
                className="card card-hover p-5 text-center group"
              >
                <div
                  className={`w-14 h-14 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-3 ring-2 ${colors.ring} group-hover:scale-110 transition-transform duration-200`}
                >
                  <span className={`text-xl font-bold ${colors.text}`}>
                    {member[0]}
                  </span>
                </div>
                <span className="font-semibold text-amber-900 text-sm">
                  {member}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
