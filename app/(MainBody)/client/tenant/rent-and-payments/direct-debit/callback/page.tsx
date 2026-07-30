'use client';

import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  clearDirectDebitSessionToken,
  getDirectDebitSessionToken,
} from '@/lib/storedirectdebitsessiontoken';
import { useCompleteDirectDebitMutation } from '@/store/api/endpoints/client/Tenant/PaymentsApi/PaymentsApi';

const RENT_AND_PAYMENTS_URL = '/client/tenant/rent-and-payments';

type CompletionState = 'loading' | 'success' | 'error';

export default function DirectDebitCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [completeDirectDebit] = useCompleteDirectDebitMutation();

  // Always start "loading" on both server and client. redirect_flow_id/
  // sessionToken depend on window/sessionStorage, which don't exist during
  // SSR - so that check has to happen inside the effect (client-only),
  // not during render, or the server and client would disagree on the
  // first render and React would flag a hydration mismatch.
  const [state, setState] = useState<CompletionState>('loading');
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const redirectFlowId = searchParams.get('redirect_flow_id');
    const sessionToken = getDirectDebitSessionToken();

    const promise =
      redirectFlowId && sessionToken
        ? completeDirectDebit({
            redirect_flow_id: redirectFlowId,
            session_token: sessionToken,
          }).unwrap()
        : Promise.reject(
            new Error('Missing redirect_flow_id or session token'),
          );

    promise
      .then(() => {
        clearDirectDebitSessionToken();
        setState('success');
      })
      .catch((error: unknown) => {
        console.error('Failed to complete Direct Debit setup:', error);
        setState('error');
      });
  }, [searchParams, completeDirectDebit]);

  return (
    <div className='mx-auto flex max-w-md flex-col items-center gap-4 p-10 text-center'>
      {state === 'loading' && (
        <>
          <Loader2 className='text-primary h-8 w-8 animate-spin' />
          <p className='text-muted-foreground text-sm'>
            Confirming your Direct Debit setup…
          </p>
        </>
      )}

      {state === 'success' && (
        <>
          <CheckCircle2 className='text-success h-8 w-8' />
          <p className='font-medium'>Direct Debit set up successfully</p>
          <p className='text-muted-foreground text-sm'>
            Your rent will now be collected automatically each month.
          </p>
          <Button onClick={() => router.replace(RENT_AND_PAYMENTS_URL)}>
            Back to dashboard
          </Button>
        </>
      )}

      {state === 'error' && (
        <>
          <XCircle className='text-danger h-8 w-8' />
          <p className='font-medium'>
            Couldn&apos;t confirm Direct Debit setup
          </p>
          <p className='text-muted-foreground text-sm'>
            Something went wrong finishing the setup. Please try again.
          </p>
          <Button
            variant='outline'
            onClick={() => router.replace(RENT_AND_PAYMENTS_URL)}
          >
            Back to dashboard
          </Button>
        </>
      )}
    </div>
  );
}
