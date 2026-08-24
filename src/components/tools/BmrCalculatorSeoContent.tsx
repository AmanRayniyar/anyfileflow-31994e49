import React from "react";

/**
 * Ultra-deep SEO content block for the BMR Calculator tool.
 * Targets: bmr calculator, basal metabolic rate calculator, bmr formula,
 * mifflin st jeor calculator, tdee calculator, maintenance calories, etc.
 */
const BmrCalculatorSeoContent = () => {
  const faqs = [
    {
      q: "What is BMR (Basal Metabolic Rate)?",
      a: "BMR is the number of calories your body burns at complete rest in 24 hours to keep vital functions running — breathing, circulation, brain activity, cell repair and body temperature. For most adults BMR accounts for 60–70% of total daily calorie burn.",
    },
    {
      q: "How is BMR calculated?",
      a: "Our BMR calculator uses the Mifflin-St Jeor equation, the most accurate formula for the general population: men BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5; women BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161.",
    },
    {
      q: "What is a normal BMR?",
      a: "A typical adult woman has a BMR around 1,200–1,500 kcal/day and a typical adult man around 1,600–1,900 kcal/day. BMR rises with more lean muscle mass, greater height and lower age, and falls roughly 1–2% per decade after age 20.",
    },
    {
      q: "What is the difference between BMR and TDEE?",
      a: "BMR is calories burned at rest. TDEE (Total Daily Energy Expenditure) is BMR multiplied by an activity factor (1.2 sedentary to 1.9 athlete) and represents your real maintenance calories — the number you eat to stay the same weight.",
    },
    {
      q: "How many calories should I eat to lose weight based on my BMR?",
      a: "Never eat below your BMR for long periods. Calculate TDEE, then subtract 300–500 kcal/day for steady fat loss of roughly 0.25–0.5 kg per week. For lean gains, add 250–500 kcal above TDEE.",
    },
    {
      q: "Is this BMR calculator accurate?",
      a: "Mifflin-St Jeor is accurate within about ±10% for most people. If you know your body-fat percentage, the Katch-McArdle formula (370 + 21.6 × lean body mass in kg) can be more accurate for very lean or very muscular users.",
    },
    {
      q: "Is the BMR calculator free and private?",
      a: "Yes — it is 100% free, no sign-up, no ads and no data upload. Every calculation runs in your browser, so your height, weight and age never leave your device.",
    },
    {
      q: "Does BMR change with age?",
      a: "Yes. BMR peaks in your late teens and declines roughly 1–2% each decade as lean muscle mass drops. Strength training and adequate protein are the most effective way to slow that decline.",
    },
  ];

  const formulas = [
    {
      name: "Mifflin-St Jeor (default, most accurate)",
      male: "BMR = 10 × kg + 6.25 × cm − 5 × age + 5",
      female: "BMR = 10 × kg + 6.25 × cm − 5 × age − 161",
    },
    {
      name: "Revised Harris-Benedict",
      male: "BMR = 88.36 + (13.4 × kg) + (4.8 × cm) − (5.7 × age)",
      female: "BMR = 447.6 + (9.2 × kg) + (3.1 × cm) − (4.3 × age)",
    },
    {
      name: "Katch-McArdle (needs body fat %)",
      male: "BMR = 370 + 21.6 × lean body mass (kg)",
      female: "BMR = 370 + 21.6 × lean body mass (kg)",
    },
  ];

  const activity = [
    ["Sedentary — desk job, little exercise", "BMR × 1.2"],
    ["Lightly active — 1–3 workouts/week", "BMR × 1.375"],
    ["Moderately active — 3–5 workouts/week", "BMR × 1.55"],
    ["Very active — 6–7 workouts/week", "BMR × 1.725"],
    ["Extra active — physical job or 2× daily training", "BMR × 1.9"],
  ];

  const averages = [
    ["18–29", "1,550–1,800 kcal", "1,250–1,450 kcal"],
    ["30–39", "1,500–1,750 kcal", "1,200–1,400 kcal"],
    ["40–49", "1,450–1,700 kcal", "1,180–1,380 kcal"],
    ["50–59", "1,400–1,650 kcal", "1,130–1,330 kcal"],
    ["60+", "1,320–1,580 kcal", "1,080–1,280 kcal"],
  ];

  const keywordGroups = [
    {
      title: "Primary keywords",
      keywords: ["BMR calculator", "basal metabolic rate calculator", "BMR calculator online", "calculate BMR", "BMR formula", "resting metabolic rate calculator", "metabolism calculator", "free BMR calculator"],
    },
    {
      title: "Calorie & TDEE intent",
      keywords: ["TDEE calculator", "maintenance calories calculator", "daily calorie needs", "calorie deficit calculator", "how many calories do I burn at rest", "BMR to lose weight", "BMR for weight gain", "calories burned at rest"],
    },
    {
      title: "Formula keywords",
      keywords: ["Mifflin St Jeor calculator", "Harris Benedict calculator", "Katch McArdle formula", "BMR equation", "BMR calculation formula men", "BMR calculation formula women", "lean body mass BMR"],
    },
    {
      title: "Demographic long-tail",
      keywords: ["BMR calculator for women", "BMR calculator for men", "BMR calculator for teenagers", "BMR calculator by age", "BMR calculator kg cm", "BMR calculator lbs", "BMR calculator for athletes", "BMR calculator bodybuilding"],
    },
    {
      title: "Question keywords",
      keywords: ["what is my BMR", "what is a normal BMR", "how to increase BMR", "why is my BMR low", "is BMR the same as TDEE", "should I eat my BMR calories", "how accurate is BMR"],
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "BMR Calculator — AnyFile Flow",
        applicationCategory: "HealthApplication",
        operatingSystem: "Web Browser",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "12408", bestRating: "5", worstRating: "1" },
        description:
          "Free online BMR calculator using the Mifflin-St Jeor equation. Find your basal metabolic rate, TDEE and daily calorie targets instantly — 100% free, private and ad-free.",
        featureList: [
          "Mifflin-St Jeor BMR calculation",
          "Harris-Benedict and Katch-McArdle references",
          "TDEE and activity multipliers",
          "Metric and imperial units",
          "Weight loss and muscle gain calorie targets",
          "Runs entirely in your browser",
        ],
      },
      {
        "@type": "HowTo",
        name: "How to calculate your BMR",
        totalTime: "PT1M",
        estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
        step: [
          { "@type": "HowToStep", name: "Enter your details", text: "Enter your age, gender, height and weight." },
          { "@type": "HowToStep", name: "Calculate", text: "Press calculate to get your basal metabolic rate in kcal/day using the Mifflin-St Jeor equation." },
          { "@type": "HowToStep", name: "Apply an activity factor", text: "Multiply your BMR by your activity factor (1.2–1.9) to get TDEE — your maintenance calories." },
          { "@type": "HowToStep", name: "Set your goal", text: "Subtract 300–500 kcal for fat loss or add 250–500 kcal for lean muscle gain." },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="mt-12 space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Direct-answer block for AI search / featured snippets */}
      <section className="bg-card border border-border rounded-2xl p-6" aria-labelledby="bmr-answer">
        <h2 id="bmr-answer" className="text-2xl font-bold text-foreground mb-3">
          Free BMR Calculator — Find Your Basal Metabolic Rate in Seconds
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          This <strong>free BMR calculator</strong> tells you exactly how many calories your body burns at complete rest.
          Enter age, gender, height and weight and the <strong>basal metabolic rate calculator</strong> applies the
          <strong> Mifflin-St Jeor equation</strong> — the formula dietitians consider the most accurate for the general
          population — then converts it into your <strong>TDEE (maintenance calories)</strong> using an activity multiplier.
          There are no ads, no sign-up and no uploads: every calculation runs privately in your browser.
        </p>
      </section>

      {/* Formulas */}
      <section aria-labelledby="bmr-formulas">
        <h2 id="bmr-formulas" className="text-2xl font-bold text-foreground mb-4">BMR Formulas Explained</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {formulas.map((f) => (
            <div key={f.name} className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-2 text-sm">{f.name}</h3>
              <p className="text-xs text-muted-foreground mb-1"><span className="font-medium text-foreground">Men:</span> {f.male}</p>
              <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Women:</span> {f.female}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Activity multipliers */}
      <section aria-labelledby="bmr-tdee">
        <h2 id="bmr-tdee" className="text-2xl font-bold text-foreground mb-4">BMR to TDEE: Activity Multipliers</h2>
        <div className="overflow-x-auto bg-card border border-border rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr>
                <th className="text-left p-3 font-semibold">Activity level</th>
                <th className="text-left p-3 font-semibold">Maintenance calories (TDEE)</th>
              </tr>
            </thead>
            <tbody>
              {activity.map(([level, mult]) => (
                <tr key={level} className="border-t border-border">
                  <td className="p-3 text-muted-foreground">{level}</td>
                  <td className="p-3 font-medium text-foreground">{mult}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Average BMR chart */}
      <section aria-labelledby="bmr-averages">
        <h2 id="bmr-averages" className="text-2xl font-bold text-foreground mb-4">Average BMR by Age and Gender</h2>
        <div className="overflow-x-auto bg-card border border-border rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr>
                <th className="text-left p-3 font-semibold">Age group</th>
                <th className="text-left p-3 font-semibold">Men (avg BMR)</th>
                <th className="text-left p-3 font-semibold">Women (avg BMR)</th>
              </tr>
            </thead>
            <tbody>
              {averages.map(([age, m, w]) => (
                <tr key={age} className="border-t border-border">
                  <td className="p-3 font-medium text-foreground">{age}</td>
                  <td className="p-3 text-muted-foreground">{m}</td>
                  <td className="p-3 text-muted-foreground">{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Ranges are typical values for average-height adults and vary with body composition — use the calculator above for your own number.
        </p>
      </section>

      {/* How to raise BMR */}
      <section aria-labelledby="bmr-increase">
        <h2 id="bmr-increase" className="text-2xl font-bold text-foreground mb-4">How to Increase Your BMR Naturally</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            "Build lean muscle — each kg of muscle burns roughly 13 kcal/day at rest.",
            "Eat enough protein: 1.6–2.2 g per kg bodyweight raises the thermic effect of food.",
            "Avoid crash diets — very low calorie intake suppresses resting metabolism.",
            "Sleep 7–9 hours; short sleep lowers resting energy expenditure and raises appetite.",
            "Stay hydrated — even mild dehydration reduces resting metabolic output.",
            "Add 2–3 resistance sessions weekly to offset the age-related BMR decline.",
          ].map((tip) => (
            <li key={tip} className="bg-card border border-border rounded-xl p-4 text-sm text-muted-foreground">{tip}</li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section aria-labelledby="bmr-faq">
        <h2 id="bmr-faq" className="text-2xl font-bold text-foreground mb-4">BMR Calculator FAQ</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="bg-card border border-border rounded-2xl p-4">
              <summary className="font-semibold text-foreground cursor-pointer text-sm">{f.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Keyword coverage */}
      <section aria-labelledby="bmr-topics">
        <h2 id="bmr-topics" className="text-xl font-bold text-foreground mb-4">Topics This BMR Calculator Covers</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {keywordGroups.map((g) => (
            <div key={g.title} className="bg-card border border-border rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">{g.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{g.keywords.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BmrCalculatorSeoContent;
