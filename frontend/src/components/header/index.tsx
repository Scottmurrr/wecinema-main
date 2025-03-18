import React, { useState } from 'react';
import { MdMenu, MdMic, MdMicOff } from "react-icons/md"; // Add mic icons
import logo from "../../assets/wecinema.png";
import search from "../../assets/search.png";
import close from "../../assets/close.png"; 
import { FaUpload, FaVideo, FaFileAlt, FaHome} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { categories, ratings } from "../../App";
import '../header/drowpdown.css';
import { MdHome } from "react-icons/md";
import { Search, X } from "lucide-react"; // Importing icons
interface HeaderProps {
    darkMode: boolean;
    toggler: any;
    expand: boolean;
    isMobile: boolean;
    toggleUploadScriptModal?: any;
    toggleUploadModal?: any;
}

const Header: React.FC<HeaderProps> = ({
    darkMode,
    toggler,
    expand,
    isMobile,
    toggleUploadScriptModal,
    toggleUploadModal,
}) => {
    const nav = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);
    const [isOpened, setIsOpened] = useState(false);
    const toggleDropdowned = () => setIsOpened(!isOpened);
    const [searchTerm, setSearchTerm] = useState("");
    const [isListening, setIsListening] = useState(false); // State to track mic status
    const [uploadMenu, setUploadMenu] = useState(false);

    const toggleUploadMenu = () => setUploadMenu(!uploadMenu);


    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (searchTerm.trim() !== "") {
            const capitalizedSearchTerm = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);
            nav(`/search/${capitalizedSearchTerm.trim()}`);
        }
    };

    const toggleSearch = () => {
        setIsExpanded(!isExpanded);
    };

    // Web Speech API for voice search
    const handleVoiceSearch = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setSearchTerm(transcript);
                nav(`/search/${transcript}`);
            };

            recognition.start();
        } else {
            alert("Speech recognition is not supported in this browser.");
        }
    };
    const getActiveClass = (path: string) => {
        return window.location.pathname === path ? "text-active" : "";
      };
    return (
        <header
            className={`text-blue z-50 border-b fixed w-screen border-gray-200 ${
                darkMode ? "bg-dark" : "bg-light"
            } ${darkMode ? "text-dark" : "text-light"} `}
        >
            <nav
                className={`mx-auto flex gap-4 items-center justify-between p-4 sm:pr-12 ${
                    expand && !isMobile ? " px-4" : "sm:px-12 "
                } `}
            >
                <ul className="flex gap-4 items-center">
                    <MdMenu size={30} className="cursor-pointer mt-2" onClick={toggler} />
                    <li
                        className="cursor-pointer flex-col sm:flex-row flex gap-2 items-center"
                        onClick={() => nav("/")}
                    >
                        <img src={logo} alt="logo" width={50} title="wecinema" />
                        {!isMobile && (
                            <p className="text-md sm:text-1xl mt-3 font-mono">
                                WeCinema
                            </p>
                        )}
                    </li>
                </ul>
                {!isMobile && (
                    <div className='form'>
                    <form className="w-full flex items-center" onSubmit={handleSearchSubmit}>
                        <input
                            type="search"
                            placeholder="Search anything..."
                            className="w-full flex mx-auto border rounded-xl cursor-pointer p-2 outline-none"
                            value={searchTerm}
                            onChange={handleSearchInputChange}
                        />
                        <button type="button" onClick={handleVoiceSearch} className="ml-2">
                            {isListening ? <MdMicOff size={24} /> : <MdMic size={24} />}
                        </button>
                    </form>
                    </div>
                )}
            {isMobile && (
            
            <div className="fixed bottom-3 left6 z-50">

            <button
    className="p-3 bg-yellow-500 rounded-full shadow-lg hover:bg-yellow-500 transition"
    onClick={toggleSearch}
>
    {isExpanded ? <X size={20} color="white" /> : <Search size={20} color="white" />}
</button>
            </div>
                )}

            {isExpanded && (
    <div className="fixed bottom-16 right-15 bg-white shadow-lg p-3 rounded-lg flex items-center w-64 border border-gray-300">
        <form className="w-full flex items-center" onSubmit={handleSearchSubmit}>
            <input
                type="search"
                placeholder="Search anything..."
                className="w-full flex mx-auto border rounded-xl p-2 outline-none"
                value={searchTerm}
                onChange={handleSearchInputChange}
            />
            {/* Search Icon Button */}
            <button type="submit" className="ml-2 text-gray-500 hover:text-gray-700">
                🔍
            </button>
        </form>

    </div>
)}


       

                 {/* Plus (+) Button for Upload Options */}
            <div className="relative">
      
                           <button
                           className="bg-yellow-500 mt-0 text-white p-2  mr-7 rounded-full hover:bg-yellow-500 transition"
                           onClick={toggleUploadMenu}
                           title="Upload Options"
                       >
                           <FaUpload size={18} />
                            {/* Upload Options (Dropdown) */}
                {uploadMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg p-2">
                        <button
                            className={`flex items-center gap-2 text-gray-700 p-2 w-full hover:bg-gray-200 rounded-md ${getActiveClass("/upload")}`}
                            onClick={toggleUploadModal}
                        >
                            <FaVideo size={16} />
                            Video
                        </button>
                        <button
                              className={`flex items-center gap-2 text-gray-700 p-2 w-full hover:bg-gray-200 rounded-md ${getActiveClass("/uploadscripts")}`}
                            onClick={toggleUploadScriptModal}
                        >
                            <FaFileAlt size={16} />
                            Script
                        </button>
                    </div>
                    
                )}
                       </button>
                       
                   
                    </div>
               

     
       

                {/* Scroll to Top Button */}
                <div
                    className="fixed bottom-3 right-5 bg-yellow-500 text-white p-1 rounded-full shadow-lg hover:bg-yellow-600 cursor-pointer z-50"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-7 h-7"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </div>

               
             

                <div className="dropdown">
                    <button className="hover:bg-yellow-500 whitespace-nowrap mr-5 hover:text-white hover:border-white-100 border border-black-700 rounded-xl px-2 py-1 cursor-pointer" onClick={toggleDropdown}>
                        Genre
                        <span className={`arrow ${isOpen ? 'open' : ''}`}></span>
                    </button>
                    {isOpen && (
                        <ul className="dropdown-menu">
                            {categories.map((val: string, index: number) => (
                                <li
                                    key={index}
                                    className={`duration-75 flex gap-4 mx-4 my-2 cursor-pointer items-center ${
                                        expand ? "" : "flex-col justify-center text-xs gap-1 specific"
                                    } `}
                                >
                                    <div
                                        onClick={() => nav("/category/" + val)}
                                        className="relative rounded-full w-32px h-32px box-border flex-shrink-0 block"
                                    >
                                        <div
                                            className="items-center rounded-full flex-shrink-0 justify-center bg-center bg-no-repeat bg-cover flex"
                                            style={{
                                                width: 10,
                                                height: 10,
                                            }}
                                            title="Fresh and Fit"
                                        ></div>
                                    <Link to="#" className="text-sm">
                                        {val}
                                    </Link>
                                    </div>

                                </li>
                            ))}
                        </ul>
                    )}
                </div>


                <div className="dropdown">
                    <button className="hover:bg-yellow-500 whitespace-nowrap hover:text-white hover:border-white-100 border border-black-700 rounded-xl px-1 py-1 cursor-pointer" onClick={toggleDropdowned}>
                        Rating
                        <span className={`arrow ${isOpened ? 'open' : ''}`}></span>
                    </button>
                    {isOpened && (
                        <ul className="dropdown-menu">
                            {ratings.map((val: string, index: number) => (
                                <li
                                    key={index}
                                    className={`duration-75 flex gap-4 mx-4 my-2 cursor-pointer items-center ${
                                        expand ? "" : "flex-col justify-center text-xs gap-1 specific"
                                    } `}
                                >
                                    <div
                                        onClick={() => nav("/ratings/" + val)}
                                        className="relative rounded-full w-32px h-32px box-border flex-shrink-0 block"
                                    >
                                        <div
                                            className="items-center rounded-full flex-shrink-0 justify-center bg-center bg-no-repeat bg-cover flex"
                                            style={{
                                                width: 12,
                                                height: 12,
                                            }}
                                            title="Fresh and Fit"
                                        ></div>
                                    <Link to="#" className="text-sm">
                                        {val}
                                    </Link>
                                    </div>

                                </li>
                            ))}
                        </ul>
                    )}
                </div>


            </nav>
        </header>
    );
};

export default Header;
