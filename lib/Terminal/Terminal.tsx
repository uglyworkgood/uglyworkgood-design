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
  /**
   * Lines to display when the terminal first renders.
   */
  lines?: TerminalLine[];
  /**
   * Character(s) to render before command lines.
   *
   * @default '$'
   */
  prompt?: string;
  /**
   * Mapping of command inputs to the text that should be written to the
   * terminal as a response. If the command entered by a user matches a key in
   * this object, the corresponding value will be printed.
   */
  commands?: Record<string, string | string[]>;
  /**
   * Optional callback invoked when a command is entered. If the callback
   * returns a string or array of strings, the value will be appended to the
   * terminal output. This can be used for dynamic responses.
   */
  onCommand?: (command: string) => string | string[] | void;
  className?: string;
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export const Terminal = forwardRef<HTMLDivElement, TerminalProps>((props, ref) => {
  const {
    lines: initialLines = [],
    prompt = '$',
    commands = {},
    onCommand,
    className,
  } = props;

  const [lines, setLines] = useState<TerminalLine[]>(initialLines);
  const [value, setValue] = useState('');

  const appendOutput = (cmd: string) => {
    setLines((prev) => {
      const next = [...prev, { text: cmd, type: 'command' as const }];
      let output: string | string[] | void = commands[cmd];
      const result = onCommand?.(cmd);
      if (output === undefined && result !== undefined) {
        output = result;
      }
      if (output === undefined) {
        output = `Unknown command: ${cmd}`;
      }
      if (Array.isArray(output)) {
        output.forEach((line) => next.push({ text: line, type: 'output' }));
      } else {
        next.push({ text: output, type: 'output' });
      }
      return next;
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const cmd = value.trim();
      if (cmd) {
        appendOutput(cmd);
      }
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

