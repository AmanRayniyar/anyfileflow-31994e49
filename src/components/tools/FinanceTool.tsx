import { useMemo, useState } from "react";
import { Tool } from "@/data/tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Sparkles, RefreshCw, Info } from "lucide-react";
import { getFinanceCalc, FinanceCalc } from "@/lib/financeCalculators";

interface Props {
  tool: Tool;
}

const FinanceTool = ({ tool }: Props) => {
  const calc: FinanceCalc | undefined = useMemo(() => getFinanceCalc(tool.id), [tool.id]);

  const initial = useMemo(() => {
    const o: Record<string, number | string> = {};
    calc?.inputs.forEach((i) => (o[i.id] = i.default ?? (i.type === "select" ? i.options?.[0]?.value ?? "" : 0)));
    return o;
  }, [calc]);

  const [values, setValues] = useState<Record<string, number | string>>(initial);
  const results = useMemo(() => (calc ? calc.compute(values) : []), [calc, values]);

  if (!calc) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 text-center">
        <p className="text-muted-foreground">This finance tool is being added soon.</p>
      </div>
    );
  }

  const update = (id: string, val: string) => {
    const input = calc.inputs.find((i) => i.id === id);
    if (!input) return;
    setValues((p) => ({ ...p, [id]: input.type === "select" ? val : val === "" ? "" : Number(val) }));
  };

  const reset = () => setValues(initial);

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Inputs</h2>
          </div>
          <Button size="sm" variant="outline" onClick={reset}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {calc.inputs.map((inp) => (
            <div key={inp.id} className="space-y-1.5">
              <Label htmlFor={inp.id} className="text-sm font-medium text-foreground flex items-center gap-1">
                {inp.label}
                {inp.unit && <span className="text-xs text-muted-foreground">({inp.unit})</span>}
              </Label>
              {inp.type === "select" ? (
                <Select value={String(values[inp.id] ?? "")} onValueChange={(v) => update(inp.id, v)}>
                  <SelectTrigger id={inp.id}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {inp.options?.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="relative">
                  {inp.type === "currency" && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  )}
                  {inp.type === "percent" && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                  )}
                  <Input
                    id={inp.id}
                    type="number"
                    inputMode="decimal"
                    step={inp.step ?? (inp.type === "percent" ? 0.1 : 1)}
                    value={values[inp.id] === "" ? "" : String(values[inp.id])}
                    onChange={(e) => update(inp.id, e.target.value)}
                    className={inp.type === "currency" ? "pl-7" : inp.type === "percent" ? "pr-7" : ""}
                  />
                </div>
              )}
              {inp.help && <p className="text-xs text-muted-foreground">{inp.help}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Results</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {results.map((r, i) => (
            <div
              key={i}
              className={`rounded-xl p-4 border ${r.highlight ? "bg-primary/10 border-primary/30" : "bg-card border-border"}`}
            >
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{r.label}</div>
              <div className={`mt-1 font-bold ${r.highlight ? "text-primary text-xl sm:text-2xl" : "text-foreground text-lg"}`}>{r.value}</div>
              {r.hint && <div className="text-xs text-muted-foreground mt-1">{r.hint}</div>}
            </div>
          ))}
        </div>
        {calc.formula && (
          <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <code className="bg-secondary/50 px-2 py-1 rounded">{calc.formula}</code>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceTool;
