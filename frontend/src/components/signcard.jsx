import "./signcard.css";

export function SignCard({
  heading,
  about,
  children,
  buttonText,
  linkText,
  linkUrl,
  to,
  onSubmit,
  isLoading,
  isLinkedIn=true,
  handleLinkedInSignIn=() => {
    window.location.href = "http://localhost:8000/api/auth/linkedin";
  }
}) {
  return (
    <div className="signcard-container">
      <div className="signcard">
        <div className="signcard-heading">{heading}</div>
        <div className="signcard-about">{about}</div>
        <form onSubmit={onSubmit}>
          {children}
          <button
            type="submit"
            className="signcard-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner-container">
                <svg className="spinner" viewBox="0 0 50 50">
                  <circle
                    className="path"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    strokeWidth="4"
                  />
                </svg>
              </div>
            ) : (
              buttonText
            )}
          </button>
        </form>

        {isLinkedIn && (
          <>
            <div className="divider">or</div>
            <button className="linkedin-button" onClick={handleLinkedInSignIn}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.26c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.76.79 1.76 1.76-.79 1.76-1.76 1.76zm13.5 12.26h-3v-5.6c0-3.36-4-3.11-4 0v5.6h-3v-11h3v1.76c1.39-2.58 7-2.77 7 2.47v6.77z" />
              </svg>
              Sign in with LinkedIn
            </button>
          </>
        )}

        <div className="signcard-link-container">
          <div>{linkText}</div>
          <a href={to} className="signcard-link">
            {linkUrl}
          </a>
        </div>
      </div>
    </div>
  );
}