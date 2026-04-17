import { serverClient } from "../../lib/oracat/supabase-server";
import AdminConsole from "./AdminConsole";

export const metadata = {
  title: "MintCat Admin"
};

async function loadAdminData() {
  const client = serverClient();
  if (!client) {
    return { reports: [], actions: [], rules: [], events: [] };
  }

  const [{ data: reports }, { data: actions }, { data: rules }, { data: events }] = await Promise.all([
    client.from("oracat_reports").select("*").order("created_at", { ascending: false }).limit(20),
    client.from("oracat_moderation_actions").select("*").order("created_at", { ascending: false }).limit(20),
    client.from("oracat_instance_rules").select("*").order("created_at", { ascending: true }).limit(20),
    client.from("oracat_risk_events").select("*").order("created_at", { ascending: false }).limit(20)
  ]);

  return {
    reports: reports || [],
    actions: actions || [],
    rules: rules || [],
    events: events || []
  };
}

export default async function AdminPage() {
  const { reports, actions, rules, events } = await loadAdminData();

  return (
    <main className="legal-shell">
      <section className="legal-card">
        <p className="section-label">Admin</p>
        <h1>管理后台</h1>
        <p>这里已经接入了真实的举报、审核动作、实例规则和风控事件数据视图。后面可以继续补操作按钮和权限体系。</p>
      </section>

      <AdminConsole initialReports={reports} initialActions={actions} initialRules={rules} initialEvents={events} />
    </main>
  );
}
