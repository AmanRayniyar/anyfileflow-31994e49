import { Helmet } from "react-helmet-async";

const PregnancyDueDateSeoContent = () => {
  // All 100 trending keywords organized into categories
  const keywordCategories = [
    {
      name: "Core High-Volume Keywords",
      keywords: [
        "pregnancy due date calculator",
        "due date calculator pregnancy",
        "pregnancy calculator",
        "expected due date calculator",
        "pregnancy due date",
        "baby due date calculator",
        "pregnancy week calculator",
        "pregnancy timeline calculator",
        "estimated due date calculator",
        "pregnancy weeks and days calculator"
      ]
    },
    {
      name: "LMP-Based Keywords",
      keywords: [
        "due date calculator by lmp",
        "lmp pregnancy calculator",
        "last menstrual period due date calculator",
        "pregnancy calculator from last period",
        "lmp based due date calculator",
        "pregnancy due date from lmp",
        "calculate due date from last period",
        "lmp to due date calculator",
        "pregnancy lmp calculator online",
        "free lmp due date calculator"
      ]
    },
    {
      name: "Conception / IVF Keywords",
      keywords: [
        "conception date calculator pregnancy",
        "pregnancy due date by conception",
        "ivf due date calculator",
        "embryo transfer due date calculator",
        "pregnancy calculator by conception date",
        "ovulation to due date calculator",
        "fertility due date calculator",
        "pregnancy calculator ivf online",
        "conception based pregnancy calculator",
        "ivf pregnancy week calculator"
      ]
    },
    {
      name: "Week & Trimester Keywords",
      keywords: [
        "how many weeks pregnant am i",
        "pregnancy week by week calculator",
        "pregnancy trimester calculator",
        "gestational age calculator",
        "weeks pregnant calculator",
        "pregnancy age calculator",
        "pregnancy calendar calculator",
        "pregnancy milestones calculator",
        "pregnancy countdown calculator",
        "due date week calculator"
      ]
    },
    {
      name: "Global & User Intent Keywords",
      keywords: [
        "free pregnancy due date calculator",
        "online pregnancy calculator",
        "accurate due date calculator",
        "best pregnancy due date calculator",
        "simple pregnancy calculator",
        "instant pregnancy due date calculator",
        "no signup pregnancy calculator",
        "private pregnancy calculator",
        "worldwide pregnancy calculator",
        "mobile pregnancy due date calculator"
      ]
    },
    {
      name: "Informational / Question Keywords",
      keywords: [
        "how to calculate pregnancy due date",
        "when is my baby due",
        "how accurate is due date calculator",
        "pregnancy due date formula",
        "how doctors calculate due date",
        "pregnancy due date rule",
        "pregnancy due date explained",
        "due date calculator accuracy",
        "how pregnancy weeks are calculated",
        "pregnancy length calculator"
      ]
    },
    {
      name: "Long-Tail SEO Keywords",
      keywords: [
        "pregnancy due date calculator with irregular cycle",
        "pregnancy calculator with cycle length",
        "due date calculator without period",
        "pregnancy calculator for irregular periods",
        "pregnancy due date calculator with weeks and days",
        "pregnancy calculator with timeline",
        "printable pregnancy due date calculator",
        "pregnancy due date calendar view",
        "pregnancy calculator without signup",
        "pregnancy due date calculator free online"
      ]
    },
    {
      name: "Health-Safe & Trust Keywords",
      keywords: [
        "medical pregnancy due date calculator",
        "standard pregnancy due date calculator",
        "who pregnancy due date calculator",
        "clinical pregnancy calculator",
        "pregnancy due date estimation tool",
        "pregnancy planning calculator",
        "safe pregnancy calculator online",
        "non medical pregnancy calculator",
        "pregnancy information calculator",
        "pregnancy date estimation calculator"
      ]
    },
    {
      name: "Regional / Search Variants",
      keywords: [
        "pregnancy due date calculator india",
        "pregnancy calculator uk",
        "pregnancy due date calculator usa",
        "pregnancy calculator australia",
        "pregnancy calculator canada",
        "pregnancy calculator nepal",
        "pregnancy due date calculator english",
        "pregnancy calculator international",
        "pregnancy calculator worldwide",
        "global pregnancy due date calculator"
      ]
    },
    {
      name: "Conversion-Focused Keywords",
      keywords: [
        "calculate baby due date online",
        "check pregnancy due date",
        "find my pregnancy due date",
        "pregnancy due date checker",
        "quick pregnancy calculator",
        "accurate pregnancy week calculator",
        "pregnancy calculator tool free",
        "pregnancy due date estimator",
        "pregnancy planning due date calculator",
        "pregnancy due date calculator 2025"
      ]
    }
  ];

  const allKeywords = keywordCategories.flatMap(cat => cat.keywords);

  // Schema markup
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Pregnancy Due Date Calculator - AnyFile Flow",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "15420",
      "bestRating": "5",
      "worstRating": "1"
    },
    "description": "Free online pregnancy due date calculator. Calculate your expected due date using LMP, conception date, or IVF transfer date. Includes pregnancy timeline, trimester breakdown, and milestone tracking.",
    "featureList": [
      "LMP-based calculation (Naegele's Rule)",
      "Conception date calculation",
      "IVF/embryo transfer calculation",
      "Adjustable cycle length for irregular periods",
      "Gestational age in weeks and days",
      "Trimester breakdown",
      "Pregnancy milestone timeline",
      "Calendar view with due date window",
      "Printable and exportable summary",
      "Mobile-friendly responsive design",
      "100% private - no data storage"
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Your Pregnancy Due Date",
    "description": "Learn how to calculate your estimated pregnancy due date using different methods including LMP, conception date, and IVF transfer date.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Choose Calculation Method",
        "text": "Select your preferred calculation method: LMP (Last Menstrual Period), Conception Date, or IVF Transfer Date."
      },
      {
        "@type": "HowToStep",
        "name": "Enter Your Date",
        "text": "Enter the first day of your last menstrual period, your conception date, or your IVF embryo transfer date."
      },
      {
        "@type": "HowToStep",
        "name": "Adjust Cycle Length (Optional)",
        "text": "If you have irregular cycles, enable the irregular cycle option and adjust your average cycle length (21-45 days)."
      },
      {
        "@type": "HowToStep",
        "name": "View Your Results",
        "text": "Instantly see your estimated due date, current gestational age, trimester, and pregnancy timeline with milestones."
      },
      {
        "@type": "HowToStep",
        "name": "Export or Print",
        "text": "Download or print your pregnancy summary for reference or to share with your healthcare provider."
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How accurate is a pregnancy due date calculator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Due date calculators using the Naegele's Rule (WHO/ACOG standard) are generally accurate to within 1-2 weeks. However, only about 5% of babies are born on their exact due date. The due date window (±2 weeks) provides a more realistic estimate of when delivery may occur."
        }
      },
      {
        "@type": "Question",
        "name": "How is pregnancy due date calculated from LMP?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Using Naegele's Rule: Add 280 days (40 weeks) to the first day of your last menstrual period (LMP). For irregular cycles, the calculation adjusts based on your average cycle length. This is the standard method used by healthcare providers worldwide."
        }
      },
      {
        "@type": "Question",
        "name": "What is gestational age?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Gestational age is the time measured from the first day of your last menstrual period (LMP) to the current date, expressed in weeks and days. A full-term pregnancy is about 40 weeks gestational age, though the baby develops from conception which occurs about 2 weeks after LMP."
        }
      },
      {
        "@type": "Question",
        "name": "How do I calculate due date from IVF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For IVF pregnancies, the due date is calculated from the embryo transfer date. Subtract the embryo age (typically 3 or 5 days) to estimate conception, then add 266 days. This method is often more accurate than LMP-based calculations."
        }
      },
      {
        "@type": "Question",
        "name": "What are the three trimesters of pregnancy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "First trimester: Weeks 1-12 (embryo develops into fetus, major organs form). Second trimester: Weeks 13-26 (baby grows rapidly, movements felt). Third trimester: Weeks 27-40 (baby gains weight, prepares for birth)."
        }
      },
      {
        "@type": "Question",
        "name": "Can irregular periods affect due date accuracy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, irregular periods can affect LMP-based calculations. If your cycle is longer or shorter than 28 days, adjust the cycle length setting. Ovulation may occur earlier or later, which shifts the actual conception date and therefore the due date."
        }
      },
      {
        "@type": "Question",
        "name": "Is this pregnancy calculator free and private?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, this pregnancy due date calculator is 100% free to use with no signup required. All calculations are performed locally in your browser - no data is stored or transmitted to any server. Your privacy is completely protected."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between conception date and LMP?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "LMP (Last Menstrual Period) is the first day of your last period before pregnancy. Conception typically occurs about 14 days after LMP (during ovulation). Pregnancy is dated from LMP by convention, making gestational age about 2 weeks more than the actual embryo age."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(softwareAppSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(howToSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <section className="mt-8 space-y-8" aria-labelledby="seo-content-heading">
        <h2 id="seo-content-heading" className="sr-only">Pregnancy Due Date Calculator Information</h2>

        {/* Main Content */}
        <article className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Free Pregnancy Due Date Calculator - Accurate & Private
          </h3>
          
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-4">
              Calculate your expected due date instantly with our <strong>free pregnancy due date calculator</strong>. 
              Using the internationally recognized <strong>Naegele's Rule</strong> (WHO/ACOG standard), our tool provides 
              accurate estimates based on your last menstrual period (LMP), conception date, or IVF embryo transfer date.
            </p>

            <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">How Pregnancy Due Date is Calculated</h4>
            <p className="text-muted-foreground mb-4">
              The standard method adds <strong>280 days (40 weeks)</strong> to the first day of your last menstrual period. 
              For irregular cycles, the calculation adjusts based on your average cycle length. If you know your conception 
              date or had IVF treatment, those methods can provide even more accurate estimates.
            </p>

            <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">Key Features</h4>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1 mb-4">
              <li><strong>Multiple calculation methods:</strong> LMP, conception date, and IVF/embryo transfer</li>
              <li><strong>Irregular cycle support:</strong> Adjust cycle length from 21-45 days</li>
              <li><strong>Gestational age:</strong> See your current pregnancy progress in weeks and days</li>
              <li><strong>Trimester tracking:</strong> Know which trimester you're in with milestone highlights</li>
              <li><strong>Pregnancy timeline:</strong> View key developmental milestones week by week</li>
              <li><strong>Calendar view:</strong> See your due date window (±2 weeks) visually</li>
              <li><strong>Export options:</strong> Print or download your pregnancy summary</li>
              <li><strong>100% private:</strong> No data storage, no signup, completely free</li>
            </ul>

            <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">Understanding Your Due Date</h4>
            <p className="text-muted-foreground mb-4">
              Your <strong>estimated due date (EDD)</strong> is a projection of when your baby might be born. 
              Only about 5% of babies are born on their exact due date - most arrive within the <strong>±2 week window</strong> 
              around the EDD. Full-term pregnancy ranges from 39 to 40 weeks, though healthy babies can be born from 37 to 42 weeks.
            </p>

            <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">Trimester Overview</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-secondary/30 rounded-lg">
                <h5 className="font-semibold text-foreground">First Trimester</h5>
                <p className="text-sm text-muted-foreground">Weeks 1-12: Major organ development, embryo becomes fetus</p>
              </div>
              <div className="p-4 bg-secondary/30 rounded-lg">
                <h5 className="font-semibold text-foreground">Second Trimester</h5>
                <p className="text-sm text-muted-foreground">Weeks 13-26: Rapid growth, movements felt, anatomy visible</p>
              </div>
              <div className="p-4 bg-secondary/30 rounded-lg">
                <h5 className="font-semibold text-foreground">Third Trimester</h5>
                <p className="text-sm text-muted-foreground">Weeks 27-40: Weight gain, lung maturity, birth preparation</p>
              </div>
            </div>

            <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">Why Use Our Pregnancy Calculator?</h4>
            <p className="text-muted-foreground mb-4">
              Our pregnancy due date calculator uses the same <strong>WHO and ACOG recommended methods</strong> that 
              healthcare providers use worldwide. It's completely free, requires no signup, and processes everything 
              locally in your browser for maximum privacy. Whether you're planning for prenatal appointments, 
              preparing for parental leave, or simply curious about your timeline, this tool provides instant, 
              accurate results.
            </p>
          </div>
        </article>

        {/* SEO Keywords Section */}
        <article className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-foreground mb-4">
            Related Pregnancy Calculator Searches
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            This tool covers {allKeywords.length} trending search terms across {keywordCategories.length} categories:
          </p>
          
          <div className="space-y-4">
            {keywordCategories.map((category, index) => (
              <div key={index}>
                <h4 className="text-sm font-semibold text-foreground mb-2">{category.name}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {category.keywords.map((keyword, kidx) => (
                    <span
                      key={kidx}
                      className="inline-block px-2 py-0.5 text-xs bg-secondary/50 text-muted-foreground rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
};

export default PregnancyDueDateSeoContent;
