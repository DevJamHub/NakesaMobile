import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { durationLabel, priceLabel } from '@/lib/format';
import type { Service } from '@/types/domain';

import { AppText } from './ui/AppText';
import { Card } from './ui/Card';

type Props = { service: Service; selected?: boolean; onPress?: () => void };

export function ServiceCard({ service, selected, onPress }: Props) {
  return (
    <Card onPress={onPress} selected={onPress ? !!selected : undefined} accessibilityLabel={service.name}>
      <View style={styles.row}>
        <View style={styles.body}>
          <AppText variant="bodyStrong">{service.name}</AppText>
          {service.description ? <AppText variant="small">{service.description}</AppText> : null}
          <View style={styles.meta}>
            <AppText variant="smallStrong" color={service.price === null ? colors.textMuted : colors.primary}>
              {priceLabel(service.price)}
            </AppText>
            {service.id ? (
              <AppText variant="small">
                {'· '}
                {durationLabel(service.duration_minutes)}
              </AppText>
            ) : null}
          </View>
        </View>
        {onPress ? (
          <Ionicons
            name={selected ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color={selected ? colors.primary : colors.textFaint}
          />
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  body: { flex: 1, gap: 3 },
  meta: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
});
