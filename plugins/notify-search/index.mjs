// Netlify Build Plugin — ping IndexNow after a successful deploy
// IndexNow notifies Bing, Yandex, DuckDuckGo, Naver of new/updated URLs
import { notifySearchEngines } from '../../scripts/notify-search-engines.mjs';

export const onSuccess = async ({ utils }) => {
  try {
    const result = await notifySearchEngines();
    if (result?.skipped) return;
    if (!result.ok) {
      // Don't fail the deploy on indexnow errors — it's best-effort
      utils.status.show({
        title: 'IndexNow ping returned non-2xx',
        summary: `HTTP ${result.status} ${result.statusText}`,
        text: 'Bing/Yandex notification failed. Site is deployed normally.',
      });
    }
  } catch (err) {
    console.warn('[indexnow plugin] Non-fatal error:', err.message);
  }
};
