import { useState, useEffect } from "react";
import { sliderData1, sliderData2 } from "./slider-data";
import "./Slider.css";

const Slider = (props) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideLength = sliderData1.length;
  // const slideLength2 = sliderData2.length;

  const autoScroll = true;
  let slideInterval;
  let intervalTime = 5000;

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
    console.log("next");
  };

  function auto() {
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  useEffect(() => {
    setCurrentSlide(0);
  }, []);

  useEffect(() => {
    if (autoScroll) {
      auto();
    }
    return () => clearInterval(slideInterval);
  }, [currentSlide]);

  return (
    <div className="slider">
      {props.slideImg==="projects" ? (sliderData1.map((slide, index) => {
        return (
          <div
            className={index === currentSlide ? "slide current" : "slide"}
            key={index}
          >
            {index === currentSlide && (
              <div>
                <img src={slide.image} alt="slide" className="image" />
              </div>
            )}
          </div>
        );
      })):
      (sliderData2.map((slide, index) => {
        return (
          <div
            className={index === currentSlide ? "slide current" : "slide"}
            key={index}
          >
            {index === currentSlide && (
              <div>
                <img src={slide.image} alt="slide" className="image" />
              </div>
            )}
          </div>
        );
      }))
      }
    </div>
  );
};

export default Slider;