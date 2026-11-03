'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  SUPPORT_CONTACT_CHANNELS,
  SUPPORT_EMAIL,
  SUPPORT_FAQS,
} from '@/data/common/LegalPages/LegalPagesData';
import { getSupportTicketsUrl } from '@/utils/redirectPath';
import { LifeBuoy, Mail, Ticket } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const SupportPage: React.FC = () => {
  const { data: session } = useSession();
  const supportTicketsUrl = getSupportTicketsUrl(session);

  return (
    <div className='space-y-12'>
      {/* Heading */}
      <div className='text-center'>
        <div className='bg-primary/10 text-primary mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full'>
          <LifeBuoy className='h-8 w-8' />
        </div>
        <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>
          How can we help?
        </h1>
        <p className='text-muted-foreground mx-auto mt-3 max-w-xl'>
          Find quick answers below, or get in touch with the Landkeeper support
          team.
        </p>
        <div className='mt-6 flex flex-col justify-center gap-3 sm:flex-row'>
          {supportTicketsUrl && (
            <Button asChild>
              <Link href={supportTicketsUrl}>
                <Ticket />
                Open a support ticket
              </Link>
            </Button>
          )}
          <Button asChild variant={supportTicketsUrl ? 'outline' : 'default'}>
            <a href={`mailto:${SUPPORT_EMAIL}`}>
              <Mail />
              Email support
            </a>
          </Button>
        </div>
      </div>

      {/* Contact channels */}
      <div className='grid gap-4 sm:grid-cols-2'>
        {SUPPORT_CONTACT_CHANNELS.map((channel) => (
          <Card key={channel.title}>
            <CardHeader>
              <div className='bg-primary/10 text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-lg'>
                <channel.icon className='h-5 w-5' />
              </div>
              <CardTitle>{channel.title}</CardTitle>
              <CardDescription>{channel.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {channel.href ? (
                <a
                  href={channel.href}
                  className='text-primary text-sm font-medium break-all hover:underline'
                >
                  {channel.value}
                </a>
              ) : (
                <p className='text-sm font-medium'>{channel.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQs */}
      <div>
        <h2 className='mb-4 text-xl font-semibold tracking-tight'>
          Frequently asked questions
        </h2>
        <Card>
          <CardContent>
            <Accordion type='single' collapsible>
              {SUPPORT_FAQS.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent className='text-muted-foreground'>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;
