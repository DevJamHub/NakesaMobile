import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors, fontSize } from '@/constants/theme';

type Variant = 'title' | 'h2' | 'h3' | 'body' | 'bodyStrong' | 'small' | 'smallStrong' | 'caption';

type Props = TextProps & { variant?: Variant; color?: string; center?: boolean };

export function AppText({ variant = 'body', color, center, style, ...rest }: Props) {
  return (
    <Text
      style={[styles.base, styles[variant], color ? { color } : null, center ? styles.center : null, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: { color: colors.text, fontSize: fontSize.body, lineHeight: 22 },
  title: { fontSize: fontSize.title, lineHeight: 32, fontWeight: '700', letterSpacing: -0.3 },
  h2: { fontSize: fontSize.h2, lineHeight: 26, fontWeight: '700' },
  h3: { fontSize: fontSize.h3, lineHeight: 23, fontWeight: '600' },
  body: {},
  bodyStrong: { fontWeight: '600' },
  small: { fontSize: fontSize.small, lineHeight: 20, color: colors.textMuted },
  smallStrong: { fontSize: fontSize.small, lineHeight: 20, fontWeight: '600' },
  caption: { fontSize: fontSize.tiny, lineHeight: 16, color: colors.textMuted },
  center: { textAlign: 'center' },
});
