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

interface ApplicationHealthInfo {
    name: string;
    services: EndpointHealthInfo[];
}

interface EndpointHealthInfo {
    name: string;
    message: string;
    status: HealthStatus;
}

type HealthStatus = 'UP' | 'DOWN';
