import {
  forwardRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import './Terminal.css';

export interface TerminalLine {
  text: string;
  type?: 'command' | 'output';
}

export interface TerminalProps {
  lines?: TerminalLine[];
  prompt?: string;
  onCommand?: (command: string) => void;
  className?: string;
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export const Terminal = forwardRef<HTMLDivElement, TerminalProps>((props, ref) => {
  const { lines = [], prompt = '$', onCommand, className } = props;
  const [value, setValue] = useState('');

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onCommand?.(value);
      setValue('');
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div ref={ref} className={cx('uglyworkgood-terminal', className)}>
      <div className="uwg-terminal-lines">
        {lines.map((line, idx) => (
          <div
            key={idx}
            className={cx('uwg-terminal-line', line.type === 'command' && 'uwg-terminal-command')}
          >
            {line.type === 'command' ? (
              <>
                <span className="uwg-terminal-prompt">{prompt}</span>
                {line.text}
              </>
            ) : (
              line.text
            )}
          </div>
        ))}
      </div>
      <div className="uwg-terminal-input">
        <span className="uwg-terminal-prompt">{prompt}</span>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
});

Terminal.displayName = 'Terminal';

