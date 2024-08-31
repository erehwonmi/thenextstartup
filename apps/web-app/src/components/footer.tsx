import Link from 'next/link';
import { Github, Slack, Twitter } from 'lucide-react';
import LocaleSwitcher from './locale-switcher';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black text-gray-400 py-20">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center px-20">
        <div className="flex flex-col items-center lg:items-start mb-8 lg:mb-0">
          <div className="flex items-center space-x-2 mb-4 gap-3 xl:flex-row md:flex-row flex-col">
            <h5 className="text-black dark:text-white flex-1 font-bungeeShade font-semibold text-2xl text-center my-4">
              The <label>Next</label> Startup
            </h5>
            <LocaleSwitcher />
          </div>
          <div className="flex space-x-4">
            <Link
              href="#"
              aria-label="slack"
              className="text-gray-400 dark:hover:text-white hover:text-gray-700"
            >
              <Slack />
            </Link>
            <Link
              href="#"
              aria-label="github"
              className="text-gray-400 dark:hover:text-white hover:text-gray-700"
            >
              <Github />
            </Link>
            <Link
              href="#"
              aria-label="twitter"
              className="text-gray-400 dark:hover:text-white hover:text-gray-700"
            >
              <Twitter />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-20 text-center lg:text-left">
          <div>
            <h5 className="text-black dark:text-white mb-4 font-josefinSans">
              Product
            </h5>
            <ul className="text-sm grid grid-cols-1 gap-1.5">
              <li>
                <Link
                  href="#"
                  className="dark:hover:text-white hover:text-gray-700"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="dark:hover:text-white hover:text-gray-700"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="dark:hover:text-white hover:text-gray-700"
                >
                  Changelog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="dark:hover:text-white hover:text-gray-700"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="dark:hover:text-white hover:text-gray-700"
                >
                  Download
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-black font-josefinSans dark:text-white mb-4">
              Company
            </h5>
            <ul className="text-sm grid grid-cols-1 gap-1.5">
              <li>
                <Link
                  href="#"
                  className="dark:hover:text-white hover:text-gray-700"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="dark:hover:text-white hover:text-gray-700"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="dark:hover:text-white hover:text-gray-700"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="dark:hover:text-white hover:text-gray-700"
                >
                  Customers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-black font-josefinSans dark:text-white mb-4">
              Resources
            </h5>
            <ul className="text-sm grid grid-cols-1 gap-1.5">
              <li>
                <Link
                  href="#"
                  className="dark:hover:text-white hover:text-gray-700"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="dark:hover:text-white hover:text-gray-700"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="dark:hover:text-white hover:text-gray-700"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="dark:hover:text-white hover:text-gray-700"
                >
                  Terms of service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="dark:hover:text-white hover:text-gray-700"
                >
                  Report a vulnerability
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
