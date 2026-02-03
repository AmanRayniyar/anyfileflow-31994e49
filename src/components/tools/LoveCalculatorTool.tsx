import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Heart, Sparkles, Share2, Copy, RefreshCw, Zap, Star, MessageCircle, Users, Calendar, Smile, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Marriage prediction messages based on love percentage
const getMarriagePrediction = (percentage: number, name1: string, name2: string) => {
  const predictions = {
    high: [
      { year: "2025-2026", message: `The stars align perfectly! 💫 ${name1} and ${name2} could hear wedding bells as early as next year. Your bond is that strong!`, confidence: "Very High" },
      { year: "Within 2 years", message: `${name1} & ${name2}, the universe has already written your love story. A beautiful ceremony awaits you soon! 💒`, confidence: "Very High" },
      { year: "Soon!", message: `Soulmates don't wait! ${name1} and ${name2}, your wedding could be the talk of the town very soon! 👰🤵`, confidence: "Extremely High" },
      { year: "2025-2027", message: `The cosmic energy suggests ${name1} and ${name2} will make it official! Start planning your dream wedding! ✨`, confidence: "Very High" },
    ],
    medium: [
      { year: "2026-2028", message: `${name1} and ${name2}, with a little more time and nurturing, marriage is definitely in your future! 🌹`, confidence: "Good" },
      { year: "Within 3-4 years", message: `The crystal ball sees a wedding! ${name1} & ${name2}, patience will lead to a beautiful union. 💑`, confidence: "Moderate-High" },
      { year: "2027-2029", message: `${name1} and ${name2}, your love is growing! Keep watering this relationship and marriage will bloom! 🌸`, confidence: "Good" },
      { year: "A few years ahead", message: `The stars suggest ${name1} & ${name2} have wedding potential! Focus on building your foundation. 🏠`, confidence: "Promising" },
    ],
    low: [
      { year: "When the time is right", message: `${name1} and ${name2}, every great marriage starts with friendship. Build that first! 🤝`, confidence: "Developing" },
      { year: "The future holds surprises", message: `The crystal ball shows potential for ${name1} & ${name2}! Sometimes the best things take time. ⏳`, confidence: "Possible" },
      { year: "Love finds a way", message: `${name1} and ${name2}, focus on understanding each other. The universe works in mysterious ways! 🌌`, confidence: "Time will tell" },
      { year: "Patience is key", message: `${name1} & ${name2}, the journey matters as much as the destination. Keep exploring your connection! 💫`, confidence: "Growing" },
    ]
  };

  let category: "high" | "medium" | "low";
  if (percentage >= 70) category = "high";
  else if (percentage >= 40) category = "medium";
  else category = "low";

  const options = predictions[category];
  return options[Math.floor(Math.random() * options.length)];
};

// Wedding themes based on zodiac compatibility
const getWeddingTheme = (zodiac1: string, zodiac2: string) => {
  const themes = [
    "Romantic Garden Wedding 🌸",
    "Beach Sunset Ceremony 🏖️",
    "Elegant Ballroom Affair 💃",
    "Rustic Barn Celebration 🌾",
    "Destination Wedding Adventure ✈️",
    "Classic Church Wedding ⛪",
    "Bohemian Forest Wedding 🌲",
    "Modern City Rooftop 🌃",
    "Fairytale Castle Wedding 🏰",
    "Intimate Backyard Gathering 🏡"
  ];
  
  // Use zodiac signs to pick a theme if available
  if (zodiac1 && zodiac2) {
    const combined = (zodiac1 + zodiac2).length;
    return themes[combined % themes.length];
  }
  
  return themes[Math.floor(Math.random() * themes.length)];
};

