interface Application {
    name: string;
    service: Service;
}

interface Service {
    host_url: string;
    base_url: string;
    endpoints: Endpoint[];
}

interface Endpoint {
    name: string;
    url: string;
}

interface Log {
    timestamp: string;
    service: string;
    endpoint: string;
    status: string;
}

type HealthStatus = 'UP' | 'DOWN';
