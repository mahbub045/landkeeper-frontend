import { CreditCard } from 'lucide-react';

function VisaLogo() {
  return (
    <svg viewBox='0 0 48 32' className='h-5 w-8' aria-hidden='true'>
      <rect width='48' height='32' rx='4' className='fill-[#1434CB]' />
      <text
        x='24'
        y='21'
        textAnchor='middle'
        className='fill-white text-[13px] font-bold italic'
        fontFamily='Arial, sans-serif'
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg viewBox='0 0 48 32' className='h-5 w-8' aria-hidden='true'>
      <rect width='48' height='32' rx='4' className='fill-[#f4f4f5]' />
      <circle cx='19' cy='16' r='9' className='fill-[#EB001B]' />
      <circle cx='29' cy='16' r='9' className='fill-[#F79E1B]' opacity='0.9' />
    </svg>
  );
}

function AmexLogo() {
  return (
    <svg viewBox='0 0 48 32' className='h-5 w-8' aria-hidden='true'>
      <rect width='48' height='32' rx='4' className='fill-[#2E77BC]' />
      <text
        x='24'
        y='20'
        textAnchor='middle'
        className='fill-white text-[9px] font-bold'
        fontFamily='Arial, sans-serif'
      >
        AMEX
      </text>
    </svg>
  );
}

function DiscoverLogo() {
  return (
    <svg viewBox='0 0 48 32' className='h-5 w-8' aria-hidden='true'>
      <rect width='48' height='32' rx='4' className='fill-[#f4f4f5]' />
      <text
        x='24'
        y='19'
        textAnchor='middle'
        className='fill-[#111827] text-[8px] font-bold'
        fontFamily='Arial, sans-serif'
      >
        DISCOVER
      </text>
      <circle cx='38' cy='16' r='6' className='fill-[#FF6000]' opacity='0.85' />
    </svg>
  );
}

function DinersLogo() {
  return (
    <svg viewBox='0 0 48 32' className='h-5 w-8' aria-hidden='true'>
      <rect width='48' height='32' rx='4' className='fill-[#0079BE]' />
      <circle cx='24' cy='16' r='9' className='fill-white' />
      <circle cx='24' cy='16' r='6' className='fill-[#0079BE]' />
    </svg>
  );
}

function JcbLogo() {
  return (
    <svg viewBox='0 0 48 32' className='h-5 w-8' aria-hidden='true'>
      <rect width='48' height='32' rx='4' className='fill-white' />
      <rect
        x='1'
        y='1'
        width='46'
        height='30'
        rx='3'
        className='fill-none stroke-[#e5e7eb]'
        strokeWidth='1'
      />
      <rect x='13' y='7' width='7' height='18' rx='2' className='fill-[#0E9F6E]' />
      <rect x='20.5' y='7' width='7' height='18' rx='2' className='fill-[#E1001A]' />
      <rect x='28' y='7' width='7' height='18' rx='2' className='fill-[#0B4EA2]' />
      <text
        x='24'
        y='20'
        textAnchor='middle'
        className='fill-white text-[9px] font-bold italic'
        fontFamily='Arial, sans-serif'
      >
        JCB
      </text>
    </svg>
  );
}

function UnionPayLogo() {
  return (
    <svg viewBox='0 0 48 32' className='h-5 w-8' aria-hidden='true'>
      <rect width='48' height='32' rx='4' className='fill-[#f4f4f5]' />
      <rect x='8' y='8' width='10' height='16' className='fill-[#E21836]' />
      <rect x='19' y='8' width='10' height='16' className='fill-[#00447C]' />
      <rect x='30' y='8' width='10' height='16' className='fill-[#007B84]' />
    </svg>
  );
}

const CARD_BRAND_LOGOS: Record<string, React.ComponentType> = {
  visa: VisaLogo,
  mastercard: MastercardLogo,
  amex: AmexLogo,
  american_express: AmexLogo,
  discover: DiscoverLogo,
  diners: DinersLogo,
  diners_club: DinersLogo,
  jcb: JcbLogo,
  unionpay: UnionPayLogo,
  union_pay: UnionPayLogo,
};

export default function CardBrandLogo({
  brand,
  className,
}: {
  brand: string;
  className?: string;
}) {
  const Logo = CARD_BRAND_LOGOS[brand.toLowerCase()];

  if (!Logo) {
    return (
      <div
        className={
          className ??
          'bg-muted flex size-9 shrink-0 items-center justify-center'
        }
      >
        <CreditCard
          className='text-muted-foreground size-4'
          aria-hidden='true'
        />
      </div>
    );
  }

  return (
    <div
      className={
        className ?? 'flex size-9 shrink-0 items-center justify-center'
      }
    >
      <Logo />
    </div>
  );
}
