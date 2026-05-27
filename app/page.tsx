import AboutPage from "@/components/AboutPage";
import PasswordGate from "@/components/PasswordGate";

export default function Home() {
  return (
    <PasswordGate>
      <AboutPage />
    </PasswordGate>
  );
}
