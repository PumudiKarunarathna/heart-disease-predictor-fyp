import { useState, useEffect } from 'react';
import image1 from '../assets/1.jpg';
import image2 from '../assets/2.jpg';
import image3 from '../assets/4.jpg';

const slides = [
  {
    image: image1,
    title: "Advanced Heart Disease Prediction",
    description: "Using cutting-edge machine learning technology to predict heart disease risk"
  },
  {
    image: image2,
    title: "Expert Healthcare Analysis",
    description: "Get accurate predictions based on your health parameters"
  },
  {
    image: image3,
    title: "Preventive Healthcare",
    description: "Take control of your heart health with early predictions"
  }
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-opacity duration-500 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
            <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
            <p className="text-xl">{slide.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Slider;