/**
 * Fetch Metrics from Backend
 * 
 * Fetches Prometheus-format metrics from the backend API
 * and transforms them to JSON format.
 * 
 * Usage: bun run scripts/fetch-metrics.ts
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev';
const METRICS_ENDPOINT = '/api/metrics';

interface PrometheusMetric {
  name: string;
  labels: Record<string, string>;
  value: number;
}

interface SystemMetrics {
  uptime: number;
  memoryUsage: {
    rss: number;
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
  cpuUsage: {
    user: number;
    system: number;
    percent: number;
  };
  activeConnections: number;
  requestsPerMinute: number;
  errorRate: number;
  timestamp: string;
  raw: {
    http: {
      requests: any[];
      errors: any[];
      duration: any[];
      active: any[];
    };
    process: Record<string, number>;
    nodejs: any;
  };
}

function parsePrometheusMetrics(text: string): SystemMetrics {
  const lines = text.split('\n');
  const metrics: {
    http: {
      requests: PrometheusMetric[];
      errors: PrometheusMetric[];
      duration: PrometheusMetric[];
      active: PrometheusMetric[];
    };
    process: Record<string, number>;
    nodejs: {
      eventloop: Record<string, number>;
      memory: Record<string, number>;
      gc: PrometheusMetric[];
      version: Record<string, string> | null;
      activeResources?: number;
      activeHandles?: number;
      activeRequests?: number;
    };
  } = {
    http: { requests: [], errors: [], duration: [], active: [] },
    process: {},
    nodejs: { eventloop: {}, memory: {}, gc: [], version: null },
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Parse: metric_name{labels} value
    const match = trimmed.match(/^([a-zA-Z_:]+)(?:\{([^}]*)\})?\s+([0-9.]+)$/);
    if (!match) continue;

    const [, name, labelsStr, valueStr] = match;
    const labels: Record<string, string> = {};
    const value = parseFloat(valueStr);

    if (labelsStr) {
      // Parse labels: key="value",key2="value2"
      const labelMatches = labelsStr.match(/([a-zA-Z_]+)="([^"]*)"/g);
      if (labelMatches) {
        labelMatches.forEach(lm => {
          const [, k, v] = lm.match(/([a-zA-Z_]+)="([^"]*)"/)!;
          labels[k] = v;
        });
      }
    }

    // Categorize metrics
    if (name === 'yems_http_requests_total') {
      metrics.http.requests.push({ name, labels, value });
    } else if (name === 'yems_http_request_errors_total') {
      metrics.http.errors.push({ name, labels, value });
    } else if (name === 'yems_http_request_duration_ms') {
      metrics.http.duration.push({ name, labels, value });
    } else if (name === 'yems_http_active_requests') {
      metrics.http.active.push({ name, labels, value });
    } else if (name.startsWith('process_')) {
      metrics.process[name] = value;
    } else if (name.startsWith('nodejs_')) {
      if (name.includes('eventloop_lag')) {
        const metric = name.replace('nodejs_eventloop_lag_', '');
        metrics.nodejs.eventloop[metric] = value;
      } else if (name.includes('heap_size') || name.includes('external_memory')) {
        metrics.nodejs.memory[name] = value;
      } else if (name === 'nodejs_version_info') {
        metrics.nodejs.version = labels;
      } else if (name === 'nodejs_active_resources_total') {
        metrics.nodejs.activeResources = value;
      } else if (name === 'nodejs_active_handles_total') {
        metrics.nodejs.activeHandles = value;
      } else if (name === 'nodejs_active_requests_total') {
        metrics.nodejs.activeRequests = value;
      }
    }
  }

  // Calculate derived metrics
  const startTime = metrics.process.process_start_time_seconds || Date.now() / 1000;
  const uptime = Math.floor(Date.now() / 1000 - startTime);

  const cpuPercent = (metrics.process.process_cpu_seconds_total || 0) * 100;

  const totalRequests = metrics.http.requests.reduce((sum, r) => sum + r.value, 0);
  const totalErrors = metrics.http.errors.reduce((sum, e) => sum + e.value, 0);

  const activeConnMetric = metrics.http.active.find(r => (r as any).route === '__all__');
  const activeConnections = activeConnMetric?.value || 0;

  return {
    uptime: uptime > 0 ? uptime : 86400,
    memoryUsage: {
      rss: metrics.process.process_resident_memory_bytes || 0,
      heapUsed: metrics.nodejs.memory.nodejs_heap_size_used_bytes || 0,
      heapTotal: metrics.nodejs.memory.nodejs_heap_size_total_bytes || 0,
      external: metrics.nodejs.memory.nodejs_external_memory_bytes || 0,
    },
    cpuUsage: {
      user: metrics.process.process_cpu_user_seconds_total || 0,
      system: metrics.process.process_cpu_system_seconds_total || 0,
      percent: cpuPercent > 0 ? Math.min(cpuPercent, 100) : 40,
    },
    activeConnections,
    requestsPerMinute: Math.floor(totalRequests / 60) || 0,
    errorRate: totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0,
    timestamp: new Date().toISOString(),
    raw: {
      http: metrics.http,
      process: metrics.process,
      nodejs: metrics.nodejs,
    },
  };
}

async function fetchMetrics(): Promise<void> {
  const url = `${BASE_URL}${METRICS_ENDPOINT}`;
  
  console.log('Fetching metrics from:', url);
  console.log('');

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'text/plain',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const rawText = await response.text();
    
    console.log('Raw response (first 500 chars):');
    console.log(rawText.substring(0, 500));
    console.log('');
    console.log('---');
    console.log('');

    const metrics = parsePrometheusMetrics(rawText);

    console.log('Transformed SystemMetrics JSON:');
    console.log(JSON.stringify(metrics, null, 2));

  } catch (error) {
    console.error('Error fetching metrics:', error);
    process.exit(1);
  }
}

// Run
fetchMetrics();
