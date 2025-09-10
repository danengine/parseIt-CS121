interface AboutUsProps {
  isInView: boolean;
}

interface Developer {
  name: string;
  role: string;
  bio: string;
  github: string;
  linkedin: string;
  avatar: string;
}

const AboutUs: React.FC<AboutUsProps> = ({ isInView }) => {
  const developers: Developer[] = [
    {
      name: "Danilo Eslawan",
      role: "Lead Developer",
      bio: "Full-stack developer passionate about building modern and user-friendly applications.",
      github: "https://github.com/danengine",
      linkedin: "https://linkedin.com/in/danengine",
      avatar: "../developers/dan.jpg"
    },
    {
      name: "Myca Joanne Faledonia",
      role: "UI/UX Designer",
      bio: "UI/UX designer and React expert who loves creating intuitive interfaces. Focused on making learning experiences engaging and user-friendly.",
      github: "#",
      linkedin: "#",
      avatar: "../developers/myca.jpg"
    },
    {
      name: "Julliana Onor",
      role: "Grammar Specialist",
      bio: "Computer science student specializing in formal language theory and parsing techniques. Enjoys breaking down complex algorithms into understandable components.",
      github: "#",
      linkedin: "#",
      avatar: "../developers/julliana.jpg"
    }
  ];

  return (
    <section className="relative z-10 py-8 md:py-16 mt-0 px-4 md:px-0" data-section="about-us">
      {/* Desktop Background Pattern with Gradient Opacity */}
      <div
        className="absolute inset-0 md:block hidden"
        style={{
          backgroundImage: "url(/bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,1) 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,1) 100%)",
        }}
      ></div>
      {/* Mobile-specific pattern overlay */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          backgroundImage: "url(/bg.png)",
          backgroundSize: "600px 600px",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
          opacity: 1,
          maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 15%, rgba(0,0,0,0.8) 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 15%, rgba(0,0,0,0.8) 100%)",
        }}
      ></div>

      <div className="max-w-6xl mx-auto relative z-10 px-4 md:px-0">
        {/* Section Header */}
        <div
          className={`text-center mb-16 ${
            isInView ? "animate-fade-in animate" : "opacity-0"
          }`}
          style={{ animationDelay: "0.2s" }}
        >
          <h2
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "DM Mono, monospace", color: "white" }}
          >
            ABOUT US
          </h2>
          <p
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            Meet the team behind ParseIt. This project is developed for CS121 course compliance.
          </p>
        </div>

        {/* Developer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {developers.map((dev, index) => (
            <div
              key={dev.name}
              className={`text-center h-[500px] flex flex-col ${
                isInView ? "animate-fade-in-up animate" : "opacity-0"
              }`}
              style={{ animationDelay: `${0.4 + index * 0.2}s` }}
            >
              {/* Avatar */}
              <div className="mb-6 flex justify-center">
                <img
                  src={dev.avatar}
                  alt={dev.name}
                  className="w-32 h-32 rounded-full object-cover border-4"
                  style={{ borderColor: "#14B984" }}
                />
              </div>

              {/* Name and Role */}
              <div className="mb-0">
                <h3
                  className="text-xl md:text-2xl font-bold mb-2"
                  style={{ fontFamily: "DM Mono, monospace", color: "white" }}
                >
                  {dev.name}
                </h3>
                <p
                  className="text-lg mb-0"
                  style={{ fontFamily: "DM Mono, monospace", color: "#14B984" }}
                >
                  {dev.role}
                </p>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <p
                  className="text-gray-300 leading-relaxed text-center"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  {dev.bio}
                </p>
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-4">
                <a
                  href={dev.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
                  style={{ backgroundColor: "#333333" }}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href={dev.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
                  style={{ backgroundColor: "#0077B5" }}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AboutUs;
