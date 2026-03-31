import { footerSections } from "../model/constant";

export const FooterLanding = () => {
  return (
    <footer className="relative py-16 px-6 bg-linear-to-br from-[#FFF9DB] to-[#FFE8D6] overflow-hidden">

      {/* background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-[30%] w-80 h-80 rounded-full bg-[#2ECC71]/10 blur-3xl" />
        <div className="absolute top-40 right-[10%] w-96 h-96 rounded-full bg-[#3498DB]/10 blur-3xl" />
        <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-[#F5C542]/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-sm text-gray-600">

          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <p className="font-bold text-[#2D2D2D]">
                {section.title}
              </p>

              {section.items.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="hover:text-[#58CC02] transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          ))}

        </div>

        {/* bottom */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#2D2D2D]">
              StudAI
            </span>
          </div>

          <p className="text-xs text-gray-400 text-center">
            © 2025 StudAI. Built for students who want to study smarter.
          </p>

        </div>
      </div>
    </footer>
  );
};