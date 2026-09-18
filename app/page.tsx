import Link from "next/link";
import { FAMILY_MEMBERS } from "@/lib/supabase";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">FamFoods</h1>
        <p className="text-lg text-gray-600">
          Track what foods your family likes and find what everyone agrees on
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/foods"
          className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Global Foods
          </h2>
          <p className="text-gray-600">
            Add or remove foods from the master list that everyone can choose
            from.
          </p>
        </Link>

        <Link
          href="/overlaps"
          className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Overlaps
          </h2>
          <p className="text-gray-600">
            See which foods are liked by selected family members. Filter by who
            is available.
          </p>
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Family Members
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {FAMILY_MEMBERS.map((member) => (
            <Link
              key={member}
              href={`/person/${member}`}
              className="block p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg font-semibold text-gray-600">
                  {member[0]}
                </span>
              </div>
              <span className="font-medium text-gray-900">{member}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
