import { TextField } from './TextField';

type Props = {
  label: string;
  value: string;
  onChange: (text: string) => void;
  error?: string | null;
  optional?: boolean;
};

/** Date typed as DD/MM/YYYY; the slashes are added while typing. Works the same everywhere. */
export function DateField({ label, value, onChange, error, optional }: Props) {
  const handle = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
    onChange(parts.join('/'));
  };
  return (
    <TextField
      label={label}
      value={value}
      onChangeText={handle}
      placeholder="HH/BB/TTTT, misal 17/08/1990"
      keyboardType="number-pad"
      maxLength={10}
      error={error}
      optional={optional}
    />
  );
}
