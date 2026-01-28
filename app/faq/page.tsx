export const metadata = {
  title: "FAQ — BoostUP Fortnite Services",
  description: "Frequently asked questions about Fortnite boosting, safety, delivery time and account security.",
};

const faqs = [
  {
    q: "Is Fortnite boosting safe?",
    a: "Yes. We use human players and safe play methods. No cheats, no bots, no scripts. Your account safety is always our top priority.",
  },
  {
    q: "Will I get banned?",
    a: "No. We use VPN protection and human gameplay to match your region and playstyle. Thousands of boosts completed safely.",
  },
  {
    q: "Do I need to share my account password?",
    a: "Only for services that require account login (like Level Boost or V-Bucks). We never change your email or password and you can enable 2FA after delivery.",
  },
  {
    q: "Can I play while boosting is in progress?",
    a: "If you choose Duo Queue services — yes, you play with the booster. For account login boosts, please stay offline to ensure speed and safety.",
  },
  {
    q: "How long does boosting take?",
    a: "Most services are completed within 1–3 hours. Larger boosts may take longer depending on your order size.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes. If we cannot complete your order or there is a verified issue, we offer refunds based on the progress made.",
  },
  {
    q: "Is V-Bucks region locked?",
    a: "No. Your account region can be changed if needed. We handle region-compatible top-ups safely.",
  },
  {
    q: "How will I know when my order is done?",
    a: "You can track your order live via Discord support. We notify you immediately once the boost is completed.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight">Frequently Asked Questions</h1>
      <p className="mt-3 text-white/70">
        Everything you need to know before ordering a boost.
      </p>

      <div className="mt-10 space-y-6">
        {faqs.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
          >
            <h2 className="text-lg font-bold text-white">{item.q}</h2>
            <p className="mt-2 text-sm text-white/70 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
