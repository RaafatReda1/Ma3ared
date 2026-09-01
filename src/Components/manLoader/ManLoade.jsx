import React from 'react';
import manLoad from '../../assets/ChatGPT Image AM.png';
import PocketWatchReactComponent from '../PocketWatch/PocketWatchReactComponent';
import './ManLoade.css';
import LoaderLife from './LoaderLife';

function manLoade() {

  return (

    <section className="relative w-full h-screen backG flex items-center justify-center overflow-hidden">

      {/* 1. النص فوق المنتصف تماماً فوق البوابة */}
      <div className="absolute top-[8%] z-20 text-center px-4 space-y-2 pointer-events-none">
        <h1 className="hero-title">
          <span style={{ "--i": 0 }}>حان</span>
          <span style={{ "--i": 1 }}>الوقت</span>
          <span style={{ "--i": 2 }}>ليبقى</span>
          <span style={{ "--i": 3 }}>أثرك</span>
        </h1>

        <p className="hero-subtitle">
          <span style={{ "--i": 5 }}>اصنع</span>
          <span style={{ "--i": 6 }}>قخرا</span>
          <span style={{ "--i": 7 }}>واستمر</span>
          <span style={{ "--i": 8 }}>في</span>
          <span style={{ "--i": 9 }}>ترك</span>
          <span style={{ "--i": 10 }}>الاثر.</span>
        </p>
      </div>

      {/* 2. صورة الراجل: مثبتة في الأسفل اليسار لترميم القطع من أسفل الشاشة */}
      {/* <div className="absolute left-0 bottom-0  md:h-[85%] z-20 flex items-end">
        <img 
          src={manLoad} 
          className="h-full w-full object-contain object-bottom drop-shadow-[10px_0_20px_rgba(0,0,0,0.7)]" 
          alt="Man background" 
        />
      </div> */}

      {/* 3. الساعة 3D: متمركزة تماماً في نص البوابة السحرية (Center Portal) */}
      <div className=' absolute right-0 top-0 w-[100%] sm:w-[50%] md:w-[80%] h-[90vh]'>

        <div className=" relative w-full h-full   ">
          <PocketWatchReactComponent />
        </div>

      </div>

      <div className=' animate-bounce absolute top-[60%] right-[10%] h-7 w-22'>
        <LoaderLife/>
        <p className=' font-bold bg-linear-to-r from-cyan-500 to-blue-700 text-transparent bg-clip-text '>TIK⚡TAK</p>
        <p className=' font-bold bg-linear-to-r/longer from-indigo-500 to-teal-400 text-transparent bg-clip-text text-center '>لنترك اثرا </p>
      </div>

      {/* 4. طبقة التدرج السفلي لإدماج العناصر مع باقي الصفحة */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black to-transparent z-30 pointer-events-none" />

    </section>
    
  );
}

export default manLoade;