const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-12 border border-x-gray-500 border-t-2">
      <div className="container mx-auto px-6">
        {/* Upper Section: Brand and Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          {/* Brand */}
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h1 className="text-4xl font-extrabold text-yellow-400">
             VirtueHireX
            </h1>
            <p className="text-sm mt-2 text-gray-400">
              Your ultimate guide to interview success with AI-driven tools.
            </p>
          </div>

          {/* Social Media */}
          <div className="flex space-x-6">
            <a
              href="https://leetcode.com/u/vaibhav_bhosale_/"
              className="text-gray-400 hover:text-yellow-400 transition-transform transform hover:scale-125"
            >
              <i className="fab fa-facebook-f text-2xl"></i> Leetcode
            </a>
            <a
              href="https://github.com/vaibhav-bhosale1"
              className="text-gray-400 hover:text-yellow-400 transition-transform transform hover:scale-125"
            >
              <i className="fab fa-twitter text-2xl"></i>Github
            </a>
            <a
              href="https://www.linkedin.com/in/vaibhav-bhosale-0a2b13259/"
              className="text-gray-400 hover:text-yellow-400 transition-transform transform hover:scale-125"
            >
              <i className="fab fa-linkedin text-2xl"></i>Linkedin
            </a>
            <a
              href="https://www.instagram.com/_vaibhav_7x_"
              className="text-gray-400 hover:text-yellow-400 transition-transform transform hover:scale-125"
            >
              <i className="fab fa-instagram text-2xl"></i>Instagram
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Lower Section: Links and Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-center md:text-left">
            <a
              href="/"
              className="text-sm hover:text-yellow-400 transition-colors"
            >
              Home
            </a>
            <a
              href="/howitworks"
              className="text-sm hover:text-yellow-400 transition-colors"
            >
              How It Works
            </a>
            <a
              href="/pricing"
              className="text-sm hover:text-yellow-400 transition-colors"
            >
              Pricing
            </a>
            <a
              href="contact"
              className="text-sm hover:text-yellow-400 transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500 mt-6 md:mt-0">
            &copy; {new Date().getFullYear()} VirtueHireX. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
