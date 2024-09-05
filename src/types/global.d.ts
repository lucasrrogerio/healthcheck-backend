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
    application: string;
    endpoint: string;
    status_code: string;
    status_message: string;
    application_available: integer | boolean;
}