import axios from "axios";

const REQUEST_ID_HEADER = "x-request-id";
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "";

const createRequestId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
};

const reportMetric = (metric) => {
  if (import.meta.env.PROD) {
    console.info("[performance]", metric);
  } else {
    console.debug("[performance]", metric);
  }
};

const isApiUrl = (url) => {
  if (!API_BASE_URL) {
    return false;
  }

  return String(url).startsWith(
    API_BASE_URL
  );
};

const reportApiTiming = ({
  requestId,
  method,
  url,
  status,
  durationMs,
}) => {
  reportMetric({
    name: "api_request",
    requestId,
    method,
    url,
    status,
    durationMs: Number(
      durationMs.toFixed(2)
    ),
  });
};

const observePerformanceEntry = (
  type,
  callback
) => {
  if (
    typeof PerformanceObserver ===
    "undefined"
  ) {
    return;
  }

  try {
    const observer =
      new PerformanceObserver((list) => {
        callback(list.getEntries());
      });

    observer.observe({
      type,
      buffered: true,
    });
  } catch {
    // Unsupported metric type in this browser.
  }
};

const observeWebVitals = () => {
  observePerformanceEntry("paint", (entries) => {
    for (const entry of entries) {
      reportMetric({
        name: entry.name,
        value: Number(
          entry.startTime.toFixed(2)
        ),
        rating: "info",
      });
    }
  });

  observePerformanceEntry(
    "largest-contentful-paint",
    (entries) => {
      const latest =
        entries[entries.length - 1];

      if (!latest) return;

      reportMetric({
        name: "LCP",
        value: Number(
          latest.startTime.toFixed(2)
        ),
        element:
          latest.element?.tagName ||
          null,
        url: latest.url || null,
      });
    }
  );

  let cls = 0;

  observePerformanceEntry(
    "layout-shift",
    (entries) => {
      for (const entry of entries) {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      }

      reportMetric({
        name: "CLS",
        value: Number(cls.toFixed(4)),
      });
    }
  );

  observePerformanceEntry("event", (entries) => {
    for (const entry of entries) {
      const interactionDelay =
        entry.processingStart -
        entry.startTime;

      reportMetric({
        name: "INP_candidate",
        value: Number(
          interactionDelay.toFixed(2)
        ),
        eventType: entry.name,
      });
    }
  });
};

const instrumentFetch = () => {
  if (!window.fetch) {
    return;
  }

  const originalFetch = window.fetch;

  window.fetch = async (input, init = {}) => {
    const url =
      typeof input === "string"
        ? input
        : input.url;

    if (!isApiUrl(url)) {
      return originalFetch(input, init);
    }

    const requestId =
      init.headers?.[REQUEST_ID_HEADER] ||
      createRequestId();

    const headers = new Headers(
      init.headers ||
        (input instanceof Request
          ? input.headers
          : undefined)
    );

    headers.set(
      REQUEST_ID_HEADER,
      requestId
    );

    const startedAt =
      performance.now();

    try {
      const response = await originalFetch(
        input,
        {
          ...init,
          headers,
        }
      );

      reportApiTiming({
        requestId:
          response.headers.get(
            REQUEST_ID_HEADER
          ) || requestId,
        method: init.method || "GET",
        url,
        status: response.status,
        durationMs:
          performance.now() - startedAt,
      });

      return response;
    } catch (error) {
      reportApiTiming({
        requestId,
        method: init.method || "GET",
        url,
        status: "NETWORK_ERROR",
        durationMs:
          performance.now() - startedAt,
      });

      throw error;
    }
  };
};

const instrumentAxios = () => {
  axios.interceptors.request.use((config) => {
    const url = new URL(
      config.url || "",
      config.baseURL || window.location.href
    ).href;

    if (!isApiUrl(url)) {
      return config;
    }

    config.metadata = {
      startedAt: performance.now(),
      requestId: createRequestId(),
    };

    config.headers = config.headers || {};
    config.headers[REQUEST_ID_HEADER] =
      config.metadata.requestId;

    return config;
  });

  axios.interceptors.response.use(
    (response) => {
      const metadata =
        response.config.metadata;

      if (metadata) {
        reportApiTiming({
          requestId:
            response.headers?.[
              REQUEST_ID_HEADER
            ] || metadata.requestId,
          method:
            response.config.method?.toUpperCase() ||
            "GET",
          url: response.config.url,
          status: response.status,
          durationMs:
            performance.now() -
            metadata.startedAt,
        });
      }

      return response;
    },
    (error) => {
      const metadata =
        error.config?.metadata;

      if (metadata) {
        reportApiTiming({
          requestId: metadata.requestId,
          method:
            error.config.method?.toUpperCase() ||
            "GET",
          url: error.config.url,
          status:
            error.response?.status ||
            "NETWORK_ERROR",
          durationMs:
            performance.now() -
            metadata.startedAt,
        });
      }

      return Promise.reject(error);
    }
  );
};

export const startPerformanceMonitoring =
  () => {
    observeWebVitals();
    instrumentFetch();
    instrumentAxios();
  };
