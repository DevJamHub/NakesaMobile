// Profile fields shared by onboarding and "Ubah Profil". Values and checks: patient-form.ts.
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { DateField } from '@/components/ui/DateField';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import { GENDERS, PROVINCES } from '@/constants/config';
import { spacing } from '@/constants/theme';

import type { PatientFormErrors, PatientFormValues } from './patient-form';

type Props = {
  values: PatientFormValues;
  errors: PatientFormErrors;
  onChange: (values: PatientFormValues) => void;
  /** Name, phone and address (asked during onboarding only when missing, e.g. after Google sign-in). */
  withIdentity: boolean;
};

export function PatientFormFields({ values, errors, onChange, withIdentity }: Props) {
  const set = <K extends keyof PatientFormValues>(key: K, value: PatientFormValues[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <View style={styles.fields}>
      {withIdentity ? (
        <>
          <TextField
            label="Nama lengkap"
            value={values.fullName}
            onChangeText={(t) => set('fullName', t)}
            autoCapitalize="words"
            autoComplete="name"
            maxLength={120}
            error={errors.fullName}
          />
          <TextField
            label="Nomor HP (WhatsApp)"
            value={values.phone}
            onChangeText={(t) => set('phone', t)}
            keyboardType="phone-pad"
            autoComplete="tel"
            maxLength={20}
            error={errors.phone}
            hint="Dipakai praktik untuk mengonfirmasi janji temu."
          />
        </>
      ) : null}
      <DateField
        label="Tanggal lahir"
        value={values.birthDate}
        onChange={(t) => set('birthDate', t)}
        error={errors.birthDate}
        optional
      />
      <View style={styles.group}>
        <AppText variant="smallStrong">
          Jenis kelamin <AppText variant="small">(opsional)</AppText>
        </AppText>
        <View style={styles.chips}>
          {GENDERS.map((g) => (
            <Chip
              key={g.value}
              label={g.label}
              selected={values.gender === g.value}
              onPress={() => set('gender', values.gender === g.value ? null : g.value)}
              style={styles.chip}
            />
          ))}
        </View>
      </View>
      {withIdentity ? (
        <TextField
          label="Alamat"
          value={values.address}
          onChangeText={(t) => set('address', t)}
          autoComplete="street-address"
          maxLength={300}
          optional
        />
      ) : null}
      <TextField
        label="Kota/Kabupaten"
        value={values.city}
        onChangeText={(t) => set('city', t)}
        autoCapitalize="words"
        maxLength={80}
        placeholder="Misal: Surabaya"
        hint="Untuk menampilkan praktik di dekat Anda."
        optional
      />
      <SelectField
        label="Provinsi"
        value={values.province}
        options={PROVINCES}
        placeholder="Pilih provinsi"
        onChange={(v) => set('province', v)}
        optional
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fields: { gap: spacing.lg },
  group: { gap: 6 },
  chips: { flexDirection: 'row', gap: spacing.sm },
  chip: { flex: 1 },
});
