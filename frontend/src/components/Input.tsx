import React from 'react'

interface InputFieldProps {
  id: string
  label: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder: string
  required?: boolean
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto'  // Reset height
    e.target.style.height = `${e.target.scrollHeight}px`  // Set height based on content
  }

  return (
    <div className="mb-6">
      <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor={id}>
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            handleResize(e)  // Auto-resize on input
            onChange(e)  // Regular change handler
          }}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          required={required}
          style={{ minHeight: '150px' }}  // Set min height for initial display
        />
      ) : (
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={required}
        />
      )}
    </div>
  )
}

export default InputField
