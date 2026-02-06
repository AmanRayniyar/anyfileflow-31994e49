import React from 'react';
import { Check, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ComparisonTable: React.FC = () => {
  const features = [
    { name: 'Bulk Conversion (100+ files)', anyfileflow: true, others: false },
    { name: 'AI Background Removal', anyfileflow: true, others: false },
    { name: 'No File Upload to Server', anyfileflow: true, others: false },
    { name: 'Works Offline (PWA)', anyfileflow: true, others: false },
    { name: 'PNG Type Selection (8/24/32)', anyfileflow: true, others: false },
    { name: 'Metadata/EXIF Control', anyfileflow: true, others: false },
    { name: 'Live Before/After Preview', anyfileflow: true, others: false },
    { name: 'Conversion Speed Display', anyfileflow: true, others: false },
    { name: 'No Watermark', anyfileflow: true, others: false },
    { name: 'No Registration', anyfileflow: true, others: false },
    { name: 'Unlimited Free Use', anyfileflow: true, others: false },
    { name: 'ZIP Download for Bulk', anyfileflow: true, others: false },
  ];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-border">
        <h3 className="font-bold text-lg text-foreground">
          Why Choose AnyFile Flow?
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          See how we compare to other online converters
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Feature</TableHead>
              <TableHead className="text-center min-w-[120px]">
                <span className="font-bold text-primary">AnyFile Flow</span>
              </TableHead>
              <TableHead className="text-center min-w-[120px]">Others</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-sm">
                  {feature.name}
                </TableCell>
                <TableCell className="text-center">
                  {feature.anyfileflow ? (
                    <Check className="h-5 w-5 text-tool-archive inline-block" aria-label="Yes" />
                  ) : (
                    <X className="h-5 w-5 text-destructive inline-block" aria-label="No" />
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {feature.others ? (
                    <Check className="h-5 w-5 text-tool-archive inline-block" aria-label="Yes" />
                  ) : (
                    <X className="h-5 w-5 text-destructive inline-block" aria-label="No" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 bg-secondary/30 text-xs text-muted-foreground">
        * Comparison based on publicly available feature information from popular online converters
      </div>
    </div>
  );
};

export default ComparisonTable;
