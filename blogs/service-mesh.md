# Custom Service Mesh & Registry Ecosystem

**Timeline:** 2017 – 2021 (considering occasional features/enhancements)  
**Role:** DevOps Engineer & Infrastructure Developer

## The Challenge
During the early days of container orchestration, our organization began migrating services from legacy Virtual Machines directly to Kubernetes, bypassing Docker Swarm. At the time, adopting an off-the-shelf service mesh like Istio wasn't feasible because it lacked mature, first-class support for mixed environments spanning VMs and Swarm clusters. To bridge this gap, we architected and developed a custom service registry and mesh ecosystem tailored to our heterogeneous infrastructure.

## Core Components Developed

Our custom stack consisted of three primary components that seamlessly integrated to provide routing, discovery, and security:

### 1. Service Registry
A centralized registry designed for developers to declare their service dependencies.
* **Architecture:** Backed by a highly available `etcd` cluster deployed on VMs, with a lightweight Go wrapper providing a RESTful API.
* **Developer Experience:** We built a UI using Go HTTP templates, allowing engineers (regardless of API expertise) to easily register their services via a simple web form.
* **Dependency Mapping:** An essential feature of our schema required developers to explicitly list downstream services their application would call, dynamically mapping the microservices topology.

### 2. Envoy Control Plane
The "brain" of our service mesh, engineered entirely in Go.
* **Dynamic Configuration:** Instead of routing through the registry's wrapper, the control plane connected directly to `etcd`. By leveraging `etcd` watchers, the control plane received real-time configuration signals whenever a service definition changed.
* **Automated Syncing:** It dynamically generated and pushed configurations (listeners, clusters, HTTP routes, external AuthZ/JWT filters) to the distributed Envoy sidecars. 
* **Self-Healing:** Envoy sidecars continuously polled the control plane, fetching pushed updates instantly without manual intervention.

### 3. Authentication & Authorization Service (AuthZ)
A secure gateway for validating external and internal microservice traffic. Transitioning this component marked a significant personal milestone: it was my first foray into software engineering, transitioning from a pure DevOps role.

* **Evolution:** Started as a lightweight Node.js HTTP service meant to generate JWTs. It was later re-architected into a highly performant **Golang gRPC service** adhering strictly to Envoy’s External Authorization (`ext_authz`) protocol.
* **Security & Encryption:** Utilized asymmetric RSA encryption for secure token generation and validation.
* **Performance Optimization:** Token generation is compute-heavy. We deployed a Redis cache alongside the Go service. If a 15-minute token was requested, it was cached with a 14.5-minute TTL, drastically reducing internal latency and compute overhead.
* **Ingress Integration:** At the network edge, we utilized **Contour** as our Ingress controller integrated with Cloudflare Access. Contour delegated internet-facing requests to our AuthZ service to cryptographically validate Cloudflare tokens before traffic ever entered the internal mesh.

## Traffic Flow & Features

Our service mesh established a zero-trust architecture across all environments:
* **External Traffic (North-South):** External internet requests hit Contour Ingress &#8594; forwarded to the AuthZ service &#8594; validates the Cloudflare token &#8594; routes to the appropriate service.
* **Internal Traffic (East-West):** Service A initiates a call &#8594; its Envoy sidecar intercepts and queries the AuthZ service &#8594; AuthZ generates (or retrieves from Redis) a secure JWT and returns it &#8594; Service A's sidecar injects the JWT header &#8594; Service B's sidecar validates the JWT &#8594; request is fulfilled by Service B.

## Key Learnings & Takeaways
* **Transition to Software Engineering:** Successfully bridged the gap from classical DevOps to writing robust systems programming in Go and Node.js.
* **Distributed Systems Mastery:** Gained deep operational and architectural knowledge of Envoy proxy configurations, `etcd` consensus/watchers, and gRPC protocols.
* **Performance & Security at Scale:** Learned how to effectively implement distributed caching strategies (Redis TTL mechanisms) to offset the compute costs of RSA asymmetric encryption in high-throughput microservices.