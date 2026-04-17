import Link from "next/link";
import MintCatLogo from "../../components/MintCatLogo";

export const metadata = {
  title: "Support MintCat",
  description: "Support MintCat with Alipay, WeChat Pay, Stripe, GitHub Sponsors, and card checkout."
};

const supportOptions = [
  {
    title: "支付宝",
    subtitle: "Alipay",
    body: "适合中国用户直接跳转到支付宝收款页，或打开支付宝收款二维码落地页。",
    cta: "打开支付宝",
    href: process.env.NEXT_PUBLIC_MINTCAT_ALIPAY_URL || "#"
  },
  {
    title: "微信支付",
    subtitle: "WeChat Pay",
    body: "适合通过微信支付页、收款码链接或活动赞助页完成支持。",
    cta: "打开微信支付",
    href: process.env.NEXT_PUBLIC_MINTCAT_WECHAT_URL || "#"
  },
  {
    title: "Stripe",
    subtitle: "Stripe Checkout",
    body: "适合全球用户通过 Stripe Hosted Checkout、Payment Link 或 Subscription Link 进行支持。",
    cta: "打开 Stripe",
    href: process.env.NEXT_PUBLIC_MINTCAT_STRIPE_URL || "#"
  },
  {
    title: "GitHub 赞助",
    subtitle: "GitHub Sponsors",
    body: "适合开发者和开源支持者通过 GitHub Sponsors 持续支持 MintCat。",
    cta: "打开 GitHub",
    href: process.env.NEXT_PUBLIC_MINTCAT_GITHUB_URL || "#"
  },
  {
    title: "Visa / 银行卡",
    subtitle: "Card checkout",
    body: "适合使用 Visa 或其他银行卡在托管支付页完成支持。通常可接到 Stripe 或独立支付服务。",
    cta: "打开银行卡支付",
    href: process.env.NEXT_PUBLIC_MINTCAT_VISA_URL || process.env.NEXT_PUBLIC_MINTCAT_STRIPE_URL || "#"
  }
];

const fundingNotes = [
  {
    title: "资金来源",
    body: "MintCat 采用参考 Mastodon 的社区支持模式，以捐赠、赞助和持续支持为主，不以广告为核心。"
  },
  {
    title: "资金用途",
    body: "资金将用于产品开发、联邦基础设施、服务器与队列任务、内容治理、安全加固和社区工具。"
  },
  {
    title: "真实接入方式",
    body: "当前页面已经支持真实入口配置。只要在环境变量中填入对应平台的托管支付链接，就可以直接上线使用。"
  }
];

export default function SupportPage() {
  return (
    <main className="support-shell">
      <div className="support-ambient support-ambient-left" />
      <div className="support-ambient support-ambient-right" />

      <header className="support-topbar">
        <Link className="support-brand" href="/">
          <MintCatLogo />
          <div>
            <strong>MintCat</strong>
            <span>Federated social platform</span>
          </div>
        </Link>
        <Link className="button button-ghost" href="/">
          返回首页
        </Link>
      </header>

      <section className="support-hero">
        <p className="section-label">Community Support</p>
        <h1>MintCat 采用由社区支持的资金模式。</h1>
        <p>你现在可以直接接入支付宝、微信支付、Stripe、GitHub Sponsors 和 Visa / 银行卡支付入口，形成面向中国与全球用户的开放支持页面。</p>
      </section>

      <section className="support-grid support-grid-payments">
        {supportOptions.map((option) => (
          <article className="support-card support-payment-card" key={option.title}>
            <p className="section-label">{option.subtitle}</p>
            <h2>{option.title}</h2>
            <p>{option.body}</p>
            <div className="support-payment-meta">
              <span>{option.href === "#" ? "未配置" : "已接入入口"}</span>
            </div>
            <a
              className={`button button-primary${option.href === "#" ? " is-disabled" : ""}`}
              href={option.href}
              target={option.href.startsWith("http") ? "_blank" : undefined}
              rel={option.href.startsWith("http") ? "noreferrer" : undefined}
            >
              {option.cta}
            </a>
          </article>
        ))}
      </section>

      <section className="support-principles">
        {fundingNotes.map((note) => (
          <article className="support-note" key={note.title}>
            <h3>{note.title}</h3>
            <p>{note.body}</p>
          </article>
        ))}
      </section>

      <section className="support-principles">
        <article className="support-note">
          <h3>支付宝 / 微信</h3>
          <p>推荐接入真实收款页、收款码落地页或品牌赞助页。也可以放一个二维码图片页，再从这里跳转。</p>
        </article>
        <article className="support-note">
          <h3>Stripe / Visa</h3>
          <p>推荐使用 Stripe Payment Link 或 Checkout Session，Visa 和其他银行卡都可以在同一个托管支付页完成。</p>
        </article>
        <article className="support-note">
          <h3>GitHub Sponsors</h3>
          <p>适合开发者、开源用户和长期支持者。放上你的 GitHub Sponsors 地址后，这里就会成为真实入口。</p>
        </article>
      </section>
    </main>
  );
}
