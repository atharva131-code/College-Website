import { useState, useEffect } from 'react'

const slides = [
  {
    id: 1,
    title: 'Welcome to Atharva College',
    subtitle: 'Empowering students with quality education since 2005',
    bg: 'from-blue-900 to-blue-700',
    emoji: '🎓',
  },
  {
    id: 2,
    title: 'Excellence in Education',
    subtitle: 'NAAC A+ Accredited institution with 98% placement record',
    bg: 'from-indigo-900 to-indigo-700',
    emoji: '🏆',
  },
  {
    id: 3,
    title: 'Annual Tech Fest 2026',
    subtitle: 'Join us for the biggest technical festival — May 5, 2026',
    bg: 'from-blue-800 to-cyan-700',
    emoji: '💻',
  },
  {
    id: 4,
    title: 'Admissions Open 2026',
    subtitle: 'Apply now for BCA, MCA, B.Com, MBA and more courses',
    bg: 'from-blue-900 to-blue-600',
    emoji: '📚',
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)

  // Auto slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (index) => setCurrent(index)

  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)

  const next = () => setCurrent((prev) => (prev + 1) % slides.length)

  return (
    <div className="relative overflow-hidden h-72 md:h-96">

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 bg-gradient-to-r ${slide.bg} transition-opacity duration-700 flex items-center justify-center ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="text-center text-white px-4">
            <div className="text-6xl mb-4">{slide.emoji}</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {slide.title}
            </h2>
            <p className="text-blue-200 text-lg max-w-xl mx-auto">
              {slide.subtitle}
            </p>
          </div>
        </div>
      ))}

      {/* Left arrow */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-30 hover:bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
      >
        ◀
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-30 hover:bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
      >
        ▶
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === current
                ? 'bg-white w-6'
                : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>

      {/* Caption bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-black bg-opacity-40 text-white text-xs text-center py-1.5">
        {slides[current].subtitle}
      </div>
    </div>
  )
}