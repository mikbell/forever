import React from "react";

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-500"></div>
            <p className="ml-4 text-lg text-gray-700">Caricamento...</p>
        </div>
    );
};

export default LoadingSpinner;