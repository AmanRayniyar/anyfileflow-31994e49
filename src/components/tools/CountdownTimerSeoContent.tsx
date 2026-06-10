import React from 'react';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CalendarDays, Clock, BellRing, Share2, Sparkles, Globe, Smartphone, ShieldCheck } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I create a countdown to a specific date?',
    a: 'Use the Date & Event Countdown section, type your event name (e.g. "My Wedding", "Exam Day", "New Year"), pick the exact date and time, and the countdown updates live every second. You can also tap a quick event preset like New Year, Christmas, Halloween, Valentine\'s Day, or Graduation.',
  },
  {
    q: 'Is this online countdown timer free to use?',
    a: 'Yes — our countdown timer online is 100% free, no sign-up, no ads in the timer itself, no download. It runs entirely in your browser and works on desktop, tablet, mobile, iPhone, iPad and Android.',
  },
  {
    q: 'Can I share my countdown with friends?',
    a: 'Yes. Click Share or Copy Link to generate a shareable countdown URL that opens with your exact event name, date and time pre-filled — perfect for wedding countdowns, birthday surprises, product launches and event marketing.',
  },
  {
    q: 'Does the countdown timer have an alarm sound?',
    a: 'Yes, the duration timer includes four built-in alarm tones (beep, bell, chime, alarm) plus browser push notifications so you get alerted even if the tab is hidden.',
  },
  {
    q: 'Can I run multiple timers at the same time?',
    a: 'Yes — you can run up to 5 independent countdown timers simultaneously, each with its own name, duration, progress ring and controls. Perfect for cooking, workouts, study sessions and pomodoro.',
  },
  {
    q: 'Does the countdown work offline?',
    a: 'Once the page loads, the countdown timer works entirely offline in your browser. No data is sent to any server. Your custom presets and history are stored locally on your device.',
  },
  {
    q: 'How accurate is this online timer?',
    a: 'The countdown updates every 100ms and uses the high-resolution Date.now() clock, so accuracy is sub-second — comparable to dedicated stopwatch apps.',
  },
  {
    q: 'Can I use it as a New Year countdown clock?',
    a: 'Absolutely. Tap the "New Year" preset and you instantly get a live countdown clock showing days, hours, minutes and seconds until midnight January 1st in your local timezone.',
  },
  {
    q: 'Does it support a fullscreen mode?',
    a: 'Yes. Click Fullscreen on any active duration timer for a giant, distraction-free countdown view — ideal for classrooms, presentations, livestreams, gym workouts and event displays.',
  },
  {
    q: 'Can I add my countdown to Google Calendar or Apple Calendar?',
    a: 'Yes — click "Add to Calendar (.ics)" in the Event Countdown to download a standard iCalendar file that imports into Google Calendar, Apple Calendar, Outlook and any other calendar app.',
  },
];

const USE_CASES = [
  { icon: '🎉', title: 'New Year Countdown', desc: 'Live ball-drop style countdown clock to midnight Jan 1st in your timezone.' },
  { icon: '💍', title: 'Wedding Countdown', desc: 'Beautiful days-hours-minutes display perfect for save-the-dates and wedding websites.' },
  { icon: '🎂', title: 'Birthday Countdown', desc: 'Track days until your birthday or a loved one\'s — share the link as a surprise.' },
  { icon: '📚', title: 'Exam & Study Timer', desc: 'Countdown to exam day plus Pomodoro-style 25-minute study sprints with alarm.' },
  { icon: '🚀', title: 'Product Launch', desc: 'Embed a launch countdown on landing pages, Notion docs and Slack channels.' },
  { icon: '🏋️', title: 'Workout & HIIT', desc: 'Run multiple interval timers in parallel — work, rest, cool-down — with sound alerts.' },
  { icon: '🍳', title: 'Cooking Timer', desc: 'Up to 5 simultaneous kitchen timers so the pasta, oven and rice all finish on time.' },
  { icon: '✈️', title: 'Vacation Countdown', desc: 'Days until your trip, in giant numbers, sharable with travel buddies.' },
];

