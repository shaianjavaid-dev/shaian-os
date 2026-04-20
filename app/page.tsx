import Desktop from "@/components/Desktop";
import PasswordGate from "@/components/PasswordGate";

export default function Home() {
  return (
    <PasswordGate>
      <Desktop />
    </PasswordGate>
  );
}
