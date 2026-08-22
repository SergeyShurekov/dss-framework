/**
 * DSS Framework — Knowledge Engine.
 *
 * Provides immutable access to canonical semantic knowledge through the
 * existing Registry contract. Semantic meaning remains owned by the
 * Knowledge layer; Registry provides identity and resolution only.
 */

import type { Registry } from "./registry";
import type {
    Concept,
    DecisionSupportDocument,
    Entity,
    KnowledgeNode,
    Relationship,
    Evidence,
} from "../types/semantic";
import type {
    Identifier,
    SemanticReference,
} from "../types/primitives";

export type KnowledgeObject =
    | Concept
    | Entity
    | KnowledgeNode
    | Relationship
    | DecisionSupportDocument
    | Evidence;

type RegistryMap = Readonly<{
    concepts: Registry<Concept>;
    entities: Registry<Entity>;
    knowledgeNodes: Registry<KnowledgeNode>;
    decisionSupportDocuments: Registry<DecisionSupportDocument>;
}>;

/**
 * Knowledge Engine access boundary.
 *
 * The engine is intentionally read-only. Registries are supplied through
 * their public contracts; registry storage and registration mechanics remain
 * outside the Knowledge Engine.
 */
export class KnowledgeEngine {
    private readonly registries: RegistryMap;
    private readonly relationships: ReadonlyMap<
        Identifier,
        Relationship
    >;
    private readonly evidence: ReadonlyMap<Identifier, Evidence>;

    public constructor(
        registries: RegistryMap,
        relationships: readonly Relationship[] = [],
        evidence: readonly Evidence[] = [],
    ) {
        this.registries = registries;
        this.relationships =
            KnowledgeEngine.indexByIdentifier(relationships);
        this.evidence =
            KnowledgeEngine.indexByIdentifier(evidence);
    }

    /**
     * Resolve canonical semantic knowledge by identifier or typed reference.
     */
    public get(identifier: Identifier): KnowledgeObject;
    public get(reference: SemanticReference): KnowledgeObject;
    public get(
        identifierOrReference: Identifier | SemanticReference,
    ): KnowledgeObject {
        if (typeof identifierOrReference === "string") {
            return this.resolveIdentifier(identifierOrReference);
        }

        return this.resolveReference(identifierOrReference);
    }

    /**
     * Determine whether canonical semantic knowledge exists for an identifier
     * or typed reference.
     */
    public has(identifier: Identifier): boolean;
    public has(reference: SemanticReference): boolean;
    public has(
        identifierOrReference: Identifier | SemanticReference,
    ): boolean {
        if (typeof identifierOrReference === "string") {
            return (
                this.registries.concepts.has(identifierOrReference) ||
                this.registries.entities.has(identifierOrReference) ||
                this.registries.knowledgeNodes.has(identifierOrReference) ||
                this.registries.decisionSupportDocuments.has(
                    identifierOrReference,
                ) ||
                this.relationships.has(identifierOrReference) ||
                this.evidence.has(identifierOrReference)
            );
        }

        switch (identifierOrReference.targetType) {
            case "Concept":
                return this.registries.concepts.has(
                    identifierOrReference.targetId,
                );

            case "Entity":
                return this.registries.entities.has(
                    identifierOrReference.targetId,
                );

            case "KnowledgeNode":
                return this.registries.knowledgeNodes.has(
                    identifierOrReference.targetId,
                );

            case "Relationship":
                return this.relationships.has(
                    identifierOrReference.targetId,
                );

            case "DecisionSupportDocument":
                return this.registries.decisionSupportDocuments.has(
                    identifierOrReference.targetId,
                );

            case "Evidence":
                return this.evidence.has(
                    identifierOrReference.targetId,
                );
        }
    }

    private resolveIdentifier(
        identifier: Identifier,
    ): KnowledgeObject {
        if (this.registries.concepts.has(identifier)) {
            return this.registries.concepts.get(identifier);
        }

        if (this.registries.entities.has(identifier)) {
            return this.registries.entities.get(identifier);
        }

        if (this.registries.knowledgeNodes.has(identifier)) {
            return this.registries.knowledgeNodes.get(identifier);
        }

        if (
            this.registries.decisionSupportDocuments.has(identifier)
        ) {
            return this.registries.decisionSupportDocuments.get(
                identifier,
            );
        }

        const relationship = this.relationships.get(identifier);

        if (relationship !== undefined) {
            return relationship;
        }

        const evidence = this.evidence.get(identifier);

        if (evidence !== undefined) {
            return evidence;
        }

        throw new Error(
            `Unknown knowledge identifier: ${identifier}`,
        );
    }

    private resolveReference(
        reference: SemanticReference,
    ): KnowledgeObject {
        switch (reference.targetType) {
            case "Concept":
                return this.registries.concepts.get(
                    reference.targetId,
                );

            case "Entity":
                return this.registries.entities.get(
                    reference.targetId,
                );

            case "KnowledgeNode":
                return this.registries.knowledgeNodes.get(
                    reference.targetId,
                );

            case "Relationship":
                return (
                    this.relationships.get(reference.targetId) ??
                    this.unknown(reference)
                );

            case "DecisionSupportDocument":
                return this.registries.decisionSupportDocuments.get(
                    reference.targetId,
                );

            case "Evidence":
                return (
                    this.evidence.get(reference.targetId) ??
                    this.unknown(reference)
                );
        }
    }

    private unknown(
        reference: SemanticReference,
    ): never {
        throw new Error(
            `Unknown knowledge reference: ${reference.targetType}:${reference.targetId}`,
        );
    }

    private static indexByIdentifier<
        T extends { readonly identifier: Identifier },
    >(
        resources: readonly T[],
    ): ReadonlyMap<Identifier, T> {
        const index = new Map<Identifier, T>();

        for (const resource of resources) {
            if (index.has(resource.identifier)) {
                throw new Error(
                    `Duplicate knowledge identifier: ${resource.identifier}`,
                );
            }

            index.set(resource.identifier, resource);
        }

        return index;
    }
}