"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Search, Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "US", href: "/us" },
  { name: "World", href: "/world" },
  { name: "Politics", href: "/politics" },
  { name: "Business", href: "/business" },
  { name: "Opinion", href: "/opinion" },
  { name: "Health", href: "/health" },
  { name: "Entertainment", href: "/entertainment" },
  { name: "Travel", href: "/travel" },
  { name: "Sports", href: "/sports" },
];

const sampleData = [
  { id: 1, title: "US Economy shows signs of recovery", image: "/Logo.jpg" },
  {
    id: 2,
    title: "New political debates spark controversy",
    image: "/Logo.jpg",
  },
  {
    id: 3,
    title: "World Health Organization announces new guidelines",
    image: "/Logo.jpg",
  },
  {
    id: 4,
    title: "Entertainment industry sees a boom post-pandemic",
    image: "/Logo.jpg",
  },
  {
    id: 5,
    title: "Sports update: Champions League final set",
    image: "/Logo.jpg",
  },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredData = sampleData.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
        setQuery("");
      }
    };

    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);

  return (
    <nav className='bg-black border-b border-gray-800 shadow-sm relative z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center'>
        {/* Logo */}
        <div className='flex items-center space-x-2'>
          <Image src='/Logo.png' alt='Logo' width={100} height={100} />
        </div>

        {/* Desktop Nav Links */}
        {!showSearch && (
          <ul className='hidden md:flex space-x-6'>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className='text-md text-white hover:text-gray-300 duration-300 font-semibold md:max-lg:text-[0.7rem]'>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Right Section */}
        <div ref={searchRef} className='flex items-center space-x-4 relative'>
          {/* Desktop Search Box */}
          <div
            className={`hidden md:flex flex-col absolute right-10 mt-2 w-80 bg-black rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out transform ${
              showSearch
                ? "opacity-100 scale-100 visible"
                : "opacity-0 scale-95 invisible"
            }`}>
            <div className='flex items-center bg-gray-200 rounded-t-lg px-2 py-2'>
              <input
                type='text'
                placeholder='Search...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className='flex-grow px-2 py-1 bg-transparent text-black outline-none'
                autoFocus
              />
              <X
                className='w-4 h-4 text-black cursor-pointer'
                onClick={() => {
                  setShowSearch(false);
                  setQuery("");
                }}
              />
            </div>

            {/* Search Results */}
            {query && (
              <div className='bg-white rounded-b-lg max-h-64 overflow-y-auto divide-y absolute top-12 w-80'>
                {filteredData.length ? (
                  filteredData.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-center p-2 space-x-3 hover:bg-gray-100 transition'>
                      <div className='w-12 h-12 flex-shrink-0'>
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={48}
                          height={48}
                          className='rounded object-cover'
                        />
                      </div>
                      <span className='text-sm font-medium text-black truncate max-w-[200px]'>
                        {item.title}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className='p-3 text-sm text-gray-500'>
                    No results found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Icon */}
          <Search
            className='w-5 h-5 text-white hover:text-gray-300 cursor-pointer md:block'
            strokeWidth={1}
            onClick={() => setShowSearch(true)}
          />

          {/* Mobile menu button */}
          <button
            className='md:hidden'
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label='Toggle Menu'>
            {menuOpen ? (
              <X className='w-6 h-6 text-white' />
            ) : (
              <Menu className='w-6 h-6 text-white' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {showSearch && (
        <div className='md:hidden px-4 pb-2 flex flex-col space-y-2 bg-black'>
          <div className='flex items-center'>
            <input
              type='text'
              placeholder='Search...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className='flex-grow px-3 py-2 rounded-t-lg bg-gray-200 text-black border focus:outline-none'
              autoFocus
            />
            <X
              className='ml-2 w-5 h-5 text-white cursor-pointer'
              onClick={() => {
                setShowSearch(false);
                setQuery("");
              }}
            />
          </div>

          {/* Mobile Results */}
          {query && (
            <div className='bg-white rounded-b-lg shadow divide-y max-h-64 overflow-y-auto w-full'>
              {filteredData.length ? (
                filteredData.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center p-2 space-x-3 hover:bg-gray-100 transition'>
                    <div className='w-12 h-12 flex-shrink-0'>
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={48}
                        height={48}
                        className='rounded object-cover'
                      />
                    </div>
                    <span className='text-sm font-medium text-black truncate max-w-[200px]'>
                      {item.title}
                    </span>
                  </div>
                ))
              ) : (
                <div className='p-3 text-sm text-gray-500'>
                  No results found.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className='md:hidden px-4 pb-4 bg-black'>
          <ul className='space-y-3'>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className='block text-sm text-white hover:text-gray-300 transition'
                  onClick={() => setMenuOpen(false)}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
