import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo & Description */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">KA Technology</span>
                    </div>

                    {/* Copyright */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                        © {new Date().getFullYear()} KA Technology. All rights reserved.
                    </p>

                    {/* Links */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
