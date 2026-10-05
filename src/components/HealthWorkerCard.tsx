import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { healthWorkerName, professionColor } from '@/features/practice/profession';
import type { HealthWorker } from '@/types/domain';

import { AppText } from './ui/AppText';
import { Avatar } from './ui/Avatar';
import { Card } from './ui/Card';

export function HealthWorkerCard({ worker, onPress }: { worker: HealthWorker; onPress?: () => void }) {
  const name = healthWorkerName(worker);
  return (
    <Card onPress={onPress} accessibilityLabel={`${name}, ${worker.profession?.label ?? 'Tenaga kesehatan'}`}>
      <View style={styles.row}>
        <Avatar name={worker.full_name} uri={worker.avatar_url} color={professionColor(worker.profession)} />
        <View style={styles.body}>
          <AppText variant="bodyStrong" numberOfLines={1}>
            {name}
          </AppText>
          <AppText variant="small">{worker.profession?.label ?? 'Tenaga kesehatan'}</AppText>
        </View>
        {onPress ? <Ionicons name="chevron-forward" size={20} color={colors.textFaint} /> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  body: { flex: 1, gap: 2 },
});
