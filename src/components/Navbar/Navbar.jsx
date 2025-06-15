"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Search, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = ({ posts, menu }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const router = useRouter();

  const filteredData = posts.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
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
        <a href={`/`} className='flex items-center space-x-2'>
          <Image 
            className="!cursor-pointer" 
            src='/Logo.png' 
            // onClick={() => router.push("/")}
            alt='Logo' 
            width={100} height={100} 
          />
        </a>

        {/* Desktop Nav Links */}
        {!showSearch && (
          <ul className='hidden md:flex space-x-6'>
            {menu.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className='text-md text-white hover:text-gray-300 duration-300 font-semibold md:max-lg:text-[0.7rem]'>
                  {link.name}
                </a>
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
                    <a
                      // onClick={() => router.push(`/post/${item.slug}`)}
                      href={`/post/${item.slug}`}
                      key={item.id}
                      className='flex items-center p-2 space-x-3 hover:bg-gray-100 transition'>
                      <div className='w-12 h-12 flex-shrink-0'>
                        <Image
                          src={`${item.image}`}
                          alt={item.title}
                          width={48}
                          height={48}
                          className='rounded object-cover'
                        />
                      </div>
                      <span className='text-sm font-medium text-black truncate max-w-[200px]'>
                        {item.title}
                      </span>
                    </a>
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
                        src={`${item.image}`}
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
            {menu.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className='block text-sm text-white hover:text-gray-300 transition'
                  onClick={() => setMenuOpen(false)}>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
