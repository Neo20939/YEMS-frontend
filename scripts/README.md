# Metrics Scripts

Scripts for fetching and transforming backend metrics from Prometheus format to JSON.

## Usage

### With Bun (Recommended)

```bash
bun run metrics
```

### With Node.js

```bash
node --loader ts-node/esm scripts/fetch-metrics.ts
```

### With Bash (Linux/Mac)

```bash
chmod +x scripts/fetch-metrics.sh
./scripts/fetch-metrics.sh
```

## Output

The script fetches metrics from `https://kennedi-ungnostic-unconvulsively.ngrok-free.dev/api/metrics` and transforms the Prometheus text format into structured JSON:

```json
{
  "uptime": 1593,
  "memoryUsage": {
    "rss": 93274112,
    "heapUsed": 11968594,
    "heapTotal": 12969984,
    "external": 3092874
  },
  "cpuUsage": {
    "user": 31.51,
    "system": 18.60,
    "percent": 100
  },
  "activeConnections": 1,
  "requestsPerMinute": 4,
  "errorRate": 1.11,
  "timestamp": "2026-03-17T13:04:08.304Z",
  "raw": {
    "http": { ... },
    "process": { ... },
    "nodejs": { ... }
  }
}
```

## Transformed Metrics

The script parses the following Prometheus metrics:

### HTTP Metrics
- `yems_http_requests_total` - Total HTTP requests by route/status
- `yems_http_request_errors_total` - HTTP request errors
- `yems_http_active_requests` - Currently active requests

### Process Metrics
- `process_cpu_*` - CPU usage
- `process_resident_memory_bytes` - Memory usage
- `process_start_time_seconds` - Start time for uptime calculation

### Node.js Metrics
- `nodejs_heap_size_*` - Heap memory
- `nodejs_external_memory_bytes` - External memory
- `nodejs_eventloop_lag_*` - Event loop lag
- `nodejs_version_info` - Node.js version

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL (default: `https://kennedi-ungnostic-unconvulsively.ngrok-free.dev`)
