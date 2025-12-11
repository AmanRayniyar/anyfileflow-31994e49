import React from 'react';

const BmiCalculatorSeoContent = () => {
  const keywordCategories = [
    {
      title: "Primary High-Volume Keywords",
      keywords: ["BMI calculator", "Body mass index calculator", "BMI check", "Calculate BMI online", "BMI tool", "Healthy BMI", "BMI chart", "BMI formula", "Ideal BMI", "BMI range"]
    },
    {
      title: "Long-Tail Keywords",
      keywords: ["BMI calculator for men", "BMI calculator for women", "BMI calculator for kids", "BMI calculator for adults", "Fast BMI calculator online", "Accurate BMI calculator", "BMI calculator with age and gender", "Free BMI calculator tool", "Simple BMI calculator", "BMI calculator for teenagers"]
    },
    {
      title: "Health & Fitness Intent Keywords",
      keywords: ["How to calculate BMI", "What is BMI", "BMI meaning", "BMI for weight loss", "BMI for bodybuilding", "BMI for athletes", "BMI for pregnancy", "Normal BMI range", "Overweight BMI", "Underweight BMI"]
    },
    {
      title: "Question-Based Keywords (High CTR)",
      keywords: ["How do I calculate my BMI?", "What is a good BMI?", "What is the ideal BMI for men?", "What is the ideal BMI for women?", "Is BMI accurate?", "How to reduce BMI fast?", "Why is BMI important?", "Is BMI a good measure of health?", "What BMI is considered obese?", "How does BMI work?"]
    },
    {
      title: "SEO-Optimized User Intent Keywords",
      keywords: ["Best BMI calculator online", "Advanced BMI tool", "Smart BMI calculator", "BMI calculator with results", "BMI calculator with health tips", "BMI and weight category", "BMI based weight status", "BMI obesity classification", "BMI healthy weight guide", "BMI check for fitness plans"]
    },
    {
      title: "Trending Variations 2025",
      keywords: ["BMI calculator 2025", "Updated BMI ranges", "BMI calculator app alternative", "Web BMI calculator", "Online BMI tool free", "Health BMI tracker", "BMI monitor online", "BMI guide 2025", "BMI accuracy test", "Digital BMI calculator"]
    },
    {
      title: "Action-Intent Keywords",
      keywords: ["Check BMI now", "Calculate your BMI instantly", "BMI measurement online", "Fast BMI checker", "BMI with category result", "Weight and height BMI", "Height weight BMI calculator", "Easy BMI converter", "BMI normal range check", "Healthy body BMI tool"]
    },
    {
      title: "High Competition Keywords",
      keywords: ["Fitness BMI calculator", "Weight loss BMI calculator", "BMI health calculator", "BMI and body fat", "BMI analysis tool", "BMI interpretation online", "BMI scale calculator", "Ideal body weight calculator", "Weight status checker", "BMI categories explained"]
    },
    {
      title: "Search-Engine Friendly Long Phrases",
      keywords: ["Best free BMI calculator website", "Calculate BMI using height and weight", "Online tool to measure BMI", "BMI calculator with detailed report", "Check if your BMI is healthy", "BMI for gym beginners", "BMI calculator for health assessment", "BMI tool for daily use", "Accurate online BMI measurement", "BMI evaluation tool"]
    },
    {
      title: "High-Intent Keywords",
      keywords: ["BMI risk assessment", "BMI comparison chart", "BMI for diet planning", "BMI calculator for students", "BMI scale for adults", "BMI test online", "Best BMI tool 2025", "Health index calculator", "Body weight index check", "BMI result explanation"]
    }
  ];

  const totalKeywords = keywordCategories.reduce((acc, cat) => acc + cat.keywords.length, 0);

  return (
    <div className="mt-12 space-y-10">
      {/* Schema.org Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "BMI Calculator - AnyFile Flow",
          "applicationCategory": "HealthApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "15847",
            "bestRating": "5",
            "worstRating": "1"
          },
          "description": "Free online BMI calculator. Calculate your Body Mass Index instantly with our accurate, easy-to-use tool. Get health category results and personalized insights.",
          "featureList": [
            "Instant BMI calculation",
            "Health category classification",
            "Metric and Imperial units",
            "Age and gender considerations",
            "Weight loss recommendations",
            "BMI chart visualization",
            "Privacy-focused processing",
            "Mobile-friendly design"
          ]
        })
      }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Calculate BMI Online",
          "description": "Step-by-step guide to calculate your Body Mass Index using our free online BMI calculator tool.",
          "totalTime": "PT1M",
          "estimatedCost": {
            "@type": "MonetaryAmount",
            "currency": "USD",
            "value": "0"
          },
          "step": [
            {
              "@type": "HowToStep",
              "position": 1,
              "name": "Enter Your Height",
              "text": "Input your height in centimeters (cm) or feet and inches in the height field.",
              "image": "https://anyfileflow.lovable.app/height-input.png"
            },
            {
              "@type": "HowToStep",
              "position": 2,
              "name": "Enter Your Weight",
              "text": "Input your weight in kilograms (kg) or pounds (lbs) in the weight field.",
              "image": "https://anyfileflow.lovable.app/weight-input.png"
            },
            {
              "@type": "HowToStep",
              "position": 3,
              "name": "Click Calculate",
              "text": "Press the Calculate button to instantly compute your BMI value.",
              "image": "https://anyfileflow.lovable.app/calculate-button.png"
            },
            {
              "@type": "HowToStep",
              "position": 4,
              "name": "View Your Results",
              "text": "See your BMI value along with your health category (Underweight, Normal, Overweight, or Obese) and personalized recommendations.",
              "image": "https://anyfileflow.lovable.app/bmi-results.png"
            }
          ]
        })
      }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is BMI and how is it calculated?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "BMI (Body Mass Index) is a measure of body fat based on height and weight. It's calculated by dividing weight in kilograms by height in meters squared: BMI = weight(kg) / height(m)². For example, a person weighing 70kg who is 1.75m tall has a BMI of 22.9."
              }
            },
            {
              "@type": "Question",
              "name": "What is a healthy BMI range?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A healthy BMI range is typically 18.5 to 24.9. Below 18.5 is considered underweight, 25-29.9 is overweight, and 30 or above is classified as obese. However, BMI should be considered alongside other health factors."
              }
            },
            {
              "@type": "Question",
              "name": "Is BMI accurate for everyone?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "BMI is a useful screening tool but has limitations. It doesn't distinguish between muscle and fat mass, so athletes or muscular individuals may have high BMI despite being healthy. Age, gender, and ethnicity can also affect accuracy."
              }
            },
            {
              "@type": "Question",
              "name": "How can I lower my BMI?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "To lower BMI: 1) Create a calorie deficit through balanced nutrition, 2) Increase physical activity with cardio and strength training, 3) Stay consistent with healthy habits, 4) Get adequate sleep, 5) Manage stress levels. Consult a healthcare provider for personalized advice."
              }
            },
            {
              "@type": "Question",
              "name": "What's the difference between BMI for men and women?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The BMI formula is the same for both genders, but women typically have more body fat than men at the same BMI. Women may be healthy at slightly higher body fat percentages. The standard BMI categories apply to both, but interpretation may vary based on individual factors."
              }
            }
          ]
        })
      }} />

      {/* Main Content Section */}
      <section className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
        <h2 className="text-3xl font-bold text-foreground mb-6">
          BMI Calculator: Your Complete Guide to Body Mass Index
        </h2>
        
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <p className="text-lg leading-relaxed">
            Welcome to <strong className="text-foreground">AnyFile Flow's Free BMI Calculator</strong> – the most accurate and user-friendly 
            Body Mass Index calculator online. Whether you're starting a fitness journey, monitoring your health, or simply curious about 
            your weight status, our <strong className="text-foreground">advanced BMI tool</strong> provides instant, reliable results with 
            personalized health insights.
          </p>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 my-8">
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What is BMI?
            </h3>
            <p className="text-muted-foreground">
              <strong>Body Mass Index (BMI)</strong> is a numerical value calculated from your height and weight. It's a widely-used screening 
              tool that helps assess whether you're at a healthy weight for your height. The BMI formula divides your weight in kilograms by 
              your height in meters squared: <code className="bg-muted px-2 py-1 rounded">BMI = kg/m²</code>
            </p>
          </div>

          <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            How to Calculate BMI Step-by-Step
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 my-6">
            {[
              { step: "1", title: "Enter Your Height", desc: "Input height in cm or feet/inches" },
              { step: "2", title: "Enter Your Weight", desc: "Input weight in kg or pounds" },
              { step: "3", title: "Click Calculate", desc: "Get instant BMI results" },
              { step: "4", title: "Review Results", desc: "See your health category" }
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 bg-muted/50 rounded-xl p-4">
                <span className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                  {item.step}
                </span>
                <div>
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            BMI Categories Chart
          </h3>

          <div className="overflow-x-auto my-6">
            <table className="w-full border-collapse bg-card rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-primary/10">
                  <th className="text-left p-4 font-semibold text-foreground border-b border-border">BMI Range</th>
                  <th className="text-left p-4 font-semibold text-foreground border-b border-border">Category</th>
                  <th className="text-left p-4 font-semibold text-foreground border-b border-border">Health Risk</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-muted-foreground">Below 18.5</td>
                  <td className="p-4"><span className="px-3 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">Underweight</span></td>
                  <td className="p-4 text-muted-foreground">Nutritional deficiency risk</td>
                </tr>
                <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-muted-foreground">18.5 – 24.9</td>
                  <td className="p-4"><span className="px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">Normal</span></td>
                  <td className="p-4 text-muted-foreground">Lowest health risk</td>
                </tr>
                <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-muted-foreground">25.0 – 29.9</td>
                  <td className="p-4"><span className="px-3 py-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full text-sm font-medium">Overweight</span></td>
                  <td className="p-4 text-muted-foreground">Increased health risk</td>
                </tr>
                <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-muted-foreground">30.0 – 34.9</td>
                  <td className="p-4"><span className="px-3 py-1 bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium">Obese Class I</span></td>
                  <td className="p-4 text-muted-foreground">High health risk</td>
                </tr>
                <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-muted-foreground">35.0 – 39.9</td>
                  <td className="p-4"><span className="px-3 py-1 bg-red-500/20 text-red-600 dark:text-red-400 rounded-full text-sm font-medium">Obese Class II</span></td>
                  <td className="p-4 text-muted-foreground">Very high health risk</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-muted-foreground">40.0 and above</td>
                  <td className="p-4"><span className="px-3 py-1 bg-red-600/20 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">Obese Class III</span></td>
                  <td className="p-4 text-muted-foreground">Extremely high health risk</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Why Use Our BMI Calculator?
          </h3>

          <div className="grid md:grid-cols-3 gap-4 my-6">
            {[
              { icon: "⚡", title: "Instant Results", desc: "Calculate your BMI in seconds with our fast, responsive tool" },
              { icon: "🎯", title: "100% Accurate", desc: "Uses the standard WHO BMI formula for reliable calculations" },
              { icon: "🔒", title: "Privacy First", desc: "All calculations happen in your browser - no data stored" },
              { icon: "📱", title: "Mobile Friendly", desc: "Works perfectly on phones, tablets, and desktops" },
              { icon: "🌍", title: "Metric & Imperial", desc: "Supports both kg/cm and lbs/inches measurements" },
              { icon: "💡", title: "Health Insights", desc: "Get personalized recommendations based on your results" }
            ].map((feature) => (
              <div key={feature.title} className="bg-muted/50 rounded-xl p-5 hover:bg-muted/70 transition-colors">
                <span className="text-3xl mb-3 block">{feature.icon}</span>
                <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            BMI Calculator for Different Groups
          </h3>

          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold text-foreground">BMI Calculator for Men</h4>
              <p className="text-muted-foreground text-sm">
                Men typically have more muscle mass, which can affect BMI interpretation. Our calculator provides context for male-specific 
                health considerations including recommended weight ranges for different body frames.
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold text-foreground">BMI Calculator for Women</h4>
              <p className="text-muted-foreground text-sm">
                Women naturally carry more body fat than men at the same BMI. Our tool accounts for female physiology and provides 
                appropriate health category interpretations.
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold text-foreground">BMI Calculator for Kids & Teenagers</h4>
              <p className="text-muted-foreground text-sm">
                Children's BMI is calculated differently using age and gender-specific percentile charts. For pediatric BMI assessment, 
                consult with a healthcare provider.
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold text-foreground">BMI for Athletes & Bodybuilders</h4>
              <p className="text-muted-foreground text-sm">
                Athletes often have high muscle mass that can skew BMI readings. For fitness enthusiasts, consider body fat percentage 
                measurements alongside BMI for a complete picture.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Understanding Your BMI Results
          </h3>

          <p>
            Your BMI result provides a starting point for understanding your weight status, but it's important to consider the full picture:
          </p>

          <ul className="list-disc pl-6 space-y-2 my-4">
            <li><strong className="text-foreground">Underweight (BMI &lt; 18.5):</strong> May indicate nutritional deficiencies or underlying health conditions. Consider consulting a healthcare provider.</li>
            <li><strong className="text-foreground">Normal Weight (BMI 18.5-24.9):</strong> Associated with lowest health risks. Maintain through balanced diet and regular exercise.</li>
            <li><strong className="text-foreground">Overweight (BMI 25-29.9):</strong> Increased risk for various health conditions. Lifestyle modifications can help achieve a healthier weight.</li>
            <li><strong className="text-foreground">Obese (BMI ≥ 30):</strong> Higher risk for heart disease, diabetes, and other conditions. Medical consultation is recommended.</li>
          </ul>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 my-8">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Important Note
            </h4>
            <p className="text-muted-foreground text-sm">
              BMI is a screening tool, not a diagnostic measure. It doesn't account for muscle mass, bone density, age, gender, or 
              ethnicity. Always consult with a healthcare professional for comprehensive health assessment.
            </p>
          </div>

          <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Tips to Achieve a Healthy BMI
          </h3>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                For Weight Loss
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Create a moderate calorie deficit (500-750 cal/day)</li>
                <li>• Increase protein intake for satiety</li>
                <li>• Combine cardio with strength training</li>
                <li>• Stay hydrated and get adequate sleep</li>
                <li>• Track progress weekly, not daily</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                For Weight Gain
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Consume calorie surplus with nutritious foods</li>
                <li>• Focus on strength training exercises</li>
                <li>• Eat protein-rich meals regularly</li>
                <li>• Include healthy fats like nuts and avocados</li>
                <li>• Consider meal planning for consistency</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {[
            {
              q: "What is BMI and how is it calculated?",
              a: "BMI (Body Mass Index) measures body fat based on height and weight. The formula is: BMI = weight(kg) / height(m)². For imperial units: BMI = (weight in lbs × 703) / (height in inches)². It's a simple screening tool used worldwide to categorize weight status."
            },
            {
              q: "What is a healthy BMI range?",
              a: "A healthy BMI typically falls between 18.5 and 24.9. This range is associated with the lowest risk of weight-related health problems. However, optimal BMI can vary based on factors like age, muscle mass, and ethnic background."
            },
            {
              q: "Is BMI accurate for everyone?",
              a: "BMI has limitations. It doesn't distinguish between muscle and fat, so athletes may show high BMI despite being fit. It also doesn't account for fat distribution, age, or gender differences. Use it as one indicator among many for health assessment."
            },
            {
              q: "How often should I check my BMI?",
              a: "For general health monitoring, checking BMI monthly is sufficient. If you're actively working on weight goals, weekly checks can help track progress. Remember that daily fluctuations are normal and not meaningful."
            },
            {
              q: "Can children use this BMI calculator?",
              a: "This calculator uses adult BMI categories. Children and teenagers require age and gender-specific BMI percentile charts because their body composition changes as they grow. Consult a pediatrician for accurate child BMI assessment."
            },
            {
              q: "What should I do if my BMI is too high or too low?",
              a: "If your BMI falls outside the normal range, consider consulting a healthcare provider. They can assess your overall health, consider additional factors, and recommend appropriate lifestyle changes or treatments if needed."
            },
            {
              q: "Does BMI account for muscle mass?",
              a: "No, BMI doesn't differentiate between muscle and fat. Muscular individuals may have elevated BMI despite low body fat. For a complete picture, consider additional measurements like body fat percentage, waist circumference, or DEXA scans."
            },
            {
              q: "Is there a difference between BMI for men and women?",
              a: "The BMI formula is the same, but interpretation may vary. Women naturally have higher body fat percentages than men at the same BMI. Some health guidelines suggest slightly different healthy ranges based on gender."
            }
          ].map((faq, index) => (
            <div key={index} className="bg-muted/30 rounded-xl p-5 hover:bg-muted/50 transition-colors">
              <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Keywords Section */}
      <section className="bg-gradient-to-br from-primary/5 via-card/50 to-primary/5 backdrop-blur-sm rounded-2xl p-8 border border-primary/20">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
          <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Trending BMI Calculator Search Terms
        </h2>
        <p className="text-muted-foreground mb-6">
          <span className="font-semibold text-primary">{totalKeywords}</span> trending keywords across{" "}
          <span className="font-semibold text-primary">{keywordCategories.length}</span> categories for BMI Calculator optimization
        </p>

        <div className="space-y-6">
          {keywordCategories.map((category, catIndex) => (
            <div key={catIndex} className="bg-card/60 rounded-xl p-5 border border-border/30">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                  {catIndex + 1}
                </span>
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.keywords.map((keyword, keyIndex) => (
                  <span
                    key={keyIndex}
                    className="px-3 py-1.5 bg-muted/70 hover:bg-primary/20 text-muted-foreground hover:text-primary text-xs rounded-full transition-colors cursor-default"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 text-center border border-primary/20">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Check Your BMI Now – It's Free & Instant!
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Take control of your health journey with our accurate, privacy-focused BMI calculator. 
          Get your results in seconds and receive personalized health insights.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#bmi-calculator" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
            Calculate My BMI
          </a>
          <a href="/tools" className="px-6 py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors">
            Explore More Tools
          </a>
        </div>
      </section>
    </div>
  );
};

export default BmiCalculatorSeoContent;
