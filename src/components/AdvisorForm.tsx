import { useId, useState, type FormEvent } from 'react';
import { Info } from 'lucide-react';
import { useI18n } from '../i18n';
import { sampleRoutes, emirates } from '../data/sample';
import { recommend, NOT_ENOUGH_DATA, type AdvisorInput, type Goal, type Level, type MissingField, type Recommendation } from '../services/advisor';

const field = 'mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-ink';

export default function AdvisorForm() {
  const { tr, pick } = useI18n();
  const uid = useId();
  const [emirate, setEmirate] = useState('');
  const [level, setLevel] = useState<Level>('beginner');
  const [goal, setGoal] = useState<Goal>('leisure');
  const [maxKm, setMaxKm] = useState('');
  const [lit, setLit] = useState(false);
  const [results, setResults] = useState<Recommendation[] | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const max = maxKm.trim() === '' ? undefined : Number(maxKm);
    const input: AdvisorInput = { emirate: emirate || undefined, level, goal, maxDistanceKm: max != null && Number.isFinite(max) && max > 0 ? max : undefined, preferLit: lit };
    setResults(recommend(input, sampleRoutes));
  };

  const missingLabel = (m: MissingField) =>
    m === 'distance' ? tr('المسافة', 'distance') : m === 'lighting' ? tr('الإضاءة', 'lighting') : tr('بيانات التضاريس/السرعة', 'terrain/speed data');
  const reasonLabel = (r: string) => (r === NOT_ENOUGH_DATA ? tr('لا تتوفر بيانات موثقة كافية', 'Not enough verified data') : r);

  return (
    <div className="mx-auto max-w-lg text-start">
      <p className="flex items-start gap-2 rounded-xl border border-brand/30 bg-white/5 p-3 text-sm text-neutral-300">
        <Info size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />
        <span>{tr('هذه توصيات قائمة على قواعد بسيطة وشفافة، وليست ذكاءً اصطناعياً. نعتمد فقط على البيانات الموثقة ونُظهر ما هو غير معروف.', 'These are simple, transparent rules-based suggestions, not AI. We use only verified data and show what is unknown.')}</span>
      </p>
      <form onSubmit={submit} className="mt-4 space-y-4 rounded-2xl bg-white p-5 text-ink">
        <div><label htmlFor={`${uid}-em`} className="font-semibold">{tr('الإمارة', 'Emirate')}</label>
          <select id={`${uid}-em`} className={field} value={emirate} onChange={(e) => setEmirate(e.target.value)}>
            <option value="">{tr('الكل', 'Any')}</option>
            {emirates.map((x) => <option key={x} value={x}>{x}</option>)}
          </select></div>
        <div><label htmlFor={`${uid}-lv`} className="font-semibold">{tr('المستوى', 'Level')}</label>
          <select id={`${uid}-lv`} className={field} value={level} onChange={(e) => setLevel(e.target.value as Level)}>
            <option value="beginner">{tr('مبتدئ', 'Beginner')}</option>
            <option value="intermediate">{tr('متوسط', 'Intermediate')}</option>
            <option value="advanced">{tr('متقدم', 'Advanced')}</option>
          </select></div>
        <div><label htmlFor={`${uid}-gl`} className="font-semibold">{tr('الهدف', 'Goal')}</label>
          <select id={`${uid}-gl`} className={field} value={goal} onChange={(e) => setGoal(e.target.value as Goal)}>
            <option value="endurance">{tr('التحمّل', 'Endurance')}</option>
            <option value="speed">{tr('السرعة', 'Speed')}</option>
            <option value="leisure">{tr('ترفيه', 'Leisure')}</option>
          </select></div>
        <div><label htmlFor={`${uid}-km`} className="font-semibold">{tr('أقصى مسافة (كم)', 'Max distance (km)')}</label>
          <input id={`${uid}-km`} type="number" min="1" inputMode="decimal" className={field} value={maxKm} onChange={(e) => setMaxKm(e.target.value)} /></div>
        <label className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={lit} onChange={(e) => setLit(e.target.checked)} className="h-5 w-5" />{tr('أفضّل المسارات المضاءة', 'Prefer lit routes')}</label>
        <button type="submit" className="btn-primary w-full py-3">{tr('اعرض التوصيات', 'Show recommendations')}</button>
      </form>

      <div aria-live="polite" className="mt-6">
        {results && (results.length === 0
          ? <p className="text-neutral-300">{tr('لا توجد مسارات مطابقة.', 'No matching routes.')}</p>
          : <ol className="space-y-3">
              {results.map(({ route, score, reasons, missingData }) => (
                <li key={route.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="font-bold">{pick(route.title)} <span className="text-sm font-normal text-neutral-400">({tr('النقاط', 'score')} {score})</span></h3>
                  {reasons.length > 0 && <ul className="mt-2 list-disc ps-5 text-sm text-neutral-300">{reasons.map((r) => <li key={r}>{reasonLabel(r)}</li>)}</ul>}
                  {missingData.length > 0 && <p className="mt-2 text-sm text-amber-300">{tr('بيانات غير معروفة: ', 'Unknown: ')}{missingData.map(missingLabel).join(tr('، ', ', '))}</p>}
                </li>
              ))}
            </ol>)}
      </div>
    </div>
  );
}
