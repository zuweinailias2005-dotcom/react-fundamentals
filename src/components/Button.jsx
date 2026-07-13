function Button({ type = "button", children, onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
    >
      {children}
    </button>
  );
}

export default Button;