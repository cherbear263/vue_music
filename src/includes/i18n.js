import { createI18n } from 'vue-i18n/index';

/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`,
 *  which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
function loadLocaleMessages() {
  const locales = require.context('../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key).default;
    }
  });
  return messages;
}

export default createI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en-AUD',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages(),
  numberFormats: { // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
    AUD: {
      currency: { style: 'currency', currency: 'AUD' }, // see https://vue-i18n-next.intlify.dev/guide/essentials/number.html
    },
    'ja-JP': {
      currency: { style: 'currency', currency: 'JPY' },
    },
    en: {
      currency: { style: 'currency', currency: 'AUD' },
    },
  },
});
