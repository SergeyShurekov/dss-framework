/**
 * DSS Framework — canonical Content contracts.
 *
 * Canonical Structured Content is the sole normalized Content → Composition
 * contract. Source-specific parser representations do not cross this
 * boundary.
 */

import type {
  BlockReference,
  ContentReference,
  Identifier,
  SemanticReference,
  Status,
  Timestamp,
  Version,
} from "./primitives";

export interface ContentMetadata {
  readonly id: Identifier;
  readonly type: string;
  readonly name: string;
  readonly version: Version;
  readonly status: Status;
  readonly created: Timestamp;
  readonly updated: Timestamp;
  readonly owner: string;
}

export interface TextContentElement {
  readonly kind: "text";
  readonly value: string;
  readonly semanticReferences?: readonly SemanticReference[];
}

export interface StructuredContentElement {
  readonly kind: "structured";
  readonly value: Readonly<Record<string, unknown>>;
  readonly semanticReferences?: readonly SemanticReference[];
}

export interface ComparisonContentElement {
  readonly kind: "comparison";
  readonly value: Readonly<Record<string, unknown>>;
  readonly semanticReferences?: readonly SemanticReference[];
}

export interface QuestionAnswerContentElement {
  readonly kind: "question-answer";
  readonly question: string;
  readonly answer: string;
  readonly semanticReferences?: readonly SemanticReference[];
}

export interface EvidenceContentElement {
  readonly kind: "evidence";
  readonly evidenceReferences: readonly ContentReference[];
  readonly semanticReferences?: readonly SemanticReference[];
}

export interface BlockDeclaration {
  readonly blockReference: BlockReference;
  readonly configuration?: Readonly<Record<string, unknown>>;
}

export interface DecisionBlockContentElement {
  readonly kind: "decision-block";
  readonly block: BlockDeclaration;
  readonly semanticReferences?: readonly SemanticReference[];
}

export type ContentElement =
  | TextContentElement
  | StructuredContentElement
  | ComparisonContentElement
  | QuestionAnswerContentElement
  | EvidenceContentElement
  | DecisionBlockContentElement;

export interface CanonicalStructuredContent {
  readonly elements: readonly ContentElement[];
  readonly metadata?: ContentMetadata;
  readonly references?: readonly ContentReference[];
}