const KEYWORDS = [
  'countdown timer', 'online countdown timer', 'countdown clock', 'countdown to date',
  'countdown to new year', 'new year countdown', 'wedding countdown', 'birthday countdown',
  'exam countdown', 'countdown days', 'days until countdown', 'event countdown',
  'free countdown timer', 'countdown timer with alarm', 'countdown timer online free',
  'fullscreen countdown', 'countdown timer for presentation', 'countdown widget',
  'time until date calculator', 'countdown to christmas', 'countdown to halloween',
  'launch countdown timer', 'pomodoro timer', 'kitchen timer online', 'multiple timer online',
  'shareable countdown link', 'countdown timer with sound', 'browser countdown', 'date countdown clock',
];

const CountdownTimerSeoContent: React.FC = () => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <article className="mt-10 space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Free <strong>Online Countdown Timer</strong> &amp; Date Countdown Clock
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Create a live <strong>countdown to any date</strong> — <strong>New Year</strong>,
          weddings, birthdays, exams, product launches — or run up to <strong>5 duration timers</strong> in parallel with alarm,
          fullscreen, browser notifications and shareable links. 100% free, no sign-up, works offline.
        </p>
      </section>

      {/* Key Features */}
      <section>
        <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
          Why Our Countdown Timer Ranks As The Best Online
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: CalendarDays, title: 'Date Countdown', desc: 'Count down to any future date and time, down to the second.' },
            { icon: Clock, title: 'Multi-Timer', desc: 'Run up to 5 independent countdown timers simultaneously.' },
            { icon: BellRing, title: 'Alarm & Push', desc: '4 alarm tones + browser notifications when time is up.' },
            { icon: Share2, title: 'Shareable Link', desc: 'One-click share — recipients see your exact countdown.' },
            { icon: Sparkles, title: 'Event Presets', desc: 'New Year, Christmas, Halloween, Wedding, Launch & more.' },
            { icon: Globe, title: 'Calendar Export', desc: 'Download .ics for Google, Apple & Outlook calendars.' },
            { icon: Smartphone, title: 'Mobile Optimized', desc: 'Pixel-perfect on iPhone, iPad, Android & desktop.' },
            { icon: ShieldCheck, title: '100% Private', desc: 'Runs entirely in your browser. No tracking, no upload.' },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="p-4">
              <Icon className="h-6 w-6 text-primary mb-2" />
              <h4 className="font-semibold text-foreground mb-1">{title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section>
        <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
          Popular Use Cases for an Online Countdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {USE_CASES.map((u) => (
            <Card key={u.title} className="p-4">
              <div className="text-3xl mb-2">{u.icon}</div>
              <h4 className="font-semibold text-foreground mb-1">{u.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{u.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How To */}
      <section className="bg-secondary/30 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
          How to Create a Countdown to a Date (in 30 Seconds)
        </h3>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 list-none">
          {[
            { n: 1, t: 'Pick or type your date', d: 'Choose a quick event preset (New Year, Christmas, Wedding) or type your own date and time.' },
            { n: 2, t: 'Name your event', d: 'Add a title like "My 30th Birthday" or "Launch Day" so the countdown is personal.' },
            { n: 3, t: 'Share the link', d: 'Hit Share or Copy Link — anyone who opens the URL sees the same live countdown.' },
          ].map((s) => (
            <li key={s.n} className="bg-card rounded-lg p-4 border border-border">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2">
                {s.n}
              </div>
              <h4 className="font-semibold text-foreground mb-1">{s.t}</h4>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section>
        <h3 className="text-2xl font-bold text-foreground mb-6">
          Countdown Timer FAQ
        </h3>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`cd-faq-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Keyword Cloud */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Searches this free countdown tool answers
        </h3>
        <div className="flex flex-wrap gap-2">
          {KEYWORDS.map((k) => (
            <span
              key={k}
              className="text-xs px-3 py-1 rounded-full bg-card border border-border text-muted-foreground"
            >
              {k}
            </span>
          ))}
        </div>
      </section>
    </article>
  );
};

export default CountdownTimerSeoContent;
