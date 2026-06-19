import React from 'react'

const Input = ({ placeholder, type }) => {
  return (
    <div>
      <form className="flex items-center border border-hairline gap-2 bg-surface-1 h-12 max-w-md w-full rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all">
        <input
          type={type}
          placeholder={placeholder}
          className="w-full h-full pl-4 outline-none text-sm bg-transparent placeholder-ink-tertiary text-ink"
          required
        />
      </form>
    </div>
  );
}

export default Input
