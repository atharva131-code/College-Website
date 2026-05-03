export default function CollegeHeader() {
  return (
    <div className="bg-white border-b-4 border-blue-700 py-4 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Left — Logo + Name */}
        <div className="flex items-center gap-4">
          {/* College logo circle */}
          <div className="w-20 h-20 rounded-full bg-blue-700 flex items-center justify-center text-white text-3xl font-bold shadow-md shrink-0">
            AC
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blue-900 leading-tight">
              Atharva College
            </h1>
            <p className="text-blue-700 font-semibold text-sm">
              Lucknow, Uttar Pradesh
            </p>
            <p className="text-gray-500 text-xs mt-0.5">
              Established 2005 · Affiliated to Lucknow University
            </p>
          </div>
        </div>

        {/* Center — College name in Hindi style */}
        <div className="hidden lg:block text-center">
          <p className="text-blue-800 text-lg font-bold">
            अथर्व कॉलेज
          </p>
          <p className="text-gray-500 text-xs">
            ज्ञान · विज्ञान · संस्कार
          </p>
        </div>

        {/* Right — Accreditation badges */}
        <div className="hidden md:flex items-center gap-3">
          <div className="text-center bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
            <div className="text-2xl font-bold text-yellow-600">A+</div>
            <div className="text-xs text-gray-500">NAAC Grade</div>
          </div>
          <div className="text-center bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <div className="text-2xl font-bold text-blue-600">UGC</div>
            <div className="text-xs text-gray-500">Recognized</div>
          </div>
          <div className="text-center bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <div className="text-2xl font-bold text-green-600">98%</div>
            <div className="text-xs text-gray-500">Placement</div>
          </div>
        </div>
      </div>
    </div>
  )
}