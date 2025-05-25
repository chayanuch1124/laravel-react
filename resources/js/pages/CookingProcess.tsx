import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import "../../css/FoodStatusTimeline.css";

const FoodStatusTimeline: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "Prepare Ingredients", emoji: "🥕" },
    { label: "Start Cooking", emoji: "🍳" },
    { label: "Cooking in Progress", emoji: "🔥" },
    { label: "Serve the Dish", emoji: "🍽️" },
  ];

  const handleNextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  return (
    <div className="food-timeline-container">
      <h1 className="food-timeline-title">Food Preparation Status</h1>
      <div className="timeline-wrapper">
        <div className="timeline-line">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              {/* จุด */}
              <div
                className={`timeline-step-circle ${
                  index <= currentStep ? "active" : ""
                }`}
              >
                <span className="emoji">{step.emoji}</span>
              </div>
              {/* เส้นเชื่อม (เว้นข้างหลัง step สุดท้าย) */}
              {index < steps.length - 1 && (
                <div
                  className={`timeline-step-line ${
                    index < currentStep ? "active" : ""
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="timeline-labels">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`timeline-step-label ${
                index === currentStep ? "active-label" : ""
              }`}
            >
              {step.label}
            </div>
          ))}
        </div>
      </div>
      <div className="food-timeline-buttons">
        <Button onClick={handlePrevStep} disabled={currentStep === 0}>
          Previous
        </Button>
        <Button onClick={handleNextStep} disabled={currentStep === steps.length - 1}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default FoodStatusTimeline;
