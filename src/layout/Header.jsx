import React from "react";

export default function Header({userID}) {
    return (
        <header className="sticky top-0 z-20 w-full bg-white border-b p-6">
            <nav className="flex justify-center">
                <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                    <li>
                        <a href={`/Home/${userID}`} className="">Home</a>
                    </li>
                    <li>
                        <a href="#" className="">Calendar</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
