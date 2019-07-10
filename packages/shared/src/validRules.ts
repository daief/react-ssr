import i18next from 'i18next';

export function requiredRule(t: i18next.TFunction, field: string) {
  return {
    required: true,
    message: t('valid:rule.required', { field }),
  };
}
