"use client";

import { useState, useTransition } from "react";

const REPORT_TEMPLATE = {
  reporterEmail: "",
  targetPostId: "",
  targetActor: "",
  reason: "",
  details: ""
};

const ACTION_TEMPLATE = {
  targetType: "post",
  targetId: "",
  actionType: "review",
  notes: ""
};

const RULE_TEMPLATE = {
  title: "",
  body: ""
};

const EVENT_TEMPLATE = {
  eventType: "upload_spike",
  severity: "warning",
  payload: "{\"source\":\"manual\"}"
};

export default function AdminConsole({ initialReports, initialActions, initialRules, initialEvents }) {
  const [reports, setReports] = useState(initialReports);
  const [actions, setActions] = useState(initialActions);
  const [rules, setRules] = useState(initialRules);
  const [events, setEvents] = useState(initialEvents);
  const [reportForm, setReportForm] = useState(REPORT_TEMPLATE);
  const [actionForm, setActionForm] = useState(ACTION_TEMPLATE);
  const [ruleForm, setRuleForm] = useState(RULE_TEMPLATE);
  const [eventForm, setEventForm] = useState(EVENT_TEMPLATE);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submitJson(url, body, onSuccess) {
    setMessage("");
    startTransition(async () => {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || "Request failed.");
        }

        onSuccess(payload);
        setMessage("已保存到 Supabase。");
      } catch (error) {
        setMessage(error.message || "保存失败。");
      }
    });
  }

  return (
    <section className="admin-grid">
      <article className="legal-card">
        <h2>举报队列</h2>
        <form
          className="admin-form"
          onSubmit={(event) => {
            event.preventDefault();
            submitJson("/api/admin/reports", reportForm, (payload) => {
              setReports((current) => [payload.report, ...current]);
              setReportForm(REPORT_TEMPLATE);
            });
          }}
        >
          <input
            placeholder="举报人邮箱"
            value={reportForm.reporterEmail}
            onChange={(event) => setReportForm((current) => ({ ...current, reporterEmail: event.target.value }))}
          />
          <input
            placeholder="目标帖子 ID"
            value={reportForm.targetPostId}
            onChange={(event) => setReportForm((current) => ({ ...current, targetPostId: event.target.value }))}
          />
          <input
            placeholder="目标用户 Actor URL"
            value={reportForm.targetActor}
            onChange={(event) => setReportForm((current) => ({ ...current, targetActor: event.target.value }))}
          />
          <input
            placeholder="举报原因"
            value={reportForm.reason}
            onChange={(event) => setReportForm((current) => ({ ...current, reason: event.target.value }))}
          />
          <textarea
            placeholder="补充说明"
            rows={3}
            value={reportForm.details}
            onChange={(event) => setReportForm((current) => ({ ...current, details: event.target.value }))}
          />
          <button className="button button-primary" disabled={isPending} type="submit">
            提交举报
          </button>
        </form>
        {reports.length ? reports.map((report) => (
          <div className="admin-item" key={report.id}>
            <strong>{report.reason}</strong>
            <span>{report.reporter_email}</span>
            <p>{report.details || "无补充说明"}</p>
          </div>
        )) : <p>暂无举报。</p>}
      </article>

      <article className="legal-card">
        <h2>审核动作</h2>
        <form
          className="admin-form"
          onSubmit={(event) => {
            event.preventDefault();
            submitJson("/api/admin/moderation", actionForm, (payload) => {
              setActions((current) => [payload.action, ...current]);
              setActionForm(ACTION_TEMPLATE);
            });
          }}
        >
          <div className="admin-form-row">
            <select
              value={actionForm.targetType}
              onChange={(event) => setActionForm((current) => ({ ...current, targetType: event.target.value }))}
            >
              <option value="post">帖子</option>
              <option value="account">账号</option>
              <option value="instance">实例</option>
            </select>
            <select
              value={actionForm.actionType}
              onChange={(event) => setActionForm((current) => ({ ...current, actionType: event.target.value }))}
            >
              <option value="review">标记复核</option>
              <option value="hide_post">隐藏帖子</option>
              <option value="suspend_account">封禁账号</option>
              <option value="block_instance">屏蔽实例</option>
            </select>
          </div>
          <input
            placeholder="目标 ID 或域名"
            value={actionForm.targetId}
            onChange={(event) => setActionForm((current) => ({ ...current, targetId: event.target.value }))}
          />
          <textarea
            placeholder="处理备注"
            rows={3}
            value={actionForm.notes}
            onChange={(event) => setActionForm((current) => ({ ...current, notes: event.target.value }))}
          />
          <button className="button button-primary" disabled={isPending} type="submit">
            记录动作
          </button>
        </form>
        {actions.length ? actions.map((action) => (
          <div className="admin-item" key={action.id}>
            <strong>{action.action_type}</strong>
            <span>{action.target_type} / {action.target_id}</span>
            <p>{action.notes || "无备注"}</p>
          </div>
        )) : <p>暂无审核动作。</p>}
      </article>

      <article className="legal-card">
        <h2>实例规则</h2>
        <form
          className="admin-form"
          onSubmit={(event) => {
            event.preventDefault();
            submitJson("/api/admin/rules", ruleForm, (payload) => {
              setRules((current) => [...current, payload.rule]);
              setRuleForm(RULE_TEMPLATE);
            });
          }}
        >
          <input
            placeholder="规则标题"
            value={ruleForm.title}
            onChange={(event) => setRuleForm((current) => ({ ...current, title: event.target.value }))}
          />
          <textarea
            placeholder="规则内容"
            rows={4}
            value={ruleForm.body}
            onChange={(event) => setRuleForm((current) => ({ ...current, body: event.target.value }))}
          />
          <button className="button button-primary" disabled={isPending} type="submit">
            新增规则
          </button>
        </form>
        {rules.length ? rules.map((rule) => (
          <div className="admin-item" key={rule.id}>
            <strong>{rule.title}</strong>
            <p>{rule.body}</p>
          </div>
        )) : <p>暂无规则。</p>}
      </article>

      <article className="legal-card">
        <h2>风控事件</h2>
        <form
          className="admin-form"
          onSubmit={(event) => {
            event.preventDefault();
            submitJson("/api/admin/risk-events", {
              eventType: eventForm.eventType,
              severity: eventForm.severity,
              payload: eventForm.payload
            }, (payload) => {
              setEvents((current) => [payload.event, ...current]);
              setEventForm(EVENT_TEMPLATE);
            });
          }}
        >
          <div className="admin-form-row">
            <select
              value={eventForm.eventType}
              onChange={(event) => setEventForm((current) => ({ ...current, eventType: event.target.value }))}
            >
              <option value="upload_spike">上传峰值</option>
              <option value="rate_limit_triggered">限流触发</option>
              <option value="preview_fetch_failure">链接抓取失败</option>
              <option value="queue_retry_exhausted">队列重试耗尽</option>
            </select>
            <select
              value={eventForm.severity}
              onChange={(event) => setEventForm((current) => ({ ...current, severity: event.target.value }))}
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <textarea
            placeholder='JSON 负载，例如 {"ip":"1.1.1.1"}'
            rows={4}
            value={eventForm.payload}
            onChange={(event) => setEventForm((current) => ({ ...current, payload: event.target.value }))}
          />
          <button className="button button-primary" disabled={isPending} type="submit">
            写入事件
          </button>
        </form>
        {events.length ? events.map((entry) => (
          <div className="admin-item" key={entry.id}>
            <strong>{entry.event_type}</strong>
            <span>{entry.severity}</span>
            <p>{JSON.stringify(entry.payload)}</p>
          </div>
        )) : <p>暂无风控事件。</p>}
      </article>

      {message ? <p className="admin-message">{message}</p> : null}
    </section>
  );
}
