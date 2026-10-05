// Design tokens: calm medical teal, lots of white space, large readable text.
export const colors = {
  primary: '#0F766E',
  primaryPressed: '#0B5E58',
  primarySoft: '#E6F4F1',
  background: '#F4F7F6',
  surface: '#FFFFFF',
  text: '#10201D',
  textMuted: '#5B6C69',
  textFaint: '#8C9B98',
  border: '#E0E8E6',
  success: '#15803D',
  successSoft: '#E8F6EC',
  warning: '#B45309',
  warningSoft: '#FDF3E3',
  danger: '#B42318',
  dangerSoft: '#FDECEA',
  info: '#1D5FB4',
  infoSoft: '#E8F0FB',
  neutral: '#5B6C69',
  neutralSoft: '#EEF2F1',
  whatsapp: '#1F9D55',
} as const;

export type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export const toneColors: Record<Tone, { fg: string; bg: string }> = {
  primary: { fg: colors.primary, bg: colors.primarySoft },
  success: { fg: colors.success, bg: colors.successSoft },
  warning: { fg: colors.warning, bg: colors.warningSoft },
  danger: { fg: colors.danger, bg: colors.dangerSoft },
  info: { fg: colors.info, bg: colors.infoSoft },
  neutral: { fg: colors.neutral, bg: colors.neutralSoft },
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 } as const;

export const fontSize = { title: 26, h2: 20, h3: 17, body: 16, small: 14, tiny: 12 } as const;

export const shadow = {
  shadowColor: '#0B2B27',
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
} as const;
