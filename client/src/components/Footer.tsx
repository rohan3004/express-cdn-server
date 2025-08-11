// Note: For these Font Awesome icons to work, you must add the Font Awesome library to your project.
// You can add the following line to the <head> of your main public/index.html file:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />

export const Footer = () => {
  return (
    <footer className="bg-prime-blue-dark text-gray-300 py-12 mt-12">
      <div className="container mx-auto px-4 md:px-10">
        <div className="flex space-x-6 mb-8">
          <a href="#" aria-label="Facebook" className="hover:text-prime-yellow transition-colors"><i className="fab fa-facebook-f text-2xl"></i></a>
          <a href="#" aria-label="Instagram" className="hover:text-prime-yellow transition-colors"><i className="fab fa-instagram text-2xl"></i></a>
          <a href="#" aria-label="Twitter" className="hover:text-prime-yellow transition-colors"><i className="fab fa-twitter text-2xl"></i></a>
          <a href="#" aria-label="YouTube" className="hover:text-prime-yellow transition-colors"><i className="fab fa-youtube text-2xl"></i></a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-8">
          <a href="#" className="hover:text-prime-yellow">Audio Description</a>
          <a href="#" className="hover:text-prime-yellow">Help Centre</a>
          <a href="#" className="hover:text-prime-yellow">Gift Cards</a>
          <a href="#" className="hover:text-prime-yellow">Media Centre</a>
          <a href="#" className="hover:text-prime-yellow">Investor Relations</a>
          <a href="#" className="hover:text-prime-yellow">Jobs</a>
          <a href="#" className="hover:text-prime-yellow">Terms of Use</a>
          <a href="#" className="hover:text-prime-yellow">Privacy</a>
          <a href="#" className="hover:text-prime-yellow">Legal Notices</a>
          <a href="#" className="hover:text-prime-yellow">Cookie Preferences</a>
          <a href="#" className="hover:text-prime-yellow">Corporate Information</a>
          <a href="#" className="hover:text-prime-yellow">Contact Us</a>
        </div>

        <button className="border border-gray-500 text-gray-300 py-1 px-2 text-sm hover:text-white hover:border-white transition-colors mb-8">
          Service Code
        </button>

        <p className="text-xs text-gray-500">
          © 1997-2025 PrimeVideo, Inc.
        </p>
      </div>
    </footer>
  );
};
