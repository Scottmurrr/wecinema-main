import React, { useState } from 'react';
import { MdMenu, MdMic, MdMicOff } from "react-icons/md"; // Add mic icons
import logo from "../../assets/wecinema.png";
import search from "../../assets/search.png";
import close from "../../assets/close.png"; 

import { Link, useNavigate } from "react-router-dom";
import { categories, ratings } from "../../App";
import '../header/drowpdown.css';

interface HeaderProps {
    darkMode: boolean;
    toggler: any;
    expand: boolean;
    isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({
    darkMode,
    toggler,
    expand,
    isMobile,
}) => {
    const nav = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);
    const [isOpened, setIsOpened] = useState(false);
    const toggleDropdowned = () => setIsOpened(!isOpened);
    const [searchTerm, setSearchTerm] = useState("");
    const [isListening, setIsListening] = useState(false); // State to track mic status

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
            const recognition = new window.webkitSpeechRecognition();
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
                        <img src={logo} alt="logo" width={60} title="wecinema" />
                        {!isMobile && (
                            <p className="text-md sm:text-2xl mt-3 font-mono">
                                WeCinema
                            </p>
                        )}
                    </li>
                </ul>
                {!isMobile && (
                    <form className="w-full md:w-2/3 flex items-center" onSubmit={handleSearchSubmit}>
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
                )}
                {isMobile && (
                    <div className="search-container">
                        <form className="search-form flex items-center" onSubmit={handleSearchSubmit}>
                            <input
                                type="search"
                                placeholder="Search anything..."
                                className={`search-input ${isExpanded ? 'expanded' : ''}`}
                                value={searchTerm}
                                onChange={handleSearchInputChange}
                            />
                            <button type="button" onClick={handleVoiceSearch} className="ml-2">
                                {isListening ? <MdMicOff size={24} /> : <MdMic size={24} />}
                            </button>
                            <div className="search-icon" onClick={toggleSearch}>
                                {isExpanded ? <img src={close} alt="close" width={30} /> :
                                    <img src={search} alt="search" width={30} />}
                            </div>
                        </form>
                    </div>
                )}
                <div className="dropdown">
                    <button className="hover:bg-yellow-400 whitespace-nowrap hover:text-white hover:border-white-100 border border-black-700 rounded-xl px-1 py-1 cursor-pointer" onClick={toggleDropdown}>
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
                                                width: 12,
                                                height: 12,
                                            }}
                                            title="Fresh and Fit"
                                        ></div>
                                    </div>
                                    <Link to="#" className="text-sm">
                                        {val}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="dropdown">
                    <button className="hover:bg-yellow-400 whitespace-nowrap hover:text-white hover:border-white-100 border border-black-700 rounded-xl px-1 py-1 cursor-pointer" onClick={toggleDropdowned}>
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
                                    </div>
                                    <Link to="#" className="text-sm">
                                        {val}
                                    </Link>
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
