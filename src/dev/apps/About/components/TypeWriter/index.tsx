import React from "react";
import { TypeAnimation } from "react-type-animation";

const TypeWriter: React.FC = () => {
  return (
    <div className="w-full h-[180px] overflow-hidden flex justify-center items-center">
      <TypeAnimation
        sequence={[
          "while (true) {\n}", // Types 'One'
          1000, // Waits 1s
          "while (true) {\nmyself.do(...",
          3000, // Deletes 'One' and types 'Two'
        ]}
        wrapper="span"
        cursor={true}
        deletionSpeed={300}
        repeat={Infinity}
        className="text-2xl font-light inline-block w-fit rounded-2xl bg-gray-50 whitespace-pre-line text-indigo-600 px-12 py-8"
      />
    </div>
  );
};

export default TypeWriter;

