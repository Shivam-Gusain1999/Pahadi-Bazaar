import React from 'react'
import { assets, footerLinks } from '../assets/assets';

const Footer = () => {
    return (
        <div className="mt-1 md:mt-10 px-6 md:px-16 lg:px-24 xl:px-32 bg-green-50">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-300 text-gray-700">
                {/* Logo and description */}
                <div>
                    <img className="w-34 md:w-45" src={assets.ppppp} alt="pahadibazarphoto" />
                    <p className="max-w-[410px] mt-6">
                        Pahadi Bazaar is your trusted online store for all daily needs – from groceries to household essentials – delivered right to your doorstep.
                    </p>
                </div>

                {/* Footer Links */}
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a 
                                            href={link.url || "#"} 
                                            className="hover:text-green-700 transition-colors duration-300"
                                        >
                                            {link.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Copyright */}
            <p className="py-4 text-center text-sm md:text-base text-gray-600">
                Copyright {new Date().getFullYear()} © 
                <a href="https://pahadibazaar.com" className="text-green-700 hover:underline"> Pahadi Bazaar</a> 
                All Rights Reserved.
            </p>
        </div>
    );
};

export default Footer;
