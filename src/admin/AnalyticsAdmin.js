import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  BarChart3,
  Users,
  Eye,
  Calendar,
  MessageSquare,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  TrendingUp,
  Activity,
  Globe2,
} from 'lucide-react';

export default function AnalyticsAdmin() {
  const { getAnalyticsSummary, getPageViews, getDeviceStats, loading } = useAnalytics();
  const [summary, setSummary] = useState(null);
  const [pageViews, setPageViews] = useState([]);
  const [deviceStats, setDeviceStats] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setRefreshing(true);
    try {
      const [s, p, d] = await Promise.all([getAnalyticsSummary(), getPageViews(), getDeviceStats()]);
      setSummary(s);
      setPageViews(p);
      setDeviceStats(d);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading && !summary) return <LoadingSpinner />;

  const totalDevices = (deviceStats.desktop || 0) + (deviceStats.mobile || 0) + (deviceStats.tablet || 0) || 1;
  const deviceBars = [
    { label: 'Desktop Workstations', value: deviceStats.desktop || 0, icon: Monitor },
    { label: 'Mobile Handhelds', value: deviceStats.mobile || 0, icon: Smartphone },
    { label: 'Tablet Devices', value: deviceStats.tablet || 0, icon: Tablet },
  ];

  const stats = [
    {
      label: 'TOTAL PAGE VISITS',
      value: summary?.totalVisits ?? 0,
      icon: Eye,
      sub: 'Cumulative page impressions',
    },
    {
      label: 'UNIQUE CLIENT VISITORS',
      value: summary?.uniqueVisitors ?? 0,
      icon: Users,
      sub: 'Distinct IP sessions',
    },
    {
      label: 'TODAY SESSION TRAFFIC',
      value: summary?.todayVisits ?? 0,
      icon: Calendar,
      sub: 'Visits in past 24 hours',
    },
    {
      label: 'CONTACT DISPATCHES',
      value: summary?.totalMessages ?? 0,
      icon: MessageSquare,
      sub: 'Total inquiries submitted',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="border border-neutral-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-black text-white text-[9px] font-black uppercase tracking-widest mb-3">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>REAL-TIME AUDIENCE TELEMETRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
            VISITOR TELEMETRY
          </h1>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            Aggregated traffic analytics, client device breakdown, and highest engagement paths.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadAnalytics}
            disabled={refreshing}
            className="px-5 py-3 border border-neutral-300 hover:border-black text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer bg-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'REFRESHING...' : 'REFRESH METRICS'}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white border border-neutral-200 p-6 flex flex-col justify-between hover:border-black transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  {stat.label}
                </span>
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-black">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="my-4">
                <div className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
                  {stat.value.toLocaleString()}
                </div>
              </div>
              <div className="pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-[10px] font-medium text-neutral-500">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span>{stat.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Telemetry Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Visited Pages */}
        <div className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
                PAGE ENGAGEMENT
              </span>
              <h2 className="text-lg font-black uppercase tracking-tight text-black mt-0.5">
                MOST VISITED ROUTES
              </h2>
            </div>
            <Globe2 className="w-5 h-5 text-neutral-400" />
          </div>

          <div className="space-y-4">
            {pageViews.length === 0 ? (
              <div className="py-8 text-center text-xs font-medium text-neutral-400">
                No route telemetry captured yet.
              </div>
            ) : (
              pageViews.slice(0, 7).map((page, i) => {
                const max = pageViews[0]?.views || 1;
                const pct = Math.round((page.views / max) * 100);
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-mono text-neutral-400">#{i + 1}</span>
                        <span className="font-bold text-black truncate uppercase tracking-wider">
                          {page.page}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-neutral-700 shrink-0">
                        {page.views.toLocaleString()} hits
                      </span>
                    </div>
                    {/* Progress Track */}
                    <div className="h-2 bg-neutral-100 overflow-hidden">
                      <div
                        className="h-full bg-black transition-all duration-700 ease-out"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Client Hardware & Device Category */}
        <div className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
                DEVICE ECOSYSTEM
              </span>
              <h2 className="text-lg font-black uppercase tracking-tight text-black mt-0.5">
                CLIENT DEVICE HARDWARE
              </h2>
            </div>
            <Monitor className="w-5 h-5 text-neutral-400" />
          </div>

          <div className="space-y-6">
            {deviceBars.map((d, i) => {
              const Icon = d.icon;
              const pct = Math.round((d.value / totalDevices) * 100);
              return (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-black">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-black">
                        {d.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-bold text-black">{d.value}</span>
                      <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-1.5 py-0.5">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  {/* Progress Track */}
                  <div className="h-2 bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full bg-black transition-all duration-700 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 font-medium leading-relaxed">
            Telemetry is recorded automatically on every route transition via client-side beacon listeners, deduplicating repetitive pings.
          </div>
        </div>
      </div>
    </div>
  );
}