// Lucky wedding dates
const getLuckyWeddingDate = (percentage: number) => {
  const luckyMonths = ["February", "May", "June", "September", "December"];
  const luckyDays = [7, 11, 14, 21, 28];
  const years = percentage >= 70 ? ["2025", "2026"] : percentage >= 40 ? ["2026", "2027", "2028"] : ["2027", "2028", "2029"];
  
  const month = luckyMonths[Math.floor(Math.random() * luckyMonths.length)];
  const day = luckyDays[Math.floor(Math.random() * luckyDays.length)];
  const year = years[Math.floor(Math.random() * years.length)];
  
  return `${month} ${day}, ${year}`;
};
// Zodiac signs for optional selection
const zodiacSigns = [
  "Aries ♈", "Taurus ♉", "Gemini ♊", "Cancer ♋", "Leo ♌", "Virgo ♍",
  "Libra ♎", "Scorpio ♏", "Sagittarius ♐", "Capricorn ♑", "Aquarius ♒", "Pisces ♓"
];

// Result style types
type ResultStyle = "romantic" | "funny" | "emotional" | "friendship";

// Dynamic messages based on percentage ranges
const getMessages = (percentage: number, style: ResultStyle, name1: string, name2: string) => {
  const romanticMessages = {
    high: [
      `${name1} and ${name2}, you're a match made in heaven! 💫 The stars have aligned for your love story.`,
      `Your hearts beat as one! ${name1} & ${name2} have found their soulmate. 💖`,
      `True love alert! 🚨 ${name1} and ${name2} share an extraordinary connection that's rare and beautiful.`,
      `${name1} + ${name2} = Forever Love! Your bond transcends ordinary relationships. 💕`,
      `Wow! ${name1} and ${name2}, you've found something magical together. Cherish it! ✨`
    ],
    medium: [
      `${name1} and ${name2}, you have a solid foundation for love. Keep nurturing it! 🌹`,
      `There's beautiful potential here! ${name1} & ${name2} just need more quality time together. 💝`,
      `${name1} and ${name2}, your love is growing stronger each day. Stay patient! 🌸`,
      `Good vibes between ${name1} and ${name2}! With effort, this could be something special. 💫`,
      `${name1} & ${name2}, you complement each other well. Focus on communication! 💬`
    ],
    low: [
      `${name1} and ${name2}, every great love story has humble beginnings. Keep the faith! 🌱`,
      `The journey to love takes time, ${name1} & ${name2}. Stay positive and open-hearted! 💛`,
      `${name1} and ${name2}, focus on building friendship first. The best romances start there! 🤝`,
      `Keep exploring your connection, ${name1} & ${name2}. Love often surprises us! 🌈`,
      `${name1} and ${name2}, different doesn't mean wrong. Embrace your unique bond! 💚`
    ]
  };

  const funnyMessages = {
    high: [
      `OMG! ${name1} and ${name2} are basically two peas in a pod! 🥜 Someone call Netflix, we have a rom-com! 🎬`,
      `${name1} + ${name2} = Relationship goals! 🎯 Your friends are probably jealous already! 😂`,
      `Cupid just high-fived himself! ${name1} & ${name2}, you're giving him job satisfaction! 💘`,
      `Alert! ${name1} and ${name2} are so perfect together, it's almost annoying! 😤💕`,
      `${name1} and ${name2}, you two finish each other's... sandwiches! 🥪❤️`
    ],
    medium: [
      `${name1} and ${name2}, not bad! You're like pizza and pineapple – controversial but it works! 🍕`,
      `Hmm, ${name1} & ${name2}... You've got potential! Maybe try sharing fries on the next date? 🍟`,
      `${name1} and ${name2}: 50% love, 50% who ate the last cookie arguments! 🍪😂`,
      `You two are like WiFi – sometimes strong, sometimes need a restart! ${name1} & ${name2} 📶`,
      `${name1} and ${name2}, you're that couple who can't decide where to eat! 🍽️😅`
    ],
    low: [
      `${name1} and ${name2}, well... opposites attract? Maybe try a cooking class together! 👨‍🍳`,
      `Plot twist incoming! ${name1} & ${name2}, every great love story needs challenges! 📖`,
      `${name1} and ${name2}, you're like oil and water – but hey, that makes salad dressing! 🥗`,
      `The universe says: ${name1} & ${name2}, work on your inside jokes first! 😄`,
      `${name1} and ${name2}, Rome wasn't built in a day, and neither is love! 🏛️`
    ]
  };

  const emotionalMessages = {
    high: [
      `${name1} and ${name2}, your souls recognize each other from lifetimes ago. This connection is sacred. 🙏✨`,
      `In a world of billions, ${name1} found ${name2}. That's not coincidence – that's destiny. 💫`,
      `${name1} & ${name2}, you make each other's hearts feel at home. That's the rarest gift. 🏠💕`,
      `Some connections defy explanation. ${name1} and ${name2}, yours is one of them. 🌟`,
      `${name1} and ${name2}, you've found your person. Hold on tight and never let go. 🤗💖`
    ],
    medium: [
      `${name1} and ${name2}, love is a journey, not a destination. Enjoy every step together. 🚶‍♂️🚶‍♀️`,
      `Every moment ${name1} and ${name2} share is a chance to grow closer. Embrace it. 🌱`,
      `${name1} & ${name2}, true love is patient and kind. Give your bond time to blossom. 🌺`,
      `The heart knows what it wants. ${name1} and ${name2}, listen to yours. 💗`,
      `${name1} and ${name2}, what you have is precious. Water it with care and attention. 💧🌸`
    ],
    low: [
      `${name1} and ${name2}, sometimes the best things take time. Be patient with each other. ⏰`,
      `Every connection teaches us something, ${name1} & ${name2}. Learn and grow together. 📚`,
      `${name1} and ${name2}, the heart has its reasons. Trust the journey you're on. 🛤️`,
      `Love isn't always a straight path, ${name1} & ${name2}. The detours make it beautiful. 🌈`,
      `${name1} and ${name2}, focus on understanding before expecting to be understood. 💭`
    ]
  };

  const friendshipMessages = {
    high: [
      `${name1} and ${name2}, from BFFs to soulmates! Your friendship is the strongest foundation for love! 👯‍♀️💕`,
      `Best friends who fell in love? ${name1} & ${name2}, that's the dream come true! 🌟`,
      `${name1} and ${name2}, your friendship-to-love story is what movies are made of! 🎬💖`,
      `They say marry your best friend – ${name1} & ${name2}, you've got this figured out! 💍`,
      `${name1} and ${name2}, from "just friends" to "can't live without you!" What a journey! 🚀`
    ],
    medium: [
      `${name1} and ${name2}, the friendship vibes are strong! Romance might be just around the corner! 💫`,
      `Is it friendship? Is it love? ${name1} & ${name2}, you're in that exciting gray area! 🤔❤️`,
      `${name1} and ${name2}, great friends often make the best partners. Keep building that bond! 🔨`,
      `${name1} & ${name2}, your friendship is solid! Add some romance and you'll be unstoppable! ⚡`,
      `From friends to more? ${name1} and ${name2}, the universe says it's possible! 🌌`
    ],
    low: [
      `${name1} and ${name2}, focus on friendship first! The best romances are built on genuine connection. 🤝`,
      `Hey ${name1} & ${name2}, even friend-zone can be a stepping stone to love! 😊`,
      `${name1} and ${name2}, get to know each other better. Love often hides in unexpected places! 🔍`,
      `${name1} & ${name2}, friendship is the first chapter. Your love story is still being written! 📖`,
      `${name1} and ${name2}, start as friends – you never know where it might lead! 🌈`
    ]
  };

  const messageMap = { romantic: romanticMessages, funny: funnyMessages, emotional: emotionalMessages, friendship: friendshipMessages };
  const messages = messageMap[style];
  
  let category: "high" | "medium" | "low";
  if (percentage >= 70) category = "high";
  else if (percentage >= 40) category = "medium";
  else category = "low";
  
  const categoryMessages = messages[category];
  return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
};

