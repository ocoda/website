import type { FC } from 'react';

interface Props {
  isScrolling: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export const MenuButton: FC<Props> = ({ isScrolling, isOpen, onToggle }) => {
  return (
    <label
      aria-expanded={isOpen}
      className={`flex flex-col lg:hidden p-2 w-12 cursor-pointer ${isScrolling || isOpen ? 'text-black-950' : 'text-white'}`}
    >
      <input type="checkbox" checked={isOpen} onChange={onToggle} className="hidden peer" />
      <span className="bg-current my-[3px] rounded-full w-1/2 h-0.5 peer-checked:origin-bottom transition-all peer-checked:translate-x-[2px] peer-checked:translate-y-[2px] duration-300 ease-in-out peer-checked:rotate-45" />
      <span className="bg-current my-[3px] rounded-full w-full h-0.5 peer-checked:origin-top peer-checked:-rotate-45 transition-all duration-300 ease-in-out" />
      <span className="bg-current my-[3px] rounded-full w-3/4 peer-checked:w-1/2 h-0.5 peer-checked:rotate-45 transition-all peer-checked:-translate-y-[3px] peer-checked:translate-x-[13px] duration-300 ease-in-out" />
    </label>
  );
};
