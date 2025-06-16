import React from 'react';

const ServiceCard = ({ title, description, buttonText, buttonColor = "bg-gray-900", icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition duration-300">
      {icon && (
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            {icon}
          </div>
        </div>
      )}
      
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        {description}
      </p>
      
      <button className={`${buttonColor} hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition duration-300 transform hover:scale-105`}>
        {buttonText}
      </button>
    </div>
  );
};

export default ServiceCard;