// Easter egg messages for special percentages
const getEasterEggMessage = (percentage: number): string | null => {
  if (percentage === 100) return "🚨 SOULMATE ALERT! This is literally a 1-in-a-million match! 🚨";
  if (percentage === 99) return "✨ So close to perfection! The universe is smiling at you both! ✨";
  if (percentage === 69) return "😏 Nice! You two definitely have... chemistry! 😏";
  if (percentage === 50) return "⚖️ Perfectly balanced, as all things should be! ⚖️";
  if (percentage === 42) return "🌌 42! The answer to life, love, and everything! 🌌";
  if (percentage === 11 || percentage === 22 || percentage === 33 || percentage === 44 || percentage === 55 || percentage === 77 || percentage === 88) {
    return `✨ Angel number ${percentage}! The universe is sending you love signals! ✨`;
  }
  return null;
};

// Tips based on percentage
const getLoveTip = (percentage: number): string => {
  if (percentage >= 80) return "💬 Perfect but keep the communication strong! Never take each other for granted.";
  if (percentage >= 60) return "🌹 Plan a surprise date! Small gestures keep the spark alive.";
  if (percentage >= 40) return "🎯 Focus on shared interests and create new memories together.";
  if (percentage >= 20) return "🤝 Build trust through honest conversations and quality time.";
  return "💛 Start with friendship! The best relationships are built on genuine connection.";
};

