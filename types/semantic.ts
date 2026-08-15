/**
 * DSS Framework — semantic contracts.
 *
 * Semantic ownership remains with the Knowledge architecture. These types
 * expose the canonical structural contracts used across repository
 * boundaries; they do not define presentation behavior.
 */

import type {
  BlockReference,
  Identifier,
  SemanticReference,
  Status,
  Timestamp,
  Version,
} from "./primitives";

export interface SemanticObject {
  readonly identifier: Identifier;
  readonly type: string;
  readonly canonicalName: string;
  readonly version: Version;
  readonly status: Status;
  readonly description: string;
  readonly ownerSpecification: string;
  readonly creationDate: Timestamp;
  readonly revisionDate: Timestamp;
}

export interface Concept extends SemanticObject {
  readonly canonicalName: string;
  readonly relatedEntities: readonly SemanticReference[];
  readonly semanticScope: string;
}

export interface Entity extends SemanticObject {
  readonly aliases: readonly string[];
  readonly entityType: string;
  readonly parentConcept?: SemanticReference;
  readonly relatedConcepts: readonly SemanticReference[];
  readonly relatedEntities: readonly SemanticReference[];
  readonly knowledgeNodes: readonly SemanticReference[];
  readonly metadata?: SemanticMetadata;
  readonly lifecycleState: string;
}

export interface KnowledgeNode extends SemanticObject {
  readonly title: string;
  readonly associatedConcepts: readonly SemanticReference[];
  readonly associatedEntities: readonly SemanticReference[];
  readonly semanticBoundaries: readonly string[];
  readonly relatedKnowledgeNodes: readonly SemanticReference[];
}

export type RelationshipCardinality = "1:1" | "1:N" | "N:N";

export interface Relationship extends SemanticObject {
  readonly relationshipType: string;
  readonly source: SemanticReference;
  readonly target: SemanticReference;
  readonly direction: string;
  readonly cardinality: RelationshipCardinality;
}

export interface Evidence extends SemanticObject {}

export interface SemanticMetadata {
  readonly id: Identifier;
  readonly type: string;
  readonly name: string;
  readonly version: Version;
  readonly status: Status;
  readonly created: Timestamp;
  readonly updated: Timestamp;
  readonly owner: string;
}

export interface DecisionSupportDocument extends SemanticObject {
  readonly knowledgeNode: SemanticReference;
  readonly title: string;
  readonly description: string;
  readonly concepts: readonly SemanticReference[];
  readonly entities: readonly SemanticReference[];
  readonly decisionBlocks: readonly BlockReference[];
  readonly decisionStage: string;
  readonly canonicalUrl: string;
  readonly publicationStatus: Status;
  readonly language: string;
  readonly lastUpdated: Timestamp;
}