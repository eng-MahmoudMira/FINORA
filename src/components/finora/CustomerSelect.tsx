import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEMO_CUSTOMERS } from "@/data/mockData";
import type { DemoCustomer } from "@/types/finora";

export function CustomerSelect({
  value,
  onChange,
  customers = DEMO_CUSTOMERS,
  ariaLabel = "Select demo customer",
}: {
  value: string;
  onChange: (demoId: string) => void;
  customers?: DemoCustomer[];
  ariaLabel?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={ariaLabel} className="w-full">
        <SelectValue placeholder="Select a demo customer" />
      </SelectTrigger>
      <SelectContent>
        {customers.map((c) => (
          <SelectItem key={c.demoId} value={c.demoId}>
            {c.demoId} — {c.demoName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
