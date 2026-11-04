'use client';

import PublicPageHero from '@/components/common/LegalPages/PublicPageHero';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  SUPPORT_CONTACT_CHANNELS,
  SUPPORT_EMAIL,
  SUPPORT_FAQS,
} from '@/data/common/LegalPages/LegalPagesData';
import { SupportContactChannel } from '@/types/common/LegalPages/LegalPagesTypes';
import { getSupportTicketsUrl } from '@/utils/redirectPath';
import { ArrowRight, LifeBuoy, Mail, Ticket } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const SupportPage: React.FC = () => {
  const { data: session } = useSession();
  const supportTicketsUrl = getSupportTicketsUrl(session);

  const channels: SupportContactChannel[] = supportTicketsUrl
    ? [
        {
          icon: Ticket,
          title: 'Raise a ticket',
          description: 'Track your request and replies from your dashboard.',
          value: 'Go to support tickets',
          href: supportTicketsUrl,
          isInternal: true,
        },
        ...SUPPORT_CONTACT_CHANNELS,
      ]
    : SUPPORT_CONTACT_CHANNELS;

  return (
    <>
      <PublicPageHero
        icon={LifeBuoy}
        eyebrow='Help centre'
        title='How can we help?'
        description='Browse our frequently asked questions, or get in touch with the Landkeeper support team.'
      />

      <div className='space-y-16 px-4 py-12 md:px-6 md:py-16 xl:px-12'>
        {/* Contact channels */}
        <section>
          <div className='mb-6'>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Get in touch
            </h2>
            <p className='text-muted-foreground mt-1'>
              Choose the option that works best for you.
            </p>
          </div>
          <div
            className={`grid gap-4 md:grid-cols-2 ${channels.length > 2 ? 'xl:grid-cols-3' : ''}`}
          >
            {channels.map((channel) => {
              const content = (
                <>
                  <div className='bg-primary/10 text-primary mb-5 flex h-12 w-12 items-center justify-center rounded-xl'>
                    <channel.icon className='h-6 w-6' />
                  </div>
                  <h3 className='text-lg font-semibold'>{channel.title}</h3>
                  <p className='text-muted-foreground mt-1 text-sm'>
                    {channel.description}
                  </p>
                  <p className='mt-5 flex items-center gap-2 text-sm font-medium break-all'>
                    <span className={channel.href ? 'text-primary' : ''}>
                      {channel.value}
                    </span>
                    {channel.href && (
                      <ArrowRight className='text-primary h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1' />
                    )}
                  </p>
                </>
              );
              const cardClassName =
                'group bg-card relative rounded-2xl border p-6 transition-all';

              if (!channel.href) {
                return (
                  <div key={channel.title} className={cardClassName}>
                    {content}
                  </div>
                );
              }

              const linkClassName = `${cardClassName} hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md`;
              return channel.isInternal ? (
                <Link
                  key={channel.title}
                  href={channel.href}
                  className={linkClassName}
                >
                  {content}
                </Link>
              ) : (
                <a
                  key={channel.title}
                  href={channel.href}
                  className={linkClassName}
                >
                  {content}
                </a>
              );
            })}
          </div>
        </section>

        {/* FAQs */}
        <section className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14'>
          <div>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Frequently asked questions
            </h2>
            <p className='text-muted-foreground mt-2'>
              Quick answers to the questions we hear most often.
            </p>
            <div className='bg-muted/50 mt-6 rounded-2xl border p-5'>
              <p className='font-medium'>Can&rsquo;t find what you need?</p>
              <p className='text-muted-foreground mt-1 text-sm'>
                Our team usually replies within one working day.
              </p>
              <Button asChild variant='outline' size='sm' className='mt-4'>
                <a href={`mailto:${SUPPORT_EMAIL}`}>
                  <Mail />
                  Contact support
                </a>
              </Button>
            </div>
          </div>

          <div className='bg-card rounded-2xl border px-6 py-2'>
            <Accordion type='single' collapsible>
              {SUPPORT_FAQS.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger className='cursor-pointer py-5 text-base hover:no-underline'>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className='text-muted-foreground pb-5 leading-relaxed'>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </div>
    </>
  );
};

export default SupportPage;
