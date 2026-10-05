// Step 1–3 of booking: service → date → free time. Step 4 is booking/confirm.
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ServiceCard } from '@/components/ServiceCard';
import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { BOOKING_DAYS_AHEAD } from '@/constants/config';
import { colors, radius, spacing } from '@/constants/theme';
import { getAvailableSlots } from '@/features/appointment/appointment-service';
import { getPractice } from '@/features/practice/practice-service';
import { useAsync } from '@/hooks/useAsync';
import { useRevalidateOnFocus } from '@/hooks/useRevalidateOnFocus';
import { DAYS_SHORT, MONTHS_SHORT, dayOfWeek, formatDate, shortTime, todayWIB } from '@/lib/format';
import type { Service, TimeSlot } from '@/types/domain';

const serviceKey = (s: Service) => s.id ?? `name:${s.name}`;

export default function ChooseScheduleScreen() {
  const { practiceId, healthWorkerId, healthWorkerName } = useLocalSearchParams<{
    practiceId: string;
    healthWorkerId?: string;
    healthWorkerName?: string;
  }>();
  const practice = useAsync(() => getPractice(practiceId), practiceId);

  const [serviceChoice, setServiceChoice] = useState<string | null>(null);
  const [dateChoice, setDateChoice] = useState<string | null>(null);
  const [slot, setSlot] = useState<TimeSlot | null>(null);

  const services = useMemo(() => practice.data?.services ?? [], [practice.data]);
  const openDays = useMemo(() => new Set(practice.data?.hours.map((h) => h.day)), [practice.data]);
  const dates = useMemo(
    () =>
      Array.from({ length: BOOKING_DAYS_AHEAD + 1 }, (_, i) => todayWIB(i)).map((iso) => ({
        iso,
        open: openDays.has(dayOfWeek(iso)),
      })),
    [openDays],
  );

  // A single service is picked for the patient; otherwise they choose.
  const service = services.length === 1 ? services[0] : services.find((s) => serviceKey(s) === serviceChoice) ?? null;
  const needsService = services.length > 0;
  const date = dateChoice ?? dates.find((d) => d.open)?.iso ?? null;
  const ready = !!date && (!needsService || !!service) && !!practice.data?.booking_enabled;

  const slots = useAsync(
    () => getAvailableSlots(practiceId, date!, service?.id ?? null),
    `${practiceId}:${date}:${service ? serviceKey(service) : ''}`,
    ready,
  );
  // Back from the confirmation (e.g. the time was just taken by someone else): show fresh times.
  useRevalidateOnFocus(slots.revalidate);

  if (practice.loading) return <LoadingState />;
  if (practice.error || !practice.data) return <ErrorState message={practice.error} onRetry={practice.reload} />;

  const p = practice.data;
  if (!p.booking_enabled) {
    return (
      <EmptyState
        icon="lock-closed-outline"
        title="Booking online ditutup"
        message="Praktik ini sedang tidak menerima janji temu lewat aplikasi. Hubungi praktik langsung."
      />
    );
  }

  const freeSlots = slots.data?.filter((s) => s.available) ?? [];
  // The chosen time only counts while it is still free in the latest list.
  const chosen = slot && freeSlots.some((s) => s.start === slot.start) ? slot : null;

  const next = () => {
    if (!date || !chosen) return;
    router.push({
      pathname: '/booking/confirm',
      params: {
        practiceId,
        date,
        time: chosen.start,
        endTime: chosen.end,
        serviceId: service?.id ?? '',
        serviceName: service?.name ?? '',
        healthWorkerId: healthWorkerId ?? '',
        healthWorkerName: healthWorkerName ?? '',
      },
    });
  };

  return (
    <Screen
      edges={['bottom']}
      footer={
        <>
          {chosen && date ? (
            <AppText variant="small" center>
              {formatDate(date)}, jam {shortTime(chosen.start)}
            </AppText>
          ) : null}
          <PrimaryButton title="Lanjut" onPress={next} disabled={!chosen} />
        </>
      }>
      <View>
        <AppText variant="h2">{p.name}</AppText>
        {healthWorkerName ? <AppText variant="small">Dengan {healthWorkerName}</AppText> : null}
      </View>

      {needsService ? (
        <View>
          <SectionHeader title="1. Pilih layanan" />
          <View style={styles.list}>
            {services.map((s) => (
              <ServiceCard
                key={serviceKey(s)}
                service={s}
                selected={!!service && serviceKey(service) === serviceKey(s)}
                onPress={() => {
                  setServiceChoice(serviceKey(s));
                  setSlot(null);
                }}
              />
            ))}
          </View>
        </View>
      ) : null}

      <View>
        <SectionHeader title={needsService ? '2. Pilih tanggal' : '1. Pilih tanggal'} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dates}>
          {dates.map((d) => {
            const selected = d.iso === date;
            const [, m, day] = d.iso.split('-').map(Number);
            return (
              <Pressable
                key={d.iso}
                disabled={!d.open}
                onPress={() => {
                  setDateChoice(d.iso);
                  setSlot(null);
                }}
                accessibilityRole="button"
                accessibilityLabel={`${formatDate(d.iso)}${d.open ? '' : ', praktik tutup'}`}
                accessibilityState={{ selected, disabled: !d.open }}
                style={[styles.date, selected && styles.dateSelected, !d.open && styles.dateClosed]}>
                <AppText variant="caption" color={selected ? '#FFFFFF' : d.open ? colors.textMuted : colors.textFaint}>
                  {d.iso === todayWIB() ? 'Hari ini' : DAYS_SHORT[dayOfWeek(d.iso)]}
                </AppText>
                <AppText variant="h2" color={selected ? '#FFFFFF' : d.open ? colors.text : colors.textFaint}>
                  {day}
                </AppText>
                <AppText variant="caption" color={selected ? '#FFFFFF' : d.open ? colors.textMuted : colors.textFaint}>
                  {d.open ? MONTHS_SHORT[m - 1] : 'Tutup'}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View>
        <SectionHeader title={needsService ? '3. Pilih jam' : '2. Pilih jam'} />
        {!date ? (
          <AppText variant="small">Belum ada tanggal praktik yang bisa dipilih. Hubungi praktik langsung.</AppText>
        ) : !ready ? (
          <AppText variant="small">Pilih layanan dulu untuk melihat jam yang tersedia.</AppText>
        ) : slots.loading ? (
          <LoadingState fill={false} message="Mencari jam kosong…" />
        ) : slots.error ? (
          <ErrorState message={slots.error} onRetry={slots.reload} fill={false} />
        ) : freeSlots.length === 0 ? (
          <EmptyState
            icon="time-outline"
            title="Tidak ada jam kosong"
            message="Semua jam di tanggal ini sudah terisi atau sudah lewat. Pilih tanggal lain."
            fill={false}
          />
        ) : (
          <View style={styles.slots}>
            {slots.data?.map((s) => (
              <Chip
                key={s.start}
                label={shortTime(s.start)}
                disabled={!s.available}
                selected={chosen?.start === s.start}
                onPress={() => setSlot(s)}
                style={styles.slot}
              />
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
  dates: { gap: spacing.sm, paddingRight: spacing.lg },
  date: {
    width: 64,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  dateSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  dateClosed: { backgroundColor: colors.neutralSoft, borderColor: colors.neutralSoft },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slot: { minWidth: 76 },
});
