
import getDynamicContextArgHelperFactory from './dynanic-context-arg-helper';

const helper = getDynamicContextArgHelperFactory(function sampleContextArgHelper(params, named, i18nContext) {
  // Helper has access to context here.
  return i18nContext.locale;
}, 'i18n');

export default helper;
