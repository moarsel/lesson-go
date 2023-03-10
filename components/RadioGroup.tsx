import { RadioGroup as RadioGroupUI } from "@headlessui/react";
import React from "react";

type Props = {
  label: string;
  options: string[];
  name?: string;
  value: string;
  onChange?: (value: string) => void;
};

const RadioGroup = ({ label, options, name, value, onChange }: Props) => {
  return (
    <RadioGroupUI value={value} onChange={onChange} name={name}>
      <RadioGroupUI.Label>{label}</RadioGroupUI.Label>
      {options.map((plan) => (
        <RadioGroupUI.Option key={plan} value={plan}>
          {plan}
        </RadioGroupUI.Option>
      ))}
    </RadioGroupUI>
  );
};

export default RadioGroup;
