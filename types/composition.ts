/**
 * DSS Framework — Composition contracts.
 *
 * Render Model is the sole public Composition → Presentation boundary.
 * Composition Context and Composition Tree remain internal.
 */

import type {
  BlockReference,
  Reference,
} from "./primitives";
import type { CanonicalStructuredContent } from "./content";
import type { DecisionSupportDocument } from "./semantic";

export interface BlockConfiguration {
  readonly blockReference: BlockReference;
  readonly configuration?: Readonly<Record<string, unknown>>;
}

export interface LayoutAssignment {
  readonly layoutReference: Reference;
  readonly configuration?: Readonly<Record<string, unknown>>;
}

export interface Traceability {
  readonly source: Reference;
}

export interface BlockEntry {
  readonly blockReference: BlockReference;
  readonly configuration?: BlockConfiguration;
  readonly layoutAssignment?: LayoutAssignment;
  readonly traceability: Traceability;
}

export type BlockSequence = readonly BlockEntry[];

export interface PresentationContext {
  readonly configuration?: Readonly<Record<string, unknown>>;
  readonly displayRequirements?: Readonly<Record<string, unknown>>;
  readonly responsiveRequirements?: Readonly<Record<string, unknown>>;
  readonly accessibilityRequirements?: Readonly<Record<string, unknown>>;
  readonly layoutRequirements?: Readonly<Record<string, unknown>>;
}

export interface RenderModel {
  readonly blockSequence: BlockSequence;
  readonly presentationContext: PresentationContext;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly traceability?: readonly Traceability[];
}

interface CompositionContext {
  readonly knowledgeNode: Reference;
  readonly document?: Reference;
  readonly content: CanonicalStructuredContent;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly configuration?: Readonly<Record<string, unknown>>;
}

interface CompositionTree {
  readonly document: DecisionSupportDocument;
  readonly blocks: BlockSequence;
}

export type CompositionInput = {
  readonly document: DecisionSupportDocument;
  readonly content: CanonicalStructuredContent;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly configuration?: Readonly<Record<string, unknown>>;
};

