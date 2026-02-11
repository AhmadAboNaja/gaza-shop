import { getDictionary } from "@/components/store/i18n-provider";
import LoginForm from "@/app/(store)/login/login-form";

export default async function LoginPage() {
  const { t } = await getDictionary();
  return (
    <LoginForm
      labels={{
        signInTitle: t.signInTitle,
        email: t.email,
        password: t.password,
        continue: t.continue,
        signedIn: t.signedIn,
      }}
    />
  );
}
