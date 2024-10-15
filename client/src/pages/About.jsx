import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaRegLightbulb, FaHeadset, FaEnvelope, FaPhone } from 'react-icons/fa';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-5xl font-bold text-center mb-4 text-blue-600">Über Uns</h1>
      <p className="text-lg text-center mb-6 max-w-3xl text-gray-700">
        Willkommen bei Estate Markt! Wir sind bestrebt, Ihnen zu helfen, Ihr perfektes Zuhause zu finden. Unsere Plattform bietet eine breite Palette von Angeboten, von Mietobjekten bis hin zu Verkaufsangeboten, damit Sie Zugang zu den besten verfügbaren Immobilien haben.
      </p>

      <h2 className="text-3xl font-semibold mb-4 text-blue-500">Unsere Mission</h2>
      <p className="text-lg text-center mb-6 max-w-3xl text-gray-700">
        Unsere Mission ist es, den Immobilienprozess für alle zu vereinfachen. Wir streben danach, eine benutzerfreundliche Erfahrung zu bieten, die es Ihnen erleichtert, die richtige Immobilie zu suchen, zu vergleichen und zu finden, die Ihren Bedürfnissen entspricht.
      </p>

      <h2 className="text-3xl font-semibold mb-4 text-blue-500">Warum Uns Wählen?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 max-w-4xl">
        <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg">
          <FaUsers className="text-4xl text-blue-500 mb-2" />
          <h3 className="text-xl font-semibold">Umfangreiche Angebote</h3>
          <p className="text-center text-gray-600">
            Entdecken Sie eine Vielzahl von Immobilien in verschiedenen Kategorien, um Ihr Traumhaus zu finden.
          </p>
        </div>
        <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg">
          <FaRegLightbulb className="text-4xl text-blue-500 mb-2" />
          <h3 className="text-xl font-semibold">Benutzerfreundliche Oberfläche</h3>
          <p className="text-center text-gray-600">
            Unsere Plattform ist für eine einfache Navigation konzipiert, die Ihre Immobiliensuche zum Kinderspiel macht.
          </p>
        </div>
        <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg">
          <FaHeadset className="text-4xl text-blue-500 mb-2" />
          <h3 className="text-xl font-semibold">Engagierter Support</h3>
          <p className="text-center text-gray-600">
            Unser Kundenserviceteam steht Ihnen zur Verfügung, um Ihnen bei Fragen oder Anliegen zu helfen.
          </p>
        </div>
      </div>

      <h2 className="text-3xl font-semibold mb-4 text-blue-500">Kundensupport</h2>
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg max-w-3xl mb-6">
        <p className="text-lg text-center text-gray-700 mb-4">
          Wir sind hier, um Ihnen zu helfen! Wenn Sie Fragen haben oder Unterstützung benötigen, zögern Sie nicht, uns zu kontaktieren.
        </p>
        <div className="flex flex-col items-start">
          <div className="flex items-center mb-2">
            <FaEnvelope className="text-blue-500 mr-2" />
            <span className="text-gray-600">support@estatemarkt.com</span>
          </div>
          <div className="flex items-center">
            <FaPhone className="text-blue-500 mr-2" />
            <span className="text-gray-600">+1 (234) 567-890</span>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-semibold mb-4 text-blue-500">Kundenbewertungen</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mb-6">
        <p className="text-lg italic text-gray-600 mb-4">
          "Estate Markt hat meine Haussuche so einfach gemacht! Ich habe im Handumdrehen den perfekten Ort gefunden."
        </p>
        <p className="text-right font-semibold">- Zufriedener Kunde</p>
      </div>

      <Link to="/search" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300">
        Beginnen Sie Ihre Suche
      </Link>
    </div>
  );
};

export default About;
