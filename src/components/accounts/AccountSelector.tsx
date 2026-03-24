import { useQuery } from "@tanstack/react-query";
import { TextField, MenuItem, Stack, Box, alpha } from "@mui/material";
import { accountsApi } from "../../api/accounts";
import type { Account } from "../../types/account";

interface AccountSelectorProps {
  value: number | "";
  onChange: (id: number | "") => void;
  label?: string;
  required?: boolean;
  size?: "small" | "medium";
}

const typeIcons: Record<string, string> = {
  cash: "💵",
  checking: "🏦",
  savings: "🏧",
  credit_card: "💳",
  e_wallet: "📱",
};

export default function AccountSelector({
  value,
  onChange,
  label = "Account",
  required = false,
  size = "small",
}: AccountSelectorProps) {
  const { data } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await accountsApi.list();
      return res.data.data as Account[];
    },
  });

  const accounts = data ?? [];

  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
      required={required}
      fullWidth
      size={size}
    >
      <MenuItem value="">
        <em>All accounts</em>
      </MenuItem>
      {accounts.map((acc) => (
        <MenuItem key={acc.id} value={acc.id}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: acc.color ?? alpha("#000", 0.3),
                flexShrink: 0,
              }}
            />
            <span>
              {typeIcons[acc.type] ?? "💰"} {acc.name} ({acc.currency})
            </span>
          </Stack>
        </MenuItem>
      ))}
    </TextField>
  );
}
