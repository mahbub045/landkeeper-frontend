'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  useGetStripeConnectStatusQuery,
  useLazyGetStripeAccountSetupLinkQuery,
  useLazySetStripeOAuthCodeQuery,
} from '@/store/api/endpoints/common/ProfileSettings/StripeAccountSetupApi';
import { CheckCircle2, CircleDashed, ExternalLink, Trash } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Loading from '../../CustomLoader/Loading';
import DisconnectStripeDialog from './Dialogs/DisconnectStripeDialog';

const REQUIREMENTS = [
  { key: 'details_submitted', label: 'Business details submitted' },
  { key: 'charges_enabled', label: 'Charges enabled' },
  { key: 'payouts_enabled', label: 'Payouts enabled' },
] as const;

const StripeAccountSetup: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    data: stripeStatus,
    isLoading: isStripeStatusLoading,
    refetch: refetchStripeStatus,
  } = useGetStripeConnectStatusQuery(undefined);

  const [triggerGetSetupLink, { isFetching: isSetupLinkLoading }] =
    useLazyGetStripeAccountSetupLinkQuery();
  const [triggerSetOAuthCode, { isFetching: isCompletingOAuth }] =
    useLazySetStripeOAuthCodeQuery();

  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);

  const hasHandledCallback = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const scope = searchParams.get('scope');

    if (!code || !state || !scope || hasHandledCallback.current) return;
    hasHandledCallback.current = true;

    triggerSetOAuthCode({ scope, code, state })
      .unwrap()
      .then(() => {
        toast.success('Stripe account connected successfully.');
        refetchStripeStatus();
      })
      .catch(() => {
        toast.error('Could not complete Stripe setup. Please try again.');
      })
      .finally(() => {
        router.replace('/client/profile-settings');
      });
  }, [searchParams, triggerSetOAuthCode, refetchStripeStatus, router]);

  const handleConnect = async () => {
    const result = await triggerGetSetupLink(undefined);
    if (result.data?.authorize_url) {
      window.location.href = result.data.authorize_url;
    } else {
      toast.error('Could not start Stripe setup. Please try again.');
    }
  };

  const completedCount = REQUIREMENTS.filter(
    (r) => !!stripeStatus?.[r.key],
  ).length;
  const isFullySetup = completedCount === REQUIREMENTS.length;
  const progressValue = (completedCount / REQUIREMENTS.length) * 100;

  return (
    <>
      <div className='mt-6 mb-5'>
        <h1 className='text-foreground text-xl font-semibold tracking-tight'>
          Stripe Account
        </h1>
        <p className='text-muted-foreground mt-0.5 text-sm'>
          Connect your Stripe account to receive rent payments and payouts.
        </p>
      </div>

      <Card className='pt-0'>
        <CardHeader className='border-b pt-6 pb-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-foreground text-sm font-bold'>
                Connection status
              </p>
              <p className='text-muted-foreground mt-0.5 text-xs'>
                {isCompletingOAuth
                  ? 'Finalizing your Stripe connection…'
                  : isStripeStatusLoading
                    ? 'Checking your Stripe account…'
                    : isFullySetup
                      ? 'Your Stripe account is fully set up.'
                      : 'Finish onboarding to start accepting payments.'}
              </p>
            </div>
            {!isStripeStatusLoading && !isCompletingOAuth && (
              <Badge variant={isFullySetup ? 'success' : 'warningLight'}>
                {isFullySetup ? 'Connected' : 'Action needed'}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className='p-6'>
          {isStripeStatusLoading || isCompletingOAuth ? (
            <div className='flex h-24 items-center justify-center'>
              <Loading />
            </div>
          ) : (
            <div className='space-y-5'>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-xs font-medium'>
                    Setup progress
                  </span>
                  <span className='text-muted-foreground text-xs'>
                    {completedCount}/{REQUIREMENTS.length} complete
                  </span>
                </div>
                <Progress value={progressValue} />
              </div>

              <div className='divide-border divide-y'>
                {REQUIREMENTS.map((req) => {
                  const done = !!stripeStatus?.[req.key];
                  return (
                    <div
                      key={req.key}
                      className='flex items-center gap-2.5 py-3 first:pt-0 last:pb-0'
                    >
                      {done ? (
                        <CheckCircle2 className='text-success size-4 shrink-0' />
                      ) : (
                        <CircleDashed className='text-muted-foreground size-4 shrink-0' />
                      )}
                      <span
                        className={
                          done
                            ? 'text-foreground text-sm'
                            : 'text-muted-foreground text-sm'
                        }
                      >
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className='flex items-center justify-end gap-3'>
                {isFullySetup ? (
                  <Button
                    variant='destructive'
                    onClick={() => setIsDisconnectDialogOpen(true)}
                    className='w-full sm:w-auto'
                  >
                    <Trash />
                    Disconnect Stripe account
                  </Button>
                ) : (
                  <Button
                    onClick={handleConnect}
                    disabled={isSetupLinkLoading}
                    className='w-full sm:w-auto'
                  >
                    {isSetupLinkLoading ? (
                      <Loading size={16} className='text-primary-foreground' />
                    ) : (
                      <ExternalLink data-icon='inline-start' />
                    )}
                    {isSetupLinkLoading
                      ? 'Redirecting to Stripe…'
                      : stripeStatus?.details_submitted
                        ? 'Continue setup on Stripe'
                        : 'Connect with Stripe'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <DisconnectStripeDialog
        open={isDisconnectDialogOpen}
        onOpenChange={setIsDisconnectDialogOpen}
        onDisconnected={refetchStripeStatus}
      />
    </>
  );
};

export default StripeAccountSetup;
