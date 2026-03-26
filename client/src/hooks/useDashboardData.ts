// ─────────────────────────────────────────────────────────────────
// Unkov — useDashboardData hook
//
// Fetches live data from the Unkov API for the dashboard.
// Falls back to static mock data when the API is not configured.
//
// Usage:
//   const { summary, identities, auditLog, incidents, integrations, loading } = useDashboardData();
//
// Configure the API URL in your .env:
//   VITE_API_URL=http://localhost:4000   ← local dev
//   VITE_API_URL=https://api.unkov.com   ← production
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL as string | undefined;
const API_KEY = import.meta.env.VITE_DASHBOARD_API_KEY as string | undefined;

// ── Types matching the dashboard interfaces ───────────────────────

export interface LiveIdentity {
  id: string;
  type: 'human' | 'bot' | 'ai_agent' | 'service' | 'orphan';
  name: string;
  dept: string;
  risk: number;
  lastActive: string;
  status: 'active' | 'suspended' | 'orphan' | 'flagged';
  accessCount: number;
  permissions: string[];
  source: string;
  riskReasons: string[];
  isActive?: boolean;
  email?: string;
  kind?: string;
}

export interface LiveSummary {
  customerId: string;
  scannedAt: string;
  total: number;
  humans: number;
  nhis: number;
  aiAgents: number;
  orphaned: number;
  critical: number;
  high: number;
  medium: number;
  nhiRatio: string;
  toxicCombos: number;
  sources: string[];
}

export interface LiveAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  target: string;
  actor: string;
  phase: string;
  outcome: 'approved' | 'blocked' | 'escalated' | 'purged' | 'scoped';
  policy: string;
  riskDelta: number;
  confidence: number;
}

export interface LiveIncident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium';
  status: 'active' | 'resolved';
  timeline: { time: string; event: string; phase: string }[];
  identitiesAffected: string[];
  detectedAt: string;
  resolvedAt?: string;
}

export interface LiveIntegration {
  name: string;
  type: string;
  status: 'healthy' | 'warning' | 'error';
  lastSync: string;
  records: number | null;
  errors: number;
  latency: string;
  icon: string;
  region?: string;
  version?: string;
}

export interface DashboardData {
  summary: LiveSummary | null;
  identities: LiveIdentity[];
  auditLog: LiveAuditEntry[];
  incidents: LiveIncident[];
  integrations: LiveIntegration[];
  loading: boolean;
  error: string | null;
  isLive: boolean;    // true = real API data, false = static mock data
  refetch: () => void;
}

// ── API fetch helper ──────────────────────────────────────────────

async function apiFetch<T>(path: string, customerId: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-customer-id': customerId,
  };
  if (API_KEY) headers['Authorization'] = `Bearer ${API_KEY}`;

  const res = await fetch(`${API_URL}${path}`, { headers });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// ── Hook ──────────────────────────────────────────────────────────

export function useDashboardData(): DashboardData {
  const { user } = useAuth();
  const [data, setData] = useState<Omit<DashboardData, 'refetch'>>({
    summary: null,
    identities: [],
    auditLog: [],
    incidents: [],
    integrations: [],
    loading: true,
    error: null,
    isLive: false,
  });
  const [tick, setTick] = useState(0);

  const customerId = user?.company
    ? user.company.toLowerCase().replace(/\s+/g, '-')
    : 'dev-local';

  useEffect(() => {
    if (!API_URL) {
      // No API configured — dashboard uses its own static data
      setData(d => ({ ...d, loading: false, isLive: false }));
      return;
    }

    let cancelled = false;

    async function load() {
      setData(d => ({ ...d, loading: true, error: null }));
      try {
        const [summaryRes, identitiesRes, auditRes, incidentsRes, integrationsRes] =
          await Promise.all([
            apiFetch<LiveSummary>('/api/summary', customerId),
            apiFetch<{ items: LiveIdentity[] }>('/api/identities', customerId),
            apiFetch<{ items: LiveAuditEntry[] }>('/api/audit-log?limit=50', customerId),
            apiFetch<{ items: LiveIncident[] }>('/api/incidents', customerId),
            apiFetch<{ items: LiveIntegration[] }>('/api/integrations', customerId),
          ]);

        if (cancelled) return;

        setData({
          summary:      summaryRes,
          identities:   identitiesRes.items,
          auditLog:     auditRes.items,
          incidents:    incidentsRes.items,
          integrations: integrationsRes.items,
          loading:      false,
          error:        null,
          isLive:       true,
        });
      } catch (err) {
        if (cancelled) return;
        console.warn('[Unkov] API not reachable — dashboard using static data:', err);
        setData(d => ({
          ...d,
          loading: false,
          error: null,    // silent fallback — no error shown to user
          isLive: false,
        }));
      }
    }

    load();
    return () => { cancelled = true; };
  }, [customerId, tick]);

  return {
    ...data,
    refetch: () => setTick(t => t + 1),
  };
}

// ── Type-safe mapping helpers ──────────────────────────────────────
// These ensure API data maps cleanly to dashboard component expectations

export function toRiskScore(level?: string): number {
  return ({ critical: 92, high: 74, medium: 48, low: 20, none: 8 })[level ?? 'none'] ?? 8;
}

export function toStatus(identity: LiveIdentity): LiveIdentity['status'] {
  if (!identity.isActive) return 'orphan';
  if (identity.status) return identity.status;
  if (identity.risk >= 70) return 'flagged';
  return 'active';
}

// Dummy export to prevent unused warning — hook already exported above
const _noop = null; export { _noop as __dashboardHookLoaded };
