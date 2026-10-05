import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fontSize, radius, spacing } from '@/constants/theme';

import { AppText } from './AppText';

type Props = {
  label: string;
  value: string | null;
  options: readonly string[];
  placeholder?: string;
  onChange: (value: string | null) => void;
  optional?: boolean;
};

/** A field that opens a searchable list (e.g. provinces). */
export function SelectField({ label, value, options, placeholder = 'Pilih', onChange, optional }: Props) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const shown = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(filter.trim().toLowerCase())),
    [options, filter],
  );

  const close = () => {
    setOpen(false);
    setFilter('');
  };

  return (
    <View style={styles.wrap}>
      <AppText variant="smallStrong">
        {label}
        {optional ? <AppText variant="small"> (opsional)</AppText> : null}
      </AppText>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value ?? placeholder}`}
        style={({ pressed }) => [styles.box, pressed && { borderColor: colors.primary }]}>
        <AppText color={value ? colors.text : colors.textFaint} style={styles.value} numberOfLines={1}>
          {value ?? placeholder}
        </AppText>
        <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
      </Pressable>

      <Modal visible={open} animationType="slide" onRequestClose={close}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <AppText variant="h2" style={styles.value}>
              {label}
            </AppText>
            <Pressable onPress={close} hitSlop={10} accessibilityRole="button" accessibilityLabel="Tutup">
              <Ionicons name="close" size={28} color={colors.text} />
            </Pressable>
          </View>
          <View style={styles.search}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              value={filter}
              onChangeText={setFilter}
              placeholder="Cari…"
              placeholderTextColor={colors.textFaint}
              style={styles.searchInput}
              autoCorrect={false}
            />
          </View>
          <FlatList
            data={shown}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              value && optional ? (
                <Pressable
                  onPress={() => {
                    onChange(null);
                    close();
                  }}
                  style={styles.option}>
                  <AppText color={colors.danger}>Kosongkan</AppText>
                </Pressable>
              ) : null
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onChange(item);
                  close();
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: item === value }}
                style={({ pressed }) => [styles.option, pressed && { backgroundColor: colors.primarySoft }]}>
                <AppText variant={item === value ? 'bodyStrong' : 'body'} style={styles.value}>
                  {item}
                </AppText>
                {item === value ? <Ionicons name="checkmark" size={22} color={colors.primary} /> : null}
              </Pressable>
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  box: {
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  value: { flex: 1 },
  modal: { flex: 1, backgroundColor: colors.surface },
  modalHeader: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },
  searchInput: { flex: 1, minHeight: 46, fontSize: fontSize.body, color: colors.text },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
});
