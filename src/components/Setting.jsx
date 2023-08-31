import React from 'react';
import { AiOutlinePercentage } from 'react-icons/ai';
import { AiOutlineClose } from 'react-icons/ai';

function InputGroup3({
  label,
  label2,
  name,
  value,
  onChange,
  decoration,
  placeholder,
  inputClassName = "",
  decorationClassName = "",
  disabled,
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-1/2 flex flex-col">
        <span className="text-md font-medium">
          {label}
        </span>
        <span className="text-md">
          {label2}
        </span>
      </div>
      <div className="relative w-52">
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          type="number"
          placeholder={placeholder}
          aria-label={label}
          className={`block w-full px-3 py-2 text-gray-500 bg-white border border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-0 appearance-none rounded transition-colors duration-300 ${
            disabled ? "bg-gray-200" : ""
          } ${inputClassName}`}
          disabled={disabled}
        />
        <div
          className={`absolute top-1/2 -right-1 transform -translate-y-1/2 flex items-center rounded-tl-none rounded-bl-none rounded px-3 py-3 text-gray-600 border bg-slate-300 border-gray-400 border-l-0 ${
            disabled ? "bg-gray-200" : ""
          } ${decorationClassName}`}
        >
          {decoration}  
        </div>
      </div>
    </div>
  );
}

function Setting() {
  return (
    <div className="relative right-20 -top-20 flex flex-col bg-white w-full p-5 gap-8 rounded-md">
      <InputGroup3
        name="RASR"
        placeholder="5"
        label="Reach Amount Spent Ratio (RASR)"
        label2="Recommended value > 5%"
        decoration={<AiOutlinePercentage size="1rem" />}
      />
      <InputGroup3
        name="CTR"
        placeholder="1.5"
        label="Click Through Rate (CTR)"
        label2="Recommended value > 1.5%"
        decoration={<AiOutlinePercentage size="1rem" />}
      />
      <InputGroup3
        name="OCLP"
        placeholder="80"
        label="Outbound Click Landing Page (OCLP)"
        label2="Recommended value > 1.5%"
        decoration={<AiOutlinePercentage size="1rem" />}
      />
      <InputGroup3
        name="ROAS"
        placeholder="3.0"
        label="Return on AD Spent (ROAS)"
        label2="Recommended value > 3.0x"
        decoration={<AiOutlineClose size="1rem" />}
      />
    </div>
  );
}

export default Setting;
