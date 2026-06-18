import { useState } from "react";
import { MdExpandMore, MdExpandLess, MdAccountBalance } from "react-icons/md";
import { OFX_BANK_GUIDES } from "./onboardingSteps";

export default function OfxBankGuides() {
  const [openId, setOpenId] = useState<string>(OFX_BANK_GUIDES[0]?.id ?? "");

  return (
    <div className="mt-4 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-cp-subtle">
        Como obter o OFX em cada banco
      </p>
      <div className="max-h-[min(42vh,320px)] space-y-2 overflow-y-auto pr-1">
        {OFX_BANK_GUIDES.map((bank) => {
          const open = openId === bank.id;
          return (
            <div
              key={bank.id}
              className="overflow-hidden rounded-xl border border-white/[0.08] bg-cp-base/60"
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? "" : bank.id)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-white/[0.03]"
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-cp-base"
                  style={{ backgroundColor: bank.color }}
                  aria-hidden
                >
                  {bank.name.charAt(0)}
                </span>
                <span className="flex-1 text-sm font-medium text-white">
                  {bank.name}
                </span>
                {open ? (
                  <MdExpandLess className="shrink-0 text-cp-muted" size={20} />
                ) : (
                  <MdExpandMore className="shrink-0 text-cp-muted" size={20} />
                )}
              </button>
              {open ? (
                <div className="border-t border-white/[0.06] px-3 pb-3 pt-2">
                  <ol className="list-inside list-decimal space-y-1.5 text-sm text-cp-muted marker:text-dash">
                    {bank.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  {bank.tip ? (
                    <p className="mt-2 flex items-start gap-1.5 text-xs text-cp-subtle">
                      <MdAccountBalance className="mt-0.5 shrink-0 text-dash" size={14} />
                      {bank.tip}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
