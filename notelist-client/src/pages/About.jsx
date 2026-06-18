import React from 'react';

export default function About() {
  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg text-center mt-10">
      {/* Емблема додатка у вигляді SVG-іконки нотаток */}
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-blue-100 rounded-full text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-2 text-gray-800">NoteList App</h2>
      <p className="text-sm text-gray-500 mb-4">Версія 1.0.0 (Beta)</p>
      <p className="text-gray-600 leading-relaxed">
        Web-додаток для створення, редагування та миттєвого обміну нотатками в реальному часі. 
        Система підтримує асинхронну взаємодію користувачів через WebSockets та надає адміністраторам інструменти моніторингу активності мережі.
      </p>
    </div>
  );
}