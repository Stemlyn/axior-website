"use client";

import Link from "next/link";
import { SITE } from "@/lib/site";
import { useSite, useWhatsappChat, useWhatsappLink } from "@/lib/store";
import { SOCIAL_META, normalizeSocialUrl, socialUrlError } from "@/lib/social";
import { SocialIcon } from "./SocialIcon";
import { Wordmark } from "./Logo";
import { NAV } from "./Navbar";
import { WhatsAppIcon, btn, cn } from "./ui";

export function Footer() {
  const { siteInfo } = useSite();
  const whatsappChat = useWhatsappChat();
  const biz = siteInfo?.business;
  const email = biz?.email || SITE.email;
  const legalName = biz?.legalName || SITE.legalName;
  const address = biz?.address || `${SITE.city}, Karnataka, India`;
  const socials = (siteInfo?.socials ?? []).filter((l) => l.visible && !socialUrlError(l.platform, l.url));
  const registered = biz && (biz.gstin || biz.cin);

  return (
    <footer className="grain relative bg-night pb-28 pt-20 text-sm text-white/55">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 border-b border-white/[0.07] pb-14 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Wordmark className="h-6 w-auto text-white" />
            <p className="mt-4 text-white/45">
              {SITE.tagline}, {SITE.city}, {SITE.region}
            </p>
            <p className="mt-6 max-w-sm leading-relaxed">
              Axior inspects and reports on property condition. We do not take custody of valuables, and all repairs are
              carried out by third-party vendors you approve.
            </p>
            <a href={whatsappChat} target="_blank" rel="noopener noreferrer" className={cn(btn.base, btn.emerald, "mt-7 min-h-11 px-5 py-2.5")}>
              <WhatsAppIcon className="size-4" /> WhatsApp support
            </a>
            {socials.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-2" aria-label="Axior on social media">
                {socials.map((l) => (
                  <li key={l.id}>
                    <a
                      href={normalizeSocialUrl(l.platform, l.url) ?? l.url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      aria-label={`Axior on ${SOCIAL_META[l.platform].label}`}
                      className="grid size-10 place-items-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-gold hover:text-gold"
                    >
                      <SocialIcon platform={l.platform} className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="font-semibold text-white">Evaluate</p>
            <ul className="mt-2">
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-11 items-center hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/blog" className="inline-flex min-h-11 items-center hover:text-white">
                  Owner guides & blog
                </Link>
              </li>
              <li>
                <Link href="/book" className="inline-flex min-h-11 items-center hover:text-white">
                  Book a pilot audit
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">Contact</p>
            <ul className="mt-2">
              <li>
                <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center hover:text-white">
                  {email}
                </a>
              </li>
              <li className="py-1">{address}</li>
              {biz?.hours && <li className="py-1 text-white/45">{biz.hours}</li>}
            </ul>
            {registered ? (
              <p className="mt-6 text-xs leading-relaxed text-white/45">
                {legalName}
                {biz.gstin && (
                  <>
                    <br />
                    GSTIN {biz.gstin}
                  </>
                )}
                {biz.cin && (
                  <>
                    <br />
                    CIN {biz.cin}
                  </>
                )}
              </p>
            ) : (
              // TODO before launch: registered company name, CIN/GSTIN (set in admin Settings > General).
              <p className="mt-6 rounded-lg border border-dashed border-gold/30 px-3 py-2 text-xs text-gold/80">
                To add before launch: registered company name, CIN or GSTIN, registered office address, terms and privacy
                policy.
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-8 text-xs text-white/55 md:flex-row md:justify-between">
          <p>© 2026 {legalName}</p>
          <p>Photography is illustrative and does not show client properties.</p>
          <p>
            Designed and built by{" "}
            <a href="https://stemlyn.rjglobalgroup.in/" target="_blank" rel="noopener" className="text-white/80 underline-offset-4 hover:text-gold hover:underline">
              STEMLYN
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function FloatingWhatsApp() {
  const wa = useWhatsappLink();
  return (
    <a
      href={wa}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Axior on WhatsApp"
      className="fixed bottom-5 right-5 z-30 grid size-14 place-items-center rounded-full bg-emerald-600 text-white shadow-[0_12px_30px_-8px_rgba(5,150,105,0.6)] transition-transform hover:scale-105 motion-reduce:transition-none"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
