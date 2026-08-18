/**
 * DSS Framework — Registry implementation.
 *
 * The Registry Contract is the canonical resolution boundary for
 * registered framework resources.
 *
 * Consumers depend on Registry<TResource>.
 * Registry storage and registration mechanics remain implementation-private.
 */

import type { Identifier } from "../types/primitives";

export interface Registry<TResource> {
    get(identifier: Identifier): TResource;
    has(identifier: Identifier): boolean;
}

export interface RegisteredResource {
    readonly identifier: Identifier;
}

export class RegistryError extends Error {
    public readonly identifier: Identifier;

    public constructor(message: string, identifier: Identifier) {
        super(message);
        this.name = "RegistryError";
        this.identifier = identifier;
    }
}

class RegistryImpl<TResource extends RegisteredResource>
    implements Registry<TResource> {
    private readonly resources = new Map<Identifier, TResource>();

    public register(resource: TResource): void {
        const { identifier } = resource;

        if (this.resources.has(identifier)) {
            throw new RegistryError(
                `Duplicate registry identifier: ${identifier}`,
                identifier,
            );
        }

        this.resources.set(identifier, resource);
    }

    public get(identifier: Identifier): TResource {
        const resource = this.resources.get(identifier);

        if (resource === undefined) {
            throw new RegistryError(
                `Unknown registry identifier: ${identifier}`,
                identifier,
            );
        }

        return resource;
    }

    public has(identifier: Identifier): boolean {
        return this.resources.has(identifier);
    }
}