import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CalendarDays, Share2, Copy, Sparkles, Gift, PartyPopper, GraduationCap, Heart, Plane, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface EventPreset {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  getDate: () => Date;
}

function nextOccurrence(month: number, day: number): Date {
  const now = new Date();
  let year = now.getFullYear();
  const candidate = new Date(year, month, day, 0, 0, 0);
  if (candidate.getTime() < now.getTime()) {
    candidate.setFullYear(year + 1);
  }
  return candidate;
}

const PRESETS: EventPreset[] = [
  { id: 'new-year', label: 'New Year', icon: PartyPopper, getDate: () => new Date(new Date().getFullYear() + 1, 0, 1, 0, 0, 0) },
  { id: 'christmas', label: 'Christmas', icon: Gift, getDate: () => nextOccurrence(11, 25) },
  { id: 'valentines', label: "Valentine's Day", icon: Heart, getDate: () => nextOccurrence(1, 14) },
  { id: 'halloween', label: 'Halloween', icon: Sparkles, getDate: () => nextOccurrence(9, 31) },
  { id: 'summer', label: 'Summer Break', icon: Plane, getDate: () => nextOccurrence(5, 21) },
  { id: 'graduation', label: 'Graduation', icon: GraduationCap, getDate: () => nextOccurrence(5, 1) },
  { id: 'birthday', label: 'My Birthday', icon: Gift, getDate: () => nextOccurrence(new Date().getMonth(), new Date().getDate() + 7) },
  { id: 'launch', label: 'Product Launch', icon: Rocket, getDate: () => { const d = new Date(); d.setDate(d.getDate() + 30); return d; } },
];

function toLocalInputValue(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

interface Breakdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  expired: boolean;
}

function getBreakdown(target: Date): Breakdown {
  const total = target.getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, expired: true };
  const days = Math.floor(total / 86400000);
  const hours = Math.floor((total % 86400000) / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  return { days, hours, minutes, seconds, total, expired: false };
}

const EventCountdown: React.FC = () => {
  // Parse URL hash for shared countdowns
  const initial = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const date = params.get('date');
    const name = params.get('name');
    if (date) {
      const d = new Date(date);
      if (!isNaN(d.getTime())) return { date: d, name: name || 'My Event' };
    }
    return null;
  }, []);

  const [targetDate, setTargetDate] = useState<Date>(initial?.date ?? PRESETS[0].getDate());
  const [eventName, setEventName] = useState<string>(initial?.name ?? 'New Year Countdown');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const breakdown = useMemo(() => getBreakdown(targetDate), [targetDate, now]);

  const applyPreset = useCallback((preset: EventPreset) => {
    setTargetDate(preset.getDate());
    setEventName(`${preset.label} Countdown`);
  }, []);

  const onDateChange = (value: string) => {
    const d = new Date(value);
    if (!isNaN(d.getTime())) setTargetDate(d);
  };

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams({
      date: targetDate.toISOString(),
      name: eventName,
    });
    return `${window.location.origin}${window.location.pathname}#${params.toString()}`;
  }, [targetDate, eventName]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Shareable countdown link copied!');
    } catch {
      toast.error('Could not copy link');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: eventName, text: `Countdown to ${eventName}`, url: shareUrl });
      } catch {/* user cancelled */}
    } else {
      handleCopy();
    }
  };

  const handleAddToCalendar = () => {
    const dt = targetDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDt = new Date(targetDate.getTime() + 3600000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AnyFileFlow//Countdown//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@anyfileflow.com`,
      `DTSTAMP:${dt}`,
      `DTSTART:${dt}`,
      `DTEND:${endDt}`,
      `SUMMARY:${eventName}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventName.replace(/\s+/g, '-').toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Calendar event downloaded');
  };

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center justify-center bg-card border border-border rounded-xl p-3 sm:p-4 md:p-6 min-w-[68px] sm:min-w-[88px] shadow-sm">
      <span className="text-3xl sm:text-5xl md:text-6xl font-mono font-bold text-primary tabular-nums leading-none">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground mt-2">
        {label}
      </span>
    </div>
  );

  return (
    <section
      aria-label="Event Countdown"
      className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-primary/5 via-secondary/30 to-accent/10 border border-primary/10 space-y-5"
    >
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-bold text-foreground flex items-center gap-2 text-lg">
            <CalendarDays className="h-5 w-5 text-primary" />
            Date & Event Countdown
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Count down to any date — New Year, wedding, birthday, exam, product launch.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
            <Copy className="h-3.5 w-3.5" /> Copy Link
          </Button>
        </div>
      </header>

      {/* Big Countdown Display */}
      <div
        className="flex justify-center gap-2 sm:gap-3 md:gap-4 py-4"
        role="timer"
        aria-live="polite"
        aria-label={`Time remaining until ${eventName}`}
      >
        <TimeBlock value={breakdown.days} label="Days" />
        <TimeBlock value={breakdown.hours} label="Hours" />
        <TimeBlock value={breakdown.minutes} label="Minutes" />
        <TimeBlock value={breakdown.seconds} label="Seconds" />
      </div>

      {breakdown.expired ? (
        <p className="text-center text-lg font-semibold text-primary">
          🎉 {eventName} is here!
        </p>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          Counting down to <strong className="text-foreground">{eventName}</strong> on{' '}
          <strong className="text-foreground">
            {targetDate.toLocaleString(undefined, {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </strong>
        </p>
      )}

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="event-name" className="text-xs">Event Name</Label>
          <Input
            id="event-name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g. My Wedding, Exam, Vacation"
            maxLength={60}
          />
        </div>
        <div>
          <Label htmlFor="event-date" className="text-xs">Target Date & Time</Label>
          <Input
            id="event-date"
            type="datetime-local"
            value={toLocalInputValue(targetDate)}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      </div>

      {/* Event Presets */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Quick Events</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const Icon = p.icon;
            return (
              <Button
                key={p.id}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(p)}
                className="gap-1.5"
              >
                <Icon className="h-3.5 w-3.5" />
                {p.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <Button variant="ghost" size="sm" onClick={handleAddToCalendar} className="gap-1.5">
          <CalendarDays className="h-4 w-4" /> Add to Calendar (.ics)
        </Button>
      </div>
    </section>
  );
};

export default EventCountdown;
