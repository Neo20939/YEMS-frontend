#!/bin/bash

# Fetch metrics from backend and transform Prometheus format to JSON
# Usage: ./fetch-metrics.sh

BASE_URL="https://kennedi-ungnostic-unconvulsively.ngrok-free.dev"
METRICS_ENDPOINT="/api/metrics"

echo "Fetching metrics from ${BASE_URL}${METRICS_ENDPOINT}..."
echo ""

# Fetch raw Prometheus metrics
RAW_METRICS=$(curl -s "${BASE_URL}${METRICS_ENDPOINT}")

if [ -z "$RAW_METRICS" ]; then
  echo "Error: No metrics returned"
  exit 1
fi

# Parse and transform to JSON using Node.js
node -e "
const rawMetrics = \`$RAW_METRICS\`;

function parsePrometheusMetrics(text) {
  const lines = text.split('\n');
  const metrics = {
    http: {
      requests: [],
      errors: [],
      duration: [],
      active: [],
    },
    process: {},
    nodejs: {
      eventloop: {},
      memory: {},
      gc: [],
      version: null,
    },
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Parse: metric_name{labels} value
    const match = trimmed.match(/^([a-zA-Z_:]+)(?:\{([^}]*)\})?\s+([0-9.]+)$/);
    if (!match) continue;

    const [, name, labelsStr, value] = match;
    const labels = {};
    
    if (labelsStr) {
      // Parse labels: key=\"value\",key2=\"value2\"
      const labelMatches = labelsStr.match(/([a-zA-Z_]+)=\"([^\"]*)\"/g);
      if (labelMatches) {
        labelMatches.forEach(lm => {
          const [, k, v] = lm.match(/([a-zA-Z_]+)=\"([^\"]*)\"/);
          labels[k] = v;
        });
      }
    }

    const numValue = parseFloat(value);

    // Categorize metrics
    if (name === 'yems_http_requests_total') {
      metrics.http.requests.push({ ...labels, value: numValue });
    } else if (name === 'yems_http_request_errors_total') {
      metrics.http.errors.push({ ...labels, value: numValue });
    } else if (name === 'yems_http_request_duration_ms') {
      metrics.http.duration.push({ ...labels, value: numValue });
    } else if (name === 'yems_http_active_requests') {
      metrics.http.active.push({ ...labels, value: numValue });
    } else if (name.startsWith('process_')) {
      metrics.process[name] = numValue;
    } else if (name.startsWith('nodejs_')) {
      if (name.includes('eventloop_lag')) {
        const metric = name.replace('nodejs_eventloop_lag_', '');
        metrics.nodejs.eventloop[metric] = numValue;
      } else if (name.includes('heap_size') || name.includes('external_memory')) {
        metrics.nodejs.memory[name] = numValue;
      } else if (name === 'nodejs_version_info') {
        metrics.nodejs.version = labels;
      } else if (name === 'nodejs_active_resources_total' || 
                 name === 'nodejs_active_handles_total' || 
                 name === 'nodejs_active_requests_total') {
        metrics.nodejs[name] = numValue;
      }
    }
  }

  // Calculate derived metrics
  const uptime = metrics.process.process_start_time_seconds 
    ? Math.floor(Date.now() / 1000 - metrics.process.process_start_time_seconds)
    : 0;

  const cpuPercent = (metrics.process.process_cpu_seconds_total || 0) * 100;

  // Transform to SystemMetrics format
  const systemMetrics = {
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
    activeConnections: metrics.http.active.find(r => r.route === '__all__')?.value || 0,
    requestsPerMinute: Math.floor(
      metrics.http.requests.reduce((sum, r) => sum + r.value, 0) / 60
    ) || 0,
    errorRate: metrics.http.errors.reduce((sum, e) => sum + e.value, 0) / 
               Math.max(metrics.http.requests.reduce((sum, r) => sum + r.value, 0), 1) * 100,
    timestamp: new Date().toISOString(),
    raw: {
      http: metrics.http,
      process: metrics.process,
      nodejs: metrics.nodejs,
    },
  };

  return systemMetrics;
}

const result = parsePrometheusMetrics(rawMetrics);
console.log(JSON.stringify(result, null, 2));
"
