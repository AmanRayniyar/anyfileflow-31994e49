import { Helmet } from "react-helmet-async";

const LoveCalculatorSeoContent = () => {
  // JSON-LD structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Love Calculator - Free Relationship Compatibility Test",
        "description": "Free online love calculator to test relationship compatibility. Enter two names and discover your love percentage with fun, romantic messages. 100% private, no data stored.",
        "url": "https://anyfileflow.lovable.app/tool/love-calculator",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Love percentage calculator",
          "Zodiac compatibility bonus",
          "Multiple result styles (romantic, funny, emotional)",
          "Nickname support",
          "One-click social sharing",
          "100% browser-based privacy"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does the Love Calculator work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our Love Calculator uses a unique algorithm that combines your names, optional zodiac signs, and nicknames to generate a fun love compatibility percentage. The results are entertaining and meant to spark joy in your relationship!"
            }
          },
          {
            "@type": "Question",
            "name": "Is the Love Calculator accurate?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Love Calculator is designed for entertainment purposes only. Real relationship compatibility depends on communication, trust, shared values, and effort from both partners. Use this tool for fun conversations and laughs with your partner!"
            }
          },
          {
            "@type": "Question",
            "name": "Is my data private when using the Love Calculator?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Your names and data are processed entirely in your browser and are never sent to any server. We don't store, track, or share any information you enter. Your romantic secrets stay between you and your screen!"
            }
          },
          {
            "@type": "Question",
            "name": "Can I share my Love Calculator results?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! We have one-click sharing buttons for WhatsApp, Facebook, and you can copy your results or the link to share anywhere. It's a fun way to surprise your partner or friends!"
            }
          },
          {
            "@type": "Question",
            "name": "What do the different result styles mean?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can choose from 4 result styles: Romantic (sweet love messages), Funny (humorous takes), Emotional (deep and meaningful), and Friendship → Love (for those testing the waters). Each style gives unique messages based on your compatibility percentage."
            }
          },
          {
            "@type": "Question",
            "name": "Does zodiac sign affect the love compatibility score?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! If you add your zodiac signs, compatible pairs receive a bonus boost to their love score. This adds an extra layer of fun for astrology enthusiasts, though it's all for entertainment."
            }
          },
          {
            "@type": "Question",
            "name": "Can I use nicknames in the Love Calculator?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Toggle the Advanced Options to enter cute nicknames. The calculator will use your nicknames for a personalized touch. Try different nickname combinations for fun variations!"
            }
          },
          {
            "@type": "Question",
            "name": "Why do I get different results with different names?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The algorithm creates unique results based on the letter combinations in both names. This makes each couple's result feel personal and special, even though it's all in good fun!"
            }
          },
          {
            "@type": "Question",
            "name": "Is the Love Calculator free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, completely free! No registration, no hidden fees, no premium features locked behind paywalls. Calculate as many love percentages as you want!"
            }
          },
          {
            "@type": "Question",
            "name": "What are Easter Egg messages in the Love Calculator?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Certain special percentages (like 100%, 69%, 42%, and angel numbers like 11, 22, 33) trigger fun Easter Egg messages. These hidden surprises add extra delight when you hit these special numbers!"
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Use the Love Calculator",
        "description": "Step-by-step guide to calculate your love compatibility percentage",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Enter Your Names",
            "text": "Type your name in the first field and your partner's name in the second field"
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Choose Result Style",
            "text": "Select from Romantic, Funny, Emotional, or Friendship → Love styles for your results"
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Add Optional Details",
            "text": "Optionally add zodiac signs, nicknames, or meeting date for personalized results"
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Calculate Compatibility",
            "text": "Click the Calculate button and watch the heartbeat animation reveal your love percentage"
          },
          {
            "@type": "HowToStep",
            "position": 5,
            "name": "Share Your Results",
            "text": "Share your fun results on WhatsApp, Facebook, or copy to share anywhere"
          }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <section className="bg-card border border-border rounded-2xl p-6 md:p-8 mt-6 space-y-8">
        {/* Main Heading */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Love Calculator: Free Online Relationship Compatibility Test 💕
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Discover your love compatibility with our free online <strong>Love Calculator</strong>! Simply enter your name and your partner's name to 
            reveal your relationship compatibility percentage with fun, romantic, or funny messages. Our love compatibility test is 100% 
            free, requires no registration, and keeps your data completely private—everything happens in your browser.
          </p>
        </div>

        {/* Core Features Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">
            Love Calculator Features & Benefits
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-pink-50 dark:bg-pink-950/30 rounded-xl">
              <h4 className="font-semibold mb-2">❤️ Instant Love Percentage</h4>
              <p className="text-sm text-muted-foreground">
                Get your love compatibility score instantly! Our algorithm creates unique, 
                personalized percentages based on your names for a fun and exciting reveal.
              </p>
            </div>
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-xl">
              <h4 className="font-semibold mb-2">🎭 Multiple Result Styles</h4>
              <p className="text-sm text-muted-foreground">
                Choose how you want your results: Romantic 💕, Funny 😂, Emotional 🥹, or 
                Friendship → Love 💞. Each style delivers unique, heartfelt messages.
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
              <h4 className="font-semibold mb-2">♈ Zodiac Compatibility Bonus</h4>
              <p className="text-sm text-muted-foreground">
                Add your zodiac signs for an extra compatibility boost! Compatible star signs 
                receive bonus points, making astrology lovers extra happy.
              </p>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl">
              <h4 className="font-semibold mb-2">😍 Nickname Support</h4>
              <p className="text-sm text-muted-foreground">
                Use your cute pet names! Calculate love with nicknames like "Honey," "Baby," 
                or whatever sweet names you call each other.
              </p>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">
            How to Use the Love Calculator
          </h3>
          <ol className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold">1</span>
              <span><strong>Enter Both Names:</strong> Type your name and your partner's name in the input fields.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold">2</span>
              <span><strong>Pick Your Vibe:</strong> Choose from Romantic, Funny, Emotional, or Friendship → Love result styles.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold">3</span>
              <span><strong>Add Extras (Optional):</strong> Include zodiac signs, nicknames, or your meeting date for personalized results.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold">4</span>
              <span><strong>Calculate:</strong> Click the button and watch the animated heart reveal your love percentage!</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold">5</span>
              <span><strong>Share the Love:</strong> Use one-click sharing to WhatsApp, Facebook, or copy your results!</span>
            </li>
          </ol>
        </div>

        {/* Fun Features */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">
            What Makes Our Love Calculator Special? ✨
          </h3>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong>🎯 Dynamic Messages:</strong> Every result comes with unique, never-boring messages. 
              Whether you score high or low, you'll get positive, encouraging words that celebrate love in all forms.
            </p>
            <p>
              <strong>🥚 Hidden Easter Eggs:</strong> Land on special percentages like 100%, 69%, 42%, or angel 
              numbers (11, 22, 33, etc.) to unlock secret surprise messages!
            </p>
            <p>
              <strong>💬 Love Tips:</strong> Every result includes actionable relationship advice tailored 
              to your compatibility level—from date night ideas to communication tips.
            </p>
            <p>
              <strong>🎬 Beautiful Animations:</strong> Watch the heartbeat loading animation and the 
              exciting percentage counter as your love score is revealed!
            </p>
            <p>
              <strong>📱 Mobile-First Design:</strong> Works perfectly on phones, tablets, and desktops. 
              Calculate love anywhere, anytime!
            </p>
          </div>
        </div>

        {/* Who Is This For */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">
            Who Uses the Love Calculator?
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>💑 <strong>Couples:</strong> Test your compatibility and share laughs together</li>
            <li>👯 <strong>Best Friends:</strong> Use the Friendship → Love mode to add some fun!</li>
            <li>🎉 <strong>Party Entertainment:</strong> A hit at gatherings—everyone wants to try!</li>
            <li>💕 <strong>Crushes:</strong> Secretly test your compatibility with your crush</li>
            <li>📱 <strong>Social Media:</strong> Create shareable, fun content for your followers</li>
            <li>😂 <strong>Entertainment Seekers:</strong> Anyone looking for a fun, lighthearted break</li>
          </ul>
        </div>

        {/* Privacy Section */}
        <div className="p-6 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800">
          <h3 className="text-xl font-bold text-foreground mb-3">
            🔒 Your Privacy is 100% Protected
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>✓ All calculations happen in your browser—data never leaves your device</li>
            <li>✓ No names or information stored on any server</li>
            <li>✓ No login or registration required</li>
            <li>✓ No tracking, no cookies for personal data</li>
            <li>✓ Completely free with no hidden costs</li>
          </ul>
        </div>

        {/* FAQ Preview */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">
            Frequently Asked Questions About Love Calculators
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-xl">
              <h4 className="font-semibold mb-2">Is the Love Calculator scientifically accurate?</h4>
              <p className="text-sm text-muted-foreground">
                Our Love Calculator is purely for entertainment. Real relationship compatibility is 
                based on communication, shared values, trust, and effort—not name algorithms! Use 
                this for fun, not serious relationship decisions.
              </p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-xl">
              <h4 className="font-semibold mb-2">Can I try with different names?</h4>
              <p className="text-sm text-muted-foreground">
                Absolutely! Try as many combinations as you like—your name, nicknames, celebrity 
                crushes, fictional characters. There's no limit to the fun!
              </p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-xl">
              <h4 className="font-semibold mb-2">Why do different name orders give different results?</h4>
              <p className="text-sm text-muted-foreground">
                Our algorithm creates unique results based on the exact combination of letters. 
                This adds variety and makes each test feel special and personalized!
              </p>
            </div>
          </div>
        </div>

        {/* Trending Keywords Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">
            Popular Love Calculator Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              "love calculator", "love percentage calculator", "couple compatibility test", 
              "relationship calculator", "love test online", "name compatibility calculator",
              "soulmate test", "love match calculator", "romance calculator", "true love test",
              "partner compatibility", "love meter", "crush calculator", "love tester",
              "couple love test", "zodiac love calculator", "birthday love compatibility",
              "friendship to love test", "love predictor", "relationship percentage",
              "name love test", "love calculator by name", "love score calculator",
              "free love test", "online love calculator", "love compatibility percentage",
              "couple name test", "romantic compatibility test", "love fortune calculator"
            ].map((keyword, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-xs"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center p-6 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-xl">
          <h3 className="text-xl font-bold text-foreground mb-2">
            Ready to Test Your Love? 💕
          </h3>
          <p className="text-muted-foreground mb-4">
            Scroll up and enter your names to discover your love compatibility percentage! 
            Remember: the best relationships are built on love, trust, and laughter—not algorithms. 
            But a little fun never hurt anyone! 😄❤️
          </p>
        </div>
      </section>
    </>
  );
};

export default LoveCalculatorSeoContent;