const LoveCalculatorTool = () => {
  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [nickname1, setNickname1] = useState("");
  const [nickname2, setNickname2] = useState("");
  const [zodiac1, setZodiac1] = useState("");
  const [zodiac2, setZodiac2] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<{
    percentage: number;
    message: string;
    style: ResultStyle;
    easterEgg: string | null;
    tip: string;
  } | null>(null);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [resultStyle, setResultStyle] = useState<ResultStyle>("romantic");
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Marriage Prediction states
  const [showMarriagePrediction, setShowMarriagePrediction] = useState(false);
  const [isGazingCrystalBall, setIsGazingCrystalBall] = useState(false);
  const [marriagePrediction, setMarriagePrediction] = useState<{
    year: string;
    message: string;
    confidence: string;
    theme: string;
    luckyDate: string;
  } | null>(null);
  const marriageRef = useRef<HTMLDivElement>(null);

  // Calculate love percentage (deterministic based on names)
  const calculateLove = useCallback(() => {
    const name1 = (nickname1 || partner1).toLowerCase().trim();
    const name2 = (nickname2 || partner2).toLowerCase().trim();
    
    if (!name1 || !name2) {
      toast.error("Please enter both names to calculate!");
      return;
    }

    setIsCalculating(true);
    setResult(null);
    setAnimatedPercentage(0);

    // Create a hash from names for consistent but seemingly random results
    const combined = name1 + name2;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    // Add zodiac bonus
    let zodiacBonus = 0;
    if (zodiac1 && zodiac2) {
      const compatiblePairs = [
        ["Aries", "Leo"], ["Aries", "Sagittarius"], ["Taurus", "Virgo"], ["Taurus", "Capricorn"],
        ["Gemini", "Libra"], ["Gemini", "Aquarius"], ["Cancer", "Scorpio"], ["Cancer", "Pisces"],
        ["Leo", "Sagittarius"], ["Virgo", "Capricorn"], ["Libra", "Aquarius"], ["Scorpio", "Pisces"]
      ];
      const z1 = zodiac1.split(" ")[0];
      const z2 = zodiac2.split(" ")[0];
      if (compatiblePairs.some(pair => 
        (pair[0] === z1 && pair[1] === z2) || (pair[0] === z2 && pair[1] === z1) || z1 === z2
      )) {
        zodiacBonus = 10;
      }
    }

    // Calculate percentage (20-100 range, always positive!)
    let percentage = Math.abs(hash % 81) + 20 + zodiacBonus;
    if (percentage > 100) percentage = 100;
    
    // Simulate calculation with heartbeat effect
    setTimeout(() => {
      const message = getMessages(percentage, resultStyle, partner1 || "Partner 1", partner2 || "Partner 2");
      const easterEgg = getEasterEggMessage(percentage);
      const tip = getLoveTip(percentage);
      
      setResult({ percentage, message, style: resultStyle, easterEgg, tip });
      setIsCalculating(false);
      
      // Animate percentage counter
      let current = 0;
      const increment = percentage / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= percentage) {
          setAnimatedPercentage(percentage);
          clearInterval(timer);
        } else {
          setAnimatedPercentage(Math.floor(current));
        }
      }, 30);
      
      // Scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }, 2500);
  }, [partner1, partner2, nickname1, nickname2, zodiac1, zodiac2, resultStyle]);

  // Share functions
  const shareToWhatsApp = () => {
    if (!result) return;
    const text = `💕 Our Love Score: ${result.percentage}%! ${result.message}\n\nTry it yourself: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied! Share with your friends 💕");
  };

  const copyResult = () => {
    if (!result) return;
    const text = `💕 ${partner1} + ${partner2} Love Score: ${result.percentage}%!\n${result.message}`;
    navigator.clipboard.writeText(text);
    toast.success("Result copied! 💖");
  };

  const reset = () => {
    setPartner1("");
    setPartner2("");
    setNickname1("");
    setNickname2("");
    setZodiac1("");
    setZodiac2("");
    setMeetingDate("");
    setResult(null);
    setAnimatedPercentage(0);
    setShowAdvanced(false);
    setShowMarriagePrediction(false);
    setMarriagePrediction(null);
  };

  // Future Marriage Prediction
  const gazeCrystalBall = useCallback(() => {
    if (!result) return;
    
    setIsGazingCrystalBall(true);
    setMarriagePrediction(null);
    
    // Simulate mystical gazing animation
    setTimeout(() => {
      const prediction = getMarriagePrediction(result.percentage, partner1, partner2);
      const theme = getWeddingTheme(zodiac1, zodiac2);
      const luckyDate = getLuckyWeddingDate(result.percentage);
      
      setMarriagePrediction({
        ...prediction,
        theme,
        luckyDate
      });
      setIsGazingCrystalBall(false);
      setShowMarriagePrediction(true);
      
      // Scroll to prediction
      setTimeout(() => {
        marriageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }, 3000);
  }, [result, partner1, partner2, zodiac1, zodiac2]);

  const tryWithNicknames = () => {
    setShowAdvanced(true);
    setNickname1("");
    setNickname2("");
    toast.info("Now enter your cute nicknames! 😍");
  };

  // Get heart color based on percentage
  const getHeartColor = (percentage: number) => {
    if (percentage >= 80) return "text-red-500";
    if (percentage >= 60) return "text-pink-500";
    if (percentage >= 40) return "text-rose-400";
    return "text-pink-300";
  };

  return (
    <div className="space-y-6">
      {/* Style Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <Label className="w-full text-center mb-2 text-muted-foreground">Choose your result vibe:</Label>
        {[
          { id: "romantic" as ResultStyle, label: "Romantic 💕", icon: Heart },
          { id: "funny" as ResultStyle, label: "Funny 😂", icon: Smile },
          { id: "emotional" as ResultStyle, label: "Emotional 🥹", icon: Star },
          { id: "friendship" as ResultStyle, label: "Friendship → Love 💞", icon: Users }
        ].map(style => (
          <Button
            key={style.id}
            variant={resultStyle === style.id ? "hero" : "outline"}
            size="sm"
            onClick={() => setResultStyle(style.id)}
            className="gap-1"
          >
            {style.label}
          </Button>
        ))}
      </div>

      {/* Main Input Card */}
      <Card className="border-2 border-pink-200 dark:border-pink-900/50 bg-gradient-to-br from-pink-50/50 to-rose-50/50 dark:from-pink-950/20 dark:to-rose-950/20">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Heart className="h-7 w-7 text-red-500 animate-pulse" />
            <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              Love Calculator
            </span>
            <Heart className="h-7 w-7 text-red-500 animate-pulse" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Discover your love compatibility! Enter your names below 💖
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partner1" className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink-500" />
                Your Name
              </Label>
              <Input
                id="partner1"
                placeholder="Enter your name..."
                value={partner1}
                onChange={(e) => setPartner1(e.target.value)}
                className="border-pink-200 dark:border-pink-800 focus:ring-pink-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partner2" className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Partner's Name
              </Label>
              <Input
                id="partner2"
                placeholder="Enter partner's name..."
                value={partner2}
                onChange={(e) => setPartner2(e.target.value)}
                className="border-pink-200 dark:border-pink-800 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {showAdvanced ? "Hide" : "Show"} Advanced Options (Zodiac, Nicknames)
          </Button>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-4 p-4 bg-secondary/30 rounded-xl animate-fade-in">
              {/* Nicknames */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nickname1">Your Nickname (optional) 😍</Label>
                  <Input
                    id="nickname1"
                    placeholder="e.g., Honey, Baby..."
                    value={nickname1}
                    onChange={(e) => setNickname1(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nickname2">Partner's Nickname (optional) 🥰</Label>
                  <Input
                    id="nickname2"
                    placeholder="e.g., Sweetie, Darling..."
                    value={nickname2}
                    onChange={(e) => setNickname2(e.target.value)}
                  />
                </div>
              </div>

              {/* Zodiac Signs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Your Zodiac Sign</Label>
                  <select
                    value={zodiac1}
                    onChange={(e) => setZodiac1(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select zodiac...</option>
                    {zodiacSigns.map(sign => (
                      <option key={sign} value={sign}>{sign}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Partner's Zodiac Sign</Label>
                  <select
                    value={zodiac2}
                    onChange={(e) => setZodiac2(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select zodiac...</option>
                    {zodiacSigns.map(sign => (
                      <option key={sign} value={sign}>{sign}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Meeting Date */}
              <div className="space-y-2">
                <Label htmlFor="meetingDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  When did you first meet? (optional)
                </Label>
                <Input
                  id="meetingDate"
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Calculate Button */}
          <Button
            onClick={calculateLove}
            disabled={isCalculating || !partner1 || !partner2}
            className={cn(
              "w-full h-14 text-lg font-bold",
              "bg-gradient-to-r from-pink-500 via-red-500 to-rose-500",
              "hover:from-pink-600 hover:via-red-600 hover:to-rose-600",
              "text-white shadow-lg hover:shadow-xl transition-all duration-300",
              isCalculating && "animate-pulse"
            )}
          >
            {isCalculating ? (
              <span className="flex items-center gap-2">
                <Heart className="h-6 w-6 animate-[pulse_0.5s_ease-in-out_infinite]" />
                Calculating Love...
                <Heart className="h-6 w-6 animate-[pulse_0.5s_ease-in-out_infinite]" />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Calculate Love Compatibility
                <Heart className="h-5 w-5" />
              </span>
            )}
          </Button>

          {/* Loading Animation */}
          {isCalculating && (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="flex justify-center">
                <div className="relative">
                  <Heart className="h-20 w-20 text-red-500 animate-[pulse_0.5s_ease-in-out_infinite]" fill="currentColor" />
                  <Sparkles className="absolute top-0 right-0 h-6 w-6 text-yellow-400 animate-spin" />
                </div>
              </div>
              <Progress value={45} className="w-3/4 mx-auto h-2 bg-pink-100" />
              <p className="text-muted-foreground animate-pulse">
                Analyzing your cosmic connection... 💫
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Card */}
      {result && !isCalculating && (
        <div ref={resultRef} className="animate-scale-in">
          <Card className="border-2 border-pink-300 dark:border-pink-800 overflow-hidden">
            {/* Percentage Display */}
            <div className={cn(
              "relative py-8 text-center",
              "bg-gradient-to-br from-pink-500 via-red-500 to-rose-600"
            )}>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Heart className={cn("h-8 w-8 text-white animate-pulse")} fill="currentColor" />
                  <span className="text-7xl font-black text-white drop-shadow-lg">
                    {animatedPercentage}%
                  </span>
                  <Heart className={cn("h-8 w-8 text-white animate-pulse")} fill="currentColor" />
                </div>
                <p className="text-white/90 text-lg font-medium">
                  {partner1} + {partner2}
                </p>
              </div>
              {/* Decorative hearts */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <Heart
                    key={i}
                    className={cn(
                      "absolute text-white/20",
                      i % 2 === 0 ? "animate-pulse" : "animate-bounce"
                    )}
                    style={{
                      left: `${10 + i * 15}%`,
                      top: `${20 + (i % 3) * 20}%`,
                      width: `${20 + i * 5}px`,
                      height: `${20 + i * 5}px`
                    }}
                    fill="currentColor"
                  />
                ))}
              </div>
            </div>

            <CardContent className="pt-6 space-y-6">
              {/* Easter Egg Message */}
              {result.easterEgg && (
                <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <p className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                    {result.easterEgg}
                  </p>
                </div>
              )}

              {/* Main Message */}
              <div className="text-center p-4 bg-pink-50 dark:bg-pink-950/30 rounded-xl">
                <p className="text-lg leading-relaxed text-foreground">
                  {result.message}
                </p>
              </div>

              {/* Love Tip */}
              <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl">
                <MessageCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-1">Love Tip:</p>
                  <p className="text-sm text-muted-foreground">{result.tip}</p>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="space-y-3">
                <p className="text-center text-sm text-muted-foreground">
                  Share your result with friends! 💕
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button onClick={shareToWhatsApp} className="bg-green-500 hover:bg-green-600 text-white gap-2">
                    <Share2 className="h-4 w-4" />
                    WhatsApp
                  </Button>
                  <Button onClick={shareToFacebook} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Share2 className="h-4 w-4" />
                    Facebook
                  </Button>
                  <Button onClick={copyResult} variant="outline" className="gap-2">
                    <Copy className="h-4 w-4" />
                    Copy Result
                  </Button>
                  <Button onClick={copyLink} variant="outline" className="gap-2">
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 pt-4 border-t">
                <Button onClick={tryWithNicknames} variant="outline" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Try with Nicknames 😍
                </Button>
                <Button onClick={reset} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Different Names
                </Button>
              </div>

              {/* Future Marriage Prediction Button */}
              {!showMarriagePrediction && !isGazingCrystalBall && (
                <div className="text-center">
                  <Button
                    onClick={gazeCrystalBall}
                    className={cn(
                      "h-14 px-8 text-lg font-bold",
                      "bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-600",
                      "hover:from-purple-600 hover:via-indigo-600 hover:to-violet-700",
                      "text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    )}
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    🔮 Reveal Future Marriage Prediction
                  </Button>
                </div>
              )}

              {/* Crystal Ball Gazing Animation */}
              {isGazingCrystalBall && (
                <div className="text-center py-8 space-y-6 animate-fade-in">
                  {/* Animated Crystal Ball */}
                  <div className="relative inline-block">
                    <div className={cn(
                      "w-40 h-40 rounded-full mx-auto relative",
                      "bg-gradient-to-br from-purple-400 via-indigo-500 to-violet-600",
                      "shadow-[0_0_60px_15px_rgba(139,92,246,0.5)]",
                      "animate-pulse"
                    )}>
                      {/* Inner glow */}
                      <div className={cn(
                        "absolute inset-4 rounded-full",
                        "bg-gradient-to-br from-white/30 via-purple-300/20 to-transparent",
                        "animate-spin",
                        "transition-all duration-1000"
                      )} style={{ animationDuration: "3s" }} />
                      
                      {/* Mystical sparkles */}
                      <div className="absolute inset-0">
                        {[...Array(8)].map((_, i) => (
                          <Sparkles
                            key={i}
                            className={cn(
                              "absolute text-white/70",
                              "animate-pulse"
                            )}
                            style={{
                              left: `${20 + (i % 4) * 20}%`,
                              top: `${15 + Math.floor(i / 4) * 50}%`,
                              width: `${12 + (i % 3) * 4}px`,
                              height: `${12 + (i % 3) * 4}px`,
                              animationDelay: `${i * 0.2}s`
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* Center eye */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Eye className="h-12 w-12 text-white/80 animate-pulse" />
                      </div>
                    </div>
                    
                    {/* Base stand */}
                    <div className="w-24 h-6 mx-auto -mt-2 rounded-b-full bg-gradient-to-b from-gray-400 to-gray-600 shadow-lg" />
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={65} className="w-3/4 mx-auto h-2 bg-purple-100" />
                    <p className="text-lg font-medium text-purple-600 dark:text-purple-400 animate-pulse">
                      🔮 Gazing into your future...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      The crystal ball is revealing your destiny... ✨
                    </p>
                  </div>
                </div>
              )}

              {/* Marriage Prediction Result */}
              {showMarriagePrediction && marriagePrediction && (
                <div ref={marriageRef} className="animate-scale-in space-y-4">
                  <Card className="border-2 border-purple-300 dark:border-purple-800 overflow-hidden">
                    {/* Header */}
                    <div className={cn(
                      "py-6 text-center relative overflow-hidden",
                      "bg-gradient-to-br from-purple-500 via-indigo-500 to-violet-600"
                    )}>
                      {/* Background decorations */}
                      <div className="absolute inset-0 overflow-hidden">
                        {[...Array(10)].map((_, i) => (
                          <Star
                            key={i}
                            className="absolute text-white/20"
                            style={{
                              left: `${5 + i * 10}%`,
                              top: `${10 + (i % 3) * 30}%`,
                              width: `${10 + i * 2}px`,
                              height: `${10 + i * 2}px`,
                              animation: `pulse ${1 + i * 0.2}s ease-in-out infinite`
                            }}
                            fill="currentColor"
                          />
                        ))}
                      </div>
                      
                      <div className="relative z-10">
                        <div className="text-5xl mb-2">🔮</div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                          Future Marriage Prediction
                        </h3>
                        <p className="text-white/80">
                          {partner1} & {partner2}
                        </p>
                      </div>
                    </div>
                    
                    <CardContent className="pt-6 space-y-4">
                      {/* Prediction Timeline */}
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                        <p className="text-sm text-muted-foreground mb-1">Predicted Wedding Timeline</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {marriagePrediction.year}
                        </p>
                        <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                          <Star className="h-3 w-3 text-purple-500" fill="currentColor" />
                          <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                            Confidence: {marriagePrediction.confidence}
                          </span>
                        </div>
                      </div>
                      
                      {/* Main Message */}
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl">
                        <p className="text-center leading-relaxed">
                          {marriagePrediction.message}
                        </p>
                      </div>
                      
                      {/* Wedding Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-violet-50 dark:bg-violet-950/30 rounded-xl text-center">
                          <p className="text-sm text-muted-foreground mb-1">💒 Ideal Wedding Theme</p>
                          <p className="font-semibold text-violet-700 dark:text-violet-300">
                            {marriagePrediction.theme}
                          </p>
                        </div>
                        <div className="p-4 bg-pink-50 dark:bg-pink-950/30 rounded-xl text-center">
                          <p className="text-sm text-muted-foreground mb-1">📅 Lucky Wedding Date</p>
                          <p className="font-semibold text-pink-700 dark:text-pink-300">
                            {marriagePrediction.luckyDate}
                          </p>
                        </div>
                      </div>
                      
                      {/* Fun Stats */}
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl">
                        <p className="text-center text-sm text-muted-foreground mb-3">
                          🎊 Your Wedding Fortune
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-2xl">💍</p>
                            <p className="text-xs text-muted-foreground">Beautiful Ring</p>
                          </div>
                          <div>
                            <p className="text-2xl">🎂</p>
                            <p className="text-xs text-muted-foreground">5-Tier Cake</p>
                          </div>
                          <div>
                            <p className="text-2xl">🕊️</p>
                            <p className="text-xs text-muted-foreground">Eternal Love</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Re-gaze button */}
                      <div className="text-center pt-2">
                        <Button
                          onClick={gazeCrystalBall}
                          variant="outline"
                          className="gap-2 border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400"
                        >
                          <Eye className="h-4 w-4" />
                          Gaze Again for New Prediction
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trust & Disclaimer */}
      <div className="text-center space-y-3 py-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/30 rounded-full border border-green-200 dark:border-green-800">
          <span className="text-green-600 dark:text-green-400 text-sm font-medium">
            🔒 100% Privacy – Your data never leaves your browser
          </span>
        </div>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          ⚠️ <strong>Disclaimer:</strong> This Love Calculator is for fun and entertainment purposes only. 
          Results are randomly generated and should not be taken seriously. 
          Real relationships require communication, trust, and effort! 💕
        </p>
      </div>
    </div>
  );
};

export default LoveCalculatorTool;
