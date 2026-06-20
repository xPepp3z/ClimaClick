import { AlertTriangle } from "lucide-react";

type ErrorNoticeProps = {
  title?: string;
  message: string;
};

export default function ErrorNotice({
  title = "Qualcosa non va",
  message,
}: ErrorNoticeProps) {
  return (
    <section className="error-notice" role="status" aria-live="polite">
      <AlertTriangle size={22} />
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
    </section>
  );
}