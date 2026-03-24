import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Autocomplete, TextField, Chip, Box } from "@mui/material";
import { tagsApi } from "../../api/tags";
import type { Tag } from "../../types/tag";

interface TagSelectorProps {
  value: number[];
  onChange: (ids: number[]) => void;
  label?: string;
}

export default function TagSelector({ value, onChange, label = "Tags" }: TagSelectorProps) {
  const qc = useQueryClient();
  const [inputValue, setInputValue] = useState("");

  const { data } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await tagsApi.list();
      return res.data.data as Tag[];
    },
  });

  const tags = data ?? [];
  const selectedTags = tags.filter((t) => value.includes(t.id));

  async function handleCreateTag(name: string) {
    const colors = ["#EF4444", "#3B82F6", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899", "#06B6D4"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const res = await tagsApi.create({ name, color });
    qc.invalidateQueries({ queryKey: ["tags"] });
    onChange([...value, res.data.data.id]);
  }

  return (
    <Autocomplete
      multiple
      options={tags}
      value={selectedTags}
      onChange={(_, newVal) => {
        const ids = newVal.map((t) => {
          if (typeof t === "string") return -1;
          return t.id;
        }).filter((id) => id > 0);
        onChange(ids);
      }}
      inputValue={inputValue}
      onInputChange={(_, v) => setInputValue(v)}
      getOptionLabel={(option) => (typeof option === "string" ? option : option.name)}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      freeSolo
      onKeyDown={(e) => {
        if (e.key === "Enter" && inputValue.trim() && !tags.find((t) => t.name.toLowerCase() === inputValue.trim().toLowerCase())) {
          e.preventDefault();
          handleCreateTag(inputValue.trim());
          setInputValue("");
        }
      }}
      renderTags={(tagValues, getTagProps) =>
        tagValues.map((option, index) => {
          const { key, ...rest } = getTagProps({ index });
          return (
            <Chip
              key={key}
              label={option.name}
              size="small"
              {...rest}
              sx={{
                bgcolor: option.color ? `${option.color}20` : undefined,
                color: option.color ?? "text.primary",
                fontWeight: 600,
                fontSize: 12,
              }}
            />
          );
        })
      }
      renderOption={(props, option) => {
        const { key, ...rest } = props;
        return (
          <li key={key} {...rest}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: option.color ?? "#999", mr: 1.5, flexShrink: 0 }} />
            {option.name}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder="Type to search or create..." size="small" />
      )}
    />
  );
}
