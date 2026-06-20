import React, { useState } from 'react';
import { useMacify } from '../store';

export default function CalculatorApp() {
  const { isDarkMode } = useMacify();
  
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState<string>('');
  const [shouldReset, setShouldReset] = useState(false);

  const handleDigit = (digit: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(digit);
      setShouldReset(false);
    } else {
      setDisplay(prev => prev + digit);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setShouldReset(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setShouldReset(false);
  };

  const handleEquals = () => {
    if (!equation) return;
    try {
      const fullExpression = equation + display;
      // Sanitize input to protect against malicious injections before evaluating simple operators safely
      const sanitized = fullExpression.replace(/[^0-9+\-*/().\s]/g, '');
      const result = new Function(`return (${sanitized})`)();
      setDisplay(String(result));
      setEquation('');
      setShouldReset(true);
    } catch {
      setDisplay('Error');
      setEquation('');
      setShouldReset(true);
    }
  };

  const handlePercent = () => {
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  const handleToggleSign = () => {
    const val = parseFloat(display);
    setDisplay(String(-val));
  };

  return (
    <div className="flex-1 h-full select-none flex flex-col justify-end p-4 bg-neutral-950 font-sans" id="calculator-app">
      {/* Visual output line */}
      <div className="text-right text-4xl font-extralight text-white font-sans pr-2 py-4 tracking-tight leading-none overflow-hidden max-w-full truncate">
        {display}
      </div>

      {/* Interactive buttons cluster */}
      <div className="grid grid-cols-4 gap-2.5">
        {/* Row 1 */}
        <button
          onClick={handleClear}
          className="h-14 font-sans font-bold rounded-full bg-neutral-400 hover:bg-neutral-300 text-neutral-950 transition cursor-pointer text-sm leading-none"
        >
          AC
        </button>
        <button
          onClick={handleToggleSign}
          className="h-14 font-sans font-bold rounded-full bg-neutral-400 hover:bg-neutral-300 text-neutral-950 transition cursor-pointer text-sm leading-none"
        >
          +/-
        </button>
        <button
          onClick={handlePercent}
          className="h-14 font-sans font-bold rounded-full bg-neutral-400 hover:bg-neutral-300 text-neutral-950 transition cursor-pointer text-sm leading-none"
        >
          %
        </button>
        <button
          onClick={() => handleOperator('/')}
          className="h-14 font-sans font-black rounded-full bg-amber-500 hover:bg-amber-400 text-white transition cursor-pointer text-lg leading-none"
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          onClick={() => handleDigit('7')}
          className="h-14 font-sans font-bold rounded-full bg-[#333333] hover:bg-neutral-700 text-white transition cursor-pointer text-sm leading-none"
        >
          7
        </button>
        <button
          onClick={() => handleDigit('8')}
          className="h-14 font-sans font-bold rounded-full bg-[#333333] hover:bg-neutral-700 text-white transition cursor-pointer text-sm leading-none"
        >
          8
        </button>
        <button
          onClick={() => handleDigit('9')}
          className="h-14 font-sans font-bold rounded-full bg-[#333333] hover:bg-neutral-700 text-white transition cursor-pointer text-sm leading-none"
        >
          9
        </button>
        <button
          onClick={() => handleOperator('*')}
          className="h-14 font-sans font-black rounded-full bg-amber-500 hover:bg-amber-400 text-white transition cursor-pointer text-lg leading-none"
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          onClick={() => handleDigit('4')}
          className="h-14 font-sans font-bold rounded-full bg-[#333333] hover:bg-neutral-700 text-white transition cursor-pointer text-sm leading-none"
        >
          4
        </button>
        <button
          onClick={() => handleDigit('5')}
          className="h-14 font-sans font-bold rounded-full bg-[#333333] hover:bg-neutral-700 text-white transition cursor-pointer text-sm leading-none"
        >
          5
        </button>
        <button
          onClick={() => handleDigit('6')}
          className="h-14 font-sans font-bold rounded-full bg-[#333333] hover:bg-neutral-700 text-white transition cursor-pointer text-sm leading-none"
        >
          6
        </button>
        <button
          onClick={() => handleOperator('-')}
          className="h-14 font-sans font-black rounded-full bg-amber-500 hover:bg-amber-400 text-white transition cursor-pointer text-lg leading-none"
        >
          -
        </button>

        {/* Row 4 */}
        <button
          onClick={() => handleDigit('1')}
          className="h-14 font-sans font-bold rounded-full bg-[#333333] hover:bg-neutral-700 text-white transition cursor-pointer text-sm leading-none"
        >
          1
        </button>
        <button
          onClick={() => handleDigit('2')}
          className="h-14 font-sans font-bold rounded-full bg-[#333333] hover:bg-neutral-700 text-white transition cursor-pointer text-sm leading-none"
        >
          2
        </button>
        <button
          onClick={() => handleDigit('3')}
          className="h-14 font-sans font-bold rounded-full bg-[#333333] hover:bg-neutral-700 text-white transition cursor-pointer text-sm leading-none"
        >
          3
        </button>
        <button
          onClick={() => handleOperator('+')}
          className="h-14 font-sans font-black rounded-full bg-amber-500 hover:bg-amber-400 text-white transition cursor-pointer text-lg leading-none"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={() => handleDigit('0')}
          className="col-span-2 h-14 font-sans font-bold rounded-full bg-[#333333] hover:bg-neutral-700 text-white px-6 text-left transition cursor-pointer text-sm leading-none"
        >
          0
        </button>
        <button
          onClick={() => handleDigit('.')}
          className="h-14 font-sans font-bold rounded-full bg-[#333333] hover:bg-neutral-700 text-white transition cursor-pointer text-lg leading-none"
        >
          .
        </button>
        <button
          onClick={handleEquals}
          className="h-14 font-sans font-black rounded-full bg-amber-500 hover:bg-amber-400 text-white transition cursor-pointer text-lg leading-none"
        >
          =
        </button>
      </div>
    </div>
  );
}
