import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

const Select = ({ value, onValueChange, children }) => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const selectRef = useRef(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (newValue) => {
    setSelectedValue(newValue);
    onValueChange(newValue);
    setOpen(false);
  };

  return (
    <div ref={selectRef} className="relative">
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            open,
            onToggle: () => setOpen(!open),
            selectedValue,
          });
        }
        if (child.type === SelectContent) {
          return React.cloneElement(child, {
            open,
            onSelect: handleSelect,
            selectedValue,
          });
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = React.forwardRef(({ className, open, onToggle, selectedValue, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    onClick={onToggle}
    {...props}
  >
    <span>{selectedValue || 'Select an option'}</span>
    <ChevronDown className={cn('h-4 w-4 opacity-50 transition-transform', open && 'rotate-180')} />
  </button>
));
SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = ({ className, open, onSelect, selectedValue, children, ...props }) => {
  if (!open) return null;

  return (
    <div
      className={cn(
        'absolute top-full z-50 mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (child.type === SelectItem) {
          return React.cloneElement(child, {
            onSelect,
            selectedValue,
          });
        }
        return child;
      })}
    </div>
  );
};

const SelectItem = React.forwardRef(({ className, value, onSelect, selectedValue, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      selectedValue === value && 'bg-accent text-accent-foreground',
      className
    )}
    onClick={() => onSelect(value)}
    {...props}
  >
    {children}
  </button>
));
SelectItem.displayName = 'SelectItem';

const SelectValue = ({ placeholder }) => placeholder;

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
