import { Bike } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

export default function Logo() {
  const { lang } = useI18n();
  return (
    <Link to="/" className="flex shrink-0 items-center gap-1.5" aria-label="Cycling AE">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand sm:h-11 sm:w-11 text-white shadow-md shadow-brand/30"><Bike size={24} aria-hidden /></span>
      <span className="whitespace-nowrap text-base font-extrabold leading-none sm:text-xl">
        {lang === 'ar' ? <>سايكلنج <span className="text-brand">AE</span></> : <>Cycling <span className="text-brand">AE</span></>}
      </span>
    </Link>
  );
}
