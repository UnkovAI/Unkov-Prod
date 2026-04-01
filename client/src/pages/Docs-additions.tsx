// ─────────────────────────────────────────────────────────────────
// NEW SECTIONS — paste these into the CONNECTORS array in Docs.tsx
// Place AFTER the compliance section (before the closing ];)
// ─────────────────────────────────────────────────────────────────
//
//  {   ← closing brace of compliance section
//  },  ← this comma
//  ↓   ← paste all of the below here
//  ];  ← then this closes the array

  {
    id: "risk-engine",
    name: "Risk Engine",
    icon: <Activity style={{ width: 16, height: 16 }} />,
    badge: "Live",
    badgeColor: S.green,
    tagline: "Weighted behavioral scoring — behavior×0.4 + permission×0.3 + graph×0.3.",
    sections: [
      {
        id: "risk-overview",
        title: "How the risk score works",
        content: (
          <div>
            <p style={{ marginBottom: "0.75rem" }}>Every identity in Unkov receives a composite risk score from 0–100, computed across three weighted dimensions:</p>
            <div style={{ background: S.code, borderRadius: 8, padding: "1rem 1.25rem", marginBottom: "1rem", fontFamily: "monospace", color: "#86efac", fontSize: "0.9rem" }}>
              risk = behavior_score × 0.4 + permission_score × 0.3 + graph_score × 0.3
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${S.border}` }}>
                  {["Score Range", "Risk Level", "Action"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: S.muted, fontWeight: 600, fontSize: "0.75rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["80–100", "🔴 CRITICAL", "Immediate action — gate blocks or challenges"],
                  ["60–79",  "🟠 HIGH",     "Review within 24 hours"],
                  ["35–59",  "🟡 MEDIUM",   "Review within 7 days"],
                  ["10–34",  "🔵 LOW",      "Monitor — no action required"],
                  ["0–9",    "⚪ NONE",     "Healthy"],
                ].map(([range, level, action]) => (
                  <tr key={range} style={{ borderBottom: `1px solid ${S.border}` }}>
                    <td style={{ padding: "0.625rem 0.75rem", fontWeight: 600, color: S.text, fontFamily: "monospace" }}>{range}</td>
                    <td style={{ padding: "0.625rem 0.75rem", fontWeight: 600, color: S.text }}>{level}</td>
                    <td style={{ padding: "0.625rem 0.75rem", color: S.soft, fontSize: "0.8rem" }}>{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      },
      {
        id: "risk-behavior",
        title: "Behavior signals (×0.4)",
        content: (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${S.border}` }}>
                {["Signal", "Points", "Source"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: S.muted, fontWeight: 600, fontSize: "0.75rem" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Unusual login time (outside 5am–11pm UTC)",     "+20", "Okta webhook / real-time pipeline"],
                ["Login from new geographic location",             "+30", "Okta webhook / real-time pipeline"],
                ["Account inactive 30–180 days",                  "+25", "Last active timestamp"],
                ["Account inactive 180+ days",                    "+40", "Last active timestamp"],
                ["Terminated employee still active",               "+60", "Workday / HR cross-reference"],
                ["API call volume exceeds baseline",               "+20", "CloudTrail / real-time pipeline"],
              ].map(([signal, pts, source]) => (
                <tr key={signal} style={{ borderBottom: `1px solid ${S.border}` }}>
                  <td style={{ padding: "0.625rem 0.75rem", color: S.soft }}>{signal}</td>
                  <td style={{ padding: "0.625rem 0.75rem", fontWeight: 700, color: S.red, fontFamily: "monospace" }}>{pts}</td>
                  <td style={{ padding: "0.625rem 0.75rem", color: S.muted, fontSize: "0.8rem" }}>{source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ),
      },
      {
        id: "risk-permission",
        title: "Permission signals (×0.3)",
        content: (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${S.border}` }}>
                {["Signal", "Points"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: S.muted, fontWeight: 600, fontSize: "0.75rem" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Admin / super-admin privileges",                "+40"],
                ["Access to PHI, payroll, or financial data",    "+40"],
                ["No MFA (human accounts only)",                 "+30"],
                ["Stale API key (90+ days without rotation)",    "+35"],
                ["Excessive scope (more than role requires)",    "+25"],
              ].map(([signal, pts]) => (
                <tr key={signal} style={{ borderBottom: `1px solid ${S.border}` }}>
                  <td style={{ padding: "0.625rem 0.75rem", color: S.soft }}>{signal}</td>
                  <td style={{ padding: "0.625rem 0.75rem", fontWeight: 700, color: S.red, fontFamily: "monospace" }}>{pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ),
      },
      {
        id: "risk-graph",
        title: "Graph signals (×0.3)",
        content: (
          <div>
            <p style={{ marginBottom: "0.75rem" }}>Graph signals come from Neptune path queries. They capture risks that no per-identity rule can see — relationships between identities, paths to sensitive data, and lateral movement potential.</p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${S.border}` }}>
                  {["Signal", "Points"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: S.muted, fontWeight: 600, fontSize: "0.75rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["AI agent with admin privileges",          "+45"],
                  ["Graph path to PHI data",                  "+50"],
                  ["Shared credentials across identities",    "+30"],
                  ["Connected to a critical-risk identity",   "+20"],
                  ["Outside collaborator with internal access", "+20"],
                ].map(([signal, pts]) => (
                  <tr key={signal} style={{ borderBottom: `1px solid ${S.border}` }}>
                    <td style={{ padding: "0.625rem 0.75rem", color: S.soft }}>{signal}</td>
                    <td style={{ padding: "0.625rem 0.75rem", fontWeight: 700, color: S.red, fontFamily: "monospace" }}>{pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      },
    ],
  },
  {
    id: "ai-proxy",
    name: "AI Proxy",
    icon: <Bot style={{ width: 16, height: 16 }} />,
    badge: "Live",
    badgeColor: S.green,
    tagline: "Route all AI tool calls through Unkov before they reach OpenAI, Anthropic, or Azure.",
    sections: [
      {
        id: "ai-proxy-overview",
        title: "What the AI Proxy does",
        content: (
          <div>
            <p style={{ marginBottom: "0.75rem" }}>The AI Proxy is the highest-leverage gate component. Every AI tool call — to OpenAI, Anthropic, or Azure OpenAI — routes through Unkov before reaching the provider.</p>
            <Note type="tip">Unkov holds the AI provider API keys. Clients point to your endpoint instead of the provider directly. Clients never hold provider keys.</Note>
            <h4 style={{ color: S.navy, marginTop: "1.25rem", marginBottom: "0.5rem" }}>Flow</h4>
            <div style={{ background: S.code, borderRadius: 8, padding: "1rem 1.25rem", fontFamily: "monospace", color: "#86efac", fontSize: "0.85rem", lineHeight: 1.8 }}>
              {`Client app\n  → POST /ai-proxy/openai/v1/chat/completions\n  → Unkov: resolve identity from x-unkov-identity header\n  → Unkov: look up risk score in DynamoDB\n  → decision: ALLOW or BLOCK\n  → if ALLOW: forward to api.openai.com with Unkov's key\n  → log: identity + model + risk level + timestamp`}
            </div>
            <h4 style={{ color: S.navy, marginTop: "1.25rem", marginBottom: "0.5rem" }}>What it controls</h4>
            <ul style={{ color: S.soft, lineHeight: 2, paddingLeft: "1.25rem" }}>
              <li>Which identities (humans or AI agents) can invoke AI models</li>
              <li>Rate limiting — calls per hour per identity</li>
              <li>Blocking high-risk or ungoverned AI agents from calling AI providers</li>
              <li>Full audit log of every AI call with identity context</li>
            </ul>
          </div>
        ),
      },
      {
        id: "ai-proxy-setup",
        title: "Setup",
        content: (
          <Steps items={[
            {
              title: "Store AI provider keys in SSM",
              body: <Code lang="bash">{`KEY=OPENAI_API_KEY     VALUE=sk-...        npm run ssm:put
KEY=ANTHROPIC_API_KEY  VALUE=sk-ant-...    npm run ssm:put
KEY=AZURE_OPENAI_ENDPOINT VALUE=https://... npm run ssm:put`}</Code>
            },
            {
              title: "Start the API",
              body: <Code lang="bash">{`npm run api:dev
# Proxy available at:
# POST http://localhost:4000/ai-proxy/openai/*
# POST http://localhost:4000/ai-proxy/anthropic/*`}</Code>
            },
            {
              title: "Point your client at Unkov instead of OpenAI",
              body: <>
                <p style={{ marginBottom: "0.5rem" }}>Change your OpenAI client base URL:</p>
                <Code lang="typescript">{`// Before
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// After — Unkov holds the key, you pass identity
const openai = new OpenAI({
  apiKey: "placeholder",   // ignored — Unkov uses its own key
  baseURL: "https://your-api.unkov.com/ai-proxy/openai",
  defaultHeaders: {
    "x-unkov-identity": userEmail,
    "x-customer-id":    customerId,
  }
});`}</Code>
              </>
            },
            {
              title: "Test identity resolution",
              body: <Code lang="bash">{`curl http://localhost:4000/ai-proxy/status \\
  -H "x-unkov-identity: user@yourcompany.com"
# Returns: identity resolved, risk level, decision`}</Code>
            },
          ]} />
        ),
      },
      {
        id: "ai-proxy-decisions",
        title: "Decision logic",
        content: (
          <div>
            <Note type="info">The proxy starts in <strong>Observe Mode</strong> — all calls allowed, all calls logged. Enable enforce mode after validating identity resolution works correctly.</Note>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem", marginTop: "1rem" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${S.border}` }}>
                  {["Condition", "Decision", "Response"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: S.muted, fontWeight: 600, fontSize: "0.75rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["GATE_ENABLED=false (observe mode)",                "ALLOW",    "Forward to provider, log the call"],
                  ["Identity inactive / deprovisioned",                "BLOCK",    "403 — account is inactive"],
                  ["AI agent + critical risk score (>80)",             "BLOCK",    "403 — ungoverned AI agent blocked"],
                  ["Rate limit exceeded (>1000 calls/hr)",             "BLOCK",    "429 — rate limit exceeded"],
                  ["Identity not found in Unkov",                      "ALLOW",    "Forward with risk level 'unknown', log"],
                  ["All other cases",                                  "ALLOW",    "Forward to provider, log with risk level"],
                ].map(([cond, dec, resp]) => (
                  <tr key={cond} style={{ borderBottom: `1px solid ${S.border}` }}>
                    <td style={{ padding: "0.625rem 0.75rem", color: S.soft, fontSize: "0.8rem" }}>{cond}</td>
                    <td style={{ padding: "0.625rem 0.75rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: dec === "ALLOW" ? S.green : S.red, background: dec === "ALLOW" ? S.lgreen : S.lred, padding: "2px 8px", borderRadius: 9999 }}>{dec}</span>
                    </td>
                    <td style={{ padding: "0.625rem 0.75rem", color: S.muted, fontSize: "0.8rem" }}>{resp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      },
    ],
  },
  {
    id: "realtime-pipeline",
    name: "Real-Time Pipeline",
    icon: <Activity style={{ width: 16, height: 16 }} />,
    badge: "Live",
    badgeColor: S.green,
    tagline: "Live events from Okta, CloudTrail, and GitHub update risk scores as they happen.",
    sections: [
      {
        id: "pipeline-overview",
        title: "Why real-time matters",
        content: (
          <div>
            <Note type="warning">Without real-time events, Unkov only knows what was true at the last nightly scan. A privilege escalation at 9am won't be seen until 2am the next day. Real-time pipeline closes that window to seconds.</Note>
            <p style={{ marginTop: "0.75rem" }}>The real-time pipeline ingests events from three sources and updates DynamoDB risk scores immediately. If a score jumps to critical, an incident is created automatically.</p>
            <h4 style={{ color: S.navy, marginTop: "1.25rem", marginBottom: "0.5rem" }}>Sources</h4>
            <ul style={{ color: S.soft, lineHeight: 2, paddingLeft: "1.25rem" }}>
              <li><strong>Okta System Log</strong> — logins, failed auth, privilege grants, policy changes</li>
              <li><strong>AWS CloudTrail via Kinesis</strong> — IAM changes, API calls, role assumptions</li>
              <li><strong>GitHub webhooks</strong> — member changes, permission grants, security alerts</li>
            </ul>
          </div>
        ),
      },
      {
        id: "pipeline-okta",
        title: "Okta webhook setup",
        content: (
          <Steps items={[
            {
              title: "Register your API endpoint in Okta",
              body: <>In Okta Admin → <strong>Reports → System Log</strong> → Send to endpoint:<br />
                <Code lang="bash">{`POST https://your-api.com/events/okta`}</Code>
                <Note type="tip">Okta will send a verification challenge first. The endpoint handles this automatically — it responds with the x-okta-verification-challenge header value.</Note>
              </>
            },
            {
              title: "Verify endpoint responds",
              body: <Code lang="bash">{`curl -X POST https://your-api.com/events/okta \\
  -H "x-okta-verification-challenge: test-challenge"
# Should return: {"verification": "test-challenge"}`}</Code>
            },
          ]} />
        ),
      },
      {
        id: "pipeline-cloudtrail",
        title: "AWS CloudTrail setup",
        content: (
          <Steps items={[
            {
              title: "Create a CloudTrail trail with Kinesis",
              body: <>AWS Console → CloudTrail → Create trail → Enable CloudWatch Logs → Create a Kinesis stream → route trail events to stream.</>
            },
            {
              title: "Add Lambda trigger on the Kinesis stream",
              body: <><p style={{ marginBottom: "0.5rem" }}>The Lambda handler is exported from <code style={{ background: "#f1f5f9", padding: "1px 6px", borderRadius: 4, fontSize: "0.8rem" }}>src/pipeline/event-pipeline.ts</code>:</p>
                <Code lang="bash">{`# Lambda function: unkov-event-processor
# Handler: dist/pipeline/event-pipeline.kinesisHandler
# Trigger: Kinesis stream (batch size: 100)`}</Code>
              </>
            },
          ]} />
        ),
      },
      {
        id: "pipeline-signals",
        title: "Real-time signal table",
        content: (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${S.border}` }}>
                {["Event", "Source", "Risk impact"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: S.muted, fontWeight: 600, fontSize: "0.75rem" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["user.session.start outside business hours", "Okta", "behavior +20 (unusual time)"],
                ["user.account.privilege.grant",              "Okta", "permission +25 (new privilege)"],
                ["authentication.failure × 3",               "Okta", "behavior +15 (brute force signal)"],
                ["iam:CreateAccessKey",                       "CloudTrail", "permission +35 (new key created)"],
                ["iam:AttachRolePolicy",                     "CloudTrail", "permission +25 (policy change)"],
                ["iam:CreateRole with AdministratorAccess",  "CloudTrail", "permission +40 (new admin role)"],
                ["org member_added",                         "GitHub", "permission +20 (new member)"],
                ["secret_scanning_alert.created",            "GitHub", "graph +30 (exposed credential)"],
              ].map(([event, source, impact]) => (
                <tr key={event} style={{ borderBottom: `1px solid ${S.border}` }}>
                  <td style={{ padding: "0.625rem 0.75rem", fontFamily: "monospace", fontSize: "0.78rem", color: S.text }}>{event}</td>
                  <td style={{ padding: "0.625rem 0.75rem", color: S.soft }}>{source}</td>
                  <td style={{ padding: "0.625rem 0.75rem", color: S.red, fontSize: "0.8rem", fontWeight: 600 }}>{impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ),
      },
    ],
  },
  {
    id: "identity-graph",
    name: "Identity Graph",
    icon: <Globe style={{ width: 16, height: 16 }} />,
    badge: "Live",
    badgeColor: S.green,
    tagline: "Neptune graph — every identity as a node, every relationship as an edge.",
    sections: [
      {
        id: "graph-overview",
        title: "Schema",
        content: (
          <div>
            <p style={{ marginBottom: "0.75rem" }}>The identity graph uses Amazon Neptune (Gremlin). Every identity from every connector becomes a node. Every relationship becomes a typed, directional edge.</p>
            <h4 style={{ color: S.navy, marginTop: "1rem", marginBottom: "0.5rem" }}>Node types</h4>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem", marginBottom: "1rem" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${S.border}` }}>
                  {["Node", "Represents"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: S.muted, fontWeight: 600, fontSize: "0.75rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["User",           "Human identities: employees, admins, contractors"],
                  ["ServiceAccount", "Service accounts, bots, Lambda roles"],
                  ["ApiKey",         "Standalone API keys and access tokens"],
                  ["AIAgent",        "AI coding agents, LLM tools, autonomous agents"],
                  ["Resource",       "Systems, apps, data stores (PHI, payroll)"],
                  ["Session",        "Active sessions from real-time pipeline"],
                ].map(([node, rep]) => (
                  <tr key={node} style={{ borderBottom: `1px solid ${S.border}` }}>
                    <td style={{ padding: "0.625rem 0.75rem", fontFamily: "monospace", fontWeight: 600, color: S.blue, fontSize: "0.85rem" }}>{node}</td>
                    <td style={{ padding: "0.625rem 0.75rem", color: S.soft }}>{rep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4 style={{ color: S.navy, marginBottom: "0.5rem" }}>Edge types</h4>
            <Code lang="gremlin">{`(User)-[:ASSUMES]->(Role)
(Role)-[:HAS_ACCESS_TO]->(Resource)
(AIAgent)-[:USES]->(ApiKey)
(ApiKey)-[:BELONGS_TO]->(ServiceAccount)
(User)-[:TRIGGERED]->(AIAgent)
(Identity)-[:SHARES_EMAIL]->(Identity)   // same person, multiple systems
(Identity)-[:MEMBER_OF]->(Group)
(Identity)-[:HAS_PRIVILEGE]->(Privilege)`}</Code>
          </div>
        ),
      },
      {
        id: "graph-setup",
        title: "Setup",
        content: (
          <Steps items={[
            {
              title: "Provision Neptune cluster",
              body: <>AWS Console → Neptune → Create cluster → <strong>db.t3.medium</strong> (free eligible). Note the cluster endpoint.</>
            },
            {
              title: "Store endpoint in SSM",
              body: <Code lang="bash">{`KEY=NEPTUNE_ENDPOINT VALUE=your-cluster.cluster-xyz.us-east-1.neptune.amazonaws.com npm run ssm:put`}</Code>
            },
            {
              title: "Test connection",
              body: <Code lang="bash">{`npm run neptune:write:dry   # test without writing`}</Code>
            },
            {
              title: "Write the identity graph",
              body: <Code lang="bash">{`npm run neptune:write   # writes all identities from latest scan`}</Code>
            },
          ]} />
        ),
      },
      {
        id: "graph-queries",
        title: "Example graph queries",
        content: (
          <div>
            <p style={{ marginBottom: "0.75rem" }}>Run these queries against your Neptune cluster to answer questions no flat-list tool can answer:</p>
            <h4 style={{ color: S.navy, marginBottom: "0.5rem" }}>Find all AI agents with a path to PHI</h4>
            <Code lang="gremlin">{`g.V().hasLabel('AIAgent')
  .where(
    __.out('HAS_PRIVILEGE').has('name', 'APP_ACCESS_PHI')
    .or()
    .repeat(__.out()).until(__.has('Privilege', 'name', 'APP_ACCESS_PHI'))
  )
  .values('displayName', 'riskLevel')`}</Code>
            <h4 style={{ color: S.navy, marginTop: "1rem", marginBottom: "0.5rem" }}>Find humans who triggered ungoverned AI agents</h4>
            <Code lang="gremlin">{`g.V().hasLabel('User')
  .out('TRIGGERED')
  .hasLabel('AIAgent')
  .has('riskLevel', 'critical')
  .path()`}</Code>
            <h4 style={{ color: S.navy, marginTop: "1rem", marginBottom: "0.5rem" }}>Find cross-system identities (same email, multiple sources)</h4>
            <Code lang="gremlin">{`g.V().both('SHARES_EMAIL')
  .path()
  .by(valueMap('displayName', 'source', 'riskLevel'))`}</Code>
          </div>
        ),
      },
    ],
  },
  {
    id: "api-reference",
    name: "API Reference",
    icon: <Code2 style={{ width: 16, height: 16 }} />,
    badge: "v3",
    badgeColor: S.blue,
    tagline: "All API endpoints — dashboard, gate, AI proxy, events, policy.",
    sections: [
      {
        id: "api-auth",
        title: "Authentication",
        content: (
          <div>
            <p style={{ marginBottom: "0.75rem" }}>All endpoints require a Bearer token matching the <code style={{ background: "#f1f5f9", padding: "1px 6px", borderRadius: 4, fontSize: "0.8rem" }}>DASHBOARD_API_KEY</code> stored in SSM.</p>
            <Code lang="bash">{`curl http://localhost:4000/api/health \\
  -H "Authorization: Bearer YOUR_DASHBOARD_API_KEY" \\
  -H "x-customer-id: your-customer-id"`}</Code>
            <Note type="info">In local dev, the default key is <code style={{ background: "#f1f5f9", padding: "1px 6px", borderRadius: 4, fontSize: "0.8rem" }}>dev-key</code> — no auth required. Always set a real key before production.</Note>
          </div>
        ),
      },
      {
        id: "api-core",
        title: "Core endpoints",
        content: (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${S.border}` }}>
                {["Method", "Endpoint", "Purpose"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: S.muted, fontWeight: 600, fontSize: "0.75rem" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["GET",  "/api/health",                       "Liveness check + gate mode + version"],
                ["GET",  "/api/summary",                     "KPI cards: total, NHI ratio, critical count"],
                ["GET",  "/api/identities",                  "Identity list — filter by ?risk=critical&kind=ai_agent"],
                ["GET",  "/api/audit-log",                   "Audit trail — filter by ?phase=gate&outcome=block"],
                ["GET",  "/api/incidents",                   "Open incidents — filter by ?status=open"],
                ["GET",  "/api/integrations",                "Connector health and last sync time"],
                ["GET",  "/api/recommendations",             "Pending action queue — filter by ?status=pending"],
                ["POST", "/api/recommendations/:id/approve", "Approve → executes action in source system"],
                ["POST", "/api/recommendations/:id/dismiss", "Dismiss with reason"],
                ["POST", "/api/recommendations/generate",    "Generate recommendations from latest scan"],
                ["POST", "/api/policy/evaluate",             "Real-time ALLOW/REVIEW/BLOCK decision for an identity"],
                ["GET",  "/api/policy/rules",                "List active policy rules"],
                ["GET",  "/api/gate/status",                 "Gate mode: observe vs enforce"],
                ["POST", "/api/gate/enable",                 "Enable enforce mode — requires confirm:ENABLE_GATE"],
                ["POST", "/api/gate/okta-hook",              "Okta inline hook endpoint"],
                ["POST", "/ai-proxy/openai/*",               "AI Proxy → OpenAI (with identity check)"],
                ["POST", "/ai-proxy/anthropic/*",            "AI Proxy → Anthropic (with identity check)"],
                ["GET",  "/ai-proxy/status",                 "Proxy status + identity resolution for caller"],
                ["POST", "/events/okta",                     "Okta System Log webhook receiver"],
                ["POST", "/events/github",                   "GitHub webhook receiver"],
                ["POST", "/api/ai/query",                    "Conversational AI — ask questions about identity data"],
                ["GET",  "/api/ai/analysis",                 "Latest Claude analysis: anomalies + exec summary"],
              ].map(([method, endpoint, purpose]) => (
                <tr key={endpoint} style={{ borderBottom: `1px solid ${S.border}` }}>
                  <td style={{ padding: "0.5rem 0.75rem" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 6px", borderRadius: 4, backgroundColor: method === "GET" ? "#e0f2fe" : "#fef3c7", color: method === "GET" ? "#0369a1" : "#92400e" }}>{method}</span>
                  </td>
                  <td style={{ padding: "0.5rem 0.75rem", fontFamily: "monospace", fontSize: "0.8rem", color: S.blue }}>{endpoint}</td>
                  <td style={{ padding: "0.5rem 0.75rem", color: S.soft, fontSize: "0.8rem" }}>{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ),
      },
      {
        id: "api-policy",
        title: "Policy evaluate example",
        content: (
          <div>
            <p style={{ marginBottom: "0.75rem" }}>Call this endpoint from any service to get a real-time ALLOW/REVIEW/BLOCK decision before executing a sensitive action:</p>
            <Code lang="bash">{`curl -X POST http://localhost:4000/api/policy/evaluate \\
  -H "Authorization: Bearer dev-key" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@company.com", "action": "read_phi_record"}'`}</Code>
            <p style={{ margin: "0.75rem 0 0.5rem" }}>Response:</p>
            <Code lang="json">{`{
  "decision": "REVIEW",
  "riskLevel": "high",
  "riskScore": 68,
  "reasons": ["Stale API key — 127 days without rotation", "Admin access"],
  "identity": { "id": "...", "name": "Jane Smith", "kind": "human" }
}`}</Code>
          </div>
        ),
      },
    ],
  },
