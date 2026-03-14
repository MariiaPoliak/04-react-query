import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage = ({
  message = "Упс! Щось пішло не так. Спробуйте перезавантажити сторінку.",
}: ErrorMessageProps) => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <AlertCircle size={48} color="#e50914" />
      <p>{message}</p>
      <button onClick={() => window.location.reload()}>Оновити</button>
    </div>
  );
};

export default ErrorMessage;
