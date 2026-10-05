import { Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { initials } from '@/lib/format';

type Props = { name?: string | null; uri?: string | null; size?: number; color?: string; emoji?: string };

/** Photo when there is one, otherwise an emoji or the initials on a soft circle. */
export function Avatar({ name, uri, size = 48, color = colors.primary, emoji }: Props) {
  const circle = { width: size, height: size, borderRadius: size / 2 };
  if (uri) return <Image source={{ uri }} style={[circle, styles.image]} accessibilityIgnoresInvertColors />;
  return (
    <View style={[circle, styles.fallback, { backgroundColor: `${color}1F` }]}>
      <Text style={{ fontSize: size * (emoji ? 0.48 : 0.38), fontWeight: '700', color }}>{emoji ?? initials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.border },
  fallback: { alignItems: 'center', justifyContent: 'center' },
});
