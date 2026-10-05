import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { colors, fontSize, radius, shadow } from '@/constants/theme';

import { AppText } from './ui/AppText';

const PLACEHOLDER = 'Cari dokter, bidan, praktik, layanan…';

type Props = {
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;
  /** Without onChangeText the bar is a button (e.g. on Home it opens the search tab). */
  onPress?: () => void;
  autoFocus?: boolean;
};

export function SearchBar({ value, onChangeText, onSubmit, onPress, autoFocus }: Props) {
  if (!onChangeText) {
    return (
      <Pressable onPress={onPress} accessibilityRole="search" accessibilityLabel={PLACEHOLDER} style={styles.bar}>
        <Ionicons name="search" size={20} color={colors.primary} />
        <AppText color={colors.textFaint} style={styles.flex} numberOfLines={1}>
          {PLACEHOLDER}
        </AppText>
      </Pressable>
    );
  }
  return (
    <View style={styles.bar}>
      <Ionicons name="search" size={20} color={colors.primary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={PLACEHOLDER}
        placeholderTextColor={colors.textFaint}
        returnKeyType="search"
        autoCorrect={false}
        autoFocus={autoFocus}
        accessibilityRole="search"
        accessibilityLabel="Cari praktik atau tenaga kesehatan"
        style={styles.input}
      />
      {value ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={10} accessibilityRole="button" accessibilityLabel="Hapus pencarian">
          <Ionicons name="close-circle" size={20} color={colors.textFaint} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 54,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  flex: { flex: 1 },
  input: { flex: 1, fontSize: fontSize.body, color: colors.text, paddingVertical: 12 },
});
