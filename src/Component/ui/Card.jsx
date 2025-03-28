// src/components/ui/Card.jsx
const Card = ({ children, className, ...props }) => {
    return (
      <div {...props} className={`p-4 bg-white shadow-lg rounded-lg ${className}`}>
        {children}
      </div>
    );
  };
  
  export default Card;
  