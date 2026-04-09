import LoginForm from './_components/login-form';

export default function LoginPage() {
  return (
    <main className="shell">
      <section className="auth-layout">
        <div className="panel visual-panel" aria-hidden="true">
          <div className="map-visual" />
        </div>

        <div className="panel login-panel">
          <div className="form-wrap simple-form-wrap">
            <div className="form-header compact-header">
              <h1>Login</h1>
            </div>

            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
