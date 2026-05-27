import TerminalOS from "@/components/TerminalOS";
import PasswordGate from "@/components/PasswordGate";

export default function Home() {
  return (
    <PasswordGate>
      <TerminalOS />
    </PasswordGate>
  );
}
