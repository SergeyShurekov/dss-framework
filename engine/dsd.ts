/**
 * DSS Framework — DSD Engine
 *
 * Implements the Composition responsibility for Decision Support
 * Documents.
 *
 * Architectural boundary:
 *
 * Knowledge
 *     +
 * Canonical Structured Content
 *     +
 * Required Metadata
 *     +
 * Declared Configuration
 *         ↓
 * DSD Engine
 *         ↓
 * Render Model
 *
 * The engine:
 * - resolves the Knowledge Node through KnowledgeEngine;
 * - verifies that the supplied DSD belongs to that Knowledge Node;
 * - resolves every declared Decision Block through the authoritative
 *   Registry contract;
 * - preserves DSD-defined block ordering;
 * - assembles the canonical Render Model;
 * - does not render UI;
 * - does not own semantic knowledge;
 * - does not own Registry storage;
 * - does not generate metadata;
 * - does not introduce another composition model.
 */

import type {
    BlockEntry,
    BlockSequence,
    CompositionInput,
    Reference,
    RenderModel,
    Traceability,
} from "../types";

import type {
    BlockReference,
    SemanticReference,
} from "../types";

import type {
    DecisionBlockDefinition,
    KnowledgeNode,
} from "../types";

import { KnowledgeEngine } from "./knowledge";
import type { Registry } from "./registry";

export class DsdEngine {
    public constructor(
        private readonly knowledge: KnowledgeEngine,
        private readonly blockRegistry: Registry<DecisionBlockDefinition>,
    ) { }

    /**
     * Compose one declared DSD into the canonical Render Model.
     *
     * The DSD itself remains a semantic object owned by the Knowledge
     * layer. The engine only transforms the declared DSD inputs into
     * presentation-ready composition data.
     */
    public compose(input: CompositionInput): RenderModel {
        const knowledgeNode = this.resolveKnowledgeNode(
            input.document.knowledgeNode,
        );

        this.assertDocumentScope(input.document.knowledgeNode, knowledgeNode);

        const blockSequence = this.composeBlockSequence(
            input.document.decisionBlocks,
            input.document.identifier,
        );

        return Object.freeze({
            blockSequence,
            presentationContext: Object.freeze({}),
            ...(input.metadata !== undefined
                ? { metadata: input.metadata }
                : {}),
            traceability: Object.freeze(
                blockSequence.map((entry) => entry.traceability),
            ),
        });
    }

    /**
     * Resolve and validate the Knowledge Node referenced by the DSD.
     *
     * KnowledgeEngine owns semantic knowledge and canonical resolution.
     * DsdEngine does not maintain a second semantic store.
     */
    private resolveKnowledgeNode(
        reference: SemanticReference,
    ): KnowledgeNode {
        const object = this.knowledge.get(reference);

        if (object.type !== "KnowledgeNode") {
            throw new Error(
                `DSD Engine expected KnowledgeNode, received ${object.type}.`,
            );
        }

        return object as KnowledgeNode;
    }

    /**
     * Preserve the frozen one-Knowledge-Node → one-DSD invariant.
     *
     * The DSD already carries its canonical Knowledge Node reference.
     * The resolved Knowledge Node is used only to verify that the
     * referenced semantic object exists and has the expected type.
     */
    private assertDocumentScope(
        reference: SemanticReference,
        knowledgeNode: KnowledgeNode,
    ): void {
        if (
            reference.targetType !== "KnowledgeNode" ||
            reference.targetId !== knowledgeNode.identifier
        ) {
            throw new Error(
                "DSD Engine received a DSD whose Knowledge Node reference " +
                "does not resolve to a KnowledgeNode.",
            );
        }
    }

    /**
     * Resolve the DSD's declared Decision Blocks in their authoritative
     * document order.
     *
     * Block order belongs to the DSD / Composition contract.
     * Registry resolution does not determine ordering.
     */
    private composeBlockSequence(
        blockReferences: readonly BlockReference[],
        documentIdentifier: string,
    ): BlockSequence {
        const documentReference: Reference<"DecisionSupportDocument"> = {
            targetType: "DecisionSupportDocument",
            targetId: documentIdentifier,
        };

        const sequence: BlockEntry[] = blockReferences.map(
            (blockReference) => {
                const definition = this.blockRegistry.get(
                    blockReference.targetId,
                );

                const configuration = Object.freeze({
                    blockReference,
                    configuration: definition.contract.requiredInput,
                });

                const traceability: Traceability = Object.freeze({
                    source: documentReference,
                });

                return Object.freeze({
                    blockReference,
                    configuration,
                    traceability,
                });
            },
        );

        return Object.freeze(sequence);
    }
}