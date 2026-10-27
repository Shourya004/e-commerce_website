import { ActivatedRoute } from '@angular/router';

export function getSafeReturnUrl(route: ActivatedRoute): string | null {
  const url = route.snapshot.queryParamMap.get('returnUrl');
  return url && url.startsWith('/') && !url.startsWith('//') ? url : null;
}
